import type { PatientService } from "@prisma/client"

export default function PatientServices({ services }: { services: PatientService[] }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Services Offered</h2>
      {services.length === 0 ? (
        <p>No services recorded for this patient.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {services.map((service) => ( 
            <li className="py-4">
              <div className="flex justify-between">
                <span className="font-medium">{service.service_name}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Quantity: {service.quantity}</span>
                <span>Total Cost: ${service.total_cost.toString()}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">{new Date(service.service_date).toLocaleDateString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

