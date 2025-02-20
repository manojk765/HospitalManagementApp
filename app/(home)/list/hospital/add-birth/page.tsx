"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Patient {
    patient_id: string ,
    name: string ,
    email : string ,
}

export default function CreateBirthPage() {
    const router = useRouter();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        patient_id: '',
        name: '',
        fatherName: '',
        gender: 'Male',
        date: new Date().toISOString().split('T')[0],
        typeofDelivery: 'NORMAL'
    });

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch('/api/patient');
                const data = await response.json();
                setPatients(data);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        fetchPatients();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/births', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to create birth record');
            }

            router.push('/list/hospital/birth-reports');
        } catch (error) {
            console.error('Error creating birth:', error);
            alert('Failed to create birth record');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-8">Create Birth Record</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2">Patient ID</label>
                    <select
                        name="patient_id"
                        value={formData.patient_id}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select Patient ID</option>
                        {patients.map((patient) => (
                            <option key={patient.patient_id} value={patient.patient_id}>
                                {patient.patient_id } - { patient.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-2">Child Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block mb-2">Father Name</label>
                    <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block mb-2">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2">Date of Birth</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block mb-2">Type of Delivery</label>
                    <select
                        name="typeofDelivery"
                        value={formData.typeofDelivery}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    >
                        <option value="NORMAL">Normal</option>
                        <option value="CESAREAN">Cesarean</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => router.push('/birth-reports')}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {loading ? 'Creating...' : 'Create Birth Record'}
                    </button>
                </div>
            </form>
        </div>
    );
}
