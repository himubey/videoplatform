'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome, {session?.user?.name || session?.user?.email}!
          </h2>
          <p className="text-gray-600 mb-6">
            Manage your videos and account settings from here.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/dashboard/upload"
              className="bg-indigo-50 p-6 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <h3 className="text-lg font-medium text-indigo-900 mb-2">
                Upload Video
              </h3>
              <p className="text-indigo-700">
                Upload new educational videos to your collection.
              </p>
            </Link>

            <Link
              href="/dashboard/videos"
              className="bg-indigo-50 p-6 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <h3 className="text-lg font-medium text-indigo-900 mb-2">
                My Videos
              </h3>
              <p className="text-indigo-700">
                View and manage your uploaded videos.
              </p>
            </Link>

            <Link
              href="/dashboard/profile"
              className="bg-indigo-50 p-6 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <h3 className="text-lg font-medium text-indigo-900 mb-2">
                Profile
              </h3>
              <p className="text-indigo-700">
                Update your account information and settings.
              </p>
            </Link>
          </div>

          {session?.user?.role === 'admin' && (
            <div className="mt-8">
              <Link
                href="/dashboard/admin"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Go to Admin Panel
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 