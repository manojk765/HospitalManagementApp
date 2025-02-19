import Pagination from '@/components/pagination';
import TableSearch from '@/components/tablesearch';
import prisma from '@/lib/prisma';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function SurgeryListPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    search?: string;
  };
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const itemsPerPage = 7;
  const searchQuery = searchParams.search || '';

  const skip = (page - 1) * itemsPerPage;

  // Query for surgeries with search functionality
  const [surgeries, totalCount] = await Promise.all([
    prisma.surgery.findMany({
      where: {
        surgery_name: {
          contains: searchQuery,
          // mode: 'insensitive', // Case-insensitive search
        },
      },
      skip,
      take: itemsPerPage,
      orderBy: {
        surgery_name: 'asc', // Optional: sort by surgery name
      },
    }),
    prisma.surgery.count({
      where: {
        surgery_name: {
          contains: searchQuery,
          // mode: 'insensitive',
        },
      },
    }),
  ]);

  return (
    <div className="p-4">
      {/* Search bar */}
      <div className="flex items-center justify-between py-4">
        <div>
          <h1 className="text-2xl font-bold">Hospital Surgeries</h1>
          <p className="text-sm text-gray-500">
            {totalCount > 0 ? `You have ${totalCount} surgeries available.` : 'No surgeries found.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <TableSearch />
          </div>
          <Link
            href="/list/services/surgery/new"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Plus className="w-5 h-5" />
            Add Surgery
          </Link>
        </div>
      </div>

      {/* Surgeries table */}
      {surgeries.length > 0 ? (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Surgery Name</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Cost</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {surgeries.map((surgery) => (
              <tr key={surgery.surgery_name}>
                <td className="border px-4 py-2">{surgery.surgery_name}</td>
                <td className="border px-4 py-2">{surgery.description}</td>
                <td className="border px-4 py-2">
                  {surgery.cost ? surgery.cost.toFixed(2) : 'N/A'}
                </td>
                <td className="border px-4 py-2 text-center">
                  <Link
                    href={`/list/services/surgery/edit/${surgery.surgery_name}`}
                    className="text-blue-500 hover:text-blue-700 p-4"
                  >
                    Edit
                  </Link>

                  <Link
                    href={`/list/services/surgery/delete/${surgery.surgery_name}`}
                    className="text-red-500 hover:text-red-700 p-4"
                  >
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500 py-4">No surgeries found.</p>
      )}

      <Pagination page={page} count={totalCount} />
    </div>
  );
}
