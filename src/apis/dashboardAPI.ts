import busAPI from "@/lib/busAPI";
import { DashboardAdminProps, DashboardManagerProps } from "@/types";
import { useQuery } from "@tanstack/react-query"

export const fetchDashboardManager = (CompanyID: string) => {
    return useQuery<DashboardManagerProps>({
        queryKey: ['dashboardManager', CompanyID],
        queryFn: async () => {
            const { data } = await busAPI.get<DashboardManagerProps>(`/dashboard-management/managed-dashboards/company/${CompanyID}`);
            return data;
        }
    })
}

export const fetchDashboardAdmin = () => {
    return useQuery<DashboardAdminProps>({
        queryKey: ['dashboardAdmin'],
        queryFn: async () => {
            const { data } = await busAPI.get<DashboardAdminProps>('/dashboard-management/managed-dashboards/admins');
            return data;
        }
    })
}