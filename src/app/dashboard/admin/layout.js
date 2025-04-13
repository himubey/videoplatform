'use client';

import { useState, useEffect, useLayoutEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { 
  FiHome, 
  FiBook, 
  FiBookOpen,
  FiVideo, 
  FiFile, 
  FiUsers,
  FiUserCheck,
  FiSettings,
  FiMenu,
  FiX,
  FiChevronDown,
  FiUpload
} from 'react-icons/fi';

// Use this to avoid hydration mismatch
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isVideoSubmenuOpen, setIsVideoSubmenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || (session?.user?.role !== 'admin' && session?.user?.role !== 'teacher')) {
      setIsRedirecting(true);
      router.push('/dashboard');
    }
  }, [session, status, router]);

  if (!mounted || status === 'loading' || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard/admin', icon: FiHome },
    { name: 'Classes', href: '/dashboard/admin/classes', icon: FiBook },
    { name: 'Subjects', href: '/dashboard/admin/subjects', icon: FiBook },
    { name: 'Chapters', href: '/dashboard/admin/chapters', icon: FiBookOpen },
    {
      name: 'Videos',
      href: '#',
      icon: FiVideo,
      submenu: [
        { name: 'All Videos', href: '/dashboard/admin/videos' },
        { name: 'Upload Video', href: '/dashboard/admin/videos/new' },
        { name: 'Video Management', href: '/dashboard/admin/video-management', adminOnly: true },
      ]
    },
    { name: 'Documents', href: '/dashboard/admin/documents', icon: FiFile },
    { name: 'Students', href: '/dashboard/admin/students', icon: FiUsers, adminOnly: true },
    { name: 'Teachers', href: '/dashboard/admin/teachers', icon: FiUserCheck, adminOnly: true },
    { name: 'User Management', href: '/dashboard/admin/users', icon: FiSettings, adminOnly: true },
  ];

  const isActive = (href) => {
    if (href === '#') return false;
    return pathname === href;
  };

  const userRole = session.user.role;

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:h-[calc(100vh-64px)] top-16">
        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-indigo-700 to-indigo-900">
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navigation.map((item) => {
                if (item.adminOnly && userRole !== 'admin') {
                  return null;
                }

                if (item.submenu) {
                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => setIsVideoSubmenuOpen(!isVideoSubmenuOpen)}
                        className="group w-full flex items-center px-3 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-600 hover:text-white rounded-md"
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        <span className="flex-1">{item.name}</span>
                        <FiChevronDown
                          className={`ml-2 h-4 w-4 transform transition-transform duration-200 ${
                            isVideoSubmenuOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isVideoSubmenuOpen && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.submenu.map((subitem) => {
                            if (subitem.adminOnly && userRole !== 'admin') {
                              return null;
                            }
                            return (
                              <Link
                                key={subitem.name}
                                href={subitem.href}
                                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                                  isActive(subitem.href)
                                    ? 'bg-indigo-800 text-white'
                                    : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
                                }`}
                              >
                                <span className="truncate">{subitem.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive(item.href)
                        ? 'bg-indigo-800 text-white'
                        : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-14 px-4">
          <span className="text-xl font-bold text-indigo-700">Admin Panel</span>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <span className="sr-only">Open menu</span>
            {isOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden pt-32">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-gradient-to-b from-indigo-700 to-indigo-900 overflow-y-auto">
            <div className="flex items-center justify-between h-16 px-4 bg-indigo-800">
              <span className="text-xl font-bold text-white">Admin Panel</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Close menu</span>
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <nav className="px-3 pb-4 space-y-1">
              {navigation.map((item) => {
                if (item.adminOnly && userRole !== 'admin') {
                  return null;
                }

                if (item.submenu) {
                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => setIsVideoSubmenuOpen(!isVideoSubmenuOpen)}
                        className="group w-full flex items-center px-3 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-600 hover:text-white rounded-md"
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        <span className="flex-1">{item.name}</span>
                        <FiChevronDown
                          className={`ml-2 h-4 w-4 transform transition-transform duration-200 ${
                            isVideoSubmenuOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isVideoSubmenuOpen && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.submenu.map((subitem) => {
                            if (subitem.adminOnly && userRole !== 'admin') {
                              return null;
                            }
                            return (
                              <Link
                                key={subitem.name}
                                href={subitem.href}
                                onClick={() => setIsOpen(false)}
                                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                                  isActive(subitem.href)
                                    ? 'bg-indigo-800 text-white'
                                    : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
                                }`}
                              >
                                <span className="truncate">{subitem.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive(item.href)
                        ? 'bg-indigo-800 text-white'
                        : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1 pt-16">
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 