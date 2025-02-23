// AdmissionsPage.tsx
"use client"

import { PatientAdmissionFee } from "@prisma/client"

interface AdmissionsPageProps {
  admissions: PatientAdmissionFee[]
  patientName: string
  patientId: string
}

export default function AdmissionsPage({ admissions, patientName, patientId }: AdmissionsPageProps) {
  const formatCurrency = (value: number) => `₹${value.toFixed(2)}`
  const groupedAdmissions = admissions.reduce((acc: { [key: string]: PatientAdmissionFee[] }, admission) => {
    const date = new Date(admission.admittedDate).toLocaleDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(admission)
    return acc
  }, {})

  return (
    <div className="p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Admissions Report</h1>
        <div className="border-b pb-4">
          <p className="text-lg">Patient Name: {patientName}</p>
          <p className="text-lg">Patient ID: {patientId}</p>
        </div>
      </div>

      {Object.entries(groupedAdmissions).map(([date, dateAdmissions]) => (
        <div key={date} className="mb-8">
          <h2 className="text-xl font-bold mb-4">{date}</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Room ID</th>
                <th className="border p-2 text-left">Admitted Date</th>
                <th className="border p-2 text-left">Discharge Date</th>
                <th className="border p-2 text-right">Total Days</th>
                <th className="border p-2 text-right">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {dateAdmissions.map((admission) => (
                <tr key={admission.room_id} className="hover:bg-gray-50">
                  <td className="border p-2">{admission.room_id}</td>
                  <td className="border p-2">
                    {new Date(admission.admittedDate).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    {new Date(admission.dischargeDate).toLocaleDateString()}
                  </td>
                  <td className="border p-2 text-right">{admission.totalDays}</td>
                  <td className="border p-2 text-right">
                    {formatCurrency(Number(admission.totalCost))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="mt-8 text-right">
        <p className="text-xl font-bold">
          Total Amount: {formatCurrency(admissions.reduce((sum, admission) => sum + Number(admission.totalCost), 0))}
        </p>
      </div>
    </div>
  )
}
