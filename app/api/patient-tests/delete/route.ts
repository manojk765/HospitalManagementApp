import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const patient_id = searchParams.get("patient_id")
    const test_name = searchParams.get("test_name")
    const test_date = searchParams.get("test_date")

    if (!patient_id || !test_name || !test_date) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    await prisma.patientTests.delete({
      where: {
        patient_id_test_name_test_date: {
          patient_id,
          test_name,
          test_date: new Date(test_date),
        },
      },
    })

    return NextResponse.json({ message: "Test deleted successfully" })
  } catch (error) {
    console.error("Error deleting test:", error)
    return NextResponse.json({ error: "Error deleting test" }, { status: 500 })
  }
}

