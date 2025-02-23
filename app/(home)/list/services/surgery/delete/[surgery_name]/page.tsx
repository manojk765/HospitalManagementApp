import { deleteSurgery } from "../action"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

type Params = Promise<{ surgery_name : string }> 

export default async function DeleteSurgeryPage( props : {params : Params}) {
  const params = await props.params

  const surgeryName = decodeURIComponent(params.surgery_name)

  const surgery = await prisma.surgery.findUnique({
    where: { surgery_name: surgeryName },
    include: {  surgery : true }, 
  })

  // If no surgery is found, redirect to the list page
  if (!surgery) {
    redirect('/list/services/surgery')
    return null
  }

  const hasPatients = surgery.surgery.length > 0

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Delete Surgery</h1>

      {hasPatients ? (
        <div className="bg-red-100 text-red-600 p-4 rounded-md">
          <p className="font-medium">This surgery has patients attached and cannot be deleted.</p>
          <Link 
            href="/list/services/surgery"
            className="inline-flex items-center mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Go Back
          </Link>
        </div>
      ) : (
        <div>
          <p>Are you sure you want to delete the surgery {surgery.surgery_name}?</p>
          <form action={deleteSurgery} method="POST">
            <input type="hidden" name="surgery_name" value={surgery.surgery_name} />
            <button
              type="submit"
              className="px-4 py-2 mt-4 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete Surgery
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
