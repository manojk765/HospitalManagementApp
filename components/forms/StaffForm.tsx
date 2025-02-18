"use client"

import { useState, useEffect } from 'react';
import { Decimal } from '@prisma/client/runtime/library';
import { ChangeEvent } from 'react';

interface Staff {
    staff_id: string;
    name: string;
    role: string;
    contact_number: string;
    email: string;
    shift_time: string;
    department_name: string;
    salary: Decimal;
    department: {
      department_name: string;
    };
}
  
interface Department {
  department_name: string;
}

interface StaffFormProps {
  staff?: Staff;
  isEdit?: boolean;
}

const StaffForm: React.FC<StaffFormProps> = ({ staff, isEdit = false }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await fetch('/api/departments');
      const data = await response.json();
      setDepartments(data);
    };
    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.currentTarget;
    const formData = {
      staff_id: (form.elements.namedItem('staff_id') as HTMLInputElement).value,
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      role: (form.elements.namedItem('role') as HTMLInputElement).value,
      contact_number: (form.elements.namedItem('contact_number') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      shift_time: (form.elements.namedItem('shift_time') as HTMLInputElement).value,
      department_name: (form.elements.namedItem('department_name') as HTMLSelectElement).value,
      salary: parseFloat((form.elements.namedItem('salary') as HTMLInputElement).value),
    };

    try {
      const url = isEdit ? `/api/staff/${staff?.staff_id}` : '/api/staff';
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

      window.location.href = '/list/staff/staff-list';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const [selectedDepartment, setSelectedDepartment] = useState(staff?.department_name || '');

  useEffect(() => {
    if (staff?.department_name) {
      setSelectedDepartment(staff.department_name);
    }
  }, [staff?.department_name]);

  const handleDepartmentChange = ( e: ChangeEvent<HTMLSelectElement> ) => {
    const selectedValue = e.target.value;
    setSelectedDepartment(selectedValue);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? 'Edit Staff Member' : 'Add New Staff Member'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={`${isEdit ? '' : 'hidden'}`}>
          <label className="block text-sm font-medium mb-2">Staff ID</label>
          <input
            type="text"
            name="staff_id"
            defaultValue={staff?.staff_id || "SXXX" }
            required
            disabled={isEdit}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            defaultValue={staff?.name}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Role</label>
          <input
            type="text"
            name="role"
            defaultValue={staff?.role}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Contact Number</label>
          <input
            type="tel"
            name="contact_number"
            defaultValue={staff?.contact_number}
            pattern="[0-9]{10}"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            defaultValue={staff?.email}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Shift Time</label>
          <input
            type="text"
            name="shift_time"
            defaultValue={staff?.shift_time}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
            <label className="block text-sm font-medium mb-2">Department</label>
            <select
                name="department_name"
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                required
                className="w-full p-2 border rounded"
            >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                <option key={dept.department_name} value={dept.department_name}>
                    {dept.department_name}
                </option>
                ))}
            </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Salary</label>
          <input
            type="number"
            name="salary"
            defaultValue={staff?.salary ? Number(staff.salary) : ''}
            required
            step="0.01"
            min="0"
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : isEdit ? 'Update Staff' : 'Add Staff'}
        </button>
      </form>
    </div>
  );
};

export default StaffForm;