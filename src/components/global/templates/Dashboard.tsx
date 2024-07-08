/** @format */

import PageTitle from '@/components/global/organisms/PageTitle'
// import Image from "next/image";
import BarChart from '@/components/global/organisms/BarChart'
import Card, { CardContent, CardProps } from '@/components/global/organisms/Card'
import SalesCard, { SalesProps } from '@/components/global/organisms/SalesCard'
import { Activity, DollarSign, Users, Bus } from 'lucide-react'

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

export default function Home() {
  return (
    <div className='flex flex-col gap-5  w-full'>
      <PageTitle title='Dashboard' />
      <section className='grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4'>
        {cardData.map((d, i) => (
          <Card key={i} amount={d.amount} discription={d.discription} icon={d.icon} label={d.label} />
        ))}
      </section>
      <section className='grid grid-cols-1  gap-4 transition-all lg:grid-cols-2'>
        <CardContent>
          <p className='p-4 font-semibold'>Tổng doanh thu trong năm</p>

          <BarChart />
        </CardContent>
        <CardContent className='flex justify-between gap-4'>
          <section>
            <p className='text-lg font-semibold'>Những nhà xe hàng đầu</p>
            <p className='text-sm text-gray-400'>You made 265 sales this month.</p>
          </section>
          {uesrSalesData.map((d, i) => (
            <SalesCard key={i} email={d.email} name={d.name} saleAmount={d.saleAmount} />
          ))}
        </CardContent>

        {/*  */}
      </section>
    </div>
  )
}
