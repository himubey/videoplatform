 'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative pt-6 pb-16 sm:pb-24">
          {/* Navigation */}
          <nav className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-2">
              <div className="relative w-48 h-16">
                <Image
                  src="/Bansal_logo.png"
                  alt="Bansal Classes Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div>
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
              >
                Sign in
              </Link>
            </div>
          </nav>

          <div className="mt-16 lg:mt-24 lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1>
                <span className="block text-sm font-semibold text-blue-600 tracking-wide uppercase">
                  ONLINE EDUCATION
                </span>
                <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                  <span className="block text-gray-900">Learn Anywhere</span>
                  <span className="block text-blue-600">Anytime</span>
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Upload, share, and manage your educational videos in one secure platform. Perfect for teachers and students to collaborate and learn together.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  GET STARTED
                </Link>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <div className="w-full h-80 relative">
                    {/* Educational Illustration */}
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-50">
                      <div className="space-y-4 p-8">
                        {/* Books Stack */}
                        <div className="w-24 h-24 bg-pink-100 rounded-lg transform -rotate-6"></div>
                        {/* Globe */}
                        <div className="w-16 h-16 bg-blue-100 rounded-full absolute top-1/2 left-1/4"></div>
                        {/* Computer Screen */}
                        <div className="w-48 h-32 bg-white border-4 border-blue-200 rounded-lg shadow-lg absolute top-1/3 right-8">
                          <div className="h-4 bg-blue-100 mx-2 mt-2 rounded"></div>
                          <div className="h-4 bg-blue-50 mx-2 mt-2 rounded"></div>
                        </div>
                        {/* Student Figure */}
                        <div className="w-12 h-12 bg-pink-200 rounded-full absolute bottom-8 left-8"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">10K+</div>
                <div className="mt-2 text-sm font-medium text-gray-500">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-500">500+</div>
                <div className="mt-2 text-sm font-medium text-gray-500">Expert Teachers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">50K+</div>
                <div className="mt-2 text-sm font-medium text-gray-500">Video Lectures</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-500">95%</div>
                <div className="mt-2 text-sm font-medium text-gray-500">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-white py-12 rounded-xl shadow-sm">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Why Choose Bansal Classes?</h2>
            <div className="grid grid-cols-1 gap-y-12 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Video Lectures</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Access high-quality video lectures from expert teachers. Watch, pause, and rewind at your own pace.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-pink-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">User Management</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Easy management of teachers and students. Track progress and manage access efficiently.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Secure Platform</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Your content is safe and protected with advanced security measures and regular backups.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-pink-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Live Classes</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Interactive live classes with real-time doubt solving and Q&A sessions.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Study Materials</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Comprehensive study materials including notes, practice questions, and mock tests.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-pink-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Performance Analytics</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Track your progress with detailed analytics and personalized recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-900 to-blue-800 py-12 rounded-xl shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mentor Quote */}
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <p className="text-xl text-white text-center">
                <span className="text-red-400">None</span> of your<br />
                <span className="font-semibold">Plans, Ideas, Strategies</span><br />
                will work unless you<br />
                <span className="text-red-400 font-bold">Choose The Right</span><br />
                <span className="font-bold text-2xl">MENTOR</span>
              </p>
            </div>

            <h2 className="text-3xl font-extrabold text-center text-white mb-2">IIT-JEE: All India Rank 1</h2>
            <p className="text-center text-blue-100 mb-8">Our Top Achievers</p>
            
            {/* AIR 1 Achievers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
              {[
                { name: "Satvat Jagwani", year: "2015" },
                { name: "Shitikanth", year: "2008" },
                { name: "Achin Bansal", year: "2007" },
                { name: "Dungararam Choudhary", year: "2002" },
                { name: "Nitin Gupta", year: "2000" }
              ].map((achiever, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center">
                  <div className="inline-block rounded-full bg-red-600 px-4 py-1 text-sm font-semibold text-white mb-4">
                    AIR 1
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{achiever.name}</h3>
                  <p className="text-blue-100">Year {achiever.year}</p>
                </div>
              ))}
            </div>

            {/* Achievement Stats */}
            <div className="grid grid-cols-3 gap-4 mb-12">
              <div className="bg-red-600 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-yellow-300">5 times</p>
                <p className="text-white font-semibold">AIR-1</p>
              </div>
              <div className="bg-green-800 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-yellow-300">6 times</p>
                <p className="text-white font-semibold">AIR-2</p>
              </div>
              <div className="bg-red-600 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-yellow-300">6 times</p>
                <p className="text-white font-semibold">AIR-3</p>
              </div>
            </div>

            {/* Center Details */}
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <h3 className="text-xl font-bold text-white text-center mb-4">Registration Open: Classes - 9th To 12th</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-blue-100">
                  <p className="font-semibold text-yellow-300">HARIDWAR CENTER:</p>
                  <p>Opp. Rishikul Medical College (AS Tower)</p>
                  <p className="mt-2">📞 +91 79-06217656</p>
                  <p className="text-sm">✉️ admin.haridwar@bansal.ac.in</p>
                </div>
                <div className="text-blue-100">
                  <p className="font-semibold text-yellow-300">ROORKEE CENTER:</p>
                  <p>Ramnagar, Opp. Vaishali Mandap</p>
                  <p className="mt-2">📞 +91 73-10692857</p>
                  <p className="text-sm">✉️ admin.roorkee@bansal.ac.in</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-16 bg-white py-12 rounded-xl shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">What Our Students Say</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Testimonial 1 */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center">
                    <span className="text-pink-600 font-medium">RK</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Rahul Kumar</h4>
                    <p className="text-sm text-gray-500">JEE Advanced 2023</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">
                  &quot;The video lectures helped me understand complex concepts easily.&quot;
                </p>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">PS</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Priya Sharma</h4>
                    <p className="text-sm text-gray-500">NEET 2023</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">
                  &quot;Great platform for online learning. The interface is user-friendly.&quot;
                </p>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center">
                    <span className="text-pink-600 font-medium">AK</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Amit Kumar</h4>
                    <p className="text-sm text-gray-500">JEE Mains 2023</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">
                  &quot;The live classes and doubt-solving sessions were very interactive and helpful.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
