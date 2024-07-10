import { z } from 'zod'

export const addManagerSchema = z.object({
  email: z.string().trim().min(1, 'email là bắt buộc').email('Email không hợp lệ'),
  companyName: z.string().trim().min(1, 'Tên công ty là bắt buộc')
})
