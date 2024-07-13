/** @format */

import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import React from 'react'

export type CardProps = {
  label: string
  icon: LucideIcon
  amount: string
  discription: string
}

export default function   Card(props: CardProps) {
  return (
    <CardContent>
      <section className='flex justify-between gap-2'>
        {/* label */}
        <p className='text-sm font-bold text-primary'>{props.label}</p>
        {/* icon */}
        <props.icon className='h-6 w-6 text-gray-400' />
      </section>
      <section className='flex items-center gap-5'>
        <h2 className='text-2xl font-semibold'>{props.amount}</h2>
        <p className='text-xs text-gray-500'>{props.discription}</p>
      </section>
    </CardContent>
  )
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('flex w-full flex-col gap-3 rounded-xl border p-5 shadow', props.className)} />
}
