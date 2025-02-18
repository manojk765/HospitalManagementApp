import type { PatientTests } from "@prisma/client"
 
 
export default function PatientLabTests({ tests }: { tests: PatientTests[] }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Lab Tests</h2>
      {tests.length === 0 ? (
        <p>No lab tests recorded for this patient.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {tests.map((test) => (
            <li className="py-4">
              <div className="flex flex-col">
                <span className="text-gray-600">{new Date(test.test_date).toLocaleDateString()}</span>
                <span className="font-medium">{test.test_name}</span>
              </div>
              <div className="mt-2">
                <p className="text-sm">{test.result_description}</p>
              </div>
              <div className="flex justify-between mt-2">
                <span>Quantity: {test.quantity}</span>
                <span>Total Cost: ${test.total_cost.toString()}</span>
              </div>
              {/* <div className="text-sm text-gray-500 mt-1">Ordered by: Dr. {test.doctor_id}</div> */}
              {/* <div className="mt-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${test.is_paid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {test.is_paid ? "Paid" : "Unpaid"}
                </span>
              </div> */}
            </li> 
          ))}
        </ul>
      )}
    </div>
  )
}