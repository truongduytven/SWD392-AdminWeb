import { Table } from "@tanstack/react-table"
import { Search } from "lucide-react"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { Button } from "@/components/global/atoms/ui/button"

// import { IUserGender, IUserRole } from "@/types/user.interface"
// import { DataTableFacetedFilter } from "@/components/local/data-table/data-table-faceted-filter"

// import { AddUser } from "../add-user-form"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}
const roles = [
  {
    label: "Super Admin",
    value: "SUPPER ADMIN"
  },
  {
    label: "Admin",
    value: "ADMIN"
  },
  { label: "Trainer", value: "TRAINER" }
]

const genders = [
  {
    label: "Male",
    value: "MALE"
  },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" }
]

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="flex items-center space-x-2">
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              id="simple-search"
              className="block w-[300px] rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 "
              placeholder="Tìm kiếm bằng tên đầy đủ"
              value={
                (table.getColumn("FullName")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("FullName")?.setFilterValue(event.target.value)
              }
            />
          </div>
              
          {table.getColumn("permissionId") && (
            <DataTableFacetedFilter
              column={table.getColumn("permissionId")}
              title="Role"
              options={roles}
            />
          )}
          {table.getColumn("gender") && (
            <DataTableFacetedFilter
              column={table.getColumn("gender")}
              title="Gender"
              options={genders}
            />
          )}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
