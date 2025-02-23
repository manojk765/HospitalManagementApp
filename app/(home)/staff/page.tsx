"use client"

import { useState, useEffect } from "react"
import { Download, Users } from "lucide-react"

export default function DashboardPage() {
  const [startDate, setStartDate] = useState<string>(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0, 10))
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [dashboardData, setDashboardData] = useState({
    ipdIncome: 0,
    opdIncome: 0,
    expenses: 0,
    todayAppointments: 0,
    doctors: 0,
    patients: 0,
    nurses: 0,
    monthlyRevenue: 0,
    weeklyRevenue: 0,
    dailyAvgRevenue: 0,
  })

  useEffect(() => {
    fetchDashboardData()
  }, [startDate, endDate])

  const fetchDashboardData = async () => {
    if (!startDate || !endDate) return

    const response = await fetch(`/api/dashboard?startDate=${startDate}&endDate=${endDate}`)
    const data = await response.json()
    setDashboardData(data)
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded-md"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded-md"
          />
          <button className="border px-4 py-2 rounded-md">Last 30 Days</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Reports</button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="border rounded-md p-4 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold">IPD Income</h2>
            <div className="relative">
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md hidden group-hover:block">
                <button className="flex items-center px-4 py-2 hover:bg-gray-100">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">Rs.{dashboardData.ipdIncome.toString()}</div>
            {/* <p className="text-sm text-gray-500">
              <span className="text-emerald-500 font-bold">↑ 4.63%</span> vs last period
            </p> */}
          </div>
        </div>

        <div className="border rounded-md p-4 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold">OPD Income</h2>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">Rs.{dashboardData.opdIncome.toString()}</div>
            {/* <p className="text-sm text-gray-500">
              <span className="text-red-500 font-bold">↓ 2.34%</span> vs last period
            </p> */}
          </div>
        </div>

        <div className="border rounded-md p-4 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold">Expenses</h2>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">Rs.{dashboardData.expenses.toString()}</div>
            {/* <p className="text-sm text-gray-500">
              <span className="text-emerald-500 font-bold">↑ 1.34%</span> vs last period
            </p> */}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-md p-4 shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold text-gray-800">Hospital Statistics</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="text-base font-medium">Today's Appointments</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">{dashboardData.todayAppointments}</span>
            </div>
            <hr />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="text-base font-medium">Doctors</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">{dashboardData.doctors}</span>
            </div>
            <hr />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="text-base font-medium">Patients</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">{dashboardData.patients}</span>
            </div>
            <hr />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="text-base font-medium">Nurses</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">{dashboardData.nurses}</span>
            </div>
          </div>
        </div>

        <div className="border rounded-md p-4 shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold text-gray-800">Total Revenue</h2>
          <p className="text-sm text-gray-500">In selected period</p>
          <div className="mt-4 grid grid-cols-3 gap-6">
            <div>
              <span className="text-sm font-medium text-gray-500">Monthly</span>
              <div className="text-3xl font-bold text-gray-900">₹{dashboardData.monthlyRevenue.toFixed(2)}</div>
              {/* <div className="text-xs text-emerald-500">+4.45%</div> */}
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Weekly</span>
              <div className="text-3xl font-bold text-gray-900">₹{dashboardData.weeklyRevenue.toFixed(2)}</div>
              {/* <div className="text-xs text-emerald-500">+1.19%</div> */}
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Daily (Avg)</span>
              <div className="text-3xl font-bold text-gray-900">₹{dashboardData.dailyAvgRevenue.toFixed(2)}</div>
              {/* <div className="text-xs text-emerald-500">+3.45%</div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
