"use client"

import { useState } from 'react';

export default function InventoryPage() {
  // Initial inventory items data; replace with actual hospital inventory data from backend
  const initialInventoryItems = [
    {
      name: 'Surgical Masks',
      category: 'Personal Protective Equipment',
      supplier: 'Health Supplies Ltd.',
      availableQuantity: 1000,
      totalQuantity: 1500,
      totalIssued: 500,
      status: 'Available',
    },
    {
      name: 'Sterile Gloves',
      category: 'Personal Protective Equipment',
      supplier: 'MedCare Supplies',
      availableQuantity: 2000,
      totalQuantity: 3000,
      totalIssued: 1000,
      status: 'Available',
    },
    {
      name: 'Bandages',
      category: 'First Aid',
      supplier: 'Medical Goods Co.',
      availableQuantity: 500,
      totalQuantity: 700,
      totalIssued: 200,
      status: 'Available',
    },
    {
      name: 'Oxygen Cylinder',
      category: 'Medical Equipment',
      supplier: 'Health Supplies Ltd.',
      availableQuantity: 50,
      totalQuantity: 100,
      totalIssued: 50,
      status: 'Available',
    },
    {
      name: 'Thermometers',
      category: 'Medical Equipment',
      supplier: 'MedCare Supplies',
      availableQuantity: 150,
      totalQuantity: 200,
      totalIssued: 50,
      status: 'Available',
    },
  ];

  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);

  const handleDelete = (index) => {
    const updatedItems = inventoryItems.filter((_, itemIndex) => itemIndex !== index);
    setInventoryItems(updatedItems);
  };

  const handleEdit = (index) => {
    const updatedItems = [...inventoryItems];
    updatedItems[index] = {
      ...updatedItems[index],
      name: prompt('Enter new item name:', updatedItems[index].name),
      category: prompt('Enter new category:', updatedItems[index].category),
      supplier: prompt('Enter new supplier:', updatedItems[index].supplier),
      availableQuantity: parseInt(prompt('Enter new available quantity:', updatedItems[index].availableQuantity)),
      totalQuantity: parseInt(prompt('Enter new total quantity:', updatedItems[index].totalQuantity)),
      totalIssued: parseInt(prompt('Enter new total issued:', updatedItems[index].totalIssued)),
      status: prompt('Enter new status:', updatedItems[index].status),
    };
    setInventoryItems(updatedItems);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8">Hospital Inventory</h1>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border border-gray-300">Item Name</th>
            <th className="px-4 py-2 border border-gray-300">Category</th>
            <th className="px-4 py-2 border border-gray-300">Supplier</th>
            <th className="px-4 py-2 border border-gray-300">Available Quantity</th>
            <th className="px-4 py-2 border border-gray-300">Total Quantity</th>
            <th className="px-4 py-2 border border-gray-300">Total Issued</th>
            <th className="px-4 py-2 border border-gray-300">Status</th>
            <th className="px-4 py-2 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventoryItems.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.category}</td>
              <td className="px-4 py-2">{item.supplier}</td>
              <td className="px-4 py-2">{item.availableQuantity}</td>
              <td className="px-4 py-2">{item.totalQuantity}</td>
              <td className="px-4 py-2">{item.totalIssued}</td>
              <td className="px-4 py-2">{item.status}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
