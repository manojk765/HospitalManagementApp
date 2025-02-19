import prisma from "@/lib/prisma"
import PatientInfo from "@/components/PatientInfo"
import PatientServices from "@/components/PatientServices"
import PatientMedicines from "@/components/PatientMedicines"
import PatientLabTests from "@/components/PatientLabTests"
import PatientSurgeries from "@/components/PatientSurgeries";
import Link from "next/link"

async function getPatientData(id: string) {
  const patient = await prisma.patient.findUnique({
    where: { patient_id: id },
    include: {
      prescriptions: {
        include: {
          doctor: true,
        },
      }, 
    },
  })
  return patient
}

export default async function PatientPage({ params }: { params: { id: string } }) {
  const patient = await getPatientData(params.id)

  if (!patient) {
    return <div className="text-center text-2xl mt-10">Patient not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Patient Details</h1>
        <Link href={`/${patient.patient_id}/bill`} target="_blank" rel="noopener noreferrer">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Print Bill</button>
        </Link>
      </div>

      {/* Patient Information */}
      <div className="flex flex-col py-4 gap-4">
        <PatientInfo patientId={params.id} />
      </div>

      {/* <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"> */}
        <Link href={`/list/patients/${patient.patient_id}/services`}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View Services</button>
        </Link>
      {/* </div> */}

      <Link href={`/list/patients/${patient.patient_id}/tests`}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View Tests</button>
      </Link>
      
      <Link href={`/list/patients/${patient.patient_id}/surgeries`}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View Surgeries</button>
      </Link>

      <Link href={`/list/patients/${patient.patient_id}/add-admission`}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add admission</button>
        </Link>

      {/* Services Section with Print Link */}
      <div className="flex flex-col py-4 gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Services</h2>
          <Link href={`/${patient.patient_id}/PrintServiceBill`} target="_blank" rel="noopener noreferrer">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Print Services</button>
          </Link>
        </div>
        <PatientServices patientId={params.id} />
      </div>

      {/* Medicines Section with Print Link */}
      <div className="flex flex-col py-4 gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Medicines</h2>
          <Link href={`/${patient.patient_id}/PrintPrescriptionBill`} target="_blank" rel="noopener noreferrer">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Print Medicines</button>
          </Link>
        </div>
        <PatientMedicines prescriptions={patient.prescriptions} />
      </div>

      {/* Lab Tests Section with Print Link */}
      <div className="flex flex-col py-4 gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Lab Tests</h2>
          <Link href={`/${patient.patient_id}/PrintTestBill`} target="_blank" rel="noopener noreferrer">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Print Tests</button>
          </Link>
        </div>
        <PatientLabTests patientId={params.id} />
      </div>

      {/* Surgeries Section with Print Link */}
      <div className="flex flex-col py-4 gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Surgeries</h2>
          <Link href={`/${patient.patient_id}/PrintSurgeryBill`} target="_blank" rel="noopener noreferrer">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Print Surgeries</button>
          </Link>
        </div>
        <PatientSurgeries patientId={params.id} />
      </div>

    </div>
  )
}
