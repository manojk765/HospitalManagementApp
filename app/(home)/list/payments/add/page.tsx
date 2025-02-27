"use client"

import type React from "react"

import Decimal from "decimal.js"
import { useEffect, useState, useCallback } from "react"
import { Trash2, Edit2, Search } from "lucide-react"
import Select from "react-select"

interface Patient {
  patient_id: string
  name: string 
}

interface Payment {
  payment_id: string
  patient_id: string
  patient_name: string
  payment_date: string
  payment_method: string
  amount_paid: Decimal
  discharged: boolean
  description: string
}

interface PaymentFormData {
  patient_id: string
  payment_date: string
  payment_method: string
  amount_paid: Decimal
  description: string
}

interface PatientOption {
  value: string
  label: string
}

// Modal component
const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="flex min-h-screen items-center justify-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

        <div
          className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:w-full sm:max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default function PaymentsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [patientOptions, setPatientOptions] = useState<PatientOption[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [selectedPatient, setSelectedPatient] = useState("")
  const [paymentDate, setPaymentDate] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [amount, setAmount] = useState(0)
  const [description, setDescription] = useState("Patient Payment")
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchDate, setSearchDate] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setPaymentDate(today)
  }, [])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const fetchPayments = useCallback(async (date: string) => {
    try {
      const response = await fetch(`/api/payments?date=${date}`)
      if (!response.ok) throw new Error("Failed to fetch payments")
      const data = await response.json()
      setPayments(data)
    } catch (err) {
      setError("Failed to load payments. Please try again later.")
      console.error(err)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const patientsResponse = await fetch("/api/patient")
        if (!patientsResponse.ok) throw new Error("Failed to fetch patient data")

        const patientsData = await patientsResponse.json()
        setPatients(patientsData)

        // Create options for react-select
        const options = patientsData.map((patient: Patient) => ({
          value: patient.patient_id,
          label: `${patient.patient_id} - ${patient.name}`,
        }))
        setPatientOptions(options)

        await fetchPayments(searchDate)
      } catch (err) {
        setError("Failed to load data. Please check your connection and try again.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [searchDate, fetchPayments])

  // Filter patient options based on search term
  // const filteredPatientOptions = searchTerm
  //   ? patientOptions.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
  //   : patientOptions

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const paymentData: PaymentFormData = {
      patient_id: selectedPatient,
      payment_date: paymentDate,
      payment_method: paymentMethod,
      amount_paid: new Decimal(amount),
      description: description,
    }

    try {
      const url = editingPayment ? `/api/payments/${editingPayment.payment_id}` : "/api/payments"

      const method = editingPayment ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to submit payment")
      }

      setSuccessMessage(`Payment ${editingPayment ? "updated" : "added"} successfully!`)
      await fetchPayments(searchDate)
      resetForm()
      setIsDialogOpen(false)
    } catch (err) {
      setError(`Failed to ${editingPayment ? "update" : "submit"} payment. Please try again.`)
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (paymentId: string) => {
    if (!confirm("Are you sure you want to delete this payment?")) return

    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete payment")

      setSuccessMessage("Payment deleted successfully!")
      await fetchPayments(searchDate)
    } catch (err) {
      setError("Failed to delete payment. Please try again.")
      console.error(err)
    }
  }

  const resetForm = () => {
    setSelectedPatient("")
    setPaymentMethod("")
    setAmount(0)
    setDescription("Patient Payment")
    setEditingPayment(null)
  }

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment)
    setSelectedPatient(payment.patient_id)
    const date = new Date(payment.payment_date).toISOString().split("T")[0]
    setPaymentDate(date)
    setPaymentMethod(payment.payment_method)
    setAmount(Number(payment.amount_paid))
    setDescription(payment.description)
    setIsDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {(error || successMessage) && (
        <div
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 p-4 rounded-2xl shadow-lg transition-all duration-500 text-white w-full max-w-md ${
            error ? "bg-red-600" : "bg-green-600"
          }`}
          role="alert"
        >
          <p className="text-center text-lg font-semibold">{error || successMessage}</p>
        </div>
      )}

      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Payments Management</h1>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Add New Payment
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-lg mb-8">
        <div className="p-6 bg-gray-50 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-800">Payment Records</h2>
          <div className="flex gap-4 items-center mt-4">
            <div className="relative">
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="border rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left text-sm font-medium text-gray-700">Payment ID</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">Patient</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">Method</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">Description</th>
                <th className="p-3 text-right text-sm font-medium text-gray-700">Amount</th>
                <th className="p-3 text-center text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No payments found for this date
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.payment_id} className="border-b hover:bg-gray-50 transition duration-200">
                    <td className="p-3 text-sm text-gray-700">{payment.payment_id}</td>
                    <td className="p-3 text-sm text-gray-700">
                      {payment.patient_id} - {payment.patient_name}
                    </td>
                    <td className="p-3 text-sm text-gray-700">{new Date(payment.payment_date).toLocaleDateString()}</td>
                    <td className="p-3 text-sm text-gray-700">{payment.payment_method}</td>
                    <td className="p-3 text-sm text-gray-700">{payment.description}</td>
                    <td className="p-3 text-sm text-right text-gray-700">{Number(payment.amount_paid).toFixed(2)}</td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(payment)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded transition duration-200"
                        title="Edit payment"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(payment.payment_id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded transition duration-200"
                        title="Delete payment"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Form Modal */}
      <Modal
        isOpen={isDialogOpen}
        onClose={() => {
          resetForm()
          setIsDialogOpen(false)
        }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800" id="modal-title">
              {editingPayment ? "Edit Payment" : "Add New Payment"}
            </h2>
            <button
              onClick={() => {
                resetForm()
                setIsDialogOpen(false)
              }}
              className="text-gray-400 hover:text-gray-500 transition-colors"
              aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="patient" className="block text-sm font-medium text-gray-700">
                Patient
              </label>
              {!editingPayment ? (
                <Select
                  id="patient-select"
                  options={patientOptions}
                  value={patientOptions.find((option) => option.value === selectedPatient)}
                  onChange={(option) => option && setSelectedPatient(option.value)}
                  onInputChange={(value) => setSearchTerm(value)}
                  isDisabled={!!editingPayment}
                  placeholder="Search for a patient..."
                  className="w-full"
                  classNamePrefix="react-select"
                />
              ) : (
                <select
                  id="patient"
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  disabled={!!editingPayment}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a patient</option>
                  {patients.map((patient) => (
                    <option key={patient.patient_id} value={patient.patient_id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">
                Payment Date
              </label>
              <input
                type="date"
                id="paymentDate"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select payment method</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  min="0"
                  step="0.01"
                  className="w-full border rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                maxLength={100}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setIsDialogOpen(false)
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin"></div>
                    Submitting...
                  </span>
                ) : editingPayment ? (
                  "Update Payment"
                ) : (
                  "Add Payment"
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      )}
    </div>
  )
}

