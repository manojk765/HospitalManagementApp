"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"

export default function AddLabTest() {
  const [testName, setTestName] = useState("")
  const [description, setDescription] = useState("")
  const [cost, setCost] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()

  // State to hold the existing lab tests
  const [existingTests, setExistingTests] = useState<string[]>([])

  useEffect(() => {
    // Fetch existing tests when component mounts
    const fetchExistingTests = async () => {
      const response = await fetch("/api/lab-tests")
      if (response.ok) {
        const data = await response.json()
        setExistingTests(data.map((test: { test_name: string }) => test.test_name))
      } else {
        console.error("Failed to fetch existing lab tests")
      }
    }
    fetchExistingTests()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if test name already exists
    if (existingTests.includes(testName)) {
      setErrorMessage("Test already exists. Cannot add this test.")
      return
    }

    const response = await fetch("/api/lab-tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test_name: testName, description, cost: Number.parseFloat(cost) }),
    })

    if (response.ok) {
      router.push("/lab-tests")
    } else {
      console.error("Failed to add lab test")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="text-red-500 text-sm">{errorMessage}</div>
      )}
      <input
        type="text"
        value={testName}
        onChange={(e) => setTestName(e.target.value)}
        placeholder="Test Name"
        required
        className="p-2 border border-gray-300 rounded"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
        className="p-2 border border-gray-300 rounded"
      />
      <input
        type="number"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        placeholder="Cost"
        step="0.01"
        required
        className="p-2 border border-gray-300 rounded"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Add Lab Test
      </button>
    </form>
  )
}
