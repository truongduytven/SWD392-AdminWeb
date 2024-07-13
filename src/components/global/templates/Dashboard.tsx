/** @format */

import PageTitle from '@/components/global/organisms/PageTitle'
// import Image from "next/image";
import BarChart from '@/components/global/organisms/BarChart'
import Card, { CardContent, CardProps } from '@/components/global/organisms/Card'
import SalesCard, { SalesProps } from '@/components/global/organisms/SalesCard'
import { Activity, DollarSign, Users, Bus, HandCoins, Ticket, Building2, UserRound } from 'lucide-react'
import { fetchDashboardAdmin } from '@/apis/dashboardAPI'
import Loading from '../molecules/Loading'
import { formatPrice } from '@/lib/utils'

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

export default function Home() {
  const { data, isLoading } = fetchDashboardAdmin();

  if (isLoading) return <Loading />;
  return (
    <div className='flex flex-col gap-5  w-full'>
      <PageTitle title='Dashboard' />
      <section className='grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4'>
        {/* {cardData.map((d, i) => (
          <Card key={i} amount={d.amount} discription={d.discription} icon={d.icon} label={d.label} />
          ))} */}
        <Card key={1} amount={formatPrice(data?.TotalRevenueInMonth || 0)} discription="" icon={HandCoins} label="Doanh thu trong tháng" />
        <Card key={2} amount={data ? data.TotalTicketBookedInMonth.toString() : '0'} discription="" icon={Ticket} label="Vé bán trong tháng" />
        <Card key={2} amount={data ? data.TotalCompanies.toString() : '0'} discription="" icon={Building2} label="Tổng số công ty" />
        <Card key={2} amount={data ? data.ToTalUsers.toString() : '0'} discription="" icon={UserRound} label="Tổng số khách hàng" />
      </section>
      <section className='grid grid-cols-1  gap-4 transition-all lg:grid-cols-2'>
        <CardContent>
          <p className='mb-4 font-semibold text-xl text-primary'>Tổng doanh thu trong năm</p>

          <BarChart data={data?.RevenueAllMonthInYears || undefined}/>
        </CardContent>
        <CardContent className='flex justify-between gap-4'>
          <section>
            <p className='text-lg font-semibold text-primary'>Công ty có doanh thu cao nhất</p>
            {/* <p className='text-sm text-gray-400'>You made 265 sales this month.</p> */}
          </section>
          {data?.RevenueOfCompanyInMonths.sort((a,b) => b.TotalRevenueOfCompanyInMonth - a.TotalRevenueOfCompanyInMonth).map((d, i) => (
            <SalesCard key={i} data={d} index={i}/>
          ))}
        </CardContent>

        {/*  */}
      </section>
    </div>
  )
}
