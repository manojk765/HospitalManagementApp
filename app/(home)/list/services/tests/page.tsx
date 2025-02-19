import { Plus } from "lucide-react"
import Pagination from "@/components/pagination"
import TableSearch from "@/components/tablesearch"
import prisma from "@/lib/prisma"
import Link from "next/link"

export default async function TestListPage({
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
  
  const [tests, totalCount] = await Promise.all([
    prisma.labTest.findMany({
      where: {
        test_name: {
          contains: searchQuery, 
          // mode: "insensitive", // Case-insensitive search
        },
      },
      skip,
      take: itemsPerPage,
      orderBy: {
        test_name: "asc",
      },
    }),
    prisma.labTest.count({
      where: {
        test_name: {
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
          <h1 className="text-2xl font-bold">Hospital Lab Tests</h1>
          <p className="text-sm text-gray-500">You have {totalCount} Lab Tests available.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <TableSearch />
          </div>
          <Link
            href="/list/services/tests/new"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Plus className="w-5 h-5" />
            Add Test
          </Link>
        </div>
      </div>

      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Test Name</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Cost</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => (
              <tr key={test.test_name}>
                <td className="border px-4 py-2">{test.test_name}</td>
                <td className="border px-4 py-2">{test.description}</td>
                <td className="border px-4 py-2">{test.cost.toFixed(2)}</td>
                <td className="border px-4 py-2 text-center">
                  <Link href={`/list/services/tests/edit/${test.test_name}`} className="text-blue-500 hover:text-blue-700 p-4">
                    Edit
                  </Link>
                  <Link href={`/list/services/tests/delete/${test.test_name}`} className="text-red-500 hover:text-red-700 p-4">
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
  )
}
