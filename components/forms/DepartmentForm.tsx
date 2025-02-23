"use client"

import { useState } from 'react';

interface Department {
  department_name: string;
  head_of_department?: string | null;
}

interface DepartmentFormProps {
  department?: Department | null;
  isEdit?: boolean;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({ department = null, isEdit = false }) => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = {
      department_name: (e.currentTarget.department_name as HTMLInputElement).value,
      head_of_department: (e.currentTarget.head_of_department as HTMLInputElement).value || null,
    };

    try {
      const url = isEdit
        ? `/api/departments/${department?.department_name}`
        : '/api/departments';

      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      window.location.href = '/list/staff/departments';
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? 'Edit Department' : 'Add New Department'}
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-6">
          <div className="flex">
            <span className="mr-2">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Department Name</label>
          <input
            type="text"
            name="department_name"
            defaultValue={department?.department_name || ''}
            disabled={isEdit}
            required
            className="w-full p-2 border rounded-md disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Head of Department</label>
          <input
            type="text"
            name="head_of_department"
            defaultValue={department?.head_of_department || ''}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : isEdit ? 'Update Department' : 'Add Department'}
        </button>
      </form>
    </div>
  );
};

export default DepartmentForm;
