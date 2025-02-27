import type React from "react"
import { useState } from "react"

interface Service {
  service_name: string
  cost: number
  description: string
}

interface Props {
  patientId: string
  services: Service[]
  onAddService: (service: {
    patient_id: string
    service_name: string
    service_date: string
    quantity: number
    total_cost: number
  }) => void
}

const ServiceForm: React.FC<Props> = ({ patientId, services, onAddService }) => {
  const [selectedService, setSelectedService] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [serviceDate, setServiceDate] = useState<string>(new Date().toISOString().split("T")[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const service = services.find((s) => s.service_name === selectedService)
    if (!service) return

    const totalCost = service.cost * quantity
    onAddService({
      patient_id: patientId,
      service_name: selectedService,
      service_date: serviceDate,
      quantity,
      total_cost: totalCost,
    })

    // Reset form
    setSelectedService("")
    setQuantity(1)
    setServiceDate(new Date().toISOString().split("T")[0])
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Add New Service</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
            Select Service
          </label>
          <select
            id="service"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            required
            className="block w-full p-2 border rounded"
          >
            <option value="">-- Select a Service --</option>
            {services.map((service) => (
              <option key={service.service_name} value={service.service_name}>
                {service.service_name} - ₹{service.cost}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            required
            className="block w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="serviceDate" className="block text-sm font-medium text-gray-700 mb-1">
            Service Date
          </label>
          <input
            type="date"
            id="serviceDate"
            value={serviceDate}
            onChange={(e) => setServiceDate(e.target.value)}
            required
            className="block w-full p-2 border rounded"
          />
        </div>
      </div>
      <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Add Service
      </button>
    </form>
  )
}

export default ServiceForm

