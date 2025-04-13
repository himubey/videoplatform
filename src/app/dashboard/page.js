'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [content, setContent] = useState({ videos: [], documents: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
    // Redirect teachers and admins to their respective dashboards
    if (session?.user?.role && session.user.role !== 'student') {
      router.push('/dashboard/admin');
    }
  }, [status, router, session]);

  useEffect(() => {
    if (session?.user) {
      fetchSubjects();
    }
  }, [session]);

  useEffect(() => {
    if (selectedSubject) {
      fetchChapters(selectedSubject.id);
      fetchContent(selectedSubject.id);
    }
  }, [selectedSubject]);

  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/subjects');
      const data = await res.json();
      setSubjects(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setLoading(false);
    }
  };

  const fetchChapters = async (subjectId) => {
    try {
      setError(null);
      const res = await fetch(`/api/chapters?subjectId=${subjectId}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const text = await res.text(); // Get the response as text first
      try {
        const data = JSON.parse(text); // Try to parse it as JSON
        setChapters(data);
      } catch (e) {
        console.error('Failed to parse JSON:', text);
        throw new Error('Invalid JSON response from server');
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
      setError('Failed to load chapters. Please try again.');
      setChapters([]);
    }
  };

  const fetchContent = async (subjectId) => {
    try {
      const [videosRes, documentsRes] = await Promise.all([
        fetch(`/api/videos?subjectId=${subjectId}`),
        fetch(`/api/documents?subjectId=${subjectId}`)
      ]);
      
      const [videos, documents] = await Promise.all([
        videosRes.json(),
        documentsRes.json()
      ]);

      setContent({ videos, documents });
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome, {session.user.name}
        </h1>

        {/* Subject Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Subjects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject)}
                className={`p-4 rounded-lg shadow ${
                  selectedSubject?.id === subject.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white hover:bg-indigo-50'
                }`}
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>

        {selectedSubject && (
          <>
            {/* Chapters */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Chapters</h2>
              {error ? (
                <div className="text-red-600 bg-red-50 p-4 rounded-lg mb-4">
                  {error}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="bg-white p-4 rounded-lg shadow"
                    >
                      <h3 className="font-medium">{chapter.name}</h3>
                      <p className="text-sm text-gray-500">{chapter.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Videos */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Videos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {content.videos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-white rounded-lg shadow overflow-hidden"
                  >
                    {video.thumbnail && (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-medium">{video.title}</h3>
                      <p className="text-sm text-gray-500">{video.description}</p>
                      <button
                        onClick={() => router.push(`/watch/${video.id}`)}
                        className="mt-2 text-indigo-600 hover:text-indigo-800"
                      >
                        Watch Video
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Documents</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {content.documents.map((document) => (
                  <div
                    key={document.id}
                    className="bg-white p-4 rounded-lg shadow"
                  >
                    <h3 className="font-medium">{document.title}</h3>
                    <p className="text-sm text-gray-500">{document.description}</p>
                    <a
                      href={document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-indigo-600 hover:text-indigo-800 block"
                    >
                      View Document
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 