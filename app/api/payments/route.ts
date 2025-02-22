import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const patientId = searchParams.get('patientId');

    let whereClause: any = {};

    // If the date is provided, apply the date filter
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      whereClause.payment_date = {
        gte: startDate,
        lte: endDate,
      };
    }
    
    if (patientId) {
      whereClause.patient_id = patientId;
    }

    // Fetch payments with the constructed where clause
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
    });

    const formattedPayments = payments.map(payment => ({
      ...payment,
      patient_name: payment.patient.name,
    }));

    return NextResponse.json(formattedPayments);

  } catch (error) {
    console.error('Failed to fetch payments:', error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid or missing payload' },
        { status: 400 }
      );
    }

    console.log(body);

    // Use the payment_date from the body if available, otherwise default to today's date
    const paymentDate = body.payment_date ? new Date(body.payment_date) : new Date();
    
    // Set hours to 00:00:00 for comparison purposes
    paymentDate.setHours(0, 0, 0, 0);

    // Count payments made on the provided or current date
    const paymentCount = await prisma.payment.count({
      where: {
        payment_date: {
          gte: paymentDate,
        },
      },
    });

    // Format date to DDMMYY
    const day = String(paymentDate.getDate()).padStart(2, '0'); // DD
    const month = String(paymentDate.getMonth() + 1).padStart(2, '0'); // MM
    const year = String(paymentDate.getFullYear()).slice(-2); // YY (last two digits of the year)

    // Increment payment number for that date
    const paymentNumber = (paymentCount + 1).toString().padStart(4, '0'); // XXXX

    // Construct the payment ID
    const paymentId = `PAY${day}${month}${year}${paymentNumber}`;

    // Create the payment entry
    const payment = await prisma.payment.create({
      data: {
        payment_id: paymentId,
        patient_id: body.patient_id,
        payment_date: paymentDate,
        payment_method: body.payment_method,
        amount_paid: parseFloat(body.amount_paid), // Ensure amount is a number
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error caught: ", error);

    return NextResponse.json(
      { error: `Failed to create payment, details: ${error}` },
      { status: 500 }
    );
  }
}
