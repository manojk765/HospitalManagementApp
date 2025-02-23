// PaymentsPage.tsx
"use client"
import { Payment } from "@prisma/client"

interface PaymentsPageProps {
  payments: Payment[]
  patientName: string
  patientId: string
}

export default function PaymentsPage({ payments, patientName, patientId }: PaymentsPageProps) {
  const formatCurrency = (value: number) => `₹${value.toFixed(2)}`

  const groupedPayments = payments.reduce((acc: { [key: string]: Payment[] }, payment) => {
    const date = new Date(payment.payment_date).toLocaleDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(payment)
    return acc
  }, {})

  return (
    <div className="p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Payments Report</h1>
        <div className="border-b pb-4">
          <p className="text-lg">Patient Name: {patientName}</p>
          <p className="text-lg">Patient ID: {patientId}</p>
        </div>
      </div>

      {Object.entries(groupedPayments).map(([date, datePayments]) => (
        <div key={date} className="mb-8">
          <h2 className="text-xl font-bold mb-4">{date}</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Payment ID</th>
                <th className="border p-2 text-left">Payment Date</th>
                <th className="border p-2 text-left">Payment Method</th>
                <th className="border p-2 text-right">Amount Paid</th>
                {/* <th className="border p-2 text-center">Status</th> */}
              </tr>
            </thead>
            <tbody>
              {datePayments.map((payment) => (
                <tr key={payment.payment_id} className="hover:bg-gray-50">
                  <td className="border p-2">{payment.payment_id}</td>
                  <td className="border p-2">{payment.payment_date.toLocaleDateString()}</td>
                  <td className="border p-2">{payment.payment_method}</td>
                  <td className="border p-2 text-right">
                    {formatCurrency(Number(payment.amount_paid))}
                  </td>
                  {/* <td className="border p-2 text-center">
                    <span className={`px-2 py-1 rounded ${payment.discharged ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {payment.discharged ? 'Discharged' : 'Pending'}
                    </span>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="mt-8 text-right">
        <p className="text-xl font-bold">
          Total Payments: {formatCurrency(payments.reduce((sum, payment) => sum + Number(payment.amount_paid), 0))}
        </p>
      </div>
    </div>
  )
}
