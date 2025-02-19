import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { patient_id, test_name, quantity, total_cost, test_date, result_description } = body

    const newTest = await prisma.patientTests.create({
      data: {
        patient_id,
        test_name,
        quantity,
        total_cost,
        test_date: new Date(test_date),
        result_description,
        is_paid: false,
      },
    })

    return NextResponse.json(newTest)
  } catch (error) {
    console.error("Error creating test:", error)
    return NextResponse.json({ error: "Error creating test" }, { status: 500 })
  }
}

