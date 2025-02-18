import ServiceForm from "@/components/forms/ServiceForm"
import { createService } from "../action"

export default function NewServicePage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Service</h1>
      <ServiceForm onSubmit={createService} />
    </div>
  )
}