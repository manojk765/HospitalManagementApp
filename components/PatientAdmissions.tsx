import prisma from "@/lib/prisma";
import Link from "next/link";

async function getAdmissionDetails(patientId: string) {
    const admissions = await prisma.admission.findMany({
        where: {
            patient_id: patientId,
            dischargeDate: null,
        },
        orderBy: {
            admittedDate: 'desc',
        },
    });

    console.log(admissions)
    return admissions;
}

export default async function AdmissionComponent({ patientId }: { patientId : string }) {
    const admissions = await getAdmissionDetails(patientId);
 
    if( admissions.length === 0){
        return(
            <h2 className="p-6text-2xl font-semibold mb-4">No Current Active Admissions for the patient.</h2>
        )
    }
    return (
        <div className="p-6 bg-gray-50">
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Current Active Admissions</h2>
                <div className="bg-white shadow-md rounded-lg p-4">
                    {admissions.map((admission) => (
                        <div key={`${admission.patient_id}-${admission.room_id}-${admission.admittedDate}`} className="mb-4">
                            <p><strong>Room ID:</strong> {admission.room_id}</p>
                            <p><strong>Admitted Date:</strong> {new Date(admission.admittedDate).toLocaleDateString()}</p>
                            <p><strong>
                                <Link href={`/list/patients/${admission.patient_id}/add-admission`}> 
                                    Discharge
                                </Link>    
                            </strong></p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
