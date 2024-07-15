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


type Staff = {
 StaffID: string,
    Name: string,
    CompanyID: string,
    Password: string,
    Email: string,
    Address: string,
    PhoneNumber:string
}

function ListStaff() {
  const { user } = useAuth()
  // console.log('user o route', user)
  const [staffs, setStaffs] = useState<Staff[]>([])
  const [isLoadingStaffs, setIsLoadingStaffs] = useState(true)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [tempStatus, setTempStatus] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const fetchRoutes = async () => {
      setIsLoadingStaffs(true)
      try {
        const { data } = await busAPI.get<Staff[]>(`user-management/managed-users/staff/${user?.CompanyID}`)
        console.log('data', data)
        setStaffs(data || [])
        // Initialize tempStatus with current statuses
        const initialStatuses: { [key: string]: string } = {}
        data.forEach((route) => {
          initialStatuses[route.Route_CompanyID] = route.Status
        })
        setTempStatus(initialStatuses)
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Không thể tải dữ liệu tuyến đường',
          description: 'Vui lòng thử lại sau'
        })
        console.log(error)
      } finally {
        setIsLoadingStaffs(false)
      }
    }

    fetchRoutes()
  }, [])

  // const handleStatusChange = (route: Route, status: string) => {
  //   setSelectedRoute(route)
  //   setNewStatus(status)
  //   setIsModalOpen(true)
  // }

  const confirmStatusChange = async () => {
    setIsLoadingUpdate(true)
    if (selectedRoute) {
      try {
        const response = await busAPI.put(`status-management?entity=ROUTE_COMPANY&id=${selectedRoute.Route_CompanyID}`)
        setRoutes(
          routes.map((route) =>
            route.Route_CompanyID === selectedRoute.Route_CompanyID ? { ...route, Status: newStatus } : route
          )
        )
        setTempStatus({ ...tempStatus, [selectedRoute.Route_CompanyID]: newStatus })
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
          setTempStatus({ ...tempStatus, [selectedRoute.Route_CompanyID]: selectedRoute.Status })
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
  if (isLoadingRoutes) {
    return <TableSkeleton />
  }

  return (
    <div className='flex h-full flex-1 flex-col '>
      <h1 className='my-4 border-b pb-2  text-3xl font-semibold tracking-wider first:mt-0 '>Danh sách tuyến đường</h1>
      <DataTable data={routes} columns={columns(handleStatusChange)} Toolbar={DataTableToolbar} rowString='Tuyến' />
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
    </div>
  )
}
export default ListStaff
