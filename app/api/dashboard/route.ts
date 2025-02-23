import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { Decimal } from "@prisma/client/runtime/library"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const startDate = new Date(searchParams.get("startDate") || "")
  const endDate = new Date(searchParams.get("endDate") || "")

  const ipdIncome = await prisma.payment.aggregate({
    where: {
      payment_date: {
        gte: startDate,
        lte: endDate,
      },
      patient: {
        category: {
          not: "Other",
        },
      },
    },
    _sum: {
      amount_paid: true,
    },
  })

  const opdIncome = await prisma.opdPatient.aggregate({
    where: {
      visitDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      amount: true,
    },
  })

  // Fetch Expenses
  const expenses = await prisma.expense.aggregate({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      amount: true,
    },
  })

  // Fetch Today's Appointments
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayAppointments = await prisma.opdPatient.count({
    where: {
      visitDate: {
        gte: today,
      },
    },
  })

  // Fetch Doctors Count
  const doctors = await prisma.doctor.count()

  // Fetch Patients Count
  const patients = await prisma.patient.count()

  // Fetch Nurses Count
  const nurses = await prisma.staff.count({
    where: {
      role: "Nurse",
    },
  })

  const toNumber = (value: number | Decimal | null | undefined) => {
    return value instanceof Decimal ? value.toNumber() : value || 0;
  };
  
  
  const totalRevenue = toNumber(ipdIncome._sum.amount_paid) + toNumber(opdIncome._sum.amount);

  // Calculate Monthly, Weekly, and Daily Average Revenue
  const daysInPeriod = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
  const monthlyRevenue = totalRevenue / (daysInPeriod / 30)
  const weeklyRevenue = totalRevenue / (daysInPeriod / 7)
  const dailyAvgRevenue = totalRevenue / daysInPeriod

  return NextResponse.json({
    ipdIncome: ipdIncome._sum.amount_paid || 0,
    opdIncome: opdIncome._sum.amount || 0,
    expenses: expenses._sum.amount || 0,
    todayAppointments,
    doctors,
    patients,
    nurses,
    monthlyRevenue,
    weeklyRevenue,
    dailyAvgRevenue,
  })
}

