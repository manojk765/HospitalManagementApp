import prisma from "@/lib/prisma";

async function getPatientTests(patientId: string) {
  const tests = await prisma.patientTests.findMany({
    where: { patient_id: patientId },
    orderBy: { test_date: 'desc' }
  });
  return tests;
}

export default async function PatientLabTests({ patientId }: { patientId: string }) {
  const tests = await getPatientTests(patientId);
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Lab Tests</h2>
      {tests.length === 0 ? (
        <p>No lab tests recorded for this patient.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {tests.map((test) => (
            <li key={`${test.test_name}-${test.test_date}`} className="py-4">
              <div className="flex flex-col">
                <span className="text-gray-600">
                  {new Date(test.test_date).toLocaleDateString()}
                </span>
                <span className="font-medium">{test.test_name}</span>
              </div>
              <div className="mt-2">
                <p className="text-sm">{test.result_description}</p>
              </div>
              <div className="flex justify-between mt-2">
                <span>Quantity: {test.quantity}</span>
                <span>Total Cost: ${test.total_cost.toString()}</span>
              </div>
            </li> 
          ))}
        </ul>
      )}
    </div>
  );
}