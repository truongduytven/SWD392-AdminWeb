// import { useDispatch, useSelector } from 'react-redux'

import { useEffect, useState } from 'react'
import { columns } from './columns'

import { DataTable } from '../table/main'
// import { RootState } from '@/store'
import { DataTableToolbar } from './toolbar'
import { useAuth } from '@/auth/AuthProvider'
import busAPI from '@/lib/busAPI'
import { toast } from '../../atoms/ui/use-toast'
import axios from 'axios'
import TableSkeleton from '../TableSkeleton'
import { Dialog, DialogContent, DialogOverlay } from '../../atoms/ui/dialog'
import { Button } from '../../atoms/ui/button'
import { Loader } from 'lucide-react'


// Define the interface for the Service
interface Service {
	ServiceID: string;
	Price: number;
	Name: string;
	ImageUrl: string;
  }
  
  // Define the interface for the ServiceType
  interface ServiceType {
	ServiceTypeID: string;
	ServiceTypeName: string;
	ServiceInStation: Service[];
  }
  
  // Define the interface for the Station
  interface Station {
	StationID: string;
	CityID: string;
	CityName: string;
	StationName: string;
	Status: string;
	ServiceTypeInStation: ServiceType[];
  }
function ListStation() {
	const { user } = useAuth()
  console.log('user o station', user)
  const [stations, setStations] = useState<Station[]>([])
  const [isLoadingStations, setIsLoadingStations] = useState(true)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [tempStatus, setTempStatus] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const fetchStations = async () => {
      setIsLoadingStations(true)
      try {
        const { data } = await busAPI.get<Station[]>(`station-management/managed-stations/company/${user?.CompanyID}`)
        console.log('data', data)
        setStations(data || [])
        // Initialize tempStatus with current statuses
        const initialStatuses: { [key: string]: string } = {}
        data.forEach((station) => {
          initialStatuses[station.StationID] = station.Status
        })
        setTempStatus(initialStatuses)
      } catch (error) {
        // toast({
        //   variant: 'destructive',
        //   title: 'Không thể tải dữ liệu trạm dừng',
        //   description: 'Vui lòng thử lại sau'
        // })
        console.log(error)
      } finally {
        setIsLoadingStations(false)
      }
    }

    fetchStations()
  }, [])

  const handleStatusChange = (station: Station, status: string) => {
    setSelectedStation(station)
    setNewStatus(status)
    setIsModalOpen(true)
  }

  const confirmStatusChange = async () => {
    setIsLoadingUpdate(true)
    if (selectedStation) {
      try {
        const response = await busAPI.put(
          `status-management?entity=STATION&id=${selectedStation.StationID}`
        )
        setStations(
          stations.map((station) =>
            station.StationID === selectedStation.StationID ? { ...station, Status: newStatus } : station
          )
        )
        setTempStatus({ ...tempStatus, [selectedStation.StationID]: newStatus })
        setIsModalOpen(false)
        toast({
          variant: 'success',
          title: 'Cập nhật thành công',
          description: 'Đã đổi trạng thái tuyến đường này thành ' + newStatus
        })
        setIsLoadingUpdate(false)
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const message = error.response.data.Result.message
          setIsModalOpen(false)
          setIsLoadingUpdate(false)
          // Revert status change on error
          setTempStatus({ ...tempStatus, [selectedStation.StationID]: selectedStation.Status })
          toast({
            variant: 'destructive',
            title: 'Không thể cập nhật trạng thái tuyến đường',
            description: message || 'Vui lòng thử lại sau'
          })
        }
      } finally {
        setIsLoadingUpdate(false)
        setIsModalOpen(false)
      }
    }
  }
  if (isLoadingStations) {
    return (
		<TableSkeleton/>
  
    )
  }

	return (
		<div className="flex h-full flex-1 flex-col ">
			<h1 className="my-4 border-b pb-2  text-3xl font-semibold tracking-wider first:mt-0 ">
				Danh sách trạm dừng
			</h1>
			<DataTable data={stations} columns={columns(handleStatusChange)} Toolbar={DataTableToolbar} rowString="Trạm" />
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogOverlay className='bg-/60' />
          <DialogContent>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>Xác nhận thay đổi trạng thái</h3>
            <div className='mt-2'>
              <p>Bạn có chắc chắn muốn thay đổi trạng thái của trạm dừng này?</p>
            </div>
            <div className='mt-4 flex justify-end space-x-2'>
              <Button variant='secondary' onClick={() => setIsModalOpen(false)}>
                Hủy
              </Button>
              <Button onClick={confirmStatusChange} disabled={isLoadingUpdate}>
                {isLoadingUpdate ? <Loader className='animate-spin' /> : 'Xác nhận'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
		</div>
	)
}
export default ListStation
