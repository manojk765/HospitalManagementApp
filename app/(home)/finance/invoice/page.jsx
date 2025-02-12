"use client"

import { useState } from 'react';

export default function CreateInvoicePage() {
  const [invoice, setInvoice] = useState({
    order_id: '',
    date: '',
    amount: '',
    status: 'Pending',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(invoice);
    // Here you can handle the creation logic, such as saving the invoice to a database
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8">Create Invoice</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium">Order ID</label>
          <input
            type="text"
            name="order_id"
            value={invoice.order_id}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={invoice.date}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium">Amount</label>
          <input
            type="number"
            name="amount"
            value={invoice.amount}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium">Status</label>
          <select
            name="status"
            value={invoice.status}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg"
            onClick={() => window.print()}
          >
            Print Invoice
          </button>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg"
          >
            View Invoice
          </button>
        </div>
      </form>
    </div>
  );
}
