import { ArrowDown, ArrowUp, MoreHorizontal } from "lucide-react"

const stats = [
  {
    label: "Today's Sales",
    value: "$10,945",
    change: 4.65,
    trend: "up",
  },
  {
    label: "Today's Revenue",
    value: "$12,338",
    change: -2.34,
    trend: "down",
  },
  {
    label: "Today's Customers",
    value: "$20,847",
    change: 4.65,
    trend: "up",
  },
  {
    label: "Today's Expenses",
    value: "$23,485",
    change: 1.34,
    trend: "up",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 bg-white border rounded-lg">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Today</option>
          </select>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg">Reports</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">{stat.label}</div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div
                className={`flex items-center mt-1 text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}
              >
                {stat.trend === "up" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span>{Math.abs(stat.change)}% vs last week</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Sales Card */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Total Sales</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div>
            <div className="text-3xl font-bold">$74,958.49</div>
            <div className="text-sm text-gray-500 mt-1">$7,395.37 in last month</div>
          </div>
          <div className="mt-6">
            <div className="text-sm font-medium">This week so far</div>
            <div className="text-2xl font-bold mt-1">$1,338.72</div>
            <div className="flex items-center mt-1 text-sm text-green-500">
              <ArrowUp className="w-4 h-4" />
              <span>4.65% vs last week</span>
            </div>
          </div>
        </div>

        {/* Store Statistics Card */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Store Statistics</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            {[
              { label: "Sales", value: "1,795" },
              { label: "Customers", value: "2,327" },
              { label: "Products", value: "674" },
              { label: "Categories", value: "68" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="text-gray-500">{item.label}</div>
                <div className="font-medium">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

