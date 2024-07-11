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


// Define the interface for the Service
interface Service {
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
function ListStation() {
	const { user } = useAuth()
  console.log('user o station', user)
  const [stations, setStations] = useState<Station[]>([])
  const [isLoadingStations, setIsLoadingStations] = useState(true)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [tempStatus, setTempStatus] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const fetchStations = async () => {
      setIsLoadingStations(true)
      try {
        const { data } = await busAPI.get<Station[]>(`station-management/managed-stations/company/${user?.CompanyID}`)
        console.log('data', data)
        setStations(data || [])
        // Initialize tempStatus with current statuses
        const initialStatuses: { [key: string]: string } = {}
        data.forEach((station) => {
          initialStatuses[station.StationID] = station.Status
        })
        setTempStatus(initialStatuses)
      } catch (error) {
        // toast({
        //   variant: 'destructive',
        //   title: 'Không thể tải dữ liệu trạm dừng',
        //   description: 'Vui lòng thử lại sau'
        // })
        console.log(error)
      } finally {
        setIsLoadingStations(false)
      }
    }

    fetchStations()
  }, [])

//   const handleStatusChange = (route: Route, status: string) => {
//     setSelectedStation(route)
//     setNewStatus(status)
//     setIsModalOpen(true)
//   }

//   const confirmStatusChange = async () => {
//     setIsLoadingUpdate(true)
//     if (selectedStation) {
//       try {
//         const response = await busAPI.put(
//           `status-management?entity=ROUTE_COMPANY&id=${selectedStation.Route_CompanyID}`
//         )
//         setStations(
//           stations.map((station) =>
//             station.Route_CompanyID === se.Route_CompanyID ? { ...route, Status: newStatus } : route
//           )
//         )
//         setTempStatus({ ...tempStatus, [selectedRoute.Route_CompanyID]: newStatus })
//         setIsModalOpen(false)
//         toast({
//           variant: 'success',
//           title: 'Cập nhật thành công',
//           description: 'Đã đổi trạng thái tuyến đường này thành ' + newStatus
//         })
//         setIsLoadingUpdate(false)
//       } catch (error) {
//         if (axios.isAxiosError(error) && error.response) {
//           const message = error.response.data.Result.message
//           setIsModalOpen(false)
//           setIsLoadingUpdate(false)
//           // Revert status change on error
//           setTempStatus({ ...tempStatus, [selectedRoute.Route_CompanyID]: selectedRoute.Status })
//           toast({
//             variant: 'destructive',
//             title: 'Không thể cập nhật trạng thái tuyến đường',
//             description: message || 'Vui lòng thử lại sau'
//           })
//         }
//       } finally {
//         setIsLoadingUpdate(false)
//         setIsModalOpen(false)
//       }
//     }
//   }
  if (isLoadingStations) {
    return (
		<TableSkeleton/>
    //   <div className='flex justify-center items-center '>
    //     <div className='animate-pulse mx-auto'>Đang tải dữ liệu...</div>
    //   </div>
    )
  }
	// const dispatch = useDispatch()
	// useEffect(() => {
	// 	dispatch({
	// 		type: 'users/fetchUsers',
	// 	})
	// }, [dispatch])
	// const users = useSelector((state: RootState) => state.allUser.users)
	return (
		<div className="flex h-full flex-1 flex-col ">
			<h1 className="my-4 border-b pb-2  text-3xl font-semibold tracking-wider first:mt-0 ">
				Danh sách tuyến đường
			</h1>
			<DataTable data={stations} columns={columns} Toolbar={DataTableToolbar} rowString="Trạm" />
		</div>
	)
}
export default ListStation
