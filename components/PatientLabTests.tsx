import type { Prisma } from "@prisma/client"

type PatientTestWithRelations = Prisma.PatientTestsGetPayload<{
  include: {
    doctor: true
    labTest: true
  }
}>
 
export default function PatientLabTests({ tests }: { tests: PatientTestWithRelations[] }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Lab Tests</h2>
      {tests.length === 0 ? (
        <p>No lab tests recorded for this patient.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {tests.map((test) => (
            <li key={test.result_id} className="py-4">
              <div className="flex justify-between">
                <span className="font-medium">{test.labTest.test_name}</span>
                <span className="text-gray-600">{new Date(test.test_date).toLocaleDateString()}</span>
              </div>
              <div className="mt-2">
                <p className="text-sm">{test.result_description}</p>
              </div>
              <div className="text-sm text-gray-500 mt-1">Ordered by: Dr. {test.doctor.name}</div>
              <div className="mt-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${test.is_paid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {test.is_paid ? "Paid" : "Unpaid"}
                </span>
              </div>
            </li> 
          ))}
        </ul>
      )}
    </div>
  )
}