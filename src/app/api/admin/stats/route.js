import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
  try {
    console.log('Fetching session in stats endpoint...');
    const session = await getServerSession(authOptions);
    console.log('Raw session data:', JSON.stringify(session, null, 2));
    
    if (!session?.user) {
      console.log('No session or user found in stats endpoint');
      return NextResponse.json({ 
        error: 'Not authenticated',
        sessionData: process.env.NODE_ENV === 'development' ? session : undefined
      }, { status: 401 });
    }

    // Log full user data for debugging
    console.log('User data in stats endpoint:', {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
      name: session.user.name
    });

    // Verify user exists in database
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!dbUser) {
      console.log('User not found in database:', session.user.email);
      return NextResponse.json({ 
        error: 'User not found in database',
        email: session.user.email 
      }, { status: 403 });
    }

    // Use database role as source of truth
    const role = (dbUser.role || '').toLowerCase();
    console.log('Database role:', role);

    if (!['admin', 'teacher'].includes(role)) {
      console.log('Invalid role from database:', role);
      return NextResponse.json({ 
        error: 'Insufficient permissions',
        details: `Current role: ${role}`,
        user: process.env.NODE_ENV === 'development' ? {
          sessionRole: session.user.role,
          dbRole: dbUser.role,
          email: dbUser.email
        } : undefined
      }, { status: 403 });
    }

    console.log('Fetching stats from database...');
    const [
      totalStudents,
      totalTeachers,
      totalVideos,
      totalSubjects,
    ] = await Promise.all([
      prisma.user.count({
        where: { role: 'student' },
      }),
      prisma.user.count({
        where: { role: 'teacher' },
      }),
      prisma.video.count(),
      prisma.subject.count(),
    ]);

    const response = {
      totalStudents,
      totalTeachers,
      totalVideos,
      totalSubjects,
    };
    console.log('Stats response:', response);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in stats endpoint:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
} 