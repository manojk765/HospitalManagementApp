import type React from "react"

interface PatientService {
  patient_id: string
  service_name: string
  service_date: string
  quantity: number
  total_cost: number
  is_paid: boolean
}

interface Props {
  services: PatientService[]
  onServiceUpdated: () => void
}

const ServiceList: React.FC<Props> = ({ services, onServiceUpdated }) => {
  const handleDeleteService = async (service: PatientService) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        const response = await fetch("/api/patient-services", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patient_id: service.patient_id,
            service_name: service.service_name,
            service_date: service.service_date,
          }),
        })
        if (!response.ok) throw new Error("Failed to delete service")
        onServiceUpdated()
      } catch (error) {
        console.error("Error deleting service:", error)
      }
    }
  }

  const handleTogglePaid = async (service: PatientService) => {
    try {
      const response = await fetch("/api/patient-services", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...service,
          is_paid: !service.is_paid,
        }),
      })
      if (!response.ok) throw new Error("Failed to update service")
      onServiceUpdated()
    } catch (error) {
      console.error("Error updating service:", error)
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Patient Services</h2>
      {services.length === 0 ? (
        <p className="text-gray-500">No services recorded for this patient.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map((service) => (
              <tr key={`${service.service_name}-${service.service_date}`}>
                <td className="px-6 py-4 whitespace-nowrap">{service.service_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(service.service_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{service.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{service.total_cost.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      service.is_paid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {service.is_paid ? "Paid" : "Unpaid"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleTogglePaid(service)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Toggle Paid
                  </button>
                  <button onClick={() => handleDeleteService(service)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ServiceList

