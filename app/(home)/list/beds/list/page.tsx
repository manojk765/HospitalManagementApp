import Link from "next/link"
import { Plus, Edit, Trash } from "lucide-react"
import Pagination from "@/components/pagination"
import TableSearch from "@/components/tablesearch"
import prisma from "@/lib/prisma"

export default async function BedsPage({
  searchParams,
}: {
  searchParams: {
    page?: string
    search?: string
  }
}) {
  const page = Number.parseInt(searchParams.page || "1", 10)
  const itemsPerPage = 7
  const searchQuery = searchParams.search || ""

  const skip = (page - 1) * itemsPerPage

  const [beds, totalCount] = await Promise.all([
    prisma.beds.findMany({
      where: {
        OR: [
          {
            bedNumber: {
              contains: searchQuery,
            },
          },
          // {
          //   type: {
          //     equals: searchQuery as RoomType || undefined,
          //   },
          // },
        ],
      },
      skip,
      take: itemsPerPage,
      orderBy: {
        id: "asc",
      },
    }),
    prisma.beds.count({
      where: {
        OR: [
          {
            bedNumber: {
              contains: searchQuery,
            },
          },
          // {
          //   type: {
          //     equals: searchQuery as RoomType || undefined,
          //   },
          // },
        ],
      },
    }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Beds Management</h1>
          <p className="text-sm text-gray-500">Total {totalCount} beds available.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <TableSearch />
          </div>
          <Link
            href="/list/beds/add"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Plus className="w-5 h-5" />
            Add Bed
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Id</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bed Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Daily Rate (₹)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {beds.map((bed) => (
                <tr key={bed.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{bed.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{bed.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{bed.bedNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{bed.dailyRate.toString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bed.available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {bed.available ? "Available" : "Occupied"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Link href={`/list/beds/edit/${bed.id}`}>
                        <Edit className="w-5 h-5 text-blue-500 hover:text-blue-600" />
                      </Link>
                      <Link href={`/list/beds/delete/${bed.id}`}>
                        <Trash className="w-5 h-5 text-red-500 hover:text-red-600" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {skip + 1} to {Math.min(skip + itemsPerPage, totalCount)} of {totalCount} entries
            </div>
            <Pagination page={page} count={totalCount} />
          </div>
        </div>
      </div>
    </div>
  )
}