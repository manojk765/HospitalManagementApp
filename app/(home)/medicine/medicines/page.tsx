import Pagination from '@/components/pagination';
import TableSearch from '@/components/tablesearch';
import prisma from '@/lib/prisma';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function MedicineListPage({ 
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

  // Modify query to include search functionality
  const [medicines, totalCount] = await Promise.all([
    prisma.medicine.findMany({
      where: {
        medicine_name: {
          contains: searchQuery,
          // mode: 'insensitive', // Case-insensitive search
        },
      },
      include: {
        manufacturer: true,
      },
      skip,
      take: itemsPerPage,
      orderBy: {
        medicine_name: 'asc', // Optional: sort by medicine name
      },
    }),
    prisma.medicine.count({
      where: {
        medicine_name: {
          contains: searchQuery,
          // mode: 'insensitive',
        },
      },
    }),
  ]);

  const formattedMedicines = medicines.map((medicine) => ({
    ...medicine,
    price_per_unit: medicine.price_per_unit.toNumber(),
    unit_quantity: medicine.unit_quantity.toNumber(),
  }));

  return (
    <div className="p-4">

      {/* Search bar */}
      <div className="flex items-center justify-between py-4">
        <div>
          <h1 className="text-2xl font-bold">Medicine Lists</h1>
          <p className="text-sm text-gray-500">You have {totalCount} Manufacturers.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <TableSearch />
          </div>
          <Link
            href="/medicine/medicines/new"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Plus className="w-5 h-5" />
            Add Medicine
          </Link>
        </div>
      </div>

      {/* Medicine table */}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Medicine Name</th>
            <th className="border px-4 py-2">Stock Quantity</th>
            <th className="border px-4 py-2">Price per Unit</th>
            <th className="border px-4 py-2">Unit Quantity</th>
            <th className="border px-4 py-2">Batch Number</th>
            <th className="border px-4 py-2">Expiry Date</th>
            <th className="border px-4 py-2">Manufacturer</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {formattedMedicines.map((medicine) => (
            <tr key={medicine.medicine_id}>
              <td className="border px-4 py-2">{medicine.medicine_name}</td>
              <td className="border px-4 py-2">{medicine.stock_quantity}</td>
              <td className="border px-4 py-2">{medicine.price_per_unit}</td>
              <td className="border px-4 py-2">{medicine.unit_quantity}</td>
              <td className="border px-4 py-2">{medicine.batch_number}</td>
              <td className="border px-4 py-2"> 
                {new Date(medicine.expiry_date).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">
                {medicine.manufacturer.vendor_pharm_name}
              </td>
              <td className="border px-4 py-2 text-center">
                    <Link
                      href={`/medicine/medicines/edit/${medicine.medicine_id}`}
                      className="text-blue-500 hover:text-blue-700 p-4"
                    >
                      Edit
                    </Link>
            
                    <Link
                      href={`/medicine/medicines/delete/${medicine.medicine_id}`}
                      className="text-red-500 hover:text-red-700 p-4"
                    >
                      Delete
                    </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
      <Pagination page={page} count={totalCount} />
    </div>
  );
}