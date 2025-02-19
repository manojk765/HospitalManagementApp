import SurgeryForm from "@/components/forms/SurgeryForm"
import { createSurgery } from "../action"

export default function NewServicePage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Service</h1>
      <SurgeryForm onSubmit={createSurgery} />
    </div>
  )
} 