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



 
type Trip = {
  TripID: string
    FromCity: string
    ToCity:string
    StartLocation: string
    EndLocation: string
    StartTime: string
    EndTime: string
    StartDate: string
    EndDate: string
    StaffName: string
    MinPrice: number
    MaxPrice: number
    Status: string
}

function ListTrip() {
  const { user } = useAuth()
  console.log('user o route', user)
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoadingTrips, setIsLoadingTrips] = useState(true)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [tempStatus, setTempStatus] = useState<{ [key: string]: string }>({})
  const [selectedTripDetails, setSelectedTripDetails] = useState<any>(null)
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
        const response = await busAPI.put(`status-management?entity=ROUTE_COMPANY&id=${selectedTrip.TripID}`)
        
        setTrips(
          trips.map((trip) =>
            trip.TripID === selectedTrip.TripID ? { ...trip, Status: newStatus } : trip
          )
        )
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
  const handleViewDetails = async (routeId: string) => {
    setIsLoadingTrips(true)
    try {
      const { data } = await busAPI.get<any>(`route-management/station-details/${routeId}`)
      selectedTripDetails(data)
      setIsModalOpen(true)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Không thể tải chi tiết chuyến đi',
        description: 'Vui lòng thử lại sau'
      })
    } finally {
      setIsLoadingTrips(false)
    }
  }
  if (isLoadingTrips) {
    return <TableSkeleton />
  }

  return (
    <div className='flex h-full flex-1 flex-col '>
      <h1 className='my-4 border-b pb-2  text-3xl font-semibold tracking-wider first:mt-0 '>Danh sách chuyến đi</h1>
      <DataTable
        data={trips}
        columns={columns(handleStatusChange, handleViewDetails)}
        Toolbar={DataTableToolbar}
        rowString='Tuyến'
      />
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogOverlay className='bg-/60' />
          <DialogContent>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>Xác nhận thay đổi trạng thái</h3>
            <div className='mt-2'>
              <p>Bạn có chắc chắn muốn thay đổi trạng thái của tuyến đường này?</p>
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

       {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogOverlay className='bg-/60' />
          <DialogContent>
            {selectedTripDetails ? (
              <>
                <h3 className='text-lg font-medium leading-6 text-gray-900'>Chi tiết trạm dừng</h3>
                <div className='mt-2'>
                  <p>ID: {selectedTripDetails.id}</p>
                  <p>Tên: {selectedTripDetails.name}</p>
                  <p>Địa chỉ: {selectedTripDetails.address}</p>
                </div>
                <div className='mt-4 flex justify-end space-x-2'>
                  <Button variant='secondary' onClick={() => setIsModalOpen(false)}>
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
    </div>
  )
}
export default ListTrip
