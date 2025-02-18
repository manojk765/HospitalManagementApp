import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { testName: string } }) {
  const testName = params.testName

  try {
    const test = await prisma.labTest.findUnique({
      where: { test_name: testName },
    })
    if (!test) {
      return NextResponse.json({ error: "Lab test not found" }, { status: 404 })
    }
    return NextResponse.json(test)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch lab test" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { testName: string } }) {
  const testName = params.testName
  const body = await req.json()
  const { description, cost } = body

  try {
    const updatedTest = await prisma.labTest.update({
      where: { test_name: testName },
      data: { description, cost },
    })
    return NextResponse.json(updatedTest)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update lab test" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { testName: string } }) {
  const testName = params.testName

  try {
    await prisma.labTest.delete({
      where: { test_name: testName },
    })
    return NextResponse.json({ message: "Lab test deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete lab test" }, { status: 500 })
  }
}

