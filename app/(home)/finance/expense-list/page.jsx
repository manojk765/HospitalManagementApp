"use client"

import Link from 'next/link';

export default function InvoiceListPage() {
  const invoices = [
    { order_id: '12345', date: '2024-02-01', amount: '500', status: 'Paid' },
    { order_id: '12346', date: '2024-02-02', amount: '300', status: 'Pending' },
    { order_id: '12347', date: '2024-02-03', amount: '400', status: 'Paid' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8">Invoices</h1>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Order ID</th> 
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{invoice.order_id}</td>
              <td className="px-4 py-2">{invoice.date}</td>
              <td className="px-4 py-2">${invoice.amount}</td>
              <td className="px-4 py-2">{invoice.status}</td>
              <td className="px-4 py-2 space-x-4">
                <Link href={`/invoice/${invoice.order_id}`}>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg">
                    View
                  </button>
                </Link>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg"
                  onClick={() => window.print()}
                >
                  Print
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
