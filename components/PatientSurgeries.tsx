import type { PatientSurgery } from "@prisma/client";
 
export default function PatientSurgeries({ surgeries }: { surgeries: PatientSurgery[] }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Surgeries</h2>
      {surgeries.length === 0 ? (
        <p>No surgeries recorded for this patient.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {surgeries.map((surgery) => (
            <li className="py-4" key={surgery.surgery_name}>
              <div className="flex justify-between">
                <span className="font-medium">{surgery.surgery_name}</span>
                <span className="text-gray-600">{new Date(surgery.surgery_date).toLocaleDateString()}</span>
              </div>
              {/* <div className="mt-2">
                <p className="text-sm">{surgery.result_description}</p>
              </div> 
              <div className="text-sm text-gray-500 mt-1">Performed by: Dr. {surgery.doctor_id}</div> */}
              <div className="mt-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    surgery.is_paid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {surgery.is_paid ? "Paid" : "Unpaid"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
