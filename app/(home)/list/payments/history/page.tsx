"use client"

import { Suspense, useEffect, useState } from "react"
import { Trash2, Search } from "lucide-react"
import { useSearchParams } from "next/navigation"
import TableSearch from "@/components/tablesearch"

interface Payment {
  payment_id: string
  patient_id: string
  patient_name: string
  payment_date: string
  payment_method: string
  amount_paid: number
}

// Separate component for the table content that uses searchParams
function PaymentsTable() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [searchDate, setSearchDate] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const fetchPayments = async (date?: string) => {
    try {
      const url = date ? `/api/payments?date=${date}` : '/api/payments'
      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch payments")
      const data = await response.json()
      setPayments(data)
      setFilteredPayments(data)
    } catch (err) {
      setError("Failed to load payments. Please try again later.")
      console.error(err)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        await fetchPayments()
      } catch (err) {
        setError("Failed to load data. Please check your connection and try again.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (searchDate) {
      fetchPayments(searchDate)
    }
  }, [searchDate])

  useEffect(() => {
    if (searchQuery) {
      const filtered = payments.filter(payment => 
        payment.payment_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.patient_id.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredPayments(filtered)
    } else {
      setFilteredPayments(payments)
    }
  }, [searchQuery, payments])

  const handleDelete = async (paymentId: string) => {
    if (!confirm("Are you sure you want to delete this payment?")) return

    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete payment")

      setSuccessMessage("Payment deleted successfully!")
      await fetchPayments(searchDate || undefined)
    } catch (err) {
      setError("Failed to delete payment. Please try again.")
      console.error(err)
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value
    setSearchDate(selectedDate)
    if (!selectedDate) {
      fetchPayments()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <>
      {(error || successMessage) && (
        <div
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 p-4 rounded-2xl shadow-lg transition-all duration-500 text-white w-full max-w-md ${
            error ? 'bg-red-600' : 'bg-green-600'
          }`}
          role="alert"
        >
          <p className="text-center text-lg font-semibold">
            {error || successMessage}
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg mb-8">
        <div className="p-6 bg-gray-50 rounded-t-lg">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <TableSearch />
            <div className="relative">
              <input
                type="date"
                value={searchDate}
                onChange={handleDateChange}
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
                <th className="p-3 text-right text-sm font-medium text-gray-700">Amount</th>
                <th className="p-3 text-center text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No payments found
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.payment_id} className="border-b hover:bg-gray-50 transition duration-200">
                    <td className="p-3 text-sm text-gray-700">{payment.payment_id}</td>
                    <td className="p-3 text-sm text-gray-700">{payment.patient_id} - {payment.patient_name}</td>
                    <td className="p-3 text-sm text-gray-700">{new Date(payment.payment_date).toLocaleDateString()}</td>
                    <td className="p-3 text-sm text-gray-700">{payment.payment_method}</td>
                    <td className="p-3 text-sm text-right text-gray-700">₹{Number(payment.amount_paid).toFixed(2)}</td>
                    <td className="p-3 flex justify-center">
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
    </>
  )
}

// Main component with proper Suspense boundary
export default function PaymentsHistoryPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Payments History</h1>
      </div>
      
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }>
        <PaymentsTable />
      </Suspense>
    </div>
  )
}