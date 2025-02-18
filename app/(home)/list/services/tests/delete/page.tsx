"use client"

import { useState, useEffect } from "react"

export default function DeleteLabTest({ testName }: { testName: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAssociatedWithPatients, setIsAssociatedWithPatients] = useState(false)

  useEffect(() => {
    const checkTestAssociation = async () => {
      const response = await fetch(`/api/lab-tests/${testName}/check-association`)
      if (response.ok) {
        const { isAssociated } = await response.json()
        setIsAssociatedWithPatients(isAssociated)
      }
    }
    checkTestAssociation()
  }, [testName])

  const handleDelete = async () => {
    const response = await fetch(`/api/lab-tests/${testName}`, {
      method: "DELETE",
    })
    if (response.ok) {
      window.location.href = '/list/services/tests'
    } else {
      // Handle error
      console.error("Failed to delete lab test")
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Delete
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold">Are you sure?</h2>
            <p className="mt-2 text-sm text-gray-500">
              This action cannot be undone. This will permanently delete the lab test.
            </p>

            {isAssociatedWithPatients && (
              <p className="mt-2 text-red-500">
                This lab test is associated with some patients. You cannot delete it.
              </p>
            )}

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              {!isAssociatedWithPatients && (
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
