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

interface DataTableRowActionsProps<TData extends Station> {
  // Add extends Route
  row: Row<TData>
  handleStatusChange: (station: Station, status: string) => void;

}

// Define the interface for the Service
interface Service {
  Service_StationID:string
	ServiceID: string;
	Price: number;
	Name: string;
	ImageUrl: string;
  }
  
  // Define the interface for the ServiceType
  interface ServiceType {
	ServiceTypeID: string;
	ServiceTypeName: string;
	ServiceInStation: Service[];
  }
  
  // Define the interface for the Station
  interface Station {
	StationID: string;
	CityID: string;
	CityName: string;
	StationName: string;
	Status: string;
	ServiceTypeInStation: ServiceType[];
  }
export function DataTableRowActions<TData extends Station>({ row,handleStatusChange }: DataTableRowActionsProps<TData>) {
  const { user } = useAuth()
  // console.log('user o route', user)
  // const [routes, setRoutes] = useState<Station[]>([])
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [tempStatus, setTempStatus] = useState<{ [key: string]: string }>({
    [row.original.StationID]: row.original.Status
  })

  // const handleStatusChange = (station: Station, status: string) => {
  //   setSelectedStation(station)
  //   setNewStatus(status)
  //   setIsModalOpen(true)
  // }

  // const confirmStatusChange = async () => {
  //   setIsLoadingUpdate(true)
  //   if (selectedStation) {
  //     try {
  //       const response = await busAPI.put(
  //         `status-management?entity=STATION&id=${selectedStation.StationID}`,
  //         { status: newStatus }
  //       )
  //       // setRoutes(
  //       //   routes.map((route) =>
  //       //     route.Route_CompanyID === selectedRoute.Route_CompanyID
  //       //       ? { ...route, Status: newStatus }
  //       //       : route
  //       //   )
  //       // )
  //       setTempStatus((prevState) => ({
  //         ...prevState,
  //         [selectedStation.StationID]: newStatus
  //       }))
  //       toast({
  //         variant: 'success',
  //         title: 'Cập nhật thành công',
  //         description: 'Đã đổi trạng thái trạm này thành ' + newStatus
  //       })
  //       setIsLoadingUpdate(false)
  //     } catch (error) {
  //       if (axios.isAxiosError(error) && error.response) {
	// 		toast({
	// 		  variant: 'destructive',
	// 		  title: 'Không thể cập nhật trạng thái trạm',
	// 		  description: 'Vui lòng thử lại sau'
	// 		})
  //         const message = error.response.data.Result.message || null
  //         setTempStatus((prevState) => ({
  //           ...prevState,
  //           [selectedStation.StationID]: selectedStation.Status
  //         }))
  //       }
  //     } finally {
  //       setIsLoadingUpdate(false)
  //       setIsModalOpen(false)
  //     }
  //   }
  // }

  return (
    <div>
      <Select
        value={row.original.Status}
        onValueChange={(value) => handleStatusChange(row.original, value)}
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

     
    </div>
  )
}
