"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();
    const [birthReports, setBirthReports] = useState<BirthReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBirthReports = async () => {
        try {
            const response = await fetch('/api/births');
            if (!response.ok) {
                throw new Error('Failed to fetch birth reports');
            }
            const data = await response.json();
            setBirthReports(data);
        } catch (err) {
            setError('Failed to fetch birth reports');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBirthReports();
    }, []);

    const handleDelete = async (birth_id: string) => {
        if (window.confirm('Are you sure you want to delete this birth record?')) {
            try {
                const response = await fetch(`/api/births/${birth_id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete birth record');
                }

                fetchBirthReports();
            } catch (error) {
                console.error('Error deleting birth:', error);
                alert('Failed to delete birth record');
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
        <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Birth Reports</h1>
                <Link 
                    href="list/births/add-birth" 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    Add Birth
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2">Birth ID</th>
                            <th className="px-4 py-2">Patient ID</th>
                            <th className="px-4 py-2">Child Name</th>
                            <th className="px-4 py-2">Gender</th>
                            <th className="px-4 py-2">Father Name</th>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Type of Delivery</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {birthReports.map((report) => (
                            <tr key={report.birth_id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2">{report.birth_id}</td>
                                <td className="px-4 py-2">{report.patient_id}</td>
                                <td className="px-4 py-2">{report.name}</td>
                                <td className="px-4 py-2">{report.gender}</td>
                                <td className="px-4 py-2">{report.fatherName}</td>
                                <td className="px-4 py-2">{new Date(report.date).toLocaleDateString()}</td>
                                <td className="px-4 py-2">{report.typeofDelivery}</td>
                                <td className="px-4 py-2">
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
        </div>
    );
}