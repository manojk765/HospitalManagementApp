import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const patient_id = searchParams.get("patient_id")
    const test_name = searchParams.get("test_name")
    const test_date = searchParams.get("test_date")

    const body = await req.json()
    const { quantity, total_cost, result_description } = body

    if (!patient_id || !test_name || !test_date) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const updatedTest = await prisma.patientTests.update({
      where: {
        patient_id_test_name_test_date: {
          patient_id,
          test_name,
          test_date: new Date(test_date),
        },
      },
      data: {
        quantity,
        total_cost,
        result_description,
      },
    })

    return NextResponse.json(updatedTest)
  } catch (error) {
    console.error("Error updating test:", error)
    return NextResponse.json({ error: "Error updating test" }, { status: 500 })
  }
}

