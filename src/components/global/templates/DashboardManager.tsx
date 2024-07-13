/** @format */

import PageTitle from '@/components/global/organisms/PageTitle'
// import Image from "next/image";
import Card, { CardContent, CardProps } from '@/components/global/organisms/Card'
import SalesCard, { SalesProps } from '@/components/global/organisms/SalesCard'
import { Activity, DollarSign, Users, Bus, Ticket, Route, HandCoins } from 'lucide-react'
import { fetchDashboardManager } from '@/apis/dashboardAPI'
import { useAuth } from '@/auth/AuthProvider'
import Loading from '../molecules/Loading'
import { formatPrice } from '@/lib/utils'
import BarChartManager from '../organisms/BarChartManager'
import PopularTripCard from '../organisms/PopularTripCard'

const cardData: CardProps[] = [
  {
    label: 'Tổng doanh thu trong tháng',
    amount: '45,231,000 vnđ',
    discription: '+20.1% from last month',
    icon: DollarSign
  },
  {
    label: 'Tổng số vé được đặt trong tháng',
    amount: '53',
    discription: '+201 since last hour',
    icon: Activity
  },
  {
    label: 'Tổng số người dùng',
    amount: '235',
    discription: '+180.1% from last month',
    icon: Users
  },
  {
    label: 'Tổng số nhà xe',
    amount: '12',
    discription: '+19% from last month',
    icon: Bus
  },
]

const uesrSalesData: SalesProps[] = [
  {
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    saleAmount: '+$1,999.00'
  },
  {
    name: 'Jackson Lee',
    email: 'isabella.nguyen@email.com',
    saleAmount: '+$1,999.00'
  },
  {
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    saleAmount: '+$39.00'
  },
  {
    name: 'William Kim',
    email: 'will@email.com',
    saleAmount: '+$299.00'
  },
  {
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    saleAmount: '+$39.00'
  }
]

export default function DashboardManager() {
  const { user } = useAuth()
  const { data, isLoading } = fetchDashboardManager(user?.CompanyID || '')



  if (isLoading) return <Loading />
  return (
    <div className='flex flex-col gap-5  w-full'>
      <PageTitle title='Dashboard' />
      <section className='grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4'>
        <Card key={1} amount={data ? data.TotalBookingsInMonth.toString() : '0'} discription='' icon={Ticket} label='Số vé đặt trong tháng'/>
        <Card key={2} amount={data ? data.TotalRoutes.toString() : '0'} discription='' icon={Route} label='Tổng số tuyến đường'/>
        <Card key={3} amount={data ? data.TotalTrips.toString() : '0'} discription='' icon={Bus} label='Tổng số chuyến đi'/>
        <Card key={4} amount={data ? formatPrice(data.YearlyRevenue) : '0'} discription='' icon={HandCoins} label='Doanh thu cả năm'/>
      </section>
      <section className='grid grid-cols-1  gap-4 transition-all lg:grid-cols-2'>
        <CardContent>
          <p className='mb-4 font-semibold text-xl text-primary'>Tổng doanh thu trong năm</p>

          <BarChartManager data={data?.MonthlyRevenue}/>
        </CardContent>
        <CardContent className='flex justify-between gap-4'>
          <section>
            <p className='text-lg font-semibold text-primary'>Những tuyến đường phổ biến</p>
            {/* <p className='text-sm text-gray-400'>Những tuyến đường được sử dụng nhiều nhất trong tháng.</p> */}
          </section>
          {data?.PopularRoutes.map((d, i) => (
            <PopularTripCard data={d} key={i}/>
          ))}
        </CardContent>

        {/*  */}
      </section>
    </div>
  )
}
