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
import { Loader, Pen, Plus, Trash } from 'lucide-react'
import { Form, Input, message, Modal, Select, Space, Button as ButtonAnt, Tag, ConfigProvider, Tooltip } from 'antd'

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
  // console.log('user o route', user)
  const [routes, setRoutes] = useState<Route[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true)
  const [isLoadingRoutesDetail, setIsLoadingRouteDetail] = useState(true)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isLoadingEditRoute, setIsLoadingEdiRoute] = useState(false)
  const [isLoadingAddRoute, setIsLoadingAddRoute] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [tempStatus, setTempStatus] = useState<{ [key: string]: string }>({})
  const [selectedRouteDetails, setSelectedRouteDetails] = useState<any>(null)
  const [stations, setStations] = useState<Station[]>([])
  const [isAddRouteModalOpen, setIsAddRouteModalOpen] = useState(false)

  const [isEditRouteModalOpen, setIsEditRouteModalOpen] = useState(false)
  const [selectedRouteForEdit, setSelectedRouteForEdit] = useState<Route | null>(null)
  const [selectedStations, setSelectedStations] = useState<string[]>([])
  const [form] = Form.useForm()
  const [newRoute, setNewRoute] = useState<{
    fromCityID: string
    toCityID: string
    startLocation: string
    endLocation: string
    stationInRoutes: { stationID: string; orderInRoute: number }[]
  }>({ fromCityID: '', toCityID: '', startLocation: '', endLocation: '', stationInRoutes: [] })
  // Initialize form
  const [formEdit] = Form.useForm()

  // Function to open edit modal with selected route data
  const openEditRouteModal = async (route: Route) => {
    console.log("cái rout updaye", route)
    setSelectedRouteForEdit(route)
    // formEdit.setFieldsValue({
    //   fromCityID: route.FromCity,
    //   toCityID: route.ToCity,
    //   startLocation: route.StartLocation,
    //   endLocation: route.EndLocation
    //   // Set other fields as necessary
    // })
    try {
      console.log('vo dya')
      const { data } = await busAPI.get<any>(
        `station-management/managed-stations/routes/${route.RouteID}/companyID/${user?.CompanyID}`
      )
      // Assuming data is an array of objects with stationID, status, and Name
      const formattedStations = data.map((station: any, index: any) => ({
        stationID: station.StationID, // Adjust according to actual property name
        orderInRoute: index + 1 // Start order from 1
      }))
      const formattedStationIDs = data.map((station: any) => station.StationID) // Adjust according to actual property name
      setSelectedStations(formattedStationIDs)
      console.log('giá tri', formattedStations)
      // Assuming data is an array of station IDs
      formEdit.setFieldsValue({
        fromCityID: route.FromCity,
        toCityID: route.ToCity,
        startLocation: route.StartLocation,
        endLocation: route.EndLocation,
        stationInRoutes: formattedStationIDs // Set the fetched station data as initial value
      })
      setIsEditRouteModalOpen(true)
    } catch (error) {
      console.error('Error fetching station data:', error)
      toast({
        variant: 'destructive',
        title: 'Không thể tải trạm dừng',
        description: 'Vui lòng thử lại sau'
      })
      // Handle error as necessary (e.g., show a message to the user)
    }
  }

  // Handle editing a route
  const handleEditRoute = async (values: any) => {
    const fromCityID = cities.find(city => city.Name === values.fromCityID)?.CityID;
    const toCityID = cities.find(city => city.Name === values.toCityID)?.CityID;
    const updateRouteWithStations = {
      ...values,
      fromCityID, // Replace with ID
      toCityID,   // Replace with ID
      stationInRoutes: selectedStations.map((stationID, index) => ({
        stationID,
        orderInRoute: index + 1
      })),
      companyID:user?.CompanyID
    }
    console.log("updaye ne", updateRouteWithStations)
    // Perform validation similar to the add route
    if (!values.fromCityID || !values.toCityID || !values.startLocation || !values.endLocation) {
      message.error('Please fill in all fields')
      return
    }

    if (values.fromCityID === values.toCityID) {
      message.warning('Start and end cities cannot be the same')
      return
    }
  try {
      const response = await busAPI.put(`route-management/managed-routes/${selectedRouteForEdit?.RouteID}`, updateRouteWithStations)
      // Update the routes state with the edited route
      // setRoutes(routes.map((route) => (route.RouteID === selectedRouteForEdit?.RouteID ? updateRouteWithStations : route)));
      //
      setRoutes(routes.map((route) => (route.RouteID === selectedRouteForEdit?.RouteID ? { ...route, StartLocation:updateRouteWithStations.startLocation,EndLocation:updateRouteWithStations.endLocation} : route)));
      // setRoutes([...routes, response.data])
      //
      
      setIsEditRouteModalOpen(false)
      formEdit.resetFields()
      setSelectedStations([])
      toast({
        variant: 'success',
        title: 'Cập nhật tuyến đường thành công',
        description: 'Tuyến đường đã được cập nhật'
      })
      message.success('Route updated successfully')
    } catch (error) {
      message.error('Failed to update route. Please try again.')
    }
  }

  const fetchRoutes = async () => {
    setIsLoadingRoutes(true)
    try {
      const { data } = await busAPI.get<Route[]>(`route-management/managed-routes/company-routes/${user?.CompanyID}`)
      // console.log('data', data)
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
 
  const handleAddRoute = async (values: any) => {
    const newRouteWithStations = {
      ...values,
      stationInRoutes: selectedStations.map((stationID, index) => ({
        stationID,
        orderInRoute: index + 1
      }))
    }

    // console.log('Tao', newRouteWithStations)

    if (!values.fromCityID || !values.toCityID || !values.startLocation || !values.endLocation) {
      toast({
        variant: 'destructive',
        title: 'Thêm tuyến đường thất bại',
        description: 'Vui lòng điền đầy đủ thông tin'
      })
      return
    }

    if (values.fromCityID === values.toCityID) {
      message.warning('Thành phố bắt đầu và thành phố kết thúc không thể giống nhau')
      return
    }

    try {
      const response = await busAPI.post(`route-management/managed-routes`, {
        ...newRouteWithStations,
        CompanyID: user?.CompanyID
      })
      setRoutes([...routes, response.data])
      setIsAddRouteModalOpen(false)
      form.resetFields()
      setSelectedStations([])
      toast({
        variant: 'success',
        title: 'Thêm tuyến đường thành công',
        description: 'Tuyến đường đã được thêm'
      })
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const messages = error.response.data.Result.message
        toast({
          variant: 'destructive',
          title: 'Không thể thêm tuyến đường',
          description: messages || 'Vui lòng thử lại sau'
        })
        message.error(messages || 'Vui lòng thử lại sau')
      }
    }
  }

  const handleStationChange = (selectedStationIDs: string[]) => {
    setSelectedStations(selectedStationIDs)
    const selectedStationsData = selectedStationIDs.map((stationID, index) => ({
      stationID,
      orderInRoute: index + 1 // Using index + 1 as the order
    }))
    setNewRoute((prev) => ({ ...prev, stationInRoutes: selectedStationsData }))
  }
  const tagRender = ({ label, value, onClose }: any) => {
    const index = selectedStations.indexOf(value) // Calculate index based on selected stations
    return (
      <Tag closable={true} onClose={onClose} style={{ marginRight: 3 }}>
        {`${label}_${index + 1}`} {/* Display label with order */}
      </Tag>
    )
  }
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
        setNewRoute((prev) => ({ ...prev, fromCityID: cityID }))
      } else {
        setNewRoute((prev) => ({ ...prev, toCityID: cityID }))
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
        <h1 className='my-4 border-b pb-2 text-3xl font-semibold tracking-wider first:mt-0'>Danh sách tuyến đường</h1>
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
        columns={columns(handleStatusChange, handleViewDetails, openEditRouteModal)}
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

     
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#F97316'
          },
          components: {
            Button: {
              colorTextLightSolid: '#fff'
            }
          }
        }}
      >
        <Modal
          visible={isAddRouteModalOpen}
          title='Thêm Tuyến Đường Mới'
          onCancel={() => {
            setIsAddRouteModalOpen(false)
            form.resetFields()
            setSelectedStations([]) // Reset the selected stations as well
          }}
          footer={null}
        >
          <Form form={form} layout='vertical' onFinish={handleAddRoute}>
            <Form.Item
              name='fromCityID'
              label='Thành Phố Bắt Đầu'
              rules={[{ required: true, message: 'Vui lòng chọn thành phố bắt đầu' }]}
            >
              <Select placeholder='Chọn thành phố' onChange={(value) => handleCityChange(value, true)}>
                {cities.map((city) => (
                  <Select.Option key={city.CityID} value={city.CityID}>
                    {city.Name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name='toCityID'
              label='Thành Phố Kết Thúc'
              rules={[{ required: true, message: 'Vui lòng chọn thành phố kết thúc' }]}
            >
              <Select placeholder='Chọn thành phố' onChange={(value) => handleCityChange(value, false)}>
                {cities.map((city) => (
                  <Select.Option key={city.CityID} value={city.CityID}>
                    {city.Name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name='startLocation'
              label='Địa Điểm Bắt Đầu'
              rules={[{ required: true, message: 'Vui lòng nhập địa điểm bắt đầu' }]}
            >
              <Input placeholder='Nhập địa điểm bắt đầu' />
            </Form.Item>
            <Form.Item
              name='endLocation'
              label='Địa Điểm Kết Thúc'
              rules={[{ required: true, message: 'Vui lòng nhập địa điểm kết thúc' }]}
            >
              <Input placeholder='Nhập địa điểm kết thúc' />
            </Form.Item>
            <Form.Item
              name='stationInRoutes'
              label='Các Trạm Dừng'
              rules={[{ required: true, message: 'Vui lòng chọn ít nhất một trạm' }]}
            >
              <Select
                mode='multiple'
                placeholder='Chọn các trạm'
                value={selectedStations}
                onChange={handleStationChange}
                tagRender={tagRender}
              >
                {stations.map((station) => (
                  <Select.Option key={station.StationID} value={station.StationID}>
                    {station.Name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <ButtonAnt type='primary' htmlType='submit' className='float-right'>
                Thêm Tuyến Đường
              </ButtonAnt>
            </Form.Item>
          </Form>
        </Modal>
      </ConfigProvider>
      <ConfigProvider theme={{
          token: {
            colorPrimary: '#F97316'
          },
          components: {
            Button: {
              colorTextLightSolid: '#fff'
            }
          }
        }}>
        <Modal
          visible={isEditRouteModalOpen}
          title='Cập nhật tuyến đường'
          onCancel={() => {
            setIsEditRouteModalOpen(false)
            formEdit.resetFields()
          }}
          footer={null}
        >
          <Form form={formEdit} layout='vertical' onFinish={handleEditRoute}>
            <Form.Item
              name='fromCityID'
              label='Từ thành phố'
              rules={[{ required: true, message: 'Vui lòng chọn thành phố bắt đầu' }]}
            >
              <Select placeholder='Chọn thành phố bắt đầu' disabled>
                {cities.map((city) => (
                  <Select.Option key={city.CityID} value={city.CityID}>
                    {city.Name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name='toCityID'
              label='Đến thành phố'
              rules={[{ required: true, message: 'Vui lòng chọn thành phố đến' }]}
            >
              <Select placeholder='Chọn thành phố đến' disabled>
                {cities.map((city) => (
                  <Select.Option key={city.CityID} value={city.CityID}>
                    {city.Name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name='startLocation'
              label='Địa điểm bắt đầu'
              rules={[{ required: true, message: 'Vui lòng nhập điểm bắt đầu' }]}
            >
              <Input placeholder='Nhập điểm bắt đầu' />
            </Form.Item>
            <Form.Item
              name='endLocation'
              label='Địa điểm kết thúc'
              rules={[{ required: true, message: 'Vui lòng nhập điểm kết thúc' }]}
            >
              <Input placeholder='Nhập điểm kết thúc' />
            </Form.Item>
            <Form.Item
              name='stationInRoutes'
              label='Trạm dừng'
              rules={[{ required: true, message: 'Vui lòng chọn trạm dừng' }]}
            >
              <Select
                mode='multiple'
                placeholder='Select stations'
                onChange={handleStationChange}
                tagRender={tagRender}
              >
                {stations.map((station) => (
                  <Select.Option key={station.StationID} value={station.StationID}>
                    {station.Name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <ButtonAnt type='primary' htmlType='submit'>
                Cập nhật tuyến đường
              </ButtonAnt>
            </Form.Item>
          </Form>
        </Modal>
      </ConfigProvider>
    </div>
  )
}
export default ListRoute
