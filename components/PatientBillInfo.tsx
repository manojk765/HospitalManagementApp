import Decimal from "decimal.js"
import prisma from "@/lib/prisma"

interface Props {
  patientId: string
}

const formatCurrency = (value: number) => `₹${value.toFixed(2)}`

const calculateTotal = (items: { total_cost: Decimal | bigint }[]) =>
  items.reduce((sum, item) => sum + Number(item.total_cost), 0)

const calculatePaymentTotal = (payments: { amount_paid: Decimal | bigint }[]) =>
  payments.reduce((sum, payment) => sum + Number(payment.amount_paid), 0)

const calculateAdmissionTotal = (admissions: { totalCost: Decimal | bigint }[]) =>
  admissions.reduce((sum, admission) => sum + Number(admission.totalCost), 0)

async function getPatientData(patientId: string) {
  const patient = await prisma.patient.findUnique({
    where: { patient_id: patientId },
    include: {
      doctors: true,
    },
  })
  return patient
}

async function getDoctorData(doctorId: string) {
  const doctor = await prisma.doctor.findUnique({
    where: { doctor_id: doctorId },
  })
  return doctor
}

async function getPatientTests(patientId: string) {
  const tests = await prisma.patientTests.findMany({
    where: { patient_id: patientId },
    orderBy: { test_date: "desc" },
  })
  return tests
}

async function getPatientServices(patientId: string) {
  const services = await prisma.patientService.findMany({
    where: { patient_id: patientId },
    orderBy: { service_date: "desc" },
  })
  return services
}

async function getPatientSurgeries(patientId: string) {
  const surgeries = await prisma.patientSurgery.findMany({
    where: { patient_id: patientId },
    orderBy: { surgery_date: "desc" },
  })
  return surgeries
}

async function getAdmissionFee(patientId: string) {
  const admissionFee = await prisma.patientAdmissionFee.findMany({
    where: { patient_id: patientId },
    orderBy: { admittedDate: "desc" },
  })
  return admissionFee
}

async function getPatientPayments(patientId: string) {
  const payments = await prisma.payment.findMany({
    where: { patient_id: patientId },
    orderBy: { payment_date: "desc" },
  })
  return payments
}

export default async function PatientBillDisplay({ patientId }: Props) {
  const patient = await getPatientData(patientId)
  if (!patient) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">Patient not found</p>
      </div>
    )
  }

  const doctor = patient.doctors[0] ? await getDoctorData(patient.doctors[0].doctor_id) : null
  const [tests, services, surgeries, admissionFee, payments] = await Promise.all([
    getPatientTests(patientId),
    getPatientServices(patientId),
    getPatientSurgeries(patientId),
    getAdmissionFee(patientId),
    getPatientPayments(patientId),
  ])

  const admissionFeeTotal = calculateAdmissionTotal(admissionFee)
  const testsTotal = calculateTotal(tests)
  const servicesTotal = calculateTotal(services)
  const surgeriesTotal = calculateTotal(surgeries)
  const totalPayments = calculatePaymentTotal(payments)
  const grandTotal = admissionFeeTotal + testsTotal + servicesTotal + surgeriesTotal
  const remainingAmount = grandTotal - totalPayments

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-4">Patient Bill Summary</h1>
        <div className="space-y-2">
          <p><strong>Patient Name:</strong> {patient.name}</p>
          <p><strong>Patient ID:</strong> {patient.patient_id}</p>
          {doctor && (
            <p>
              <strong>Doctor:</strong> {doctor.name} | {doctor.specialty}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Charges Breakdown</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Tests Total:</span>
              <span className="font-medium">{formatCurrency(testsTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Services Total:</span>
              <span className="font-medium">{formatCurrency(servicesTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Surgeries Total:</span>
              <span className="font-medium">{formatCurrency(surgeriesTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Admission Fee ({admissionFee.length} admission{admissionFee.length !== 1 ? 's' : ''}):</span>
              <span className="font-medium">{formatCurrency(admissionFeeTotal)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span className="font-medium">{formatCurrency(grandTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span className="font-medium text-green-600">{formatCurrency(totalPayments)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Remaining Balance:</span>
              <span className="font-bold text-red-600">{formatCurrency(remainingAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-600">
        <p>Thank you for choosing our hospital. We wish you a speedy recovery!</p>
        <p>For any queries regarding this bill, please contact our billing department.</p>
      </div>
    </div>
  )
}