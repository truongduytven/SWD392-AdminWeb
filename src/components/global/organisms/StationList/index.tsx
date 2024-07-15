import { useEffect, useState } from 'react'
import { columns } from './columns'
import { DataTable } from '../table/main'
import { DataTableToolbar } from './toolbar'
import { useAuth } from '@/auth/AuthProvider'
import busAPI from '@/lib/busAPI'
import { toast } from '../../atoms/ui/use-toast'
import axios from 'axios'
import TableSkeleton from '../TableSkeleton'
import { Dialog, DialogContent, DialogOverlay } from '../../atoms/ui/dialog'
import { Button } from '../../atoms/ui/button'
import { Loader, Plus } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../atoms/ui/form'
import { Input } from '../../atoms/ui/input'
import { useForm } from 'react-hook-form'
import { StationNameSchema } from '@/components/Schema/StationNameSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AddStationSchema } from '@/components/Schema/AddStationSchema'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../atoms/ui/select'
import { ServiceModal, AddServiceModal } from '../ServiceModals'

// Define the interface for the Service
interface Service {
  Service_StationID: string
  ServiceID: string
  Price: number
  Name: string
  ImageUrl: string
}

// Define the interface for the ServiceType
interface ServiceType {
  ServiceTypeID: string
  ServiceTypeName: string
  ServiceInStation: Service[]
}

