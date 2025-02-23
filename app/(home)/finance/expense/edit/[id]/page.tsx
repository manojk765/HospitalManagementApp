
  'use client';
  
  import { useState, useEffect } from 'react';
  import { useRouter } from 'next/navigation';
  import { ExpenseFormData } from '../../page';

  interface PageProps {
    params: {
      id: string;
    };
  }

  export default function EditExpense({ params }: PageProps ) {
    const router = useRouter();
    const { id } = params;
    
    const [formData, setFormData] = useState<ExpenseFormData>({
      title: '',
      amount: '',
      type: 'expense',
      date: '',
      category: '',
      description: '',
    });
  
    useEffect(() => {
      const fetchExpense = async () => {
        try {
          const response = await fetch(`/api/expense/${id}`);
          const data = await response.json();
          setFormData({
            ...data,
            amount: data.amount.toString(),
            date: new Date(data.date).toISOString().split('T')[0],
          });
        } catch (error) {
          console.error('Error fetching expense:', error);
        }
      };
    
      if (id) {
        fetchExpense();
      }
    }, [id]);
      
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await fetch(`/api/expense/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          router.push('/finance/expenses');
        }
      } catch (error) {
        console.error('Error updating expense:', error);
      }
    };
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Edit Expense</h1>
        <form onSubmit={handleSubmit} className="max-w-md">
          <div className="mb-4">
            <label className="block mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              maxLength={50}
            />
          </div>
  
          <div className="mb-4">
            <label className="block mb-2">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              step="0.01"
            />
          </div>
  
          <div className="mb-4">
            <label className="block mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
  
          <div className="mb-4">
            <label className="block mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              maxLength={50}
            />
          </div>
  
          <div className="mb-4">
            <label className="block mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              maxLength={20}
            />
          </div>
  
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Update Expense
          </button>
        </form>
      </div>
    );
  }
  

  