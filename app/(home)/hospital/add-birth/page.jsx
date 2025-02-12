"use client"

import { useState } from 'react';

export default function AddBirthReportPage() {
  const [birthReport, setBirthReport] = useState({
    child_name: '',
    gender: '',
    mother_name: '',
    father_name: '',
    date: '',
    report: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBirthReport((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(birthReport);
    // Here you can handle saving the birth report to a database or backend.
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8">Add Birth Report</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium">Child Name</label>
          <input
            type="text"
            name="child_name"
            value={birthReport.child_name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium">Gender</label>
          <select
            name="gender"
            value={birthReport.gender}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium">Mother Name</label>
          <input
            type="text"
            name="mother_name"
            value={birthReport.mother_name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium">Father Name</label>
          <input
            type="text"
            name="father_name"
            value={birthReport.father_name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={birthReport.date}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium">Type of Delivery</label>
          <select
            name="report"
            value={birthReport.report}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Type of Delivery</option>
            <option value="Normal">Normal</option>
            <option value="C-Section">C-Section</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg"
          >
            Add Birth Report
          </button>
        </div>
      </form>
    </div>
  );
}
