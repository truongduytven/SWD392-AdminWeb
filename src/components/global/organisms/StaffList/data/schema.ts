import { z } from 'zod'

export const taskSchema = z.object({
    Route_CompanyID: z.string(),
    FromCity: z.string(),
    ToCity: z.string(),
    StartLocation: z.string(),
    EndLocation: z.string(),
    Status: z.string(),
})

export type Task = z.infer<typeof taskSchema>
