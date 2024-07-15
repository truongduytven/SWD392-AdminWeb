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
import { Loader, Plus } from 'lucide-react'
import TripDetailModal from '../TripDetailModal'
import AddTripModal from '../AddTripModal'
import EditTripModal from '../EditTripModal'

type Trip = {
  TripID: string
  FromCity: string
  ToCity: string
  StartLocation: string
  EndLocation: string
  StartTime: string
  EndTime: string
  StartDate: string
  EndDate: string
  StaffName: string
  StaffID: string
  MinPrice: number
  MaxPrice: number
  Status: string
}

function ListTrip() {
  const { user } = useAuth()
  // console.log('user o route', user)
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoadingTrips, setIsLoadingTrips] = useState(true)
  const [isLoadingDetailTrips, setIsLoadingDetailTrips] = useState(true)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [tempStatus, setTempStatus] = useState<{ [key: string]: string }>({})
  const [selectedTripDetails, setSelectedTripDetails] = useState<any>(null)
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoadingTrips(true)
      try {
        const { data } = await busAPI.get<Trip[]>(`trip-management/manage-trips/${user?.CompanyID}`)
        console.log('data', data)
        setTrips(data || [])
        // Initialize tempStatus with current statuses
        const initialStatuses: { [key: string]: string } = {}
        data.forEach((trip) => {
          initialStatuses[trip.TripID] = trip.Status
        })
        setTempStatus(initialStatuses)
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Không thể tải dữ liệu chuyến đi',
          description: 'Vui lòng thử lại sau'
        })
        console.log(error)
      } finally {
        setIsLoadingTrips(false)
      }
    }

    fetchTrips()
  }, [])

  const handleStatusChange = (trip: Trip, status: string) => {
    setSelectedTrip(trip)
    setNewStatus(status)
    setIsModalOpen(true)
  }

  const confirmStatusChange = async () => {
    setIsLoadingUpdate(true)
    if (selectedTrip) {
      try {
        const response = await busAPI.put(`status-management?entity=TRIP&id=${selectedTrip.TripID}`)

        setTrips(trips.map((trip) => (trip.TripID === selectedTrip.TripID ? { ...trip, Status: newStatus } : trip)))
        setTempStatus({ ...tempStatus, [selectedTrip.TripID]: newStatus })
        setIsModalOpen(false)
        toast({
          variant: 'success',
          title: 'Cập nhật thành công',
          description: 'Đã đổi trạng thái chuyến đi này thành ' + newStatus
        })
        setIsLoadingUpdate(false)
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const message = error.response.data.Result.message
          setIsModalOpen(false)
          setIsLoadingUpdate(false)
          // Revert status change on error
          setTempStatus({ ...tempStatus, [selectedTrip.TripID]: selectedTrip.Status })
          toast({
            variant: 'destructive',
            title: 'Không thể cập nhật trạng thái chuyến đi',
            description: message || 'Vui lòng thử lại sau'
          })
        }
      } finally {
        setIsLoadingUpdate(false)
        setIsModalOpen(false)
      }
    }
  }
  const handleAddTripSuccess = (newData: any) => {
    setTrips((prevTrips) => {
      if (Array.isArray(newData)) {
        return [...prevTrips, ...newData] // If it's an array, spread the new data
      } else {
        return [...prevTrips, newData] // If it's a single object, add it to the array
      }
    })
  }

  const handleViewDetails = async (tripID: string) => {
    setIsLoadingDetailTrips(true)
    try {
      const { data } = await busAPI.get<any>(`trip-management/manage-trips/${tripID}/details`)
      console.log('chi tiey xe', data)

      setSelectedTripDetails(data)
      setIsModalDetailOpen(true)
    } catch (error) {
      console.log(error)
      toast({
        variant: 'destructive',
        title: 'Không thể tải chi tiết chuyến đi',
        description: 'Vui lòng thử lại sau'
      })
    } finally {
      setIsLoadingDetailTrips(false)
    }
  }

  const showAddTripModal = () => {
    setIsModalAddOpen(true)
  }

  const handleOk = () => {
    setIsModalAddOpen(false)
  }

  const handleCancel = () => {
    setIsModalAddOpen(false)
  }
  const handleEditTrip = (trip: Trip) => {
    setSelectedTrip(trip)
    setIsModalEditOpen(true)
  }

  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTrips(trips.map((trip) => (trip.TripID === updatedTrip.TripID ? updatedTrip : trip)))
  }
  if (isLoadingTrips) {
    return <TableSkeleton />
  }

  return (
    <div className='flex h-full flex-1 flex-col '>
      <div className='flex justify-between'>
        <h1 className='my-4 border-b pb-2 text-3xl font-semibold tracking-wider first:mt-0'>Danh sách chuyến đi</h1>
        <Button
          className='flex justify-center items-center bg-white border-primary border-[1px] text-primary hover:bg-primary hover:text-white'
          onClick={showAddTripModal}
        >
          <Plus className='w-6 mr-1' />
          Tạo chuyến đi
        </Button>
      </div>
      <DataTable
        data={trips}
        columns={columns(handleStatusChange, handleViewDetails, handleEditTrip)}
        Toolbar={DataTableToolbar}
        rowString='Chuyến'
      />
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogOverlay className='bg-/60' />
          <DialogContent>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>Xác nhận thay đổi trạng thái</h3>
            <div className='mt-2'>
              <p>
                Bạn có chắc chắn muốn thay đổi trạng thái của chuyến xe này? Lưu ý: Chuyến xe sẽ không được hủy nếu đã
                có vé đặt!
              </p>
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

      {isModalDetailOpen && (
        <Dialog open={isModalDetailOpen} onOpenChange={setIsModalOpen}>
          <DialogOverlay className='bg-/60' />
          <DialogContent>
            {selectedTripDetails ? (
              <>
                <h3 className='text-lg font-medium leading-6 text-gray-900'>Chi tiết chuyến đi</h3>
                <div className='mt-2'>
                  <TripDetailModal trip={selectedTripDetails} />
                </div>
                <div className='mt-4 flex justify-end space-x-2'>
                  <Button className='bg-primary' onClick={() => setIsModalDetailOpen(false)}>
                    Đóng
                  </Button>
                </div>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </DialogContent>
        </Dialog>
      )}

      <AddTripModal
        isModalVisible={isModalAddOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        onSuccess={handleAddTripSuccess}
      />
      <EditTripModal
        visible={isModalEditOpen}
        onClose={() => setIsModalEditOpen(false)}
        trip={selectedTrip}
        onUpdate={handleUpdateTrip}
      />
    </div>
  )
}
export default ListTrip
