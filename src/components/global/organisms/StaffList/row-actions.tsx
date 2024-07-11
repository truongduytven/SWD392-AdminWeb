import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'

import { Button } from '@/components/global/atoms/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/global/atoms/ui/dropdown-menu'
import { CircleUserRound, Eye, EyeOff } from 'lucide-react'
// import { useDispatch } from 'react-redux'

// import { RoleGate } from '@/auth/role-gate'
// import { UpdateUser } from '@/components/common/modal/update-user'
import { roles } from './data/data'

interface DataTableRowActionsProps<TData> {
	row: Row<TData>
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
	// const role = taskSchema.parse(row.original);
	// const [popUpChangeStatus, setPopUpChangeStatus] = useState<boolean>(false)
	// const dispatch = useDispatch()
	// const handleChangeRole = (id: string, role: string) => {
	// 	const changeRoleUser = {
	// 		email: row.getValue('email'),
	// 		birthday: row.getValue('birthday'),
	// 		gender: row.getValue('gender'),
	// 		phone: row.getValue('phone'),
	// 		name: row.getValue('name'),
	// 		role,
	// 		id,
	// 		status: row.getValue('status'),
	// 		avatar: row.getValue('avatar'),
	// 	}
	// 	dispatch({
	// 		type: 'users/changeRoleUser',
	// 		payload: {
	// 			userId: id,
	// 			userData: changeRoleUser,
	// 		},
	// 	})
	// }
	// const handleChangeStatus = (id: string, status: boolean) => {
	// 	const changeStatusUser = {
	// 		email: row.getValue('email'),
	// 		birthday: row.getValue('birthday'),
	// 		gender: row.getValue('gender'),
	// 		phone: row.getValue('phone'),
	// 		name: row.getValue('name'),
	// 		role: row.getValue('role'),
	// 		id,
	// 		status,
	// 		avatar: row.getValue('avatar'),
	// 	}
	// 	dispatch({
	// 		type: 'users/changeStatusUser',
	// 		payload: {
	// 			userId: id,
	// 			userData: changeStatusUser,
	// 		},
	// 	})
	// }
	return (
		// <RoleGate feature="userPerm" requiredPermissions={['Modify', 'Create', 'FullAccess']}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
						<DotsHorizontalIcon className="size-4" />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-[160px]">
					<DropdownMenuLabel>Manage</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{/* <UpdateUser
						user={{
							email: row.getValue('email'),
							birthday: row.getValue('birthday'),
							gender: row.getValue('gender'),
							phone: row.getValue('phone'),
							name: row.getValue('name'),
							role: row.getValue('role'),
							id: row.getValue('id'),
							status: row.getValue('status'),
							avatar: row.getValue('avatar'),
						}}
						// updateUser={setUsers}
					/> */}

					{/* <DropdownMenuItem>Edit</DropdownMenuItem> */}
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className="cursor-pointer">
							<CircleUserRound size={20} className="mr-2" />
							Roles
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuRadioGroup>
								{roles.map((role) => (
									<DropdownMenuRadioItem
										key={role.value}
										value={role.value}
										className="cursor-pointer"
										// onClick={() => handleChangeRole(row.getValue('id'), role.value)}
									>
										{role.label}
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
					{row.getValue('status') === true ? (
						<DropdownMenuItem
							className="cursor-pointer"
							// onClick={() => handleChangeStatus(row.getValue('id'), false)}
						>
							<EyeOff size={20} className="mr-2" />
							Deactivate user
						</DropdownMenuItem>
					) : (
						<DropdownMenuItem
							className="cursor-pointer"
							// onClick={() => handleChangeStatus(row.getValue('id'), true)}
						>
							<Eye size={20} className="mr-2" />
							Activate user
						</DropdownMenuItem>
					)}

					{/* <DropdownMenuItem>De-active</DropdownMenuItem> */}
				</DropdownMenuContent>
			</DropdownMenu>
		// </RoleGate>
	)
}
