"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Calendar } from "lucide-react";

interface BirthReport {
  birth_id: string;
  patient_id: string;
  name: string;
  gender: string;
  fatherName: string;
  date: string;
  typeofDelivery: string;
}

export default function BirthReportListPage() {
  const [birthReports, setBirthReports] = useState<BirthReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchBirthReports = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          search: searchQuery,
          startDate: startDate,
          endDate: endDate,
        });

        const response = await fetch(`/api/births?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch birth reports");
        }
        const data = await response.json();
        setBirthReports(data);
      } catch (err) {
        setError("Failed to fetch birth reports");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBirthReports();
  }, [searchQuery, startDate, endDate]);

  const handleDelete = async (birth_id: string) => {
    if (window.confirm("Are you sure you want to delete this birth record?")) {
      try {
        const response = await fetch(`/api/births/${birth_id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete birth record");
        }

        setBirthReports((prev) =>
          prev.filter((report) => report.birth_id !== birth_id)
        );
      } catch (error) {
        console.error("Error deleting birth:", error);
        setError("Failed to delete birth record");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Birth Reports</h1>
          <p className="text-sm text-gray-500">Total records: {birthReports.length}</p>
        </div>
        <Link
          href="/list/births/add-birth"
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
        >
          Add Birth Report
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, ID or father's name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          <div className="relative">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Birth ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Child Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Father Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type of Delivery</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {birthReports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No birth reports found
                  </td>
                </tr>
              ) : (
                birthReports.map((report) => (
                  <tr key={report.birth_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{report.birth_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.patient_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.fatherName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(report.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.typeofDelivery}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.location.href = (`/list/births  /edit-birth/${report.birth_id}`)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(report.birth_id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
}
