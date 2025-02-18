import Link from "next/link";
import { Plus } from "lucide-react";
import Pagination from '@/components/pagination';
import TableSearch from '@/components/tablesearch';
import prisma from '@/lib/prisma';
import DeleteDepartmentButton from './DeleteDepartmentButton';

export default async function DepartmentsPage({
  searchParams
}: {
  searchParams: {
    page?: string;
    search?: string;
  }
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const itemsPerPage = 7;  
  const searchQuery = searchParams.search || '';

  const skip = (page - 1) * itemsPerPage;

  const [departments, totalCount] = await Promise.all([
    prisma.department.findMany({
      where: {
        department_name: {
          contains: searchQuery,
        },
      },
      include: {
        doctors: true,
        staff: true,
      },
      skip,
      take: itemsPerPage,
      orderBy: {
        department_name: 'asc',  
      },
    }),
    prisma.department.count({
      where: {
        department_name: {
          contains: searchQuery,
        },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Department Lists</h1>
          <p className="text-sm text-gray-500">You have {totalCount} departments.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <TableSearch />
          </div>
          <Link
            href="/list/staff/departments/add"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Plus className="w-5 h-5" />
            Add Department
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Department Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Head of Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Doctors
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Staff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {departments.map((department) => (
                <tr key={department.department_name}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-green-500">{department.department_name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {department.head_of_department || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ul>
                      {department.doctors.map((doctor) => (
                        <li key={doctor.doctor_id}>
                          {doctor.name} - {doctor.specialty}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ul>
                      {department.staff.map((staff) => (
                        <li key={staff.staff_id}>
                          {staff.name} - {staff.role}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/list/staff/departments/${department.department_name}/edit`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </Link>
                      <DeleteDepartmentButton departmentName={department.department_name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Showing {skip + 1} to {Math.min(skip + itemsPerPage, totalCount)} of {totalCount} entries</div>
            <Pagination page={page} count={totalCount} />
          </div>
        </div>
      </div>
    </div>
  );
}
