import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

async function getPatientServices(patientId: string) {
  const services = await prisma.patientService.findMany({
    where: { 
      patient_id: patientId,
      is_paid: false
    },
    orderBy: { service_date: 'desc' }
  });
  return services;
}

export default async function PatientServices({ patientId }: { patientId: string }) {
  const services = await getPatientServices(patientId);

  const groupedServices = services.reduce((acc, service) => {
    const date = new Date(service.service_date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(service);
    return acc;
  }, {} as Record<string, typeof services>);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Services Offered</h2>
      {Object.entries(groupedServices).map(([date, dateServices]) => (
        <div key={date} className="mb-6 border-b pb-4">
          <h3 className="text-lg font-medium mb-2">{date}</h3>
          <ul className="space-y-2">
            {dateServices.map((service) => (
              <li key={`₹{service.service_name}`} className="flex justify-between">
                <span>{service.service_name} (x{service.quantity})</span>
                <span>₹{service.total_cost.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 text-right font-semibold">
            Total: ₹{dateServices.reduce((sum, service) => sum.add(service.total_cost), new Decimal(0)).toFixed(2)}
          </div>
        </div>
      ))}
      <div className="mt-4 text-right font-bold text-lg">
        Grand Total: ₹{services.reduce((sum, service) => sum.add(service.total_cost), new Decimal(0)).toFixed(2)}
      </div>
    </div>
  );
}
