import TestForm from "@/components/forms/TestForm"
import { updateTest } from "../action"
import prisma from "@/lib/prisma"

type Params =  Promise<{ test_name : string }> 

export default async function EditServicePage( props : {params : Params }) {
  const params = await props.params
  const testName = decodeURIComponent(params.test_name);

  const test = await prisma.labTest.findUnique({
    where: { test_name : testName },
  })

  if (!test) {
    return <div>Service not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Service</h1>
      <TestForm initialData={test} onSubmit={updateTest} />
    </div>
  )
}
 