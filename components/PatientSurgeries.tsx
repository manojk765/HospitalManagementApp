import prisma from "@/lib/prisma"
import { Decimal } from "@prisma/client/runtime/library.js"

async function getPatientSurgeries(patientId: string) {
  const surgeries = await prisma.patientSurgery.findMany({
    where: {
      patient_id: patientId,
      is_paid: false,
    },
    orderBy: { surgery_date: "desc" },
  })
  return surgeries
}

export default async function PatientSurgeries({ patientId }: { patientId: string }) {
  const surgeries = await getPatientSurgeries(patientId)

  const groupedSurgeries = surgeries.reduce(
    (acc, surgery) => {
      const date = new Date(surgery.surgery_date).toLocaleDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(surgery)
      return acc
    },
    {} as Record<string, typeof surgeries>,
  )

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Surgeries</h2>
      {Object.entries(groupedSurgeries).map(([date, dateSurgeries]) => (
        <div key={date} className="mb-6 border-b pb-4">
          <h3 className="text-lg font-medium mb-2">{date}</h3>
          <ul className="space-y-2">
            {dateSurgeries.map((surgery) => (
              <li key={`₹{surgery.surgery_name}-₹{surgery.surgery_date}`} className="flex justify-between">
                <span>
                  {surgery.surgery_name} (x{surgery.quantity})
                </span>
                <span>₹{surgery.total_cost.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 text-right font-semibold">
            Total: ₹{dateSurgeries.reduce((sum, surgery) => sum.add(surgery.total_cost), new Decimal(0)).toFixed(2)}
          </div>
        </div>
      ))}
      <div className="mt-4 text-right font-bold text-lg">
        Grand Total: ₹{surgeries.reduce((sum, surgery) => sum.add(surgery.total_cost), new Decimal(0)).toFixed(2)}
      </div>
    </div>
  )
}

