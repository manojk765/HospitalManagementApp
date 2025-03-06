import Link from "next/link";
import {Plus} from "lucide-react";
import Pagination from '@/components/pagination';
import TableSearch from '@/components/tablesearch';
import prisma from '@/lib/prisma';

type SearchParams = {
  page?: string
  search?: string
}

export default async function PatientsPage( 
  {
    searchParams,
  }: {
    searchParams:  Promise<SearchParams>
  } 
) {
  const params = await searchParams


  const page = parseInt(params.page || '1', 10);
  const itemsPerPage = 7;
  const searchQuery = params.search || '';

  const skip = (page - 1) * itemsPerPage;

  const [patients, totalCount] = await Promise.all([
    prisma.patient.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchQuery,
            },
          },
          {
            patient_id: {
              contains: searchQuery,
            },
          },
        ],
      },      
      skip,
      take: itemsPerPage,
      orderBy: {
        patient_id: 'desc',
      },
    }),
    prisma.patient.count({
      where: {
        OR: [
          {
            name: {
              contains: searchQuery,
            },
          },
          {
            patient_id: {
              contains: searchQuery,
            },
          },
        ],
      },
    }),
  ]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Patients List</h1>
          <p className="text-sm text-gray-500">You have {totalCount} patients.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <TableSearch />
          </div>
          <Link
            href="/list/patients/add/ipd"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Plus className="w-5 h-5" />
            Add Patient
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.patient_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {patient.patient_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {patient.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {patient.contact_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {patient.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {patient.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {patient.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                        href={`/list/patients/${patient.patient_id}`}
                        className="text-blue-500 hover:text-blue-700 p-4"
                      >
                        MoreDetails
                      </Link>
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
