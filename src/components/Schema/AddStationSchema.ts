import { z } from 'zod';

export const AddStationSchema = z.object({
  StationName: z
    .string()
    .min(2, 'Tên trạm phải nhiều hơn 2 kí tự')
    .max(40, 'Tên trạm ít hơn 40 kí tự'),
  CityID: z.string().uuid('CityID must be a valid UUID'),
  CompanyID: z.string().uuid('CompanyID must be a valid UUID')
});