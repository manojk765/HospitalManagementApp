import Link from "next/link";
import { MoreHorizontal, Plus } from "lucide-react";
import Pagination from '@/components/pagination';
import TableSearch from '@/components/tablesearch';
import prisma from '@/lib/prisma';
import DeleteStaffButton from "./DeleteStaffComponent";

export default async function StaffPage({
  searchParams
}: {
  searchParams: {
    page?: string;
    search?: string;
  }
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const itemsPerPage = 7; // Customize the items per page
  const searchQuery = searchParams.search || '';

  const skip = (page - 1) * itemsPerPage;

  // Fetch staff based on search and pagination
  const [staffList, totalCount] = await Promise.all([
    prisma.staff.findMany({
      where: {
        name: {
          contains: searchQuery,
        },
      },
      include: {
        department: true,
      },
      skip,
      take: itemsPerPage,
      orderBy: {
        staff_id : 'asc', // Optional: Sort by staff's id
      },
    }),
    prisma.staff.count({
      where: {
        name: {
          contains: searchQuery,
        },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff List</h1>
          <p className="text-sm text-gray-500">You have {totalCount} staff members.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <TableSearch />
          </div>
          <Link
            href="/list/staff/staff-list/add"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Plus className="w-5 h-5" />
            Add Staff
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Id
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Shift Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {staffList.map((staff) => (
                <tr key={staff.staff_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {staff.staff_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {staff.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {staff.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {staff.contact_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {staff.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {staff.shift_time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {staff.department.department_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₹{staff.salary.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/list/staff/staff-list/${staff.staff_id}/edit`}
                        className="text-blue-500 hover:text-blue-700 mx-2"
                      >
                        Edit
                      </Link>
                      <DeleteStaffButton id={staff.staff_id} />
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
