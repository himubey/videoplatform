'use client';

import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

export default function ClassesPage() {
  const { data: session } = useSession();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClass, setEditingClass] = useState(null);
  const [newClass, setNewClass] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes');
      if (!response.ok) {
        throw new Error('Failed to fetch classes');
      }
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClass),
      });

      if (!response.ok) {
        throw new Error('Failed to create class');
      }

      await fetchClasses();
      setNewClass({ name: '', description: '' });
      toast.success('Class created successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create class');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/classes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingClass),
      });

      if (!response.ok) {
        throw new Error('Failed to update class');
      }

      await fetchClasses();
      setEditingClass(null);
      toast.success('Class updated successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update class');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) {
      return;
    }

    try {
      const response = await fetch(`/api/classes?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete class');
      }

      await fetchClasses();
      toast.success('Class deleted successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete class');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Manage Classes</h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Class Name
            </label>
            <input
              type="text"
              id="name"
              value={newClass.name}
              onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={newClass.description}
              onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="mr-2" /> Add Class
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classes.map((classItem) => (
              <tr key={classItem.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingClass?.id === classItem.id ? (
                    <input
                      type="text"
                      value={editingClass.name}
                      onChange={(e) =>
                        setEditingClass({ ...editingClass, name: e.target.value })
                      }
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  ) : (
                    classItem.name
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingClass?.id === classItem.id ? (
                    <textarea
                      value={editingClass.description}
                      onChange={(e) =>
                        setEditingClass({ ...editingClass, description: e.target.value })
                      }
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows="2"
                    />
                  ) : (
                    classItem.description
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingClass?.id === classItem.id ? (
                    <div className="space-x-2">
                      <button
                        onClick={handleEdit}
                        className="text-green-600 hover:text-green-900"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingClass(null)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="space-x-2">
                      <button
                        onClick={() => setEditingClass(classItem)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEdit className="inline-block" />
                      </button>
                      <button
                        onClick={() => handleDelete(classItem.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="inline-block" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 