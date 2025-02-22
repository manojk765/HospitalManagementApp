  'use client';
  
  import { useState, useEffect } from 'react';
  import Link from 'next/link';
  
  export interface Expense {
      id: number;
      title: string;
      amount: number;
      type: string;
      date: Date;
      category: string;
      description: string;
    }
    
    export interface ExpenseFormData {
      title: string;
      amount: string;
      type: string;
      date: string;
      category: string;
      description: string;
    }
    
  
  export default function ExpenseList() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
  
    useEffect(() => {
      fetchExpenses();
    }, []);
  
    const fetchExpenses = async () => {
      const response = await fetch('/api/expense');
      const data = await response.json();
      setExpenses(data);
    };
  
    const deleteExpense = async (id: number) => {
      try {
        await fetch(`/api/expense/${id}`, {
          method: 'DELETE',
        });
        fetchExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    };
  
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Expenses</h1>
        <Link href="/finance/expense/create">
          <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
            Add New Expense
          </button>
        </Link>
        <div className="grid gap-4">
          {expenses.map((expense) => (
            <div key={expense.id} className="border p-4 rounded">
              <h2 className="text-xl">{expense.title}</h2>
              <p>Amount: ${expense.amount}</p>
              <p>Category: {expense.category}</p>
              <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
              <div className="mt-2">
                <Link href={`/finance/expense/edit/${expense.id}`}>
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  