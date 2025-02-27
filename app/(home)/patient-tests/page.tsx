"use client"

import { useState, useEffect } from "react"
import Select from "react-select"
import TestForm from "./TestForm"
import TestList from "./TestsList"

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

interface PatientOption {
  value: string
  label: string
}

export default function PatientServicesPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [patientOptions, setPatientOptions] = useState<PatientOption[]>([])
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [patientServices, setPatientServices] = useState<PatientService[]>([])
  const [serviceUnitCosts, setServiceUnitCosts] = useState<{[serviceName: string]: number}>({})

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
      
      // Create options for react-select
      const options = data.map((patient: Patient) => ({
        value: patient.patient_id,
        label: `${patient.name} (ID: ${patient.patient_id})`
      }))
      setPatientOptions(options)
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
      
      const unitCosts: {[key: string]: number} = {}
      data.forEach((service: Service) => {
        unitCosts[service.service_name] = service.cost
      })
      setServiceUnitCosts(unitCosts)
    } catch (error) {
      console.error("Error fetching services:", error)
    }
  }

  const fetchPatientServices = async (patientId: string) => {
    try {
      const response = await fetch(`/api/patient-services?patientId=${patientId}`)
      if (!response.ok) throw new Error("Failed to fetch patient services")
      const data = await response.json()
      setPatientServices(data)
    } catch (error) {
      console.error("Error fetching patient services:", error)
    }
  }

  const handleAddService = async (newService: Omit<PatientService, "is_paid">) => {
    try {
      const response = await fetch("/api/patient-services/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newService),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add service")
      }
      fetchPatientServices(selectedPatient!)
    } catch (error) {
      console.error("Error adding service:", error)
      alert(error instanceof Error ? error.message : "Failed to add service")
    }
  }

  const handlePatientChange = (selectedOption: PatientOption | null) => {
    setSelectedPatient(selectedOption ? selectedOption.value : null)
  }

  // Get the selected patient's name
  const getSelectedPatientName = () => {
    const patient = patients.find(p => p.patient_id === selectedPatient)
    return patient ? patient.name : ""
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Patient Services Management</h1>
      
      <div className="mb-6">
        <label htmlFor="patient-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select Patient
        </label>
        <Select
          id="patient-select"
          options={patientOptions}
          value={patientOptions.find(option => option.value === selectedPatient) || null}
          onChange={handlePatientChange}
          placeholder="Search patient by name or ID..."
          isClearable
          className="basic-single"
          classNamePrefix="select"
        />
      </div>
      
      {selectedPatient && (
        <>
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold">Patient: {getSelectedPatientName()}</h2>
            <p className="text-sm text-gray-600">ID: {selectedPatient}</p>
          </div>
          
          <TestForm patientId={selectedPatient} services={services} onAddService={handleAddService} />
          <TestList 
            services={patientServices} 
            onServiceUpdated={() => fetchPatientServices(selectedPatient)} 
            serviceUnitCosts={serviceUnitCosts}
          />
        </>
      )}
    </div>
  )
}