import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/subjects
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subjects = await prisma.subject.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/subjects
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'teacher'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { name, description } = data;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(subject);
  } catch (error) {
    console.error('Error creating subject:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/subjects/[id]
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'teacher'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { name, description } = data;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const subject = await prisma.subject.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(subject);
  } catch (error) {
    console.error('Error updating subject:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/subjects/[id]
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'teacher'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.subject.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 