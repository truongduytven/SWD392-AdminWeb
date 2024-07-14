import { z } from 'zod'
export const StationNameSchema = z.object({
	StationName: z
		.string()
		.min(2, 'Tên trạm phải nhiều hơn 2 kí tự')
		.max(40, 'Tên trạm ít hơn 40 kí tự')
})