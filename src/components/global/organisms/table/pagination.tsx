import {
	ChevronLeftIcon,
	ChevronRightIcon,
	DoubleArrowLeftIcon,
	DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import pluralize from 'pluralize'

import { Button } from '@/components/global/atoms/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/global/atoms/ui/select'

interface DataTablePaginationProps<TData> {
	table: Table<TData>
	rowString: string
}

export function DataTablePagination<TData>({ table, rowString }: DataTablePaginationProps<TData>) {
	return (
		<div className="mx-1 flex justify-between space-x-6 px-1 py-2 lg:space-x-8">
			<div className="flex items-center space-x-2">
				<p className="text-sm font-medium opacity-60">
					{rowString } / trang
				</p>
				<Select
					value={`${table.getState().pagination.pageSize}`}
					onValueChange={(value) => {
						table.setPageSize(Number(value))
					}}
				>
					<SelectTrigger className="h-8 w-[70px]">
						<SelectValue placeholder={table.getState().pagination.pageSize} />
					</SelectTrigger>
					<SelectContent side="top">
						{[10, 20, 30, 40, 50].map((pageSize) => (
							<SelectItem key={pageSize} value={`${pageSize}`}>
								{pageSize}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && (
					<div className="flex-1 text-sm text-muted-foreground">
						{table.getFilteredSelectedRowModel().rows.length} of{' '}
						{table.getFilteredRowModel().rows.length} {rowString}(s) selected.
					</div>
				)}
			</div>
			<div className="flex items-center space-x-2">
				<div className="flex w-[100px] items-center justify-center text-sm font-medium opacity-60">
					Trang {table.getState().pagination.pageIndex + 1} của {table.getPageCount()}
				</div>
				<Button
					variant="outline"
					className="group hidden size-8 p-0 transition-all duration-200 hover:scale-110 hover:drop-shadow-lg lg:flex"
					onClick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
				>
					<span className="sr-only">Đi đến trang đầu tiên</span>
					<DoubleArrowLeftIcon className="size-4 transition-all duration-200 group-hover:scale-125" />
				</Button>
				<Button
					variant="outline"
					className="group size-8 p-0 transition-all duration-200 hover:scale-110 hover:drop-shadow-lg"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<span className="sr-only">Đi đến trang trước</span>
					<ChevronLeftIcon className="size-4 transition-all duration-200 group-hover:scale-125" />
				</Button>
				<Button
					variant="outline"
					className="group size-8 p-0 transition-all duration-200 hover:scale-110 hover:drop-shadow-lg"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					<span className="sr-only">Đi đến trang tiếp</span>
					<ChevronRightIcon className="size-4 transition-all duration-200 group-hover:scale-125" />
				</Button>
				<Button
					variant="outline"
					className="group hidden size-8 p-0 transition-all duration-200 hover:scale-110 hover:drop-shadow-lg lg:flex"
					onClick={() => table.setPageIndex(table.getPageCount() - 1)}
					disabled={!table.getCanNextPage()}
				>
					<span className="sr-only">Đi đến trang cuối</span>
					<DoubleArrowRightIcon className="size-4 transition-all duration-200 group-hover:scale-125" />
				</Button>
			</div>
		</div>
	)
}
