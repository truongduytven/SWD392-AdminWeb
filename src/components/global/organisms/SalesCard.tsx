/* eslint-disable @next/next/no-img-element */
/**
 * eslint-disable @next/next/no-img-element
 *
 * @format
 */

import { formatPrice } from "@/lib/utils"
import { RevenueOfCompanyInMonths } from "@/types"

/** @format */


export type SalesProps = {
  data: RevenueOfCompanyInMonths
  index: number
}

export default function SalesCard({ data, index }: SalesProps) {
  var color = ''
  var text = ''
  switch(index) {
    case 0:  color = '#FFD700'
            text = '#FFFFFF'
            break;
    case 1:  color = '#C0C0C0'
            text = '#FFFFFF'
            break;  
    case 2: color = '#cd7f32'
            text = '#FFFFFF'
            break;
    default: color = '#FFFFFF'
            text = '#000000'
  }

  return (
    <div className='  flex flex-wrap justify-between gap-3 '>
      <section className='flex justify-between gap-3 '>
        <div className='flex justify-center items-center h-12 w-12 rounded-full p-1' style={{backgroundColor: color}}>
          <div className="font-bold text-xl" style={{ color: text }}>{index + 1}</div>
        </div>
        <div className='text-sm'>
          <p>{data.CompanyName}</p>
          <div className='text-ellipsis overflow-hidden whitespace-nowrap w-[120px]  sm:w-auto  text-gray-400'>
            Tháng {data.Month} năm {data.Year}
          </div>
        </div>
      </section>
      <p>{formatPrice(data.TotalRevenueOfCompanyInMonth)}</p>
    </div>
  )
}
