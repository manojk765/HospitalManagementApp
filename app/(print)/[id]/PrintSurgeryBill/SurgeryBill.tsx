
// SurgeriesPage.tsx
"use client"
import { PatientSurgery } from "@prisma/client"

interface SurgeriesPageProps {
  surgeries: PatientSurgery[]
  patientName: string
  patientId: string
}

export default function SurgeriesPage({ surgeries, patientName, patientId }: SurgeriesPageProps) {
  const formatCurrency = (value: number) => `₹${value.toFixed(2)}`
  const groupedSurgeries = surgeries.reduce((acc: { [key: string]: PatientSurgery[] }, surgery) => {
    const date = new Date(surgery.surgery_date).toLocaleDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(surgery)
    return acc
  }, {})

  return (
    <div className="p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Surgeries Report</h1>
        <div className="border-b pb-4">
          <p className="text-lg">Patient Name: {patientName}</p>
          <p className="text-lg">Patient ID: {patientId}</p>
        </div>
      </div>

      {Object.entries(groupedSurgeries).map(([date, dateSurgeries]) => (
        <div key={date} className="mb-8">
          <h2 className="text-xl font-bold mb-4">{date}</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Surgery Name</th>
                <th className="border p-2 text-left">Quantity</th>
                <th className="border p-2 text-right">Unit Price</th>
                <th className="border p-2 text-right">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {dateSurgeries.map((surgery) => (
                <tr key={surgery.surgery_name} className="hover:bg-gray-50">
                  <td className="border p-2">{surgery.surgery_name}</td>
                  <td className="border p-2">{surgery.quantity}</td>
                  <td className="border p-2 text-right">
                    {formatCurrency(Number(surgery.total_cost) / surgery.quantity)}
                  </td>
                  <td className="border p-2 text-right">
                    {formatCurrency(Number(surgery.total_cost))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="mt-8 text-right">
        <p className="text-xl font-bold">
          Total Amount: {formatCurrency(surgeries.reduce((sum, surgery) => sum + Number(surgery.total_cost), 0))}
        </p>
      </div>
    </div>
  )
}
