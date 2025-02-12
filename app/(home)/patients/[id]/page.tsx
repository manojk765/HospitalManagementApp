// import prisma from '@/lib/prisma';
// import PatientInfo from "@/components/PatientInfo"
// import PatientServices from "@/components/PatientServices"
// import PatientMedicines from "@/components/PatientMedicines"
// import PatientLabTests from "@/components/PatientLabTests"



// async function getPatientData(id: string) {
//   const patient = await prisma.patient.findUnique({
//     where: { patient_id: id },
//     include: {
//       services: true,
//       prescriptions: {
//         include: {
//           doctor: true,
//         },
//       },
//       tests: {
//         include: {
//           doctor: true,
//           labTest: true,
//         },
//       },
//     },
//   })
//   return patient
// }

// export default async function PatientPage({ params }: { params: { id: string } }) {
//   const patient = await getPatientData(params.id)

//   if (!patient) {
//     return <div className="text-center text-2xl mt-10">Patient not found</div>
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8 text-center">Patient Details</h1>
//       <div className="flex flex-col py-4 gap-4">
//         <PatientInfo patient={patient} />
//         <PatientServices services={patient.services} />
//       </div>
//       <div className="flex flex-col py-4 gap-4">
//         <PatientMedicines prescriptions={patient.prescriptions} />
//         <PatientLabTests tests={patient.tests} />
//       </div>
//     </div>
//   )
// }

import prisma from "@/lib/prisma"
import PatientInfo from "@/components/PatientInfo"
import PatientServices from "@/components/PatientServices"
import PatientMedicines from "@/components/PatientMedicines"
import PatientLabTests from "@/components/PatientLabTests"
import Link from "next/link"

async function getPatientData(id: string) {
  const patient = await prisma.patient.findUnique({
    where: { patient_id: id },
    include: {
      services: true,
      prescriptions: {
        include: {
          doctor: true,
        },
      },
      tests: {
        include: {
          doctor: true,
          labTest: true,
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
        <Link href={`/${patient.patient_id}/print-bill`} target="_blank" rel="noopener noreferrer">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Print Bill</button>
        </Link>
      </div>

      {/* Patient Information */}
      <div className="flex flex-col py-4 gap-4">
        <PatientInfo patient={patient} />
      </div>

      {/* Services Section with Print Link */}
      <div className="flex flex-col py-4 gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Services</h2>
          <Link href={`/${patient.patient_id}/PrintServiceBill`} target="_blank" rel="noopener noreferrer">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Print Services</button>
          </Link>
        </div>
        <PatientServices services={patient.services} />
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
        <PatientLabTests tests={patient.tests} />
      </div>
    </div>
  )
}
