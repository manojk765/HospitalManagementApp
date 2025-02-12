"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Manufacturer = {
  vendor_pharm_name: string;
};

export default function NewMedicineForm() {
  const router = useRouter();
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [formData, setFormData] = useState({
    medicine_name: '',
    stock_quantity: '',
    price_per_unit: '',
    unit_quantity: '',
    batch_number: '',
    expiry_date: '',
    manufacturer_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all manufacturers on component mount
  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const response = await fetch('/api/manufacturer');
        const data = await response.json();
        setManufacturers(data);
      } catch (error) {
        console.error('Failed to fetch manufacturers:', error);
      }
    };

    fetchManufacturers();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/medicine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create medicine');
      }

      router.push('/medicine/medicines');
      router.refresh();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Add New Medicine</h1>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Medicine Name</label>
          <input
            type="text"
            name="medicine_name"
            value={formData.medicine_name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Manufacturer</label>
          <select
            name="manufacturer_name"
            value={formData.manufacturer_name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded-md bg-white"
          >
            <option value="">Select Manufacturer</option>
            {manufacturers.map((manufacturer) => (
              <option 
                key={manufacturer.vendor_pharm_name} 
                value={manufacturer.vendor_pharm_name}
              >
                {manufacturer.vendor_pharm_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stock Quantity</label>
          <input
            type="number"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price per Unit</label>
          <input
            type="number"
            name="price_per_unit"
            value={formData.price_per_unit}
            onChange={handleInputChange}
            required
            step="0.01"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Unit Quantity</label>
          <input
            type="number"
            name="unit_quantity"
            value={formData.unit_quantity}
            onChange={handleInputChange}
            required
            step="0.01"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Batch Number</label>
          <input
            type="text"
            name="batch_number"
            value={formData.batch_number}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Expiry Date</label>
          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Creating...' : 'Create Medicine'}
      </button>
    </form>
  );
}