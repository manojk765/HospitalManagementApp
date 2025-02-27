"use client"

import { useState, useEffect } from "react"
import PatientSelector from "./PatientSelector"
import ServiceForm from "./ServiceForm"
import ServiceList from "./ServiceList"

interface Patient {
  patient_id: string
  name: string
}

interface Service {
  service_name: string
  cost: number
  description: string
}

interface PatientService {
  patient_id: string
  service_name: string
  service_date: string
  quantity: number
  total_cost: number
  is_paid: boolean
}

export default function PatientServicesPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [patientServices, setPatientServices] = useState<PatientService[]>([])

  useEffect(() => {
    fetchPatients()
    fetchServices()
  }, [])

  useEffect(() => {
    if (selectedPatient) {
      fetchPatientServices(selectedPatient)
    }
  }, [selectedPatient])

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/patient")
      if (!response.ok) throw new Error("Failed to fetch patients")
      const data = await response.json()
      setPatients(data)
    } catch (error) {
      console.error("Error fetching patients:", error)
    }
  }

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services")
      if (!response.ok) throw new Error("Failed to fetch services")
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error("Error fetching services:", error)
    }
  }

  const fetchPatientServices = async (patientId: string) => {
    try {
      const response = await fetch(`/api/patient-services/${patientId}`)
      if (!response.ok) throw new Error("Failed to fetch patient services")
      const data = await response.json()
      setPatientServices(data)
    } catch (error) {
      console.error("Error fetching patient services:", error)
    }
  }

  const handleAddService = async (newService: Omit<PatientService, "is_paid">) => {
    try {
      const response = await fetch("/api/patient-services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newService),
      })
      if (!response.ok) throw new Error("Failed to add service")
      fetchPatientServices(selectedPatient!)
    } catch (error) {
      console.error("Error adding service:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Patient Services Management</h1>
      <PatientSelector patients={patients} selectedPatient={selectedPatient} onSelectPatient={setSelectedPatient} />
      {selectedPatient && (
        <>
          <ServiceForm patientId={selectedPatient} services={services} onAddService={handleAddService} />
          <ServiceList services={patientServices} onServiceUpdated={() => fetchPatientServices(selectedPatient)} />
        </>
      )}
    </div>
  )
}

