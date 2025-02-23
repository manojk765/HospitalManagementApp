"use client"

import type {
  Patient,
  Doctor, 
  PatientTests,
  PatientService,
  PatientSurgery,
  PatientAdmissionFee,
  Payment,
} from "@prisma/client"
import Decimal from "decimal.js"

interface PatientBillProps {
  patient: Patient & { doctors: { doctor_id: string }[] }
  doctor: Doctor | null
  tests: PatientTests[]
  services: PatientService[]
  surgeries: PatientSurgery[]
  admissionFee: PatientAdmissionFee[]
  payments: Payment[]
}

// Base interface for items with a date field
interface DateItem {
  [key: string]: unknown
}

// Interface for grouped items
interface GroupedItems<T extends DateItem> {
  [date: string]: T[]
}

const formatCurrency = (value: number) => `₹${value.toFixed(2)}`

const groupByDate = <T extends DateItem>(items: T[], dateField: keyof T): GroupedItems<T> => {
  return items.reduce((acc: GroupedItems<T>, item) => {
    const dateValue = item[dateField]
    if (dateValue instanceof Date || typeof dateValue === 'string') {
      const date = new Date(dateValue).toLocaleDateString()
      if (!acc[date]) acc[date] = []
      acc[date].push(item)
    }
    return acc
  }, {})
}

const calculateTotal = (items: { total_cost: Decimal | bigint }[]) =>
  items.reduce((sum, item) => sum + Number(item.total_cost), 0)

const calculatePaymentTotal = (payments: { amount_paid: Decimal | bigint }[]) =>
  payments.reduce((sum, payment) => sum + Number(payment.amount_paid), 0)

