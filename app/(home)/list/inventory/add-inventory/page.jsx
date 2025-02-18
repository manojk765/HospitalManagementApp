"use client"

import { useState } from 'react';

export default function AddInventoryPage() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [supplier, setSupplier] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalIssued, setTotalIssued] = useState(0);
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to send data to backend or update state management
    console.log({ name, category, supplier, availableQuantity, totalQuantity, totalIssued, status });
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Add New Inventory Item</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Item Name</label>
          <input
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Supplier</label>
          <input
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Available Quantity</label>
          <input
            type="number"
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            value={availableQuantity}
            onChange={(e) => setAvailableQuantity(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Total Quantity</label>
          <input
            type="number"
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            value={totalQuantity}
            onChange={(e) => setTotalQuantity(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Total Issued</label>
          <input
            type="number"
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            value={totalIssued}
            onChange={(e) => setTotalIssued(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <input
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-lg">Add Item</button>
      </form>
    </div>
  );
}
