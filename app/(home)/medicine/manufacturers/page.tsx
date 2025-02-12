import Link from "next/link";
import { Plus } from "lucide-react";
import Pagination from '@/components/pagination';
import TableSearch from '@/components/tablesearch';
import prisma from '@/lib/prisma';

export default async function ManufacturersPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const page = parseInt(searchParams.page || '1', 7);
  const itemsPerPage = 7; 
  const searchQuery = searchParams.search || '';

  const skip = (page - 1) * itemsPerPage;

  const [manufacturers, totalCount] = await Promise.all([
    prisma.manufacturer.findMany({
      where: {
        vendor_pharm_name: {
          contains: searchQuery,
        },
      },
      skip,
      take: itemsPerPage,
      orderBy: {
        vendor_pharm_name: 'asc', 
      },
    }),
    prisma.manufacturer.count({
      where: {
        vendor_pharm_name: {
          contains: searchQuery,
        },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manufacturer Lists</h1>
          <p className="text-sm text-gray-500">You have {totalCount} Manufacturers.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <TableSearch />
          </div>
          <Link
            href="/medicine/manufacturers/add"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Plus className="w-5 h-5" />
            Add Manufacturer
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pharmacy name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {manufacturers.map((manufacturer) => (
                <tr key={manufacturer.vendor_pharm_name}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-green-500">{manufacturer.vendor_pharm_name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{manufacturer.vendor_name}</div>
                      <div className="text-sm text-gray-500">{manufacturer.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{manufacturer.contact_number}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div>City: {manufacturer.city}</div>
                      <div>State: {manufacturer.state}</div>
                      <div>Country: {manufacturer.zip_code}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">$0.00</td> 
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/medicine/manufacturers/edit/${manufacturer.vendor_pharm_name}`}
                      className="text-blue-500 hover:text-blue-700 p-4"
                    >
                      Edit
                    </Link>

                    <Link
                      href={`/medicine/manufacturers/delete/${manufacturer.vendor_pharm_name}`}
                      className="text-red-500 hover:text-red-700 p-4"
                    >
                      Delete
                    </Link>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={page} count={totalCount} />
      </div>
    </div>
  );
}