export default function PatientBill({
  patient,
  doctor,
  tests,
  services,
  surgeries,
  admissionFee,
  payments,
}: PatientBillProps) {
  const admissionFeeTotal = admissionFee.length > 0 ? Number(admissionFee[0].totalCost) : 0
  const testsTotal = calculateTotal(tests)
  const servicesTotal = calculateTotal(services)
  const surgeriesTotal = calculateTotal(surgeries)
  const totalPayments = calculatePaymentTotal(payments)
  const grandTotal = admissionFeeTotal + testsTotal + servicesTotal + surgeriesTotal
  const remainingAmount = grandTotal - totalPayments

  const groupedTests = groupByDate(tests, "test_date")
  const groupedServices = groupByDate(services, "service_date")
  const groupedSurgeries = groupByDate(surgeries, "surgery_date")
  const groupedAdmissions = groupByDate(admissionFee, "admittedDate")
  const groupedPayments = groupByDate(payments, "payment_date")

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-4">Patient Bill Summary</h1>
        <p><strong>Patient Name:</strong> {patient.name}</p>
        {doctor && (
          <p>
            <strong>Doctor:</strong> Dr. {doctor.name} | <strong>Contact:</strong> {doctor.contact_number} |{" "}
            <strong>Specialisation:</strong> {doctor.specialty}
          </p>
        )}
        <p><strong>Patient ID:</strong> {patient.patient_id}</p>
      </div>

      {/* Tests Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Tests</h2>
        {tests.length > 0 ? (
          Object.entries(groupedTests).map(([date, items]) => (
            <div key={date} className="mb-4">
              <h3 className="font-semibold">{date}</h3>
              <div className="grid grid-cols-4 gap-4 text-center font-semibold mb-2">
                <span>Test Name</span>
                <span>Quantity</span>
                <span>Unit Price</span>
                <span>Total Cost</span>
              </div>
              {items.map((test) => (
                <div key={test.test_name} className="grid grid-cols-4 gap-4 text-center">
                  <span>{test.test_name}</span>
                  <span>{test.quantity}</span>
                  <span>{formatCurrency(Number(test.total_cost) / test.quantity)}</span>
                  <span>{formatCurrency(Number(test.total_cost))}</span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>Currently, there are no tests for this patient.</p>
        )}
      </div>

      {/* Services Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Services</h2>
        {services.length > 0 ? (
          Object.entries(groupedServices).map(([date, items]) => (
            <div key={date} className="mb-4">
              <h3 className="font-semibold">{date}</h3>
              <div className="grid grid-cols-4 gap-4 text-center font-semibold mb-2">
                <span>Service Name</span>
                <span>Quantity</span>
                <span>Unit Price</span>
                <span>Total Cost</span>
              </div>
              {items.map((service) => (
                <div key={service.service_name} className="grid grid-cols-4 gap-4 text-center">
                  <span>{service.service_name}</span>
                  <span>{service.quantity}</span>
                  <span>{formatCurrency(Number(service.total_cost) / service.quantity)}</span>
                  <span>{formatCurrency(Number(service.total_cost))}</span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>Currently, there are no services for this patient.</p>
        )}
      </div>

      {/* Surgeries Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Surgeries</h2>
        {surgeries.length > 0 ? (
          Object.entries(groupedSurgeries).map(([date, items]) => (
            <div key={date} className="mb-4">
              <h3 className="font-semibold">{date}</h3>
              <div className="grid grid-cols-4 gap-4 text-center font-semibold mb-2">
                <span>Surgery Name</span>
                <span>Quantity</span>
                <span>Unit Price</span>
                <span>Total Cost</span>
              </div>
              {items.map((surgery) => (
                <div key={surgery.surgery_name} className="grid grid-cols-4 gap-4 text-center">
                  <span>{surgery.surgery_name}</span>
                  <span>{surgery.quantity}</span>
                  <span>{formatCurrency(Number(surgery.total_cost) / surgery.quantity)}</span>
                  <span>{formatCurrency(Number(surgery.total_cost))}</span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>Currently, there are no surgeries for this patient.</p>
        )}
      </div>

      {/* Admissions Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Admissions</h2>
        {admissionFee.length > 0 ? (
          Object.entries(groupedAdmissions).map(([date, items]) => (
            <div key={date} className="mb-4">
              <h3 className="font-semibold">{date}</h3>
              <div className="grid grid-cols-5 gap-4 text-center font-semibold mb-2">
                <span>Room ID</span>
                <span>Admitted Date</span>
                <span>Discharge Date</span>
                <span>Total Days</span>
                <span>Total Cost</span>
              </div>
              {items.map((admission) => (
                <div key={admission.room_id} className="grid grid-cols-5 gap-4 text-center">
                  <span>{admission.room_id}</span>
                  <span>{new Date(admission.admittedDate).toLocaleDateString()}</span>
                  <span>{new Date(admission.dischargeDate).toLocaleDateString()}</span>
                  <span>{admission.totalDays}</span>
                  <span>{formatCurrency(Number(admission.totalCost))}</span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>Currently, there are no admissions for this patient.</p>
        )}
      </div>

      {/* Payments Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Payments</h2>
        {payments.length > 0 ? (
          Object.entries(groupedPayments).map(([date, items]) => (
            <div key={date} className="mb-4">
              <h3 className="font-semibold">{date}</h3>
              <div className="grid grid-cols-3 gap-4 text-center font-semibold mb-2">
                <span>Payment ID</span>
                <span>Payment Method</span>
                <span>Amount Paid</span>
              </div>
              {items.map((payment) => (
                <div key={payment.payment_id} className="grid grid-cols-3 gap-4 text-center">
                  <span>{payment.payment_id}</span>
                  <span>{payment.payment_method}</span>
                  <span>{formatCurrency(Number(payment.amount_paid))}</span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>Currently, there are no payments for this patient.</p>
        )}
      </div>

      {/* Grand Total and Remaining Balance */}
      <div className="mt-8 border-t pt-4">
        <h2 className="text-2xl font-bold mb-2">Grand Total: {formatCurrency(grandTotal)}</h2>
        <h2 className="text-2xl font-bold mb-2">Remaining Amount: {formatCurrency(remainingAmount)}</h2>
      </div>

      <div className="mt-8 text-center text-sm text-gray-600">
        <p>Thank you for choosing our hospital. We wish you a speedy recovery!</p>
        <p>For any queries regarding this bill, please contact our billing department.</p>
      </div>
    </div>
  )
}