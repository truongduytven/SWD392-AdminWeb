import { useState } from 'react'
import { Row } from '@tanstack/react-table'
import axios from 'axios'
import { toast } from '../../atoms/ui/use-toast'
import busAPI from '@/lib/busAPI'
import { Badge } from '../../atoms/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../atoms/ui/select'
import { useAuth } from '@/auth/AuthProvider'
import { Dialog, DialogContent, DialogOverlay } from '../../atoms/ui/dialog'
import { Button } from '@/components/global/atoms/ui/button'
import { Loader } from 'lucide-react'

interface DataTableRowActionsProps<TData extends Route> {
  // Add extends Route
  row: Row<TData>
}

type Route = {
  Route_CompanyID: string
  FromCity: string
  ToCity: string
  StartLocation: string
  EndLocation: string
  Status: string
}

export function DataTableRowActions<TData extends Route>({ row }: DataTableRowActionsProps<TData>) {
  const { user } = useAuth()
  console.log('user o route', user)
  const [routes, setRoutes] = useState<Route[]>([])
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [tempStatus, setTempStatus] = useState<{ [key: string]: string }>({
    [row.original.Route_CompanyID]: row.original.Status
  })

  const handleStatusChange = (route: Route, status: string) => {
    setSelectedRoute(route)
    setNewStatus(status)
    setIsModalOpen(true)
  }

  const confirmStatusChange = async () => {
    setIsLoadingUpdate(true)
    if (selectedRoute) {
      try {
        const response = await busAPI.put(
          `status-management?entity=ROUTE_COMPANY&id=${selectedRoute.Route_CompanyID}`,
          { status: newStatus }
        )
        // setRoutes(
        //   routes.map((route) =>
        //     route.Route_CompanyID === selectedRoute.Route_CompanyID
        //       ? { ...route, Status: newStatus }
        //       : route
        //   )
        // )
        setTempStatus((prevState) => ({
          ...prevState,
          [selectedRoute.Route_CompanyID]: newStatus
        }))
        toast({
          variant: 'success',
          title: 'Cập nhật thành công',
          description: 'Đã đổi trạng thái tuyến đường này thành ' + newStatus
        })
        setIsLoadingUpdate(false)
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
			toast({
			  variant: 'destructive',
			  title: 'Không thể cập nhật trạng thái tuyến đường',
			  description: 'Vui lòng thử lại sau'
			})
          const message = error.response.data.Result.message || null
          setTempStatus((prevState) => ({
            ...prevState,
            [selectedRoute.Route_CompanyID]: selectedRoute.Status
          }))
        }
      } finally {
        setIsLoadingUpdate(false)
        setIsModalOpen(false)
      }
    }
  }

  return (
    <div>
      <Select
        onValueChange={(status) => handleStatusChange(row.original, status)}
        value={tempStatus[row.original.Route_CompanyID] || row.original.Status}
      >
        <SelectTrigger className='w-fit'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className='w-fit'>
          <SelectItem value='HOẠT ĐỘNG'>
            <Badge variant='success'>Hoạt động</Badge>
          </SelectItem>
          <SelectItem value='KHÔNG HOẠT ĐỘNG'>
            <Badge variant='destructive'>Không hoạt động</Badge>
          </SelectItem>
        </SelectContent>
      </Select>

      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogOverlay className='bg-/60' />
          <DialogContent className=''>
            <p>Bạn có chắc chắn muốn thay đổi trạng thái của tuyến đường này?</p>
            <div className='flex justify-end mt-4'>
              <Button variant='outline' onClick={() => setIsModalOpen(false)}>
                Hủy
              </Button>
              <Button onClick={confirmStatusChange} className='ml-2'>
                {isLoadingUpdate && <Loader className='animate-spin w-4 h-4' />} Xác nhận
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
