import { Download, MoreHorizontal, Users } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-4">
          <button className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
            Last 30 Days
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-transform transform hover:scale-105 shadow-lg">
            Reports
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* IPD Income Card */}
        <div className="border rounded-md p-4 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold">IPD Income</h2>
            <div className="relative">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MoreHorizontal className="h-5 w-5" />
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md hidden group-hover:block">
                <button className="flex items-center px-4 py-2 hover:bg-gray-100">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">Rs.10,945</div>
            <p className="text-sm text-gray-500">
              <span className="text-emerald-500 font-bold">↑ 4.63%</span> vs last week
            </p>
          </div>
        </div>

        {/* OPD Income Card */}
        <div className="border rounded-md p-4 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold">OPD Income</h2>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">Rs.12,338</div>
            <p className="text-sm text-gray-500">
              <span className="text-red-500 font-bold">↓ 2.34%</span> vs last week
            </p>
          </div>
        </div>

        {/* Laboratory Income Card */}
        <div className="border rounded-md p-4 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold">Laboratory Income</h2>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">Rs.20,847</div>
            <p className="text-sm text-gray-500">
              <span className="text-emerald-500 font-bold">↑ 4.63%</span> vs last week
            </p>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="border rounded-md p-4 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold">Expenses</h2>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">Rs.23,485</div>
            <p className="text-sm text-gray-500">
              <span className="text-emerald-500 font-bold">↑ 1.34%</span> vs last week
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Hospital Statistics */}
        <div className="border rounded-md p-4 shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold text-gray-800">Hospital Statistics</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="text-base font-medium">Today's Appointments</span> 
              </div>
              <span className="text-2xl font-bold text-gray-800">470</span>
            </div>
            <hr />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="text-base font-medium">Doctors</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">152</span>
            </div>
            <hr />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="text-base font-medium">Patients</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">2,327</span>
            </div>
            <hr />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="text-base font-medium">Nurses</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">674</span>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="border rounded-md p-4 shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold text-gray-800">Total Revenue</h2>
          <p className="text-sm text-gray-500">In 30 days income of this hospital</p>
          <div className="mt-4 grid grid-cols-3 gap-6">
            <div>
              <span className="text-sm font-medium text-gray-500">Monthly</span>
              <div className="text-3xl font-bold text-gray-900">98K</div>
              <div className="text-xs text-emerald-500">+4.45%</div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Weekly</span>
              <div className="text-3xl font-bold text-gray-900">9.69K</div>
              <div className="text-xs text-emerald-500">+1.19%</div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Daily (Avg)</span>
              <div className="text-3xl font-bold text-gray-900">3.94K</div>
              <div className="text-xs text-emerald-500">+3.45%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
