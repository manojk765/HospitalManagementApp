import { deleteTest } from "../action"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DeleteTestPage({ params }: { params: { test_name: string } }) {
  const testName = decodeURIComponent(params.test_name)

  const test = await prisma.labTest.findUnique({
    where: { test_name: testName },
    include: { tests: true },   
  })

  // If no test is found, redirect to the list page
  if (!test) {
    redirect('/list/services/tests')
    return null
  }

  const hasPatients = test.tests.length > 0

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Delete Test</h1>

      {hasPatients ? (
        <div className="bg-red-100 text-red-600 p-4 rounded-md">
          <p className="font-medium">This test has patients attached and cannot be deleted.</p>
          <Link 
            href="/list/services/tests"
            className="inline-flex items-center mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Go Back
          </Link>
        </div>
      ) : (
        <div>
          <p>Are you sure you want to delete the service "{test.test_name}"?</p>
          <form action={deleteTest} method="POST">
            <input type="hidden" name="test_name" value={test.test_name} />
            <button
              type="submit"
              className="px-4 py-2 mt-4 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete Test
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
