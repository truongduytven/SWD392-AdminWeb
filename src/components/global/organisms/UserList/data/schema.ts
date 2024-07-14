import { z } from 'zod'

export const taskSchema = z.object({})

export type Task = z.infer<typeof taskSchema>
