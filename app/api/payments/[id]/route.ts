import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// PUT Method - Update payment details
export async function PUT(request: NextRequest) {
  try {
    // Extract payment id from the request URL
    const url = new URL(request.url)
    const id = url.pathname.split("/").pop() // Get the last part of the URL

    if (!id) {
      return NextResponse.json({ error: "Payment ID not provided" }, { status: 400 })
    }

    const body = await request.json()

    const payment = await prisma.payment.update({
      where: {
        payment_id: id,
      },
      data: {
        patient_id: body.patient_id,
        payment_date: new Date(body.payment_date),
        payment_method: body.payment_method,
        amount_paid: body.amount_paid,
        discharged: body.discharged || false,
        description: body.description || "Patient Payment",
      },
    })

    return NextResponse.json(payment)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 })
  }
}

// DELETE Method - Delete payment
export async function DELETE(request: NextRequest) {
  try {
    // Extract payment id from the request URL
    const url = new URL(request.url)
    const id = url.pathname.split("/").pop() // Get the last part of the URL

    if (!id) {
      return NextResponse.json({ error: "Payment ID not provided" }, { status: 400 })
    }

    await prisma.payment.delete({
      where: {
        payment_id: id,
      },
    })

    return NextResponse.json({ message: "Payment deleted successfully" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete payment" }, { status: 500 })
  }
}

