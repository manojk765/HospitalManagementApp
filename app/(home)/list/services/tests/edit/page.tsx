"use client"

import type React from "react"

import { useState, useEffect } from "react"

export default function EditLabTest({ testName }: { testName: string }) {
  const [description, setDescription] = useState("")
  const [cost, setCost] = useState("")

  useEffect(() => {
    const fetchTest = async () => {
      const response = await fetch(`/api/lab-tests/${testName}`)
      if (response.ok) {
        const test = await response.json()
        setDescription(test.description)
        setCost(test.cost.toString())
      }
    }
    fetchTest()
  }, [testName])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch(`/api/lab-tests/${testName}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, cost: Number.parseFloat(cost) }),
    })
    if (response.ok) {
      window.location.href = '/list/services/tests'
    } else {
      // Handle error
      console.error("Failed to update lab test")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="testName">Test Name</label>
        <input
          id="testName"
          type="text"
          value={testName}
          disabled
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="cost">Cost</label>
        <input
          id="cost"
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          placeholder="Cost"
          step="0.01"
          required
          className="border p-2 w-full"
        />
      </div>
      <div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Update Lab Test
        </button>
      </div>
    </form>
  )
}
