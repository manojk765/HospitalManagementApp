// ServicesPage.tsx
"use client"
import { PatientService } from "@prisma/client"

interface ServicesPageProps {
  services: PatientService[]
  patientName: string
  patientId: string
}

export default function ServicesPage({ services, patientName, patientId }: ServicesPageProps) {
  const formatCurrency = (value: number) => `₹${value.toFixed(2)}`
  const groupedServices = services.reduce((acc: { [key: string]: PatientService[] }, service) => {
    const date = new Date(service.service_date).toLocaleDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(service)
    return acc
  }, {})

  return (
    <div className="p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Medical Services Report</h1>
        <div className="border-b pb-4">
          <p className="text-lg">Patient Name: {patientName}</p>
          <p className="text-lg">Patient ID: {patientId}</p>
        </div>
      </div>

      {Object.entries(groupedServices).map(([date, dateServices]) => (
        <div key={date} className="mb-8">
          <h2 className="text-xl font-bold mb-4">{date}</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Service Name</th>
                <th className="border p-2 text-left">Quantity</th>
                <th className="border p-2 text-right">Unit Price</th>
                <th className="border p-2 text-right">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {dateServices.map((service) => (
                <tr key={service.service_name} className="hover:bg-gray-50">
                  <td className="border p-2">{service.service_name}</td>
                  <td className="border p-2">{service.quantity}</td>
                  <td className="border p-2 text-right">
                    {formatCurrency(Number(service.total_cost) / service.quantity)}
                  </td>
                  <td className="border p-2 text-right">
                    {formatCurrency(Number(service.total_cost))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="mt-8 text-right">
        <p className="text-xl font-bold">
          Total Amount: {formatCurrency(services.reduce((sum, service) => sum + Number(service.total_cost), 0))}
        </p>
      </div>
    </div>
  )
}