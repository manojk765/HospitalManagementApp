import prisma from "@/lib/prisma"
import PatientBill from "./PatientBill"

async function getPatientData(id: string) {
  const patient = await prisma.patient.findUnique({
    where: { patient_id: id },
    include: {
      doctors: true,
    },
  })
  return patient 
}

async function getDoctorData(id: string) {
  const doctor = await prisma.doctor.findUnique({
    where: { doctor_id: id },
  })
  return doctor
}

async function getPatientTests(patientId: string) {
  const tests = await prisma.patientTests.findMany({
    where: { patient_id: patientId },
    orderBy: { test_date: "desc" },
  })
  return tests
}

async function getPatientServices(patientId: string) {
  const services = await prisma.patientService.findMany({
    where: { patient_id: patientId },
    orderBy: { service_date: "desc" },
  })
  return services
}

async function getPatientSurgeries(patientId: string) {
  const surgeries = await prisma.patientSurgery.findMany({
    where: { patient_id: patientId },
    orderBy: { surgery_date: "desc" },
  })
  return surgeries
}

async function getAdmissionFee(patientId: string) {
  const admissionFee = await prisma.patientAdmissionFee.findMany({
    where: { patient_id: patientId },
    orderBy: { admittedDate: "desc" },
  });
  return admissionFee;
}

async function getPayments(patientId: string) {
  const payments = await prisma.payment.findMany({
    where: { patient_id: patientId },
    orderBy: { payment_date: "desc" },
  });
  return payments;
}
export default async function PatientBillPage({ params }: { params: { id: string } }) {
  const patientId = params.id;
  const patient = await getPatientData(patientId);
  const doctor = patient?.doctors[0] ? await getDoctorData(patient.doctors[0].doctor_id) : null;
  const tests = await getPatientTests(patientId);
  const services = await getPatientServices(patientId);
  const surgeries = await getPatientSurgeries(patientId);
  const admissionFee = await getAdmissionFee(patientId);
  const payments = await getPayments(patientId);

  if (!patient) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-red-500">Patient not found</p>
      </div>
    );
  }

  return <PatientBill patient={patient} doctor={doctor} tests={tests} services={services} surgeries={surgeries} admissionFee={admissionFee} payments={payments} />;
}

