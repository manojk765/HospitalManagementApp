import Link from "next/link";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation"

type Params = Promise<{id: string}>

export default async function DeleteDoctorPage( props :{params: Params}) {
  const params = await props.params

  const doctor = await prisma.doctor.findUnique({
    where: { doctor_id: params.id },
    include: {
      prescriptions: true, // Include prescriptions to check if any exist
      patients: true,      // Include patients to check if any exist
    },
  })

  if (!doctor) {
    return <div>Doctor not found</div>
  }

  // Check if the doctor has prescriptions or patients
  const hasPrescriptionsOrPatients = doctor.prescriptions.length > 0 || doctor.patients.length > 0;

  async function deleteDoctor() {
    "use server"
    if (hasPrescriptionsOrPatients) {
      return alert("This doctor has prescriptions or patients and cannot be deleted.");
    }

    await prisma.doctor.delete({
      where: { doctor_id: params.id },
    })
    redirect("/list/staff/doctor-list")
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Delete Doctor</h1>
      
      {
        !hasPrescriptionsOrPatients ? (
          <>
            <p className="mb-4"> 
                `Are you sure you want to delete the doctor: {doctor.name}?` 
            </p>
          </>
        ) : null
      }

      {hasPrescriptionsOrPatients ? (
        <>
          <p className="text-red-500 mb-4">
            This doctor has associated prescriptions or patients and cannot be deleted.
          </p>
          <Link
            href="/list/staff/doctor-list"
            className="px-4 py-2 mt-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Go Back
          </Link>
        </>
      ) : (
        <form action={deleteDoctor}>
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
