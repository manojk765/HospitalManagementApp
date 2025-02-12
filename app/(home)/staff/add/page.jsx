"use client"

export default function AddStaffPage() {
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Add Patient</h1>
          <p className="text-sm text-gray-500">Input new patient information carefully.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Personal Info Card */}
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Personal Info</h2>
            <p className="text-sm text-gray-500">Add common information like Name, Email, etc.</p>
          </div>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <input type="text" placeholder="Full Name" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Date of Birth</label>
                <input type="date" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Gender</label>
                <select className="w-full border rounded px-3 py-2">
                  <option>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input type="text" placeholder="Phone no." className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input type="email" placeholder="Email" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">National ID</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="Choose file" className="w-full border rounded px-3 py-2" />
                  <button className="border px-4 py-2 rounded">Browse</button>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Address</label>
              <textarea placeholder="Address" className="w-full border rounded px-3 py-2 min-h-[100px]"></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium">Salary</label>
                <input type="text" placeholder="Enter Salary" className="w-full border rounded px-3 py-2" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">Add Patient</button>
        </div>
      </div>
    </div>
  )
}
