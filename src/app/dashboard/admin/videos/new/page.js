'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiUpload, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function UploadVideoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    chapterId: '',
    classId: '',
    examType: '',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subjects
        const subjectsResponse = await fetch('/api/subjects');
        const subjectsData = await subjectsResponse.json();
        setSubjects(subjectsData);

        // Fetch classes
        const classesResponse = await fetch('/api/classes');
        const classesData = await classesResponse.json();
        setClasses(classesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load required data');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (formData.subjectId) {
      const fetchChapters = async () => {
        try {
          const response = await fetch(`/api/chapters?subjectId=${formData.subjectId}`);
          const data = await response.json();
          setChapters(data);
        } catch (error) {
          console.error('Error fetching chapters:', error);
        }
      };

      fetchChapters();
    } else {
      setChapters([]);
    }
  }, [formData.subjectId]);

  const getFilteredClasses = () => {
    if (!formData.examType) return [];
    
    const examTypeMap = {
      'JEE': ['11th JEE', '12th JEE'],
      'NEET': ['11th NEET', '12th NEET'],
      'Regular': ['Class 9th', 'Class 10th']
    };

    return classes.filter(cls => examTypeMap[formData.examType].includes(cls.name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', videoFile);
      formDataToSend.append('thumbnail', thumbnailFile);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('subjectId', formData.subjectId);
      formDataToSend.append('chapterId', formData.chapterId);
      formDataToSend.append('classId', formData.classId);
      formDataToSend.append('examType', formData.examType);

      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload video');
      }

      const data = await response.json();
      router.push('/dashboard/admin/videos');
    } catch (error) {
      console.error('Error uploading video:', error);
      setError(error.message);
    }  finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e, type) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (type === 'video') {
        setVideoFile(selectedFile);
      } else if (type === 'thumbnail') {
        setThumbnailFile(selectedFile);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset classId when exam type changes
      ...(name === 'examType' && { classId: '' })
    }));
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session?.user || !['admin', 'teacher'].includes(session.user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
          <p className="mt-1 text-sm text-gray-500">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const filteredClasses = getFilteredClasses();

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mb-8">
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Upload New Video</h1>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
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
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="examType" className="block text-sm font-medium text-gray-700">
                Exam Type
              </label>
              <select
                id="examType"
                name="examType"
                value={formData.examType}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select Exam Type</option>
                <option value="JEE">JEE</option>
                <option value="NEET">NEET</option>
                <option value="Regular">Regular</option>
              </select>
            </div>

            {formData.examType && (
              <div>
                <label htmlFor="classId" className="block text-sm font-medium text-gray-700">
                  Class
                </label>
                <select
                  id="classId"
                  name="classId"
                  value={formData.classId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Class</option>
                  {filteredClasses.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <select
                id="subjectId"
                name="subjectId"
                value={formData.subjectId}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {formData.subjectId && (
              <div>
                <label htmlFor="chapterId" className="block text-sm font-medium text-gray-700">
                  Chapter
                </label>
                <select
                  id="chapterId"
                  name="chapterId"
                  value={formData.chapterId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Chapter</option>
                  {chapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="videoFile" className="block text-sm font-medium text-gray-700">
                Video File
              </label>
              <input
                type="file"
                id="videoFile"
                accept="video/*"
                onChange={(e) => handleFileChange(e, 'video')}
                className="mt-1 block w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="thumbnailFile" className="block text-sm font-medium text-gray-700">
                Thumbnail
              </label>
              <input
                type="file"
                id="thumbnailFile"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'thumbnail')}
                className="mt-1 block w-full"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  <>
                    <FiUpload className="mr-2" />
                    Upload Video
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
