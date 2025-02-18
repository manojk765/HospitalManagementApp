'use client'

import { useState } from 'react';

interface DeleteDepartmentButtonProps {
  departmentName: string;
}

const DeleteDepartmentButton: React.FC<DeleteDepartmentButtonProps> = ({ departmentName }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this department?')) {
      try {
        setLoading(true);
        const response = await fetch(`/api/departments/${departmentName}`, {
          method: 'DELETE',
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        window.location.reload(); // Refresh the page after successful delete
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700"
      disabled={loading}
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
};

export default DeleteDepartmentButton;
