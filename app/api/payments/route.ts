import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')
    const patientId = searchParams.get('patientId')

    if (!date) {
      return NextResponse.json(
        { error: "Invalid Date" },
        { status: 400 }
      )
    }

    const startDate = new Date(date)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(date)
    endDate.setHours(23, 59, 59, 999)

    const whereClause: any = {
      payment_date: {
        gte: startDate,
        lte: endDate,
      },
    }

    if (patientId) {
      whereClause.patient_id = patientId
    }

    const payments = await prisma.payment.findMany({
      where: whereClause,
      include: {
        patient: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        payment_date: 'desc',
      },
    })

    const formattedPayments = payments.map(payment => ({
      ...payment,
      patient_name: payment.patient.name,
    }))

    return NextResponse.json(formattedPayments)

  } catch (error) {
    console.error('Failed to fetch payments:', error)
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    )
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get today's date
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Count payments made today
    const paymentCount = await prisma.payment.count({
      where: {
        payment_date: {
          gte: today,
        },
      },
    })

    // Generate payment ID (PAY + 4-digit number)
    const paymentNumber = (paymentCount + 1).toString().padStart(4, '0')
    const paymentId = `PAY${paymentNumber}`

    const payment = await prisma.payment.create({
      data: {
        payment_id: paymentId,
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
      { error: "Failed to create payment" },
      { status: 500 }
    )
  }
}
