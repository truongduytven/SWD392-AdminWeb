/** @format */

import PageTitle from '@/components/global/organisms/PageTitle'
// import Image from "next/image";
import Card, { CardContent } from '@/components/global/organisms/Card'
import { Bus, Ticket, Route, HandCoins } from 'lucide-react'
import { fetchDashboardManager } from '@/apis/dashboardAPI'
import { useAuth } from '@/auth/AuthProvider'
import Loading from '../molecules/Loading'
import { formatPrice } from '@/lib/utils'
import BarChartManager from '../organisms/BarChartManager'
import PopularTripCard from '../organisms/PopularTripCard'

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
        <CardContent className='flex justify-start gap-4'>
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
