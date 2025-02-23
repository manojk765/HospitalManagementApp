import { notFound } from 'next/navigation';
import DepartmentForm from '@/components/forms/DepartmentForm';
import prisma from '@/lib/prisma';

type Params = Promise<{ name : string }>

const EditDepartmentPage = async (props : {params : Params }) => {
  const params = await props.params

  const departmentName = decodeURIComponent(params.name).replace(/%20/g, ' ');

  const department = await prisma.department.findUnique({
    where: { department_name: departmentName },
  });

  if (!department) {
    notFound();
  }

  return <DepartmentForm department={department} isEdit={true} />;
};

export default EditDepartmentPage;
