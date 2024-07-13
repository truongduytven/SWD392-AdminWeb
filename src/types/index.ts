export type DashboardManagerProps = {
  PopularRoutes: PopularRoutes[]
  TotalRoutes: number
  TotalTrips: number
  TotalBookingsInMonth: number
  MonthlyRevenue: MothRevenue[]
  YearlyRevenue: number
}

export type MothRevenue = {
  Month: number
  RevenueInMonth: number
}

export type PopularRoutes = {
  RouteID: string
  FromCityID: string
  FromCity: string
  ToCityID: string
  ToCity: string
  StartLocation: string
  EndLocation: string
  TotalBooking: number
}