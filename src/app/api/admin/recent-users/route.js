import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { uploadToCloud } from '@/lib/storage';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const recentUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    return NextResponse.json(recentUsers);
  } catch (error) {
    console.error('Error fetching recent users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // ... existing session and validation checks ...

    const formData = await request.formData();
    const videoFile = formData.get('file');
    const thumbnailFile = formData.get('thumbnail');
    // ... other form data ...

    // Upload video to Cloudinary
    let videoUploadResult;
    let thumbnailUploadResult;
    try {
      // Convert FormData file to a format Cloudinary can handle
      const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
      const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
      
      // Upload both files to Cloudinary
      [videoUploadResult, thumbnailUploadResult] = await Promise.all([
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'video',
            folder: 'class-videos',
          }
        ).end(videoBuffer),
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'thumbnails',
          }
        ).end(thumbnailBuffer)
      ]);
    } catch (uploadError) {
      console.error('Upload to Cloudinary failed:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload media files', details: uploadError.message },
        { status: 500 }
      );
    }

    // Create video record with actual URLs
    try {
      const video = await prisma.video.create({
        data: {
          title,
          description: description || null,
          url: videoUploadResult.secure_url,
          thumbnail: thumbnailUploadResult.secure_url,
          duration: videoUploadResult.duration || 0,
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
      // If database creation fails, we should clean up the uploaded files
      try {
        await Promise.all([
          cloudinary.uploader.destroy(videoUploadResult.public_id),
          cloudinary.uploader.destroy(thumbnailUploadResult.public_id)
        ]);
      } catch (cleanupError) {
        console.error('Failed to cleanup uploaded files:', cleanupError);
      }
      
      throw createError;
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