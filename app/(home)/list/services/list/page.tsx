import Pagination from "@/components/pagination"
import TableSearch from "@/components/tablesearch"
import prisma from "@/lib/prisma"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function ServiceListPage({
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

  const [services, totalCount] = await Promise.all([
    prisma.services.findMany({
      where: {
        service_name: {
          contains: searchQuery,
          // mode: "insensitive", // Case-insensitive search
        },
      },
      skip,
      take: itemsPerPage,
      orderBy: {
        service_name: "asc",
      },
    }),
    prisma.services.count({
      where: {
        service_name: {
          contains: searchQuery,
          // mode: "insensitive",
        },
      },
    }),
  ])

  return (
    <div className="p-4">
      <div className="flex items-center justify-between py-4">
        <div>
          <h1 className="text-2xl font-bold">Hospital Services</h1>
          <p className="text-sm text-gray-500">You have {totalCount} Services available.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <TableSearch />
          </div>
          <Link
            href="/list/services/list/new"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Plus className="w-5 h-5" />
            Add Service
          </Link>
        </div>
      </div>

      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Service Name</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Cost</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.service_name}>
              <td className="border px-4 py-2">{service.service_name}</td>
              <td className="border px-4 py-2">{service.description}</td>
              <td className="border px-4 py-2">{service.cost.toFixed(2)}</td>
              <td className="border px-4 py-2 text-center">
                <Link href={`/list/services/list/edit/${service.service_name}`} className="text-blue-500 hover:text-blue-700 p-4">
                  Edit
                </Link>
                <Link href={`/list/services/list/delete/${service.service_name}`} className="text-red-500 hover:text-red-700 p-4">
                  Delete
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination page={page} count={totalCount} />
    </div>
  )
}

