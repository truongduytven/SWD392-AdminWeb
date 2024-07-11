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

const users: any = [
  {
    id: '1',
    avatar: 'https://via.placeholder.com/150',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    birthday: '1990-01-01',
    gender: 'Male',
    role: 'Admin',
    status: true
  },
  {
    id: '2',
    avatar: 'https://via.placeholder.com/150',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '098-765-4321',
    birthday: '1992-02-02',
    gender: 'Female',
    role: 'User',
    status: false
  },
  {
    id: '3',
    avatar: 'https://via.placeholder.com/150',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '111-222-3333',
    birthday: '1985-03-03',
    gender: 'Female',
    role: 'User',
    status: true
  },
  {
    id: '4',
    avatar: 'https://via.placeholder.com/150',
    name: 'Bob Brown',
    email: 'bob.brown@example.com',
    phone: '444-555-6666',
    birthday: '1978-04-04',
    gender: 'Male',
    role: 'Moderator',
    status: true
  },
  {
    id: '5',
    avatar: 'https://via.placeholder.com/150',
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    phone: '777-888-9999',
    birthday: '1980-05-05',
    gender: 'Male',
    role: 'Admin',
    status: false
  },
  {
    id: '1',
    avatar: 'https://via.placeholder.com/150',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    birthday: '1990-01-01',
    gender: 'Male',
    role: 'Admin',
    status: true
  },
  {
    id: '2',
    avatar: 'https://via.placeholder.com/150',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '098-765-4321',
    birthday: '1992-02-02',
    gender: 'Female',
    role: 'User',
    status: false
  },
  {
    id: '3',
    avatar: 'https://via.placeholder.com/150',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '111-222-3333',
    birthday: '1985-03-03',
    gender: 'Female',
    role: 'User',
    status: true
  },
  {
    id: '4',
    avatar: 'https://via.placeholder.com/150',
    name: 'Bob Brown',
    email: 'bob.brown@example.com',
    phone: '444-555-6666',
    birthday: '1978-04-04',
    gender: 'Male',
    role: 'Moderator',
    status: true
  },
  {
    id: '5',
    avatar: 'https://via.placeholder.com/150',
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    phone: '777-888-9999',
    birthday: '1980-05-05',
    gender: 'Male',
    role: 'Admin',
    status: false
  },
  {
    id: '1',
    avatar: 'https://via.placeholder.com/150',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    birthday: '1990-01-01',
    gender: 'Male',
    role: 'Admin',
    status: true
  },
  {
    id: '2',
    avatar: 'https://via.placeholder.com/150',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '098-765-4321',
    birthday: '1992-02-02',
    gender: 'Female',
    role: 'User',
    status: false
  },
  {
    id: '3',
    avatar: 'https://via.placeholder.com/150',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '111-222-3333',
    birthday: '1985-03-03',
    gender: 'Female',
    role: 'User',
    status: true
  },
  {
    id: '4',
    avatar: 'https://via.placeholder.com/150',
    name: 'Bob Brown',
    email: 'bob.brown@example.com',
    phone: '444-555-6666',
    birthday: '1978-04-04',
    gender: 'Male',
    role: 'Moderator',
    status: true
  },
  {
    id: '5',
    avatar: 'https://via.placeholder.com/150',
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    phone: '777-888-9999',
    birthday: '1980-05-05',
    gender: 'Male',
    role: 'Admin',
    status: false
  },
  {
    id: '1',
    avatar: 'https://via.placeholder.com/150',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    birthday: '1990-01-01',
    gender: 'Male',
    role: 'Admin',
    status: true
  },
  {
    id: '2',
    avatar: 'https://via.placeholder.com/150',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '098-765-4321',
    birthday: '1992-02-02',
    gender: 'Female',
    role: 'User',
    status: false
  },
  {
    id: '3',
    avatar: 'https://via.placeholder.com/150',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '111-222-3333',
    birthday: '1985-03-03',
    gender: 'Female',
    role: 'User',
    status: true
  },
  {
    id: '4',
    avatar: 'https://via.placeholder.com/150',
    name: 'Bob Brown',
    email: 'bob.brown@example.com',
    phone: '444-555-6666',
    birthday: '1978-04-04',
    gender: 'Male',
    role: 'Moderator',
    status: true
  },
  {
    id: '5',
    avatar: 'https://via.placeholder.com/150',
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    phone: '777-888-9999',
    birthday: '1980-05-05',
    gender: 'Male',
    role: 'Admin',
    status: false
  }
]
type Route = {
  Route_CompanyID: string
  FromCity: string
  ToCity: string
  StartLocation: string
  EndLocation: string
  Status: string
}

function ListRoute() {
  const { user } = useAuth()
  console.log('user o route', user)
  const [routes, setRoutes] = useState<Route[]>([])
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [tempStatus, setTempStatus] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const fetchRoutes = async () => {
      setIsLoadingRoutes(true)
      try {
        const { data } = await busAPI.get<Route[]>(`route-management/managed-routes/company-routes/${user?.CompanyID}`)
        console.log('data', data)
        setRoutes(data || [])
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
        setIsLoadingRoutes(false)
      }
    }

    fetchRoutes()
  }, [])

  const handleStatusChange = (route: Route, status: string) => {
    setSelectedRoute(route)
    setNewStatus(status)
    setIsModalOpen(true)
  }

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
export default ListRoute
