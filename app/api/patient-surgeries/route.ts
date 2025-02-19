import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const surgeries = await prisma.surgery.findMany({
      select: {
        surgery_name: true,
        cost : true,
        description : true,
      },
    })
    return NextResponse.json(surgeries)
  } catch (error) {
    console.error("Error fetching surgeries:", error)
    return NextResponse.json({ error: "Error fetching surgeries" }, { status: 500 })
  }
}

