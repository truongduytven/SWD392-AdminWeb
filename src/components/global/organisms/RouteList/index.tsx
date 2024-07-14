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
import { Loader, Plus, Trash } from 'lucide-react'
import { Input, message, Modal, Select, Space, Tag } from 'antd'

type Route = {
  Route_CompanyID: string
  RouteID: string
  FromCity: string
  ToCity: string
  StartLocation: string
  EndLocation: string
  Status: string
}
interface City {
  CityID: string
  Name: string
  Status: string
}
interface Station {
  StationID: string
  Name: string
  Status: string
}

function ListRoute() {
  const { user } = useAuth()
  console.log('user o route', user)
  const [routes, setRoutes] = useState<Route[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true)
  const [isLoadingRoutesDetail, setIsLoadingRouteDetail] = useState(true)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [tempStatus, setTempStatus] = useState<{ [key: string]: string }>({})
  const [selectedRouteDetails, setSelectedRouteDetails] = useState<any>(null)
  const [stations, setStations] = useState<Station[]>([])
  const [isAddRouteModalOpen, setIsAddRouteModalOpen] = useState(false)
  const [selectedStations, setSelectedStations] = useState<string[]>([]);
  const [newRoute, setNewRoute] = useState<{
    FromCity: string
    ToCity: string
    StartLocation: string
    EndLocation: string
    stationInRoutes?: { stationID: string; orderInRoute: number }[]; 
  }>({ FromCity: '', ToCity: '', StartLocation: '', EndLocation: '' })

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
  const fetchCities = async () => {
    try {
      const { data } = await busAPI.get<City[]>('city-management/managed-cities')
      setCities(data || [])
    } catch (error) {
      console.log(error)
      toast({
        variant: 'destructive',
        title: 'Không thể tải dữ liệu thành phố',
        description: 'Vui lòng thử lại sau'
      })
    }
  }
  useEffect(() => {
    fetchRoutes()
    fetchCities()
    fetchStations()
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
  const handleViewDetails = async (routeId: string) => {
    setIsLoadingRouteDetail(true)
    try {
      const { data } = await busAPI.get<any>(
        `station-management/managed-stations/routes/${routeId}/companyID/${user?.CompanyID}`
      )
      setSelectedRouteDetails(data)
      setIsModalDetailOpen(true)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Không thể tải chi tiết trạm dừng',
        description: 'Vui lòng thử lại sau'
      })
    } finally {
      setIsLoadingRouteDetail(false)
    }
  }
  const handleAddRoute = async () => {
    console.log('tao', newRoute)
    // Simple validation check
    if (!newRoute.FromCity || !newRoute.ToCity || !newRoute.StartLocation || !newRoute.EndLocation) {
      toast({
        variant: 'destructive',
        title: 'Thêm tuyến đường thất bại',
        description: 'Vui lòng điền đầy đủ thông tin'
      })
      return
    }
    if (newRoute.FromCity === newRoute.ToCity) {
      message.warning('Thành phố bắt đầu và thành phố kết thúc không thể giống nhau')
      // toast({
      //   variant: 'destructive',
      //   title: 'Thêm tuyến đường thất bại',
      //   description: 'Thành phố bắt đầu và thành phố kết thúc không thể giống nhau'
      // })
      return
    }
    try {
      const response = await busAPI.post(`route-management/managed-routes`, { ...newRoute, CompanyID: user?.CompanyID })
      setRoutes([...routes, response.data]) // Update the routes list
      setIsAddRouteModalOpen(false) // Close modal
      setNewRoute({ FromCity: '', ToCity: '', StartLocation: '', EndLocation: '' }) // Reset the form
      toast({
        variant: 'success',
        title: 'Thêm tuyến đường thành công',
        description: 'Tuyến đường đã được thêm'
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Không thể thêm tuyến đường',
        description: 'Vui lòng thử lại sau'
      })
    }
  }
  const handleStationChange = (selectedStationIDs: string[]) => {
    setSelectedStations(selectedStationIDs);
    const selectedStationsData = selectedStationIDs.map((stationID, index) => ({
      stationID,
      orderInRoute: index + 1 // Using index + 1 as the order
    }))
    setNewRoute((prev) => ({ ...prev, stationInRoutes: selectedStationsData }))
  }
  const tagRender = ({ label, value, onClose }: any) => {
    const index = selectedStations.indexOf(value); // Calculate index based on selected stations
    return (
      <Tag closable={true} onClose={onClose} style={{ marginRight: 3 }}>
        {`${label}_${index + 1}`} {/* Display label with order */}
      </Tag>
    );
  };
  const fetchStations = async () => {
    try {
      const { data } = await busAPI.get<Station[]>(`station-management/managed-stations`)
      setStations(data || [])
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Không thể tải dữ liệu trạm',
        description: 'Vui lòng thử lại sau'
      })
    }
  }
  const handleCityChange = async (cityID: string, isFromCity: boolean) => {
    try {
      // Fetch stations when a city is selected
      await fetchStations()

      // Update the newRoute state based on whether it's the FromCity or ToCity
      if (isFromCity) {
        setNewRoute((prev) => ({ ...prev, FromCity: cityID }))
      } else {
        setNewRoute((prev) => ({ ...prev, ToCity: cityID }))
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi khi tải trạm',
        description: 'Vui lòng thử lại sau'
      })
    }
  }
  if (isLoadingRoutes) {
    return <TableSkeleton />
  }

  return (
    <div className='flex h-full flex-1 flex-col '>
      <div className='flex justify-between'>
        <h1 className='my-4 border-b pb-2 text-3xl font-semibold tracking-wider first:mt-0'>Danh sách trạm dừng</h1>
        <Button
          className='flex justify-center items-center bg-white border-primary border-[1px] text-primary hover:bg-primary hover:text-white'
          onClick={() => setIsAddRouteModalOpen(true)}
        >
          <Plus className='w-6 mr-1' />
          Thêm tuyến đường
        </Button>
      </div>
      <DataTable
        data={routes}
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

      {isModalDetailOpen && (
        <Dialog open={isModalDetailOpen} onOpenChange={setIsModalDetailOpen}>
          <DialogOverlay className='bg-/60' />
          <DialogContent>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>Chi tiết trạm dừng</h3>
            {isLoadingRoutesDetail ? (
              <div className='flex justify-center items-center mt-4'>
                <Loader className='animate-spin' />
              </div>
            ) : (
              <>
                {selectedRouteDetails && selectedRouteDetails.length > 0 ? (
                  <div className='ml-10 mt-8 text-base flex justify-center items-center'>
                    <div>
                      <ol className='relative border-l border-orange-400 border-dashed'>
                        {selectedRouteDetails.map((item: any, index: any) => (
                          <li key={index} className='mb-10 ml-6'>
                            <span className='flex absolute text-white -left-3 bg-primary justify-center items-center w-6 h-6 rounded-full ring-8 ring-white'>
                              {index + 1}
                            </span>
                            <h3 className='flex items-center mb-1'>{item.Name}</h3>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ) : (
                  <p className='mt-4 text-center'>Tuyến đường này chưa có trạm dừng</p>
                )}
              </>
            )}
            <div className='mt-4 flex justify-end space-x-2'>
              <Button onClick={() => setIsModalDetailOpen(false)}>Đóng</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Route Modal */}
      <Modal
        title='Thêm tuyến đường'
        visible={isAddRouteModalOpen}
        onCancel={() => setIsAddRouteModalOpen(false)}
        onOk={handleAddRoute}
      >
        <Space style={{ width: '100%' }} direction='vertical'>
          <Select
            showSearch
            className='w-full'
            placeholder='Chọn thành phố từ'
            onChange={(value) => handleCityChange(value, true)}
            options={cities.map((city) => ({ value: city.CityID, label: city.Name }))}
          />

          <Select
            showSearch
            className='w-full'
            placeholder='Chọn thành phố đến'
            onChange={(value) => handleCityChange(value, false)}
            options={cities.map((city) => ({ value: city.CityID, label: city.Name }))}
          />

          <Input
            placeholder='Vị trí bắt đầu'
            value={newRoute.StartLocation}
            onChange={(e) => setNewRoute({ ...newRoute, StartLocation: e.target.value })}
          />

          <Input
            placeholder='Vị trí kết thúc'
            value={newRoute.EndLocation}
            onChange={(e) => setNewRoute({ ...newRoute, EndLocation: e.target.value })}
          />

          <Select
            mode='multiple'
            allowClear
            style={{ width: '100%' }}
            placeholder='Chọn trạm'
            onChange={handleStationChange}
            options={stations?.map((station: any) => ({ value: station.StationID, label: station.Name }))}
            tagRender={tagRender}
          />
        </Space>
      </Modal>
    </div>
  )
}
export default ListRoute
