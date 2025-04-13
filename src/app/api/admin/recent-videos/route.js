import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Debug logging
    console.log('Starting recent-videos API request');

    const session = await getServerSession(authOptions);
    console.log('Session data:', session);

    if (!session) {
      console.log('No session found');
      return NextResponse.json({ 
        error: 'Not authenticated',
        details: 'No session found'
      }, { status: 401 });
    }

    if (!session.user) {
      console.log('No user data in session');
      return NextResponse.json({ 
        error: 'Invalid session',
        details: 'No user data found in session'
      }, { status: 401 });
    }

    if (!session.user.role) {
      console.log('No role in user data');
      return NextResponse.json({ 
        error: 'Invalid user data',
        details: 'No role found in user data'
      }, { status: 401 });
    }

    if (session.user.role.toLowerCase() !== 'admin') {
      console.log('User role is not admin:', session.user.role);
      return NextResponse.json({ 
        error: 'Unauthorized',
        details: `User role '${session.user.role}' is not authorized`
      }, { status: 403 });
    }

    console.log('Fetching recent videos from database');
    const recentVideos = await prisma.video.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    console.log('Found videos:', recentVideos.length);

    const formattedVideos = recentVideos.map(video => ({
      id: video.id,
      title: video.title,
      uploadedBy: video.user?.name || 'Unknown',
      uploadedAt: video.createdAt,
    }));

    return NextResponse.json(formattedVideos);
  } catch (error) {
    console.error('Error in recent-videos API:', error);
    // Ensure we always return a proper error response
    const errorResponse = {
      error: 'Internal Server Error',
      details: error.message || 'An unexpected error occurred',
      code: error.code || 'UNKNOWN_ERROR',
      timestamp: new Date().toISOString()
    };
    
    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = error.stack;
      errorResponse.originalError = error;
    }
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
} 