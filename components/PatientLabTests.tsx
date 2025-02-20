import prisma from "@/lib/prisma"
import { Decimal } from "@prisma/client/runtime/library.js"

async function getPatientTests(patientId: string) {
  const tests = await prisma.patientTests.findMany({
    where: {
      patient_id: patientId,
      is_paid: false,
    },
    orderBy: { test_date: "desc" },
  })
  return tests
}

export default async function PatientLabTests({ patientId }: { patientId: string }) {
  const tests = await getPatientTests(patientId)

  const groupedTests = tests.reduce(
    (acc, test) => {
      const date = new Date(test.test_date).toLocaleDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(test)
      return acc
    },
    {} as Record<string, typeof tests>,
  )

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Lab Tests</h2>
      {Object.entries(groupedTests).map(([date, dateTests]) => (
        <div key={date} className="mb-6 border-b pb-4">
          <h3 className="text-lg font-medium mb-2">{date}</h3>
          <ul className="space-y-2">
            {dateTests.map((test) => (
              <li key={`₹{test.test_name}-₹{test.test_date}`} className="flex justify-between">
                <span>
                  {test.test_name} (x{test.quantity})
                </span>
                <span>₹{test.total_cost.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 text-right font-semibold">
            Total: ₹{dateTests.reduce((sum, test) => sum.add(test.total_cost), new Decimal(0)).toFixed(2)}
          </div>
        </div>
      ))}
      <div className="mt-4 text-right font-bold text-lg">
        Grand Total: ₹{tests.reduce((sum, test) => sum.add(test.total_cost), new Decimal(0)).toFixed(2)}
      </div>
    </div>
  )
}

