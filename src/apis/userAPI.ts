import axios from 'axios';
import busAPI from '@/lib/busAPI';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export interface IUserDetail {
  UserID: string,
  UserName: string,
  Password: string,
  FullName: string,
  Email: string,
  Avatar: string,
  Address: string,
  OtpCode: string,
  PhoneNumber: string,
  Balance: number,
  CreateDate: string,
  IsVerified: boolean,
  Status: string,
  RoleID: string,
  RoleName:string,
  CompanyID:string
}
// export const fetchUserDetail = async (userId: string): Promise<IUserDetail> => {
//   const { data } = await busAPI.get<IUserDetail>(`/user-management/managed-users/${userId}/details`);
//   return data;
// };
export const fetchUserDetail = (userId: string) => {
    return useQuery({
      queryKey: ['userDetail', userId],
      queryFn: async () => {
        const { data } = await busAPI.get<IUserDetail>(`/user-management/managed-users/${userId}/details`);
        console.log("tui ne", data)
        return data;
      },
    });
  };
  export const updateUserProfile = async (userId:string,formData: any) => {
    try {
      const response = await busAPI.put(`/user-management/managed-users/${userId}`, formData); // Adjust the API endpoint and method as per your backend API
      return response.data; // Assuming the API returns updated user data
    } catch (error) {
      throw new Error('Error updating user profile'); // Handle errors appropriately in your application
    }
  };