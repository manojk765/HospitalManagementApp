import Link from "next/link";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import Pagination from '@/components/pagination';
import TableSearch from '@/components/tablesearch';
import prisma from '@/lib/prisma';

export default async function DoctorsPage({
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

  // Fetch doctors based on search and pagination
  const [doctors, totalCount] = await Promise.all([
    prisma.doctor.findMany({
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
        name: 'asc', // Optional: Sort by doctor's name
      },
    }),
    prisma.doctor.count({
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
          <h1 className="text-2xl font-bold">Doctors List</h1>
          <p className="text-sm text-gray-500">You have {totalCount} doctors.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <TableSearch />
          </div>
          <Link
            href="/doctors/add"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Plus className="w-5 h-5" />
            Add Doctor
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Specialty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Experience (Years)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {doctors.map((doctor) => (
                <tr key={doctor.doctor_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doctor.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doctor.specialty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doctor.contact_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doctor.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doctor.experience_years}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doctor.department.department_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
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
