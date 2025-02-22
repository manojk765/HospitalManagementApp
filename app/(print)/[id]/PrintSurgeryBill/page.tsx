import prisma from "@/lib/prisma";
import { format } from "date-fns";

async function getPatientSurgeryData(id: string) {
  const patient = await prisma.patient.findUnique({
    where: { patient_id: id },
    include: {
      surgery: {
        include: {
          surgery: true, // Include surgery details
        },
      },
    },
  });
  return patient;
}

function groupByDate(items: any[]) {
  return items.reduce((acc, item) => {
    const date = format(new Date(item.surgery_date), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});
}

export default async function PrintSurgeryBillPage({ params }: { params: { id: string } }) {
  const patient = await getPatientSurgeryData(params.id);

  if (!patient) {
    return <div className="text-center text-2xl mt-10">Patient not found</div>;
  }

  const groupedSurgeries = groupByDate(patient.surgery);
  let totalBill = 0;

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Patient Surgery Bill</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Patient Information</h2>
          <p>Name: {patient.name}</p>
          <p>ID: {patient.patient_id}</p>
          <p>Contact: {patient.contact_number}</p>
        </div>

        {/* Surgeries Table */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Surgeries</h2>
          {Object.keys(groupedSurgeries).length > 0 ? (
            Object.keys(groupedSurgeries).map((date) => (
              <div key={date} className="mb-6">
                <h3 className="text-lg font-semibold">{date}</h3>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">Surgery Name</th>
                      <th className="border border-gray-300 px-4 py-2">Description</th>
                      <th className="border border-gray-300 px-4 py-2">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedSurgeries[date].map((surgery: any) => {
                      const surgeryCost = Number(surgery.surgery.cost);  
                      totalBill += surgeryCost;
                      return (
                        <tr key={surgery.surgery_name}>
                          <td className="border border-gray-300 px-4 py-2">{surgery.surgery_name}</td>
                          <td className="border border-gray-300 px-4 py-2">{surgery.surgery_description}</td>
                          <td className="border border-gray-300 px-4 py-2">₹{surgeryCost.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <p>No surgeries found.</p>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold">Total Bill: ₹{totalBill.toFixed(2)}</h3>
        </div>
        {/* <button
          onClick={() => window.print()}
          className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded print:hidden"
        >
          Print
        </button> */}
      </div>
    </>
  );
}
