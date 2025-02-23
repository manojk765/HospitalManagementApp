// import prisma from "@/lib/prisma";
// import { format } from "date-fns";

// async function getPatientData(id: string) {
//   const patient = await prisma.patient.findUnique({
//     where: { patient_id: id },
//     include: {
//       prescriptions: true,
//     },
//   });
//   return patient;
// }

// function groupByDate(items: any[]) {
//   return items.reduce((acc, item) => {
//     const date = format(new Date(item.prescription_date), "yyyy-MM-dd");
//     if (!acc[date]) {
//       acc[date] = [];
//     }
//     acc[date].push(item);
//     return acc;
//   }, {});
// }

// export default async function PrintPrescriptionBill({ params }: { params: { id: string } }) {
//   const patient = await getPatientData(params.id);

//   if (!patient) {
//     return <div className="text-center text-2xl mt-10">Patient not found</div>;
//   }

//   const groupedPrescriptions = groupByDate(patient.prescriptions);
//   let totalBill = 0;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8 text-center">Prescription Bill</h1>
//       <div className="mb-4">
//         <h2 className="text-xl font-semibold">Patient Information</h2>
//         <p>Name: {patient.name}</p>
//         <p>ID: {patient.patient_id}</p>
//         <p>Contact: {patient.contact_number}</p>
//       </div>

//       <div className="mb-8">
//         <h2 className="text-xl font-semibold mb-4">Prescriptions</h2>
//         {Object.keys(groupedPrescriptions).length > 0 ? (
//           Object.keys(groupedPrescriptions).map((date) => (
//             <div key={date} className="mb-6">
//               <h3 className="text-lg font-semibold">{date}</h3>
//               <table className="w-full border-collapse border border-gray-300">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="border border-gray-300 px-4 py-2">Medicine Name</th>
//                     <th className="border border-gray-300 px-4 py-2">Quantity</th>
//                     <th className="border border-gray-300 px-4 py-2">Price per Unit</th>
//                     <th className="border border-gray-300 px-4 py-2">Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {groupedPrescriptions[date].map((prescription: any) => {
//                     const total = Number(prescription.price_per_unit) * Number(prescription.quantity);
//                     totalBill += total;
//                     return (
//                       <tr key={prescription.prescription_id}>
//                         <td className="border border-gray-300 px-4 py-2">{prescription.medicine_name}</td>
//                         <td className="border border-gray-300 px-4 py-2">{prescription.quantity}</td>
//                         <td className="border border-gray-300 px-4 py-2">${Number(prescription.price_per_unit).toFixed(2)}</td>
//                         <td className="border border-gray-300 px-4 py-2">${total.toFixed(2)}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ))
//         ) : (
//           <p>No prescriptions found.</p>
//         )}
//       </div>

//       <div className="mt-6">
//         <h3 className="text-xl font-semibold">Total Prescription Bill: ${totalBill.toFixed(2)}</h3>
//       </div>
//     </div>
//   );
// }

export default async function(){
  return(
    <h1>Currently On build</h1>
  )
}
