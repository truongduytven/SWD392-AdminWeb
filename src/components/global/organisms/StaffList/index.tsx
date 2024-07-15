import { useEffect, useState } from 'react';
import { DataTable } from '../table/main';
import { DataTableToolbar } from './toolbar';
import { useAuth } from '@/auth/AuthProvider';
import busAPI from '@/lib/busAPI';
import { toast } from '../../atoms/ui/use-toast';
import { Dialog, DialogContent, DialogOverlay } from '../../atoms/ui/dialog';
import { Button } from '../../atoms/ui/button';
import { Loader } from 'lucide-react';
import { columns } from './columns';
import TableSkeleton from '../TableSkeleton';
import { fetchStaff } from '@/apis/staffAPI';

type Staff = {
  StaffID: string;
  Name: string;
  CompanyID: string;
  Password: string;
  Email: string;
  Address: string;
  PhoneNumber: string;
  Status: string;
};

function ListStaff() {
  const { user } = useAuth();
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [isLoadingStaffs, setIsLoadingStaffs] = useState(true);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const { data, refetch } = fetchStaff(user?.CompanyID || '');

  useEffect(() => {
    if (data) {
      setStaffs(data);
      setIsLoadingStaffs(false);
    }
  }, [data]);

  const handleChangeStatus = (staff: Staff, status: string) => {
    setSelectedStaff(staffs.find((data) => data.StaffID === staff.StaffID) || null);
    setIsModalOpen(true);
  };

  const confirmChangeStatus = async () => {
    if (!selectedStaff) return;
    setIsLoadingUpdate(true);
    try {
      await busAPI.put(`status-management?entity=USER&id=${selectedStaff.StaffID}`);
      refetch();
      toast({
        variant: 'success',
        title: 'Trạng thái đã được thay đổi',
        description: 'Trạng thái của nhân viên đã được thay đổi thành công',
      });
      setIsModalOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Không thể thay đổi trạng thái',
        description: 'Vui lòng thử lại sau',
      });
      console.log(error);
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  if (isLoadingStaffs) return <TableSkeleton />;

  return (
    <div className='flex h-full flex-1 flex-col'>
      <h1 className='my-4 border-b pb-2 text-3xl font-semibold tracking-wider first:mt-0'>Danh sách nhân viên</h1>
      <DataTable data={staffs} columns={columns(handleChangeStatus)} Toolbar={DataTableToolbar} rowString='Nhân viên' />
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogOverlay className='bg-/60' />
          <DialogContent>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>Xác nhận thay đổi trạng thái</h3>
            <div className='mt-2'>
              <p>Bạn có chắc chắn muốn thay đổi trạng thái của nhân viên này?</p>
            </div>
            <div className='mt-4 flex justify-end space-x-2'>
              <Button variant='secondary' onClick={() => setIsModalOpen(false)}>
                Hủy
              </Button>
              <Button onClick={confirmChangeStatus} disabled={isLoadingUpdate}>
                {isLoadingUpdate ? <Loader className='animate-spin' /> : 'Xác nhận'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default ListStaff;
