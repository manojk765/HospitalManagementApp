import { notFound } from 'next/navigation';
import StaffForm from '@/components/forms/StaffForm'
import prisma from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

interface Staff {
    staff_id: string;
    name: string;
    role: string;
    contact_number: string;
    email: string;
    shift_time: string; 
    department_name: string;
    salary: Decimal ;
    department: {
      department_name: string;
    };
  }
  
interface EditStaffPageProps {
  params: {
    id: string;
  };
}

export default async function EditStaffPage({ params }: EditStaffPageProps) {
  const staff = await prisma.staff.findUnique({
    where: { staff_id: params.id },
    include: {
      department: true,
    },
  });

  if (!staff) {
    notFound();
  }

  return <StaffForm staff={staff as Staff} isEdit={true} />;

};