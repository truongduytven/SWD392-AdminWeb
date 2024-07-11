import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from '@radix-ui/react-icons'
import { ShieldCheck, ShieldOff, BookDashed } from 'lucide-react'

export const labels = [
	{
		value: 'ADMIN',
		label: 'ADMIN',
	},
	{
		value: 'SUPERADMIN',
		label: 'SUPERADMIN',
	},
	{
		value: 'TRAINER',
		label: 'TRAINER',
	},
]

export const statuses = [
	{
		value: true,
		label: 'Active',
		icon: ShieldCheck,
	},
	{
		value: false,
		label: 'Inactive',
		icon: ShieldOff,
	},
	{
		value: 'Drafting',
		label: 'Drafting',
		icon: BookDashed,
	},
]

export const roles = [
	{
		label: 'Super Admin',
		value: 'SUPERADMIN',
		icon: ArrowDownIcon,
	},
	{
		label: 'Admin',
		value: 'ADMIN',
		icon: ArrowRightIcon,
	},
	{
		label: 'Trainer',
		value: 'TRAINER',
		icon: ArrowUpIcon,
	},
]
