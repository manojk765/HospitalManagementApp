import Link from "next/link"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function DeleteBedPage({ params }: { params: { id: string } }) {
  const bed = await prisma.beds.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      Admission: true,
      PatientAdmissionFee: true,
    },
  })

  if (!bed) {
    return <div>Bed not found</div>
  }

  const hasRelatedRecords = bed.Admission.length > 0 || bed.PatientAdmissionFee.length > 0

  async function deleteBed() {
    "use server"
    
    if (hasRelatedRecords) {
      return alert("This bed has related records and cannot be deleted.")
    }

    await prisma.beds.delete({
      where: { id: parseInt(params.id) },
    })
    redirect("/list/beds/list")
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Delete Bed</h1>
      
      {!hasRelatedRecords ? (
        <>
          <p className="mb-4">
            Are you sure you want to delete bed number {bed.bedNumber} ({bed.type})?
          </p>
        </>
      ) : null}

      {hasRelatedRecords ? (
        <>
          <p className="text-red-500 mb-4">
            This bed has associated admission records and cannot be deleted.
          </p>
          <Link
            href="/beds"
            className="px-4 py-2 mt-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Go Back
          </Link>
        </>
      ) : (
        <form action={deleteBed}>
          <button
            type="submit"
            className="px-4 py-2 mt-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Confirm Delete
          </button>
        </form>
      )}
    </div>
  )
}