import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const payment = await prisma.payment.update({
      where: {
        payment_id: params.id,
      },
      data: {
        patient_id: body.patient_id,
        payment_date: new Date(body.payment_date),
        payment_method: body.payment_method,
        amount_paid: body.amount_paid,
      },
    })

    return NextResponse.json(payment)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.payment.delete({
      where: {
        payment_id: params.id,
      },
    })

    return NextResponse.json({ message: "Payment deleted successfully" })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to delete payment" },
      { status: 500 }
    )
  }
}