import prisma from "@/lib/prisma"
import PatientInfo from "@/components/PatientInfo"
import PatientServices from "@/components/PatientServices"
// import PatientMedicines from "@/components/PatientMedicines"
import PatientLabTests from "@/components/PatientLabTests"
import PatientSurgeries from "@/components/PatientSurgeries"
import AdmissionComponent from '@/components/PatientAdmissions'
import PatientAdmissionFee from "@/components/PatientAdmissionFee"
import Link from "next/link"
import PatientPaymentsPage from "@/components/PatientPayments"
import PatientBillDisplay from "@/components/PatientBillInfo"

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

type Params = Promise<{ id : string }> 

export default async function PatientPage( props : {params : Params }) {
  const params = await props.params

  const patient = await getPatientData(params.id)

  if (!patient) {
    return <div className="text-center text-2xl mt-10">Patient not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header: Patient Information and Print Bill */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Patient Details</h1>
        <Link href={`/${patient.patient_id}/bill`} target="_blank" rel="noopener noreferrer">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Print Bill</button>
        </Link>
      </div>

      {/* Section: Patient Information */}
      <section className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Patient Information</h2>
        <PatientInfo patientId={params.id} />
      </section>

      {/* Section: Services */}
      <section className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Services</h2>
          <Link href={`/${patient.patient_id}/PrintServiceBill`} target="_blank" rel="noopener noreferrer">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Print Services</button>
          </Link>
        </div>
        <PatientServices patientId={params.id} />
        <div className="mt-4">
          <Link href={`/list/patients/${patient.patient_id}/services`}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit Services</button>
          </Link>
        </div>
      </section>

      {/* Section: Medicines
      <section className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Medicines</h2>
          <Link href={`/${patient.patient_id}/PrintPrescriptionBill`} target="_blank" rel="noopener noreferrer">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Print Medicines</button>
          </Link>
        </div>
        <PatientMedicines prescriptions={patient.prescriptions} />
      </section> */}

      {/* Section: Lab Tests */}
      <section className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Lab Tests</h2>
          <Link href={`/${patient.patient_id}/PrintTestBill`} target="_blank" rel="noopener noreferrer">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Print Tests</button>
          </Link>
        </div>
        <PatientLabTests patientId={params.id} />
        <div className="mt-4">
          <Link href={`/list/patients/${patient.patient_id}/tests`}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit Tests</button>
          </Link>
        </div>
      </section>

      {/* Section: Surgeries */}
      <section className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Surgeries</h2>
          <Link href={`/${patient.patient_id}/PrintSurgeryBill`} target="_blank" rel="noopener noreferrer">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Print Surgeries</button>
          </Link>
        </div>
        <PatientSurgeries patientId={params.id} />
        <div className="mt-4">
          <Link href={`/list/patients/${patient.patient_id}/surgeries`}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit Surgeries</button>
          </Link>
        </div>
      </section>

      {/* Section: Admission Details */}
      <section className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Current Admission</h2>
        <AdmissionComponent patientId={params.id} />
      </section>

      {/* Section: Admission Fees */}
      <section className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Admissions</h2>
          <Link href={`/${patient.patient_id}/PrintAdmissionBill`} target="_blank" rel="noopener noreferrer">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Print Admission Fees</button>
          </Link>
        </div>
        <PatientAdmissionFee patientId={params.id} />
        <div className="mt-4">
          <Link href={`/list/patients/${patient.patient_id}/add-admission`}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit Admission</button>
          </Link>
        </div>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Payments</h2>
          <Link href={`/${patient.patient_id}/PrintPayments`} target="_blank" rel="noopener noreferrer">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Print Payment Details</button>
          </Link>
        </div>
        <PatientPaymentsPage patientId={params.id} />
        <div className="mt-4">
          <Link href={`/list/patients/${patient.patient_id}/payments`}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit Payments</button>
          </Link>
        </div>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-lg">
        <PatientBillDisplay patientId={params.id} />
      </section>
    </div>
  )
}
