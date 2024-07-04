import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../atoms/ui/select'
import { Badge } from '../atoms/ui/badge'
import { Dialog, DialogContent, DialogOverlay } from '@radix-ui/react-dialog'
import { Button } from '../atoms/ui/button'
import axios from 'axios'
import { toast } from '../atoms/ui/use-toast'

type Route = {
  Route_CompanyID: string
  FromCity: string
  ToCity: string
  StartLocation: string
  EndLocation: string
  Status: string
}

function Routes() {
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
        const { data } = await axios.get<Route[]>('https://65a5598f52f07a8b4a3eeb7a.mockapi.io/product/route')
        setRoutes(data || [])
        // Initialize tempStatus with current statuses
        const initialStatuses: { [key: string]: string } = {}
        data.forEach(route => {
          initialStatuses[route.Route_CompanyID] = route.Status
        })
        setTempStatus(initialStatuses)
      } catch (error) {
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
        await axios.put(`https://65a5598f52f07a8b4a3eeb7a.mockapi.io/product/route/${selectedRoute.Route_CompanyID}`, {
          ...selectedRoute,
          Status: newStatus
        })
        setRoutes(
          routes.map((route) =>
            route.Route_CompanyID === selectedRoute.Route_CompanyID ? { ...route, Status: newStatus } : route
          )
        )
        setTempStatus({ ...tempStatus, [selectedRoute.Route_CompanyID]: newStatus })
        setIsModalOpen(false)
        console.log("truoc toaasst")
        toast({
          variant: 'success',
          title: 'Cập nhật thành công',
          description: 'Đã đổi trạng thái tuyến đường này thành ' + newStatus
        })
        console.log("sau toast")
        setIsLoadingUpdate(false)
      } catch (error) {
        console.log(error)
        setIsModalOpen(false)
        setIsLoadingUpdate(false)

        // Revert status change on error
        setTempStatus({ ...tempStatus, [selectedRoute.Route_CompanyID]: selectedRoute.Status })
        toast({
          variant: 'destructive',
          title: 'Không thể cập nhật trạng thái tuyến đường',
          description:'Vui lòng thử lại sau'
        })
      }
    }
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <div className='text-3xl font-bold'>Danh sách tuyến đường</div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='text-center'>From City</TableHead>
            <TableHead>To City</TableHead>
            <TableHead>Start Location</TableHead>
            <TableHead className='text-center'>End Location</TableHead>
            <TableHead className='text-center'>Status</TableHead>
            <TableHead className='text-end'></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {routes.map((route) => (
            <TableRow key={route.Route_CompanyID}>
              <TableCell className='text-center'>{route.FromCity}</TableCell>
              <TableCell className=''>{route.ToCity}</TableCell>
              <TableCell className='font-medium'>{route.StartLocation}</TableCell>
              <TableCell className='text-center font-medium'>{route.EndLocation}</TableCell>
              <TableCell className='text-center'>
                <Select
                  onValueChange={(status) => handleStatusChange(route, status)}
                  value={tempStatus[route.Route_CompanyID] || route.Status}
                >
                  <SelectTrigger className='w-fit mx-auto'>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogOverlay className="fixed inset-0 bg-black bg-opacity-30" />
          <DialogContent className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p>Bạn có chắc chắn muốn thay đổi trạng thái của tuyến đường này?</p>
              <div className='flex justify-end mt-4'>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
                <Button onClick={confirmStatusChange} className='ml-2'>
                 {isLoadingUpdate && <div>...</div>} Xác nhận
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default Routes
