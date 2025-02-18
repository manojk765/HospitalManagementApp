import prisma from "@/lib/prisma";
import { format } from "date-fns";

async function getPatientData(id: string) {
  const patient = await prisma.patient.findUnique({
    where: { patient_id: id },
    include: {
      services: true,
    },
  });
  return patient;
}

function groupByDate(items: any[]) {
  return items.reduce((acc, item) => {
    const date = format(new Date(item.service_date), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});
}

export default async function PrintServiceBill({ params }: { params: { id: string } }) {
  const patient = await getPatientData(params.id);

  if (!patient) {
    return <div className="text-center text-2xl mt-10">Patient not found</div>;
  }

  const groupedServices = groupByDate(patient.services);
  let totalBill = 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Service Bill</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Patient Information</h2>
        <p>Name: {patient.name}</p>
        <p>ID: {patient.patient_id}</p>
        <p>Contact: {patient.contact_number}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Services</h2>
        {Object.keys(groupedServices).length > 0 ? (
          Object.keys(groupedServices).map((date) => (
            <div key={date} className="mb-6">
              <h3 className="text-lg font-semibold">{date}</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">Service Name</th>
                    <th className="border border-gray-300 px-4 py-2">Quantity</th>
                    {/* <th className="border border-gray-300 px-4 py-2">Price</th> */}
                    <th className="border border-gray-300 px-4 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedServices[date].map((service: any) => {
                    totalBill += Number(service.total_cost);
                    return (
                      <tr key={service.service_id}>
                        <td className="border border-gray-300 px-4 py-2">{service.service_name}</td>
                        <td className="border border-gray-300 px-4 py-2">{service.quantity}</td>
                        {/* <td className="border border-gray-300 px-4 py-2">${Number(service.cost).toFixed(2)}</td> */}
                        <td className="border border-gray-300 px-4 py-2">${Number(service.total_cost).toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p>No services found.</p>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold">Total Service Bill: ${totalBill.toFixed(2)}</h3>
      </div>
    </div>
  );
}
