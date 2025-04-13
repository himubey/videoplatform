'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { 
  FiUsers, 
  FiVideo, 
  FiBook, 
  FiTrendingUp,
  FiUserPlus,
  FiUserCheck,
  FiUpload,
  FiCalendar,
  FiAlertCircle
} from 'react-icons/fi';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalVideos: 0,
    totalSubjects: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Debug logging
        console.log('Session status:', status);
        console.log('Session data:', session);
        console.log('User role:', session?.user?.role);

        // Ensure we have a valid session with user data
        if (!session?.user?.role) {
          console.log('No valid session or role found');
          throw new Error('No valid session found');
        }

        const userRole = session.user.role.toLowerCase();
        console.log('Normalized user role:', userRole);

        if (!['admin', 'teacher'].includes(userRole)) {
          console.log('Invalid role detected:', userRole);
          throw new Error(`Invalid role: ${userRole}`);
        }

        // Fetch statistics with credentials
        const statsResponse = await fetch('/api/admin/stats', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const statsData = await statsResponse.json();
        
        console.log('Stats response:', statsResponse.status, statsData);
        
        if (!statsResponse.ok) {
          throw new Error(statsData.error || 'Failed to fetch statistics');
        }
        setStats(statsData);

        // Only fetch users and videos data if user is admin
        if (userRole === 'admin') {
          // Fetch recent users
          const usersResponse = await fetch('/api/admin/recent-users', {
            credentials: 'include',
          });
          const usersData = await usersResponse.json();
          
          if (!usersResponse.ok) {
            throw new Error(usersData.error || 'Failed to fetch users');
          }
          setRecentUsers(Array.isArray(usersData) ? usersData : []);

          // Fetch recent videos
          const videosResponse = await fetch('/api/admin/recent-videos', {
            credentials: 'include',
          });
          const videosData = await videosResponse.json();
          
          if (!videosResponse.ok) {
            console.error('Videos API error:', videosData);
            const errorMessage = videosData.details || videosData.error || 'Failed to fetch videos';
            throw new Error(errorMessage);
          }
          setRecentVideos(Array.isArray(videosData) ? videosData : []);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'loading') {
      return;
    }

    if (session?.user) {
      fetchDashboardData();
    } else {
      setIsLoading(false);
    }
  }, [session, status]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Not authenticated</h3>
          <p className="mt-1 text-sm text-gray-500">Please sign in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  if (!['admin', 'teacher'].includes(session.user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FiAlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
          <p className="mt-1 text-sm text-gray-500">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FiAlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading dashboard</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <div className="mt-4">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Retry
            </button>
            <button
              onClick={() => signIn()}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Sign In Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Only show admin actions for admin users
  const quickActions = session.user.role === 'admin' ? [
    { name: 'Add Student', href: '/dashboard/admin/students/new', icon: FiUserPlus, color: 'blue' },
    { name: 'Add Teacher', href: '/dashboard/admin/teachers/new', icon: FiUserCheck, color: 'green' },
    { name: 'Upload Video', href: '/dashboard/admin/videos/new', icon: FiUpload, color: 'purple' },
    { name: 'Add Subject', href: '/dashboard/admin/subjects/new', icon: FiBook, color: 'orange' },
  ] : [
    { name: 'Upload Video', href: '/dashboard/admin/videos/new', icon: FiUpload, color: 'purple' },
    { name: 'Add Subject', href: '/dashboard/admin/subjects/new', icon: FiBook, color: 'orange' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            {session.user.role === 'admin' ? 'Admin Dashboard' : 'Teacher Dashboard'}
          </h1>
          <div className="flex space-x-3">
            <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
              <FiCalendar className="mr-2" />
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className={`flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-${action.color}-500`}
              >
                <action.icon className={`h-6 w-6 text-${action.color}-500 mr-3`} />
                <span className="text-sm font-medium text-gray-900">{action.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Students"
            value={stats.totalStudents}
            icon={<FiUsers className="h-6 w-6 text-blue-600" />}
            trend="+5.4%"
            trendIcon={<FiTrendingUp className="h-4 w-4" />}
          />
          <StatsCard
            title="Total Teachers"
            value={stats.totalTeachers}
            icon={<FiUserCheck className="h-6 w-6 text-green-600" />}
            trend="+2.1%"
            trendIcon={<FiTrendingUp className="h-4 w-4" />}
          />
          <StatsCard
            title="Total Videos"
            value={stats.totalVideos}
            icon={<FiVideo className="h-6 w-6 text-purple-600" />}
            trend="+12.5%"
            trendIcon={<FiTrendingUp className="h-4 w-4" />}
          />
          <StatsCard
            title="Total Subjects"
            value={stats.totalSubjects}
            icon={<FiBook className="h-6 w-6 text-orange-600" />}
            trend="+3.2%"
            trendIcon={<FiTrendingUp className="h-4 w-4" />}
          />
        </div>

        {/* Only show recent activity sections for admin users */}
        {session.user.role === 'admin' && (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Users */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Recent Users</h2>
                <Link href="/dashboard/admin/users" className="text-sm text-blue-600 hover:text-blue-800">
                  View all
                </Link>
              </div>
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {recentUsers.map((user) => (
                    <li key={user.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <FiUsers className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'teacher' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recent Videos */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Recent Videos</h2>
                <Link href="/dashboard/admin/videos" className="text-sm text-blue-600 hover:text-blue-800">
                  View all
                </Link>
              </div>
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {recentVideos.map((video) => (
                    <li key={video.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded bg-gray-200 flex items-center justify-center">
                            <FiVideo className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {video.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            Uploaded by {video.uploadedBy}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(video.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, trend, trendIcon }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                  <span className="flex items-center">
                    {trendIcon}
                    {trend}
                  </span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 