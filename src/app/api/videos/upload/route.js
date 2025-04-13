import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { uploadToCloud } from '@/lib/storage';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    // Test database connection
    try {
      await prisma.$connect();
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed', details: dbError.message },
        { status: 500 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!['admin', 'teacher'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const formData = await request.formData();
    const videoFile = formData.get('file');
    const thumbnailFile = formData.get('thumbnail');
    const title = formData.get('title');
    const description = formData.get('description');
    const subjectId = formData.get('subjectId');
    const chapterId = formData.get('chapterId');
    const classId = formData.get('classId');
    const examType = formData.get('examType');

    console.log('Received form data:', {
      title,
      description,
      subjectId,
      chapterId,
      classId,
      examType,
      hasVideoFile: !!videoFile,
      hasThumbnailFile: !!thumbnailFile,
    });

    if (!videoFile || !title || !thumbnailFile || !examType) {
      return NextResponse.json(
        { error: 'Title, video file, thumbnail, and exam type are required' },
        { status: 400 }
      );
    }

    // Verify that the class exists if classId is provided
    if (classId) {
      try {
        const existingClass = await prisma.class.findUnique({
          where: { id: classId },
        });

        if (!existingClass) {
          return NextResponse.json(
            { error: 'Invalid class selected' },
            { status: 400 }
          );
        }
        console.log('Class verification successful:', existingClass);
      } catch (classError) {
        console.error('Error verifying class:', classError);
        return NextResponse.json(
          { error: 'Error verifying class', details: classError.message },
          { status: 500 }
        );
      }
    }

    // Verify that the subject exists if subjectId is provided
    if (subjectId) {
      try {
        const existingSubject = await prisma.subject.findUnique({
          where: { id: subjectId },
        });

        if (!existingSubject) {
          return NextResponse.json(
            { error: 'Invalid subject selected' },
            { status: 400 }
          );
        }
        console.log('Subject verification successful:', existingSubject);
      } catch (subjectError) {
        console.error('Error verifying subject:', subjectError);
        return NextResponse.json(
          { error: 'Error verifying subject', details: subjectError.message },
          { status: 500 }
        );
      }
    }

    // Verify that the chapter exists if chapterId is provided
    if (chapterId) {
      try {
        const existingChapter = await prisma.chapter.findUnique({
          where: { id: chapterId },
        });

        if (!existingChapter) {
          return NextResponse.json(
            { error: 'Invalid chapter selected' },
            { status: 400 }
          );
        }
        console.log('Chapter verification successful:', existingChapter);
      } catch (chapterError) {
        console.error('Error verifying chapter:', chapterError);
        return NextResponse.json(
          { error: 'Error verifying chapter', details: chapterError.message },
          { status: 500 }
        );
      }
    }

    // Function to convert File to a temporary file path
    async function fileToPath(file) {
      const buffer = await file.arrayBuffer();
      const tempFilePath = path.join('./uploads', file.name);
      await fs.writeFile(tempFilePath, Buffer.from(buffer));
      return tempFilePath;
    }

    let videoUrl = null;
    let thumbnailUrl = null;
    let duration = 0;

    // Upload video to Cloudinary
    try {
      const videoPath = await fileToPath(videoFile);
      const videoResult = await uploadToCloud({ path: videoPath }, 'video');
      videoUrl = videoResult.url;
      duration = videoResult.duration;
      await fs.unlink(videoPath); // Delete the temporary video file
      console.log('Video uploaded successfully:', videoResult);
    } catch (videoError) {
      console.error('Error uploading video:', videoError);
      return NextResponse.json(
        { error: 'Failed to upload video to Cloudinary', details: videoError.message },
        { status: 500 }
      );
    }

    // Upload thumbnail to Cloudinary
    try {
      const thumbnailPath = await fileToPath(thumbnailFile);
      const thumbnailResult = await uploadToCloud({ path: thumbnailPath }, 'image');
      thumbnailUrl = thumbnailResult.url;
      await fs.unlink(thumbnailPath); // Delete the temporary thumbnail file
      console.log('Thumbnail uploaded successfully:', thumbnailResult);
    } catch (thumbnailError) {
      console.error('Error uploading thumbnail:', thumbnailError);
      return NextResponse.json(
        { error: 'Failed to upload thumbnail to Cloudinary', details: thumbnailError.message },
        { status: 500 }
      );
    }

    // Create video record
    try {
      const video = await prisma.video.create({
        data: {
          title,
          description: description || null,
          url: videoUrl,
          thumbnail: thumbnailUrl,
          duration,
          examType,
          subjectId: subjectId || null,
          chapterId: chapterId || null,
          classId: classId || null,
          userId: session.user.id,
        },
        include: {
          subject: true,
          chapter: true,
          class: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      console.log('Video created successfully:', video);
      return NextResponse.json(video);
    } catch (createError) {
      console.error('Error creating video:', createError);
      return NextResponse.json(
        { error: 'Failed to create video record', details: createError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in video upload endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to upload video', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
