import { z } from 'zod'
// Define the interface for Service
interface Service {
    ServiceID: string;
    Price: number;
    Name: string;
    ImageUrl: string;
  }
  
  // Define the Zod schema for Service
  const serviceSchema = z.object({
    ServiceID: z.string(),
    Price: z.number(),
    Name: z.string(),
    ImageUrl: z.string(),
  });
  
  // Define the interface for ServiceType
  interface ServiceType {
    ServiceTypeID: string;
    ServiceTypeName: string;
    ServiceInStation: Service[];
  }
  
  // Define the Zod schema for ServiceType
  const serviceTypeSchema = z.object({
    ServiceTypeID: z.string(),
    ServiceTypeName: z.string(),
    ServiceInStation: z.array(serviceSchema),
  });
  
  // Define the interface for Station
  interface Station {
    StationID: string;
    CityID: string;
    CityName: string;
    StationName: string;
    Status: string;
    ServiceTypeInStation: ServiceType[];
  }
export const taskSchema = z.object({
    StationID: z.string(),
  CityID: z.string(),
  CityName: z.string(),
  StationName: z.string(),
  Status: z.string(),
  ServiceTypeInStation: z.array(serviceTypeSchema),
})

export type Task = z.infer<typeof taskSchema>
