"use client"


export default function InvoiceDetailsPage() {
  // Mock data; Replace with actual invoice data from backend or props
  const invoice = {
    order_id: '12345',
    date: '2024-02-01',
    amount: '500',
    status: 'Paid',
    items: [
      { description: 'Product 1', price: 100 },
      { description: 'Product 2', price: 200 },
      { description: 'Service 1', price: 200 },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8">Invoice Details</h1>
      <div className="space-y-4">
        <div>
          <span className="font-bold">Order ID:</span> {invoice.order_id}
        </div>
        <div>
          <span className="font-bold">Date:</span> {invoice.date}
        </div>
        <div>
          <span className="font-bold">Amount:</span> ${invoice.amount}
        </div>
        <div>
          <span className="font-bold">Status:</span> {invoice.status}
        </div>

        <table className="min-w-full border-collapse mt-4">
          <thead>
            <tr>
              <th className="border-b-2 p-2">Description</th>
              <th className="border-b-2 p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td className="border-b p-2">{item.description}</td>
                <td className="border-b p-2">${item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-6">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg"
            onClick={() => window.print()}
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

