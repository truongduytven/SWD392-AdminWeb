/* eslint-disable @next/next/no-img-element */
/**
 * eslint-disable @next/next/no-img-element
 *
 * @format
 */

import { PopularRoutes } from "@/types"
import { MapPinned } from "lucide-react"

/** @format */


export type PopularTripProps = {
    data: PopularRoutes | undefined
  }
  
  export default function PopularTripCard(props: PopularTripProps) {
    return (
      <div className='  flex flex-wrap justify-between gap-3 '>
        <section className='flex justify-between gap-3 '>
          <div className=' h-12 w-12 flex justify-center items-center rounded-full bg-gray-100 p-1'>
            <MapPinned />
          </div>
          <div className='text-sm'>
            <p>{props.data?.fromCity} đến {props.data?.toCity}</p>
            <div className='text-ellipsis overflow-hidden whitespace-nowrap w-[120px]  sm:w-auto  text-gray-400'>
              {props.data?.startLocation} đến {props.data?.endLocation}
            </div>
          </div>
        </section>
        <p>{props.data?.totalBooking} vé</p>
      </div>
    )
  }
  