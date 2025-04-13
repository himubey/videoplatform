'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {session.user.name || session.user.email}!
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {session.user.role === 'admin' ? 'Admin Dashboard' : 'Teacher Dashboard'}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/dashboard/upload"
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900">Upload Video</h2>
              <p className="mt-2 text-gray-600">Upload new educational videos</p>
            </Link>

            <Link
              href="/dashboard/videos"
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900">My Videos</h2>
              <p className="mt-2 text-gray-600">Manage your uploaded videos</p>
            </Link>

            <Link
              href="/dashboard/profile"
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
              <p className="mt-2 text-gray-600">Update your profile information</p>
            </Link>
          </div>

          {session.user.role === 'admin' && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900">Admin Tools</h2>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                  href="/dashboard/users"
                  className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  <p className="mt-2 text-gray-600">Manage users and permissions</p>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 