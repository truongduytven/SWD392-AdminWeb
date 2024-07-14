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

type Route = {
  Route_CompanyID: string
  RouteID: string
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
  const [isLoadingRoutesDetail, setIsLoadingRouteDetail] = useState(true)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [tempStatus, setTempStatus] = useState<{ [key: string]: string }>({})
  const [selectedRouteDetails, setSelectedRouteDetails] = useState<any>(null)
  const [isAddRouteModalOpen, setIsAddRouteModalOpen] = useState(false);
  const [newRouteData, setNewRouteData] = useState({
    fromCityID: '',
    toCityID: '',
    companyID: user?.CompanyID || '',
    startLocation: '',
    endLocation: '',
    stationInRoutes: [{ stationID: '', orderInRoute: 0 }],
  });
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

  useEffect(() => {
    fetchRoutes();
  }, []);

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
  if (isLoadingRoutes) {
    return <TableSkeleton />
  }

  const handleAddRouteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRouteData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStation = () => {
    setNewRouteData((prev) => ({
      ...prev,
      stationInRoutes: [...prev.stationInRoutes, { stationID: '', orderInRoute: prev.stationInRoutes.length }],
    }));
  };

  const handleStationChange = (index: number, value: string) => {
    const updatedStations = newRouteData.stationInRoutes.map((station, i) =>
      i === index ? { ...station, stationID: value } : station
    );
    setNewRouteData((prev) => ({ ...prev, stationInRoutes: updatedStations }));
  };

  const handleRemoveStation = (index: number) => {
    const updatedStations = newRouteData.stationInRoutes.filter((_, i) => i !== index);
    setNewRouteData((prev) => ({ ...prev, stationInRoutes: updatedStations }));
  };

  const handleAddRoute = async () => {
    if (!newRouteData.fromCityID || !newRouteData.toCityID || !newRouteData.startLocation || !newRouteData.endLocation) {
      toast({
        variant: 'destructive',
        title: 'Thêm tuyến đường không thành công',
        description: 'Vui lòng điền đầy đủ thông tin.',
      });
      return;
    }

    try {
      await busAPI.post('route-management/routes', newRouteData);
      toast({
        variant: 'success',
        title: 'Thêm tuyến đường thành công',
        description: 'Tuyến đường đã được thêm thành công',
      });
      setIsAddRouteModalOpen(false);
      setNewRouteData({
        fromCityID: '',
        toCityID: '',
        companyID: user?.CompanyID || '',
        startLocation: '',
        endLocation: '',
        stationInRoutes: [{ stationID: '', orderInRoute: 0 }],
      });
      // Refresh the list of routes
      fetchRoutes();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Không thể thêm tuyến đường',
        description: 'Vui lòng thử lại sau',
      });
      console.log(error);
    }
  };

  return (
    <div className='flex h-full flex-1 flex-col '>
      <div className='flex justify-between'>
        <h1 className='my-4 border-b pb-2 text-3xl font-semibold tracking-wider first:mt-0'>Danh sách trạm dừng</h1>
        <Button className='flex justify-center items-center bg-white border-primary border-[1px] text-primary hover:bg-primary hover:text-white' onClick={() => setIsAddRouteModalOpen(true)}>
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
       {isAddRouteModalOpen && (
        <Dialog open={isAddRouteModalOpen} onOpenChange={setIsAddRouteModalOpen}>
          <DialogOverlay className='bg-/60' />
          <DialogContent>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>Thêm tuyến đường mới</h3>
            <div className='mt-2'>
              <input
                type='text'
                name='fromCityID'
                placeholder='ID Thành phố đi'
                value={newRouteData.fromCityID}
                onChange={handleAddRouteChange}
                className='w-full p-2 border border-gray-300 rounded mt-2'
              />
              <input
                type='text'
                name='toCityID'
                placeholder='ID Thành phố đến'
                value={newRouteData.toCityID}
                onChange={handleAddRouteChange}
                className='w-full p-2 border border-gray-300 rounded mt-2'
              />
              <input
                type='text'
                name='startLocation'
                placeholder='Điểm khởi hành'
                value={newRouteData.startLocation}
                onChange={handleAddRouteChange}
                className='w-full p-2 border border-gray-300 rounded mt-2'
              />
              <input
                type='text'
                name='endLocation'
                placeholder='Điểm đến'
                value={newRouteData.endLocation}
                onChange={handleAddRouteChange}
                className='w-full p-2 border border-gray-300 rounded mt-2'
              />
              <div className='mt-4'>
                <h4 className='font-medium'>Trạm dừng:</h4>
                {newRouteData.stationInRoutes.map((station, index) => (
                  <div key={index} className='flex mt-2 items-center'>
                    <input
                      type='text'
                      placeholder={`ID Trạm ${index + 1}`}
                      value={station.stationID}
                      onChange={(e) => handleStationChange(index, e.target.value)}
                      className='w-full p-2 border border-gray-300 rounded'
                    />
                    <Button onClick={() => handleRemoveStation(index)} className='ml-2'>
                      <Trash className='w-5 h-5 text-red-600' />
                    </Button>
                  </div>
                ))}
                <Button onClick={handleAddStation} className='mt-2'>
                  Thêm Trạm
                </Button>
              </div>
            </div>
            <div className='mt-4 flex justify-end space-x-2'>
              <Button variant='secondary' onClick={() => setIsAddRouteModalOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddRoute}>
                Thêm
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

    </div>
  )
}
export default ListRoute
