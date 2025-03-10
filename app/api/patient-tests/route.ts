import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const tests = await prisma.labTest.findMany({
      select: {
        test_name: true,
        cost: true,
        description: true,
      },
    })
    return NextResponse.json(tests)
  } catch (error) {
    console.error("Error fetching tests:", error)
    return NextResponse.json({ error: "Error fetching tests" }, { status: 500 })
  }
}

