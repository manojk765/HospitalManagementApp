import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    const bed = await prisma.beds.update({
      where: { id: parseInt(params.id) },
      data: {
        type: data.type,
        bedNumber: data.bedNumber,
        dailyRate: data.dailyRate,
        available: data.available,
      },
    })
    
    return NextResponse.json(bed)
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update bed ${error}` },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.beds.delete({
      where: { id: parseInt(params.id) },
    })
    
    return NextResponse.json({ message: "Bed deleted successfully" })
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete bed ${error}` },
      { status: 500 }
    )
  }
}