'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [videos, setVideos] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.role !== 'student') {
      router.push('/dashboard');
      return;
    }
    fetchClassesAndSubjects();
  }, [session, router]);

  const fetchClassesAndSubjects = async () => {
    try {
      const [classesResponse, subjectsResponse] = await Promise.all([
        fetch('/api/classes'),
        fetch('/api/subjects'),
      ]);

      const classesData = await classesResponse.json();
      const subjectsData = await subjectsResponse.json();

      setClasses(classesData);
      setSubjects(subjectsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const fetchContent = async () => {
    if (!selectedClass || !selectedSubject) return;

    try {
      const [videosResponse, documentsResponse] = await Promise.all([
        fetch(`/api/videos?class=${selectedClass}&subject=${selectedSubject}`),
        fetch(`/api/documents?class=${selectedClass}&subject=${selectedSubject}`),
      ]);

      const videosData = await videosResponse.json();
      const documentsData = await documentsResponse.json();

      setVideos(videosData);
      setDocuments(documentsData);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Select Class and Subject</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={fetchContent}
          disabled={!selectedClass || !selectedSubject}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Load Content
        </button>
      </div>

      {videos.length > 0 && (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Videos</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <div key={video.id} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{video.title}</h4>
                <p className="text-sm text-gray-500">{video.description}</p>
                <div className="mt-4">
                  <button
                    onClick={() => router.push(`/dashboard/student/video/${video.id}`)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Watch Video
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {documents.length > 0 && (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((document) => (
              <div key={document.id} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{document.title}</h4>
                <p className="text-sm text-gray-500">{document.description}</p>
                <div className="mt-4">
                  <button
                    onClick={() => router.push(`/dashboard/student/document/${document.id}`)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View Document
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 