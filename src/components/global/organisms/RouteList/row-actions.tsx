import { Row } from '@tanstack/react-table';
import { Badge } from '../../atoms/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../atoms/ui/select';
type Route = {
  Route_CompanyID: string
  RouteID:string
  FromCity: string
  ToCity: string
  StartLocation: string
  EndLocation: string
  Status: string
}

interface DataTableRowActionsProps<TData extends Route> {
  row: Row<TData>;
  handleStatusChange: (route: Route, status: string) => void;
}

export function DataTableRowActions<TData extends Route>({ row, handleStatusChange }: DataTableRowActionsProps<TData>) {
  return (
    <div>
      <Select
        value={row.original.Status}
        onValueChange={(value) => handleStatusChange(row.original, value)}
      >
        <SelectTrigger className='w-fit'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className='w-fit'>
          <SelectItem value='HOẠT ĐỘNG'>
            <Badge variant='success'>Hoạt động</Badge>
          </SelectItem>
          <SelectItem value='KHÔNG HOẠT ĐỘNG'>
            <Badge variant='destructive'>Không hoạt động</Badge>
          </SelectItem>
        </SelectContent>
      </Select>
      {/* <Badge variant="primary">{row.original.Status}</Badge> */}
    </div>
  );
}
