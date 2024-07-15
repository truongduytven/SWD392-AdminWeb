import { Button } from '@/components/global/atoms/ui/button'
import { Calendar } from '@/components/global/atoms/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/global/atoms/ui/popover'
import { Column } from '@tanstack/react-table'
import { addDays, format, isAfter, isBefore, parseISO, subDays } from 'date-fns'
import * as React from 'react'
import { DateRange } from 'react-day-picker'

interface DateRangeFilterProps<TData, TValue> {
	column?: Column<TData, TValue>
	options: string[]
	title?: string
	resetTrigger: number
}

export function DateRangeFilter<TData, TValue>({
	column,
	title,
	options,
	resetTrigger,
}: DateRangeFilterProps<TData, TValue>) {
	const [date, setDate] = React.useState<DateRange | undefined>({
		from: undefined,
		to: undefined,
	})
	React.useEffect(() => {
		setDate({ from: undefined, to: undefined })
	}, [resetTrigger])

	React.useEffect(() => {
		if (column && date?.from && date?.to) {
			const filteredOptions = options.filter((option: string) => {
				if (!option) return false; // Skip null or undefined options
				const itemDate = parseISO(option)
				const startDate = subDays(date?.from ?? new Date(), 1)
				const endDate = addDays(date?.to ?? new Date(), 1)
				return (
					(!date?.from || isAfter(itemDate, startDate)) &&
					(!date?.to || isBefore(itemDate, endDate))
				)
			})

			if (filteredOptions.length === 0) {
				column.setFilterValue('no-matching-dates')
			} else {
				const filterString = filteredOptions.join(',')
				column.setFilterValue(filterString)
			}
		}
	}, [date, column])

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="h-8 border-dashed " >
					{date?.from ? (
						date.to ? (
							<>
								{format(date.from, 'yyyy/MM/dd')} - {format(date.to, 'yyyy/MM/dd')}
							</>
						) : (
							format(date.from, 'yyyy/MM/dd')
						)
					) : (
						title
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0 " align="start">
				<Calendar initialFocus mode="range" selected={date} onSelect={setDate} numberOfMonths={1} />
			</PopoverContent>
		</Popover>
	)
}
