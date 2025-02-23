// TestsPage.tsx
"use client"
import { useState } from "react"
import { PatientTests } from "@prisma/client"

interface TestsPageProps {
  tests: PatientTests[]
  patientName: string
  patientId: string
}

export default function TestsPage({ tests, patientName, patientId }: TestsPageProps) {
  const formatCurrency = (value: number) => `₹${value.toFixed(2)}`
  const groupedTests = tests.reduce((acc: { [key: string]: PatientTests[] }, test) => {
    const date = new Date(test.test_date).toLocaleDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(test)
    return acc
  }, {})

  return (
    <div className="p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Medical Tests Report</h1>
        <div className="border-b pb-4">
          <p className="text-lg">Patient Name: {patientName}</p>
          <p className="text-lg">Patient ID: {patientId}</p>
        </div>
      </div>

      {Object.entries(groupedTests).map(([date, dateTests]) => (
        <div key={date} className="mb-8">
          <h2 className="text-xl font-bold mb-4">{date}</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Test Name</th>
                <th className="border p-2 text-left">Quantity</th>
                <th className="border p-2 text-right">Unit Price</th>
                <th className="border p-2 text-right">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {dateTests.map((test) => (
                <tr key={test.test_name} className="hover:bg-gray-50">
                  <td className="border p-2">{test.test_name}</td>
                  <td className="border p-2">{test.quantity}</td>
                  <td className="border p-2 text-right">
                    {formatCurrency(Number(test.total_cost) / test.quantity)}
                  </td>
                  <td className="border p-2 text-right">
                    {formatCurrency(Number(test.total_cost))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="mt-8 text-right">
        <p className="text-xl font-bold">
          Total Amount: {formatCurrency(tests.reduce((sum, test) => sum + Number(test.total_cost), 0))}
        </p>
      </div>
    </div>
  )
}