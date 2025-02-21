import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library.js";

// Function to get the patient's payment history
async function getPatientPayments(patientId: string) {
  const payments = await prisma.payment.findMany({
    where: {
      patient_id: patientId,
    },
    orderBy: {
      payment_date: "desc",
    },
  });
  return payments;
}

export default async function PatientPaymentsPage({ patientId }: { patientId: string }) {
  const payments = await getPatientPayments(patientId);

  // Grouping payments by date
  const groupedPayments = payments.reduce((acc, payment) => {
    const date = new Date(payment.payment_date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(payment);
    return acc;
  }, {} as Record<string, typeof payments>);

  // Rendering the grouped payments
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Payments</h2>
      {Object.entries(groupedPayments).map(([date, datePayments]) => (
        <div key={date} className="mb-6 border-b pb-4">
          <h3 className="text-lg font-medium mb-2">{date}</h3>
          <ul className="space-y-2">
            {datePayments.map((payment) => (
              <li key={`₹{payment.id}-₹{payment.payment_date}`} className="flex justify-between">
                <span>₹{payment.amount_paid.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 text-right font-semibold">
            Total: ₹
            {datePayments
              .reduce((sum, payment) => sum.add(payment.amount_paid), new Decimal(0))
              .toFixed(2)}
          </div>
        </div>
      ))}
      <div className="mt-4 text-right font-bold text-lg">
        Grand Total: ₹
        {payments.reduce((sum, payment) => sum.add(payment.amount_paid), new Decimal(0)).toFixed(2)}
      </div>
    </div>
  );
}
