"use client"

import { useState } from "react";

const appointmentsData = [
  {
    id: "05",
    patient: {
      name: "Abu Isthiyak",
      avatar: "A",
    },
    department: "Gastroenterology",
    doctor: {
      name: "Joe Larson",
      avatar: "/placeholder.svg",
    },
    date: "18/12/2020",
    status: "Waiting",
  },
  {
    id: "10",
    patient: {
      name: "Amelia Grant",
      avatar: "A",
    },
    department: "Medicine",
    doctor: {
      name: "Patrick Newman",
      avatar: "/placeholder.svg",
    },
    date: "12/02/2021",
    status: "Visited",
  },
  
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState(appointmentsData);

  return (
    <div className="container" style={{ padding: "20px" }}>
      <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Appointment List</h1>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            TODAY'S TOTAL (150) | VISITED (47) | WAITING (12) | CANCELED (1)
          </div>
        </div>
        <button style={buttonStyle}>Add Appointment</button>
      </div>

      <div className="table-container" style={{ marginTop: "20px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={tableHeadStyle}>
                <input type="checkbox" />
              </th>
              <th style={tableHeadStyle}>Patient</th>
              <th style={tableHeadStyle}>Department</th>
              <th style={tableHeadStyle}>Doctor</th>
              <th style={tableHeadStyle}>Serial No</th>
              <th style={tableHeadStyle}>Date</th>
              <th style={tableHeadStyle}>Status</th>
              <th style={tableHeadStyle}></th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} style={tableRowStyle}>
                <td style={tableCellStyle}>
                  <input type="checkbox" />
                </td>
                <td style={tableCellStyle}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "32px",
                        width: "32px",
                        borderRadius: "50%",
                        backgroundColor: "#e0f7fa",
                      }}
                    >
                      {appointment.patient.avatar}
                    </span>
                    <span>{appointment.patient.name}</span>
                  </div>
                </td>
                <td style={tableCellStyle}>{appointment.department}</td>
                <td style={tableCellStyle}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img
                      src={appointment.doctor.avatar}
                      alt={`${appointment.doctor.name}'s avatar`}
                      style={{ height: "32px", width: "32px", borderRadius: "50%" }}
                    />
                    <span>{appointment.doctor.name}</span>
                  </div>
                </td>
                <td style={tableCellStyle}>{appointment.id}</td>
                <td style={tableCellStyle}>{appointment.date}</td>
                <td style={tableCellStyle}>
                  <span
                    style={{
                      color:
                        appointment.status === "Waiting"
                          ? "blue"
                          : appointment.status === "Visited"
                          ? "green"
                          : "red",
                    }}
                  >
                    {appointment.status}
                  </span>
                </td>
                <td style={tableCellStyle}>
                  <button style={iconButtonStyle}>•••</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Styles
const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const tableHeadStyle = {
  padding: "12px",
  backgroundColor: "#f3f4f6",
  borderBottom: "1px solid #e5e7eb",
  textAlign: "left",
  fontWeight: "bold",
};

const tableCellStyle = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
};

const tableRowStyle = {
  backgroundColor: "white",
  transition: "background-color 0.2s ease",
};

const iconButtonStyle = {
  backgroundColor: "transparent",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
};
