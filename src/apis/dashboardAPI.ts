import busAPI from "@/lib/busAPI";
import { DashboardManagerProps } from "@/types";
import { useQuery } from "@tanstack/react-query"

export const fetchDashboardManager = (CompanyID: string) => {
    return useQuery<DashboardManagerProps>({
        queryKey: ['dashboardManager', CompanyID],
        queryFn: async () => {
            const { data } = await busAPI.get<DashboardManagerProps>(`/dashboard-management/managed-dashboard/company/${CompanyID}`);
            return data;
        }
    })
}