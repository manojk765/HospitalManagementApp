import DoctorForm from "@/components/forms/NewDoctorForm"
import prisma from "@/lib/prisma"

type Params = Promise<{id: string}>

export default async function EditDoctorPage(  props :{params: Params} ) {
  const params = await props.params
  
  const doctor = await prisma.doctor.findUnique({
    where: { doctor_id: params.id },
    include: { department: true },
  })

  if (!doctor) {
    return <div>Doctor not found</div>
  }

  return <DoctorForm doctor={doctor} isEdit={true} />
}

