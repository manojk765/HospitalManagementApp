'use client'

import { useState } from 'react';

interface DeleteStaffButtonProps {
  id : string;
}

const DeleteStaffButton : React.FC<DeleteStaffButtonProps> = ({ id }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this staff?')) {
      try {
        setLoading(true);
        const response = await fetch(`/api/staff/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        window.location.reload(); 
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

export default DeleteStaffButton;
