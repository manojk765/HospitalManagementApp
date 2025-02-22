"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Pagination from "@/components/pagination";
import TableSearch from "@/components/tablesearch";
import router from "next/router";

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
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 7;
  const skip = (page - 1) * itemsPerPage;

  const fetchBirthReports = async () => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams({
        page: page.toString(),
        search: searchQuery,
      }).toString();

      const response = await fetch(`/api/births?${queryString}`);
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

  useEffect(() => {
    fetchBirthReports();
  }, [page, searchQuery]);

  const handleDelete = async (birth_id: string) => {
    if (window.confirm("Are you sure you want to delete this birth record?")) {
      try {
        const response = await fetch(`/api/births/${birth_id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete birth record");
        }

        fetchBirthReports();
      } catch (error) {
        console.error("Error deleting birth:", error);
        alert("Failed to delete birth record");
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Birth Reports</h1>
          <p className="text-sm text-gray-500">You have {birthReports.length} birth reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <TableSearch />
          </div>
          <Link
            href="/list/births/add-birth"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Add Birth Report
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
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
              {birthReports.slice(skip, skip + itemsPerPage).map((report) => (
                <tr key={report.birth_id}>
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
                        onClick={() => router.push(`/list/hospital/edit-birth/${report.birth_id}`)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(report.birth_id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {skip + 1} to {Math.min(skip + itemsPerPage, birthReports.length)} of {birthReports.length} entries
            </div>
            <Pagination
              page={page}
              count={Math.ceil(birthReports.length / itemsPerPage)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
