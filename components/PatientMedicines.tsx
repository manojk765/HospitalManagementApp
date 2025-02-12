import type { Prisma } from "@prisma/client"

type PrescriptionWithDoctor = Prisma.PrescriptionGetPayload<{
  include: {
    doctor: true
  }
}>

export default function PatientMedicines({ prescriptions }: { prescriptions: PrescriptionWithDoctor[] }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Prescribed Medicines</h2>
      {prescriptions.length === 0 ? (
        <p>No prescriptions recorded for this patient.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {prescriptions.map((prescription) => (
            <li key={prescription.prescription_id} className="py-4">
              <div className="flex justify-between">
                <span className="font-medium">{prescription.medicine_name}</span>
                <span className="text-gray-600">{new Date(prescription.prescription_date).toLocaleDateString()}</span>
              </div>
              <div className="mt-2">
                <p>Dosage: {prescription.dosage}</p>
                <p>
                  Duration: {prescription.duration} {prescription.duration_type}
                </p>
              </div>
              <div className="text-sm text-gray-500 mt-1">Prescribed by: Dr. {prescription.doctor.name}</div>
              <div className="mt-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${prescription.is_paid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {prescription.is_paid ? "Paid" : "Unpaid"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

