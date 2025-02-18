"use client"

import { Suspense } from "react"
import { Plus } from "lucide-react"
import Pagination from "@/components/pagination"
import TableSearch from "@/components/tablesearch"
import AddLabTest from "./add/page"
import EditLabTest from "./edit/page"
import DeleteLabTest from "./delete/page"
import prisma from "@/lib/prisma"
import { useState } from "react"

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
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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


  const openDialog = () => setIsDialogOpen(true)
  const closeDialog = () => setIsDialogOpen(false)

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
          <button
            onClick={openDialog}
            className="flex items-center gap-2 bg-blue-500 text-white p-2 rounded"
          >
            <Plus className="w-5 h-5" />
            Add Lab Test
          </button>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Lab Test</h2>
            <p className="text-sm text-gray-500 mb-4">Enter the details for the new lab test.</p>
            <AddLabTest />
            <button
              onClick={closeDialog}
              className="mt-4 p-2 bg-gray-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

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
                  <button
                    onClick={() => openDialog()}
                    className="mr-2 p-2 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <DeleteLabTest testName={test.test_name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <Pagination page={page} count={totalCount} />
      </Suspense>
    </div>
  )
}
