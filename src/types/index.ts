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
  routeID: string
  fromCityID: string
  fromCity: string
  toCityID: string
  toCity: string
  startLocation: string
  endLocation: string
  totalBooking: number
}

export type DashboardAdminProps = {
  TotalRevenueInMonth: number
  TotalTicketBookedInMonth: number
  ToTalUsers: number
  TotalCompanies: number
  RevenueAllMonthInYears: RevenueAllMonthInYears[]
  RevenueOfCompanyInMonths: RevenueOfCompanyInMonths[]
}

export type RevenueAllMonthInYears = {
  Month: number
  Year: number
  TotalRevenueMonthInYear: number
}

export type RevenueOfCompanyInMonths = {
  CompanyID: string
  CompanyName: string
  Month: number
  Year: number
  TotalRevenueOfCompanyInMonth: number
}
