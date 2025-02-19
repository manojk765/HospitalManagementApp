import type { Patient, Doctor, PatientTests, PatientService, PatientSurgery } from "@prisma/client"

interface PatientBillProps {
  patient: Patient & { doctors: { doctor_id: string }[] }
  doctor: Doctor | null
  tests: PatientTests[]
  services: PatientService[]
  surgeries: PatientSurgery[]
}

export default function PatientBill({ patient, doctor, tests, services, surgeries }: PatientBillProps) {
  const calculateTotal = (items: { total_cost: number | bigint }[]) => {
    return items.reduce((sum, item) => sum + Number(item.total_cost), 0)
  }

  const testsTotal = calculateTotal(tests.map(test => ({
    ...test,
    total_cost: test.total_cost.toNumber()
  })));
  
  const servicesTotal = calculateTotal(services.map(service => ({
    ...service,
    total_cost: service.total_cost.toNumber() 
  })));
  
  const surgeriesTotal = calculateTotal(surgeries.map(surgery => ({
    ...surgery,
    total_cost: surgery.total_cost.toNumber() 
  })));
  
  const grandTotal = testsTotal + servicesTotal + surgeriesTotal

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Hospital Bill</h1>
        <p className="text-gray-600">Bill Date: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Patient Information</h2>
          <p>
            <span className="font-medium">Name:</span> {patient.name}
          </p>
          <p>
            <span className="font-medium">ID:</span> {patient.patient_id}
          </p>
          <p>
            <span className="font-medium">Gender:</span> {patient.gender}
          </p>
          <p>
            <span className="font-medium">Age:</span> {patient.age}
          </p>
          <p>
            <span className="font-medium">Date of Birth:</span> {new Date(patient.date_of_birth).toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium">Contact:</span> {patient.contact_number}
          </p>
          <p>
            <span className="font-medium">Email:</span> {patient.email || "N/A"}
          </p>
          <p>
            <span className="font-medium">Address:</span>{" "}
            {`${patient.address || ""}, ${patient.city || ""}, ${patient.state || ""} ${patient.zip_code || ""}`}
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Doctor Information</h2>
          {doctor ? (
            <>
              <p>
                <span className="font-medium">Name:</span> {doctor.name}
              </p>
              <p>
                <span className="font-medium">ID:</span> {doctor.doctor_id}
              </p>
              <p>
                <span className="font-medium">Specialty:</span> {doctor.specialty}
              </p>
              <p>
                <span className="font-medium">Contact:</span> {doctor.contact_number}
              </p>
              <p>
                <span className="font-medium">Email:</span> {doctor.email || "N/A"}
              </p>
            </>
          ) : (
            <p>No doctor assigned</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Lab Tests</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2">Test Name</th>
              <th className="text-left p-2">Date</th>
              <th className="text-right p-2">Quantity</th>
              <th className="text-right p-2">Cost</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => (
              <tr key={`${test.test_name}-${test.test_date}`} className="border-b">
                <td className="p-2">{test.test_name}</td>
                <td className="p-2">{new Date(test.test_date).toLocaleDateString()}</td>
                <td className="p-2 text-right">{test.quantity}</td>
                <td className="p-2 text-right">${Number(test.total_cost).toFixed(2)}</td>
              </tr>
            ))}
            <tr className="font-semibold">
              <td colSpan={3} className="p-2 text-right">
                Total:
              </td>
              <td className="p-2 text-right">${testsTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Services</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2">Service Name</th>
              <th className="text-left p-2">Date</th>
              <th className="text-right p-2">Quantity</th>
              <th className="text-right p-2">Cost</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={`${service.service_name}-${service.service_date}`} className="border-b">
                <td className="p-2">{service.service_name}</td>
                <td className="p-2">{new Date(service.service_date).toLocaleDateString()}</td>
                <td className="p-2 text-right">{service.quantity}</td>
                <td className="p-2 text-right">${Number(service.total_cost).toFixed(2)}</td>
              </tr>
            ))}
            <tr className="font-semibold">
              <td colSpan={3} className="p-2 text-right">
                Total:
              </td>
              <td className="p-2 text-right">${servicesTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Surgeries</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2">Surgery Name</th>
              <th className="text-left p-2">Date</th>
              <th className="text-right p-2">Quantity</th>
              <th className="text-right p-2">Cost</th>
            </tr>
          </thead>
          <tbody>
            {surgeries.map((surgery) => (
              <tr key={`${surgery.surgery_name}-${surgery.surgery_date}`} className="border-b">
                <td className="p-2">{surgery.surgery_name}</td>
                <td className="p-2">{new Date(surgery.surgery_date).toLocaleDateString()}</td>
                <td className="p-2 text-right">{surgery.quantity}</td>
                <td className="p-2 text-right">${Number(surgery.total_cost).toFixed(2)}</td>
              </tr>
            ))}
            <tr className="font-semibold">
              <td colSpan={3} className="p-2 text-right">
                Total:
              </td>
              <td className="p-2 text-right">${surgeriesTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 border-t pt-4">
        <h2 className="text-2xl font-bold mb-2">Grand Total</h2>
        <table className="w-full">
          <tbody>
            <tr>
              <td className="p-2">Lab Tests Total:</td>
              <td className="p-2 text-right">${testsTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="p-2">Services Total:</td>
              <td className="p-2 text-right">${servicesTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="p-2">Surgeries Total:</td>
              <td className="p-2 text-right">${surgeriesTotal.toFixed(2)}</td>
            </tr>
            <tr className="font-bold text-lg">
              <td className="p-2">Grand Total:</td>
              <td className="p-2 text-right">${grandTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-center text-sm text-gray-600">
        <p>Thank you for choosing our hospital. We wish you a speedy recovery!</p>
        <p>For any queries regarding this bill, please contact our billing department.</p>
      </div>
    </div>
  )
}

