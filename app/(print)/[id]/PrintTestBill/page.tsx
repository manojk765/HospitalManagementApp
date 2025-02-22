import prisma from "@/lib/prisma";
import { format } from "date-fns";

async function getPatientData(id: string) {
  const patient = await prisma.patient.findUnique({
    where: { patient_id: id },
    include: {
      tests: {
        include: {
          labTest: true,
        },
      },
    },
  });
  return patient;
}

function groupByDate(items: any[]) {
  return items.reduce((acc, item) => {
    const date = format(new Date(item.test_date), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});
}

export default async function PrintTestBill({ params }: { params: { id: string } }) {
  const patient = await getPatientData(params.id);

  if (!patient) {
    return <div className="text-center text-2xl mt-10">Patient not found</div>;
  }

  const groupedTests = groupByDate(patient.tests);
  let totalBill = 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Test Bill</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Patient Information</h2>
        <p>Name: {patient.name}</p>
        <p>ID: {patient.patient_id}</p>
        <p>Contact: {patient.contact_number}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Tests</h2>
        {Object.keys(groupedTests).length > 0 ? (
          Object.keys(groupedTests).map((date) => (
            <div key={date} className="mb-6">
              <h3 className="text-lg font-semibold">{date}</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">Test Name</th>
                    <th className="border border-gray-300 px-4 py-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedTests[date].map((test: any) => {
                    totalBill += Number(test.labTest.cost);
                    return (
                      <tr key={test.test_id}>
                        <td className="border border-gray-300 px-4 py-2">{test.labTest.test_name}</td>
                        <td className="border border-gray-300 px-4 py-2">₹{Number(test.labTest.cost).toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p>No tests found.</p>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold">Total Test Bill: ₹{totalBill.toFixed(2)}</h3>
      </div>
    </div>
  );
}
