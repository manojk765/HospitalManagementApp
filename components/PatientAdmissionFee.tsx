import prisma from "@/lib/prisma"
import { Decimal } from "@prisma/client/runtime/library.js"

async function getAdmissionFeeDetails(patientId: string) {
  const fees = await prisma.patientAdmissionFee.findMany({
    where: {
      patient_id: patientId,
      is_paid: false,
    },
    orderBy: {
      admittedDate: "desc",
    },
  })

  return fees
}

export default async function PatientAdmissionFee({ patientId }: { patientId: string }) {
  const admissionFeeDetails = await getAdmissionFeeDetails(patientId)

  const groupedFees = admissionFeeDetails.reduce(
    (acc, fee) => {
      const date = new Date(fee.admittedDate).toLocaleDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(fee)
      return acc
    },
    {} as Record<string, typeof admissionFeeDetails>,
  )

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Admission Fee Details</h2>
      {Object.entries(groupedFees).map(([date, fees]) => (
        <div key={date} className="mb-6 border-b pb-4">
          <h3 className="text-lg font-medium mb-2">{date}</h3>
          <ul className="space-y-2">
            {fees.map((fee) => (
              <li key={`₹{fee.patient_id}-${fee.room_id}-${fee.admittedDate}`} className="flex justify-between">
                <span>
                  Room {fee.room_id} ({fee.totalDays} days)
                </span>
                <span>₹{fee.totalCost.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 text-right font-semibold">
            Total: ₹{fees.reduce((sum, fee) => sum.add(fee.totalCost), new Decimal(0)).toFixed(2)}
          </div>
        </div>
      ))}
      <div className="mt-4 text-right font-bold text-lg">
        Grand Total: ₹{admissionFeeDetails.reduce((sum, fee) => sum.add(fee.totalCost), new Decimal(0)).toFixed(2)}
      </div>
    </div>
  )
}

