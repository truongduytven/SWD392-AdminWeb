import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, 'Bắt buộc').email('Email không hợp lệ'),
  password: z.string().trim().min(1, 'Bắt buộc')
})



export type TSignInSchema = z.infer<typeof signInSchema>
