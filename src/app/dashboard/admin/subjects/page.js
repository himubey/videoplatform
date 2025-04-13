'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FiEdit, FiTrash2, FiBook } from 'react-icons/fi';

export default function SubjectsPage() {
  const { data: session } = useSession();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSubject, setNewSubject] = useState({ name: '', description: '' });
  const [isEditing, setIsEditing] = useState(null);
  const [editData, setEditData] = useState({ name: '', description: '' });
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [newChapter, setNewChapter] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/subjects');
      const data = await res.json();
      setSubjects(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch subjects');
      setLoading(false);
    }
  };

  const fetchChapters = async (subjectId) => {
    try {
      const res = await fetch(`/api/chapters?subjectId=${subjectId}`);
      const data = await res.json();
      setChapters(data);
    } catch (error) {
      setError('Failed to fetch chapters');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSubject),
      });

      if (!res.ok) {
        throw new Error('Failed to create subject');
      }

      const data = await res.json();
      setSubjects([...subjects, data]);
      setNewSubject({ name: '', description: '' });
    } catch (error) {
      setError('Failed to create subject');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/subjects/${isEditing}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (!res.ok) {
        throw new Error('Failed to update subject');
      }

      const data = await res.json();
      setSubjects(subjects.map(subject => 
        subject.id === isEditing ? data : subject
      ));
      setIsEditing(null);
    } catch (error) {
      setError('Failed to update subject');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this subject?')) {
      return;
    }

    try {
      const res = await fetch(`/api/subjects/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete subject');
      }

      setSubjects(subjects.filter(subject => subject.id !== id));
    } catch (error) {
      setError('Failed to delete subject');
    }
  };

  const handleChapterSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/chapters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newChapter,
          subjectId: selectedSubject.id,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create chapter');
      }

      const data = await res.json();
      setChapters([...chapters, data]);
      setNewChapter({ name: '', description: '' });
    } catch (error) {
      setError('Failed to create chapter');
    }
  };

  const handleManageChapters = (subject) => {
    setSelectedSubject(subject);
    fetchChapters(subject.id);
    setIsChapterModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Manage Subjects</h1>
          </div>

          {/* Add new subject form */}
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Subject</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  value={newSubject.description}
                  onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Subject
                </button>
              </div>
            </form>
          </div>

          {/* Subjects list */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subjects.map((subject) => (
                  <tr key={subject.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing === subject.id ? (
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing === subject.id ? (
                        <textarea
                          value={editData.description}
                          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                          className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      ) : (
                        <div className="text-sm text-gray-500">{subject.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        {isEditing === subject.id ? (
                          <>
                            <button
                              onClick={handleEdit}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setIsEditing(null)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleManageChapters(subject)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Manage Chapters"
                            >
                              <FiBook className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => {
                                setIsEditing(subject.id);
                                setEditData({
                                  name: subject.name,
                                  description: subject.description,
                                });
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit Subject"
                            >
                              <FiEdit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(subject.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Subject"
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Chapter Management Modal */}
      {isChapterModalOpen && selectedSubject && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>
            <div className="inline-block bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Manage Chapters for {selectedSubject.name}
                </h2>
                <button
                  onClick={() => {
                    setIsChapterModalOpen(false);
                    setSelectedSubject(null);
                    setChapters([]);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Add new chapter form */}
              <form onSubmit={handleChapterSubmit} className="mb-6 space-y-4">
                <div>
                  <label htmlFor="chapterName" className="block text-sm font-medium text-gray-700">
                    Chapter Name
                  </label>
                  <input
                    type="text"
                    id="chapterName"
                    required
                    value={newChapter.name}
                    onChange={(e) => setNewChapter({ ...newChapter, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="chapterDescription" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="chapterDescription"
                    rows={3}
                    value={newChapter.description}
                    onChange={(e) => setNewChapter({ ...newChapter, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Chapter
                  </button>
                </div>
              </form>

              {/* Chapters list */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Existing Chapters</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {chapters.length === 0 ? (
                    <p className="text-gray-500 text-sm">No chapters added yet</p>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {chapters.map((chapter) => (
                        <li key={chapter.id} className="py-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{chapter.name}</h4>
                              {chapter.description && (
                                <p className="mt-1 text-sm text-gray-500">{chapter.description}</p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditChapter(chapter)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <FiEdit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteChapter(chapter.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
} 