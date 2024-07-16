import { Staff } from "@/components/global/organisms/StaffList/columns";
import busAPI from "@/lib/busAPI";
import { useQuery } from "@tanstack/react-query";

export const fetchStaff = (CompanyID: string) => {
    return useQuery<Staff[]>({
        queryKey: ['staff'],
        queryFn: async () => {
            const { data } = await busAPI.get<Staff[]>(`user-management/managed-users/staff/${CompanyID}`);
            return data;
        }
    })
}