// Define the interface for the Station
interface Station {
  StationID: string
  CityID: string
  CityName: string
  StationName: string
  Status: string
  ServiceTypeInStation: ServiceType[]
}
interface City {
  CityID: string
  Name: string
  Status: string
}
function ListStation() {
  const { user } = useAuth()
  const [stations, setStations] = useState<Station[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [isLoadingStations, setIsLoadingStations] = useState(true)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [tempStatus, setTempStatus] = useState<{ [key: string]: string }>({})
  const [isEditing, setIsEditing] = useState<Station | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isServiceModalVisible, setServiceModalVisible] = useState(false)
  const [isAddServiceModalVisible, setAddServiceModalVisible] = useState(false)
  // const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const handleUpdateService = (updatedService: any) => {
    console.log("update ơ bang", updatedService)
    setStations((prevStations) =>
      prevStations.map((station) =>
        station.StationID === updatedService.StationID // Ensure you're matching with Service_StationID
          ? {
              ...updatedService
            }
          : station
      )
    )
  }
  const handleShowServiceModal = (station: Station) => {
    setSelectedStation(station)
    setServiceModalVisible(true)
  }

  const handleShowAddServiceModal = () => {
    setAddServiceModalVisible(true)
  }

  const handleServiceModalOk = () => {
    setServiceModalVisible(false)
  }

  const handleAddServiceModalOk = () => {
    // Handle the logic for adding a service
    setAddServiceModalVisible(false)
  }
  const formStation = useForm<z.infer<typeof StationNameSchema>>({
    resolver: zodResolver(StationNameSchema),
    defaultValues: {
      StationName: ''
    }
  })
  const formAddStation = useForm<z.infer<typeof AddStationSchema>>({
    resolver: zodResolver(AddStationSchema),
    defaultValues: {
      StationName: '',
      CityID: '',
      CompanyID: user?.CompanyID || ''
    }
  })
  useEffect(() => {
    const fetchStations = async () => {
      setIsLoadingStations(true)
      try {
        const { data } = await busAPI.get<Station[]>(`station-management/managed-stations/company/${user?.CompanyID}`)
        setStations(data || [])
        const initialStatuses: { [key: string]: string } = {}
        data.forEach((station) => {
          initialStatuses[station.StationID] = station.Status
        })
        setTempStatus(initialStatuses)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoadingStations(false)
      }
    }
    const fetchCities = async () => {
      try {
        const { data } = await busAPI.get<City[]>('city-management/managed-cities')
        setCities(data || [])
      } catch (error) {
        console.log(error)
      }
    }
    fetchStations()
    fetchCities()
  }, [user?.CompanyID])

  const handleStatusChange = (station: Station, status: string) => {
    setSelectedStation(station)
    setNewStatus(status)
    setIsModalOpen(true)
  }

  const confirmStatusChange = async () => {
    setIsLoadingUpdate(true)
    if (selectedStation) {
      try {
        await busAPI.put(`status-management?entity=STATION&id=${selectedStation.StationID}`)
        setStations(
          stations.map((station) =>
            station.StationID === selectedStation.StationID ? { ...station, Status: newStatus } : station
          )
        )
        setTempStatus({ ...tempStatus, [selectedStation.StationID]: newStatus })
        toast({
          variant: 'success',
          title: 'Cập nhật thành công',
          description: 'Đã đổi trạng thái tuyến đường này thành ' + newStatus
        })
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const message = error.response.data.Result.message
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

  const handleEditName = (station: Station, currentName: string) => {
    setIsEditing(station)
    formStation.reset({ StationName: currentName })
  }

  const confirmEditName = async (values: z.infer<typeof StationNameSchema>) => {
    if (isEditing) {
      setIsLoadingUpdate(true)
      try {
        await busAPI.put(`station-management/managed-stations/${isEditing.StationID}`, {
          StationName: values.StationName
        })
        setStations(
          stations.map((station) =>
            station.StationID === isEditing.StationID ? { ...station, StationName: values.StationName } : station
          )
        )
        toast({
          variant: 'success',
          title: 'Cập nhật thành công',
          description: 'Đã cập nhật tên trạm dừng'
        })
        setIsEditing(null)
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const message = error.response.data.Result.message
          toast({
            variant: 'destructive',
            title: 'Không thể cập nhật tên trạm dừng',
            description: message || 'Vui lòng thử lại sau'
          })
        }
      } finally {
        setIsLoadingUpdate(false)
      }
    }
  }

  const handleAddStation = () => {
    setIsAdding(true)
  }
  const handleModalAddClose = () => {
    setIsAdding(false)
    formAddStation.reset() // Reset form when closing
  }
  const confirmAddStation = async (values: z.infer<typeof AddStationSchema>) => {
    setIsLoadingUpdate(true)
    try {
      const { data } = await busAPI.post('station-management/managed-stations', {
        stationName: values.StationName,
        cityID: values.CityID,
        companyID: user?.CompanyID
      })
      const newStation = { ...data, ServiceTypeInStation: [] }
      console.log('fjhhfjhkjg', newStation)
      setStations([...stations, newStation])
      toast({
        variant: 'success',
        title: 'Thêm trạm dừng thành công',
        description: 'Trạm dừng mới đã được thêm thành công'
      })
      setIsAdding(false)
      formAddStation.reset()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const message = error.response.data.Result.message
        toast({
          variant: 'destructive',
          title: 'Không thể thêm trạm dừng',
          description: message || 'Vui lòng thử lại sau'
        })
      }
    } finally {
      setIsLoadingUpdate(false)
    }
  }
  if (isLoadingStations) {
    return <TableSkeleton />
  }

  return (
    <div className='flex h-full flex-1 flex-col'>
      <div className='flex justify-between'>
        <h1 className='my-4 border-b pb-2 text-3xl font-semibold tracking-wider first:mt-0'>Danh sách trạm dừng</h1>
        <Button
          className='flex justify-center items-center bg-white border-primary border-[1px] text-primary hover:bg-primary hover:text-white'
          onClick={handleAddStation}
        >
          <Plus className='w-6 mr-1' />
          Thêm trạm dừng
        </Button>
      </div>
      <DataTable
        data={stations}
        columns={columns(handleStatusChange, handleEditName, handleShowServiceModal)}
        Toolbar={DataTableToolbar}
        rowString='Trạm'
      />
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
      {isEditing && (
        <Dialog open={isEditing !== null} onOpenChange={() => setIsEditing(null)}>
          <DialogOverlay className='bg-/60' />
          <DialogContent>
            <Form {...formStation}>
              <form
                onSubmit={formStation.handleSubmit(confirmEditName)}
                className='w-full flex  gap-5 flex-col h-full text-center mr-20'
              >
                <h3 className='text-lg font-medium leading-6 text-gray-900'>Cập nhật tên trạm dừng</h3>
                <FormField
                  control={formStation.control}
                  name='StationName'
                  render={({ field }) => (
                    <FormItem className='w-full flex flex-col justify-center items-start'>
                      <FormLabel>Tên trạm dừng</FormLabel>
                      <FormControl>
                        <Input placeholder='Nhập tên trạm dừng' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex gap-2 justify-end'>
                  <Button variant='outline' className='w-fit' onClick={() => setIsEditing(null)}>
                    Hủy
                  </Button>
                  <Button type='submit' disabled={isLoadingUpdate} className='w-fit'>
                    {isLoadingUpdate && <Loader className='animate-spin' />} Cập nhật
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
      {isAdding && (
        <Dialog open={isAdding} onOpenChange={handleModalAddClose}>
          <DialogOverlay className='bg-/60' />
          <DialogContent>
            <Form {...formAddStation}>
              <form
                onSubmit={formAddStation.handleSubmit(confirmAddStation)}
                className='w-full flex gap-5 flex-col h-full text-center mr-20'
              >
                <h3 className='text-lg font-medium leading-6 text-gray-900'>Thêm trạm dừng mới</h3>
                <FormField
                  control={formAddStation.control}
                  name='CityID'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chọn thành phố</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Chọn thành phố có trạm dừng chân' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city.CityID} value={city.CityID}>
                              {city.Name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formAddStation.control}
                  name='StationName'
                  render={({ field }) => (
                    <FormItem className='w-full flex flex-col justify-center items-start'>
                      <FormLabel>Tên trạm dừng</FormLabel>
                      <FormControl>
                        <Input placeholder='Nhập tên trạm dừng' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex gap-2 justify-end'>
                  <Button variant='outline' className='w-fit' onClick={handleModalAddClose}>
                    Hủy
                  </Button>
                  <Button type='submit' disabled={isLoadingUpdate} className='w-fit'>
                    {isLoadingUpdate && <Loader className='animate-spin' />} Thêm
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
      <ServiceModal
        visible={isServiceModalVisible}
        onOk={handleServiceModalOk}
        station={selectedStation}
        onAddService={handleShowAddServiceModal}
        onUpdateService={handleUpdateService} // Pass the update handler
      />
      <AddServiceModal visible={isAddServiceModalVisible} onOk={handleAddServiceModalOk} />
    </div>
  )
}

export default ListStation
