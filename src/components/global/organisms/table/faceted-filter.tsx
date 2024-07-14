import * as React from 'react'
import { CheckIcon } from '@radix-ui/react-icons'
import { Column } from '@tanstack/react-table'
import { Command as CommandPrimitive } from 'cmdk'

import { Badge } from '@/components/global/atoms/ui/badge'
import { Button } from '@/components/global/atoms/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandList,
	CommandSeparator,
} from '@/components/global/atoms/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/global/atoms/ui/popover'
import { Separator } from '@/components/global/atoms/ui/separator'
import { cn } from '@/lib/utils'

const CommandItem = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Item
		ref={ref}
		className={cn(
			'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground',
			className,
		)}
		{...props}
	/>
))
CommandItem.displayName = CommandPrimitive.Item.displayName

interface DataTableFacetedFilterProps<TData, TValue> {
	column?: Column<TData, TValue>
	title?: string
	options: (string | { value: TValue; label: string })[]
}

export function DataTableFacetedFilter<TData, TValue>({
	column,
	title,
	options,
}: DataTableFacetedFilterProps<TData, TValue>) {
	const facets = column?.getFacetedUniqueValues()
	const selectedValues = new Set(column?.getFilterValue() as any[])
	// console.log('Facets:', facets)
	// console.log('Selected Values:', selectedValues)
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="h-8 border-dashed">
					{title}
					{selectedValues?.size > 0 && (
						<>
							<Separator orientation="vertical" className="mx-2 h-4" />
							<Badge variant="primary" className="rounded-sm px-1 font-normal lg:hidden">
								{selectedValues.size}
							</Badge>
							<div className="hidden space-x-1 lg:flex">
								{selectedValues.size > 3 ? (
									<Badge variant="primary" className="rounded-sm px-1 font-normal">
										{selectedValues.size} đã chọn
									</Badge>
								) : (
									options
										.filter((option) =>
											typeof option === 'string'
												? selectedValues.has(option)
												: selectedValues.has(String(option.value)),
										)
										.map((option) => (
											<Badge
												variant="primary"
												key={typeof option === 'string' ? option : String(option.value)}
												className="rounded-sm  text-primary font-medium px-1 "
											>
												{typeof option === 'string' ? option : option.label}
											</Badge>
										))
								)}
							</div>
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0" align="start" >
				<Command>
					<CommandInput placeholder={title} />
					<CommandList>
						<CommandEmpty>Không tìm thấy kết quả</CommandEmpty>
						<CommandGroup>
							{(options as (string | { value: TValue; label: string })[]).map((option) => {
								const isSelected =
									typeof option === 'string'
										? selectedValues.has(option)
										: selectedValues.has(option.value)
								return (
									<CommandItem
										key={typeof option === 'string' ? option : (option.value as React.Key)}
										onSelect={() => {
											if (isSelected) {
												selectedValues.delete(typeof option === 'string' ? option : option.value)
											} else {
												selectedValues.add(typeof option === 'string' ? option : option.value)
											}
											const filterValues = Array.from(selectedValues)
											column?.setFilterValue(filterValues.length ? filterValues : undefined)
										}}
									>
										<div
											className={cn(
												'mr-2 flex size-4 items-center justify-center rounded-sm border border-primary',
												isSelected
													? 'bg-primary text-primary-foreground'
													: 'opacity-50 [&_svg]:invisible',
											)}
										>
											<CheckIcon className={cn('size-4')} />
										</div>
										<span>{typeof option === 'string' ? option : option.label}</span>
										{facets?.get(typeof option === 'string' ? option : option.value) && (
											<span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
												{facets.get(typeof option === 'string' ? option : option.value)}
											</span>
										)}
									</CommandItem>
								)
							})}
						</CommandGroup>
						{selectedValues.size > 0 && (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem
										onSelect={() => column?.setFilterValue(undefined)}
										className="justify-center text-center"
									>
										Xóa lọc
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
