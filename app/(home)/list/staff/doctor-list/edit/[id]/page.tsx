import DoctorForm from "@/components/forms/NewDoctorForm"
import prisma from "@/lib/prisma"

export default async function EditDoctorPage({ params }: { params: { id: string } }) {
  const doctor = await prisma.doctor.findUnique({
    where: { doctor_id: params.id },
    include: { department: true },
  })

  if (!doctor) {
    return <div>Doctor not found</div>
  }

  return <DoctorForm doctor={doctor} isEdit={true} />
}

