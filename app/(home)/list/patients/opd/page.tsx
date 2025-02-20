"use client";

import Decimal from "decimal.js";
import React, { useState, useEffect } from "react";

interface Patient {
  id: number;
  patient_id: string;
  name: string;
  contact: string;
  visitDate: string;
  doctor: {
    doctor_id: string;
    name: string;
  };
  purpose: string;
  amount: Decimal;
}

export default function DailyVisitLog() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

 
  useEffect(() => {
    fetchPatients();
  }, [date]);  

  const fetchPatients = async () => {
    try {
      const response = await fetch(`/api/opd-patients?date=${date}`);
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      } else {
        console.error("Error fetching patient records");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value); 
  };

  const handleExport = () => {
    const headers = [
      "Patient ID",
      "Patient Name",
      "Contact",
      "Time of Visit",
      "Doctor (ID - Name)",
      "Purpose of Visit",
      "Amount",
    ];
    const csvContent = [
      headers.join(","),
      ...patients.map((patient) =>
        [
          patient.patient_id,
          patient.name,
          patient.contact,
          new Date(patient.visitDate).toLocaleString(),
          `${patient.doctor.doctor_id} - ${patient.doctor.name}`,
          patient.purpose,
          patient.amount.toString(), // Convert Decimal to string for CSV export
        ].join(",")
      ),
    ].join("\n");

    // to enable CSV export
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `daily_visit_log_${date}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="date" className="mr-2">
          Select Date:
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={handleDateChange}
          className="border rounded px-2 py-1"
        />
        <button onClick={handleExport} className="ml-4 bg-green-500 text-white px-4 py-2 rounded">
          Export to CSV
        </button>
      </div>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Patient ID</th>
            <th className="border p-2">Patient Name</th>
            <th className="border p-2">Contact Number</th>
            <th className="border p-2">Time of Visit</th>
            <th className="border p-2">Doctor (ID - Name)</th>
            <th className="border p-2">Purpose of Visit</th>
            <th className="border p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan={7} className="border p-2 text-center">
                No patients for this date
              </td>
            </tr>
          ) : (
            patients.map((patient) => (
              <tr key={patient.id}>
                <td className="border p-2">{patient.id}</td>
                <td className="border p-2">{patient.name}</td>
                <td className="border p-2">{patient.contact}</td>
                <td className="border p-2">{new Date(patient.visitDate).toLocaleString()}</td>
                <td className="border p-2">{`${patient.doctor.doctor_id} - ${patient.doctor.name}`}</td>
                <td className="border p-2">{patient.purpose}</td>
                <td className="border p-2">{patient.amount.toString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
