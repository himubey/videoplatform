import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { upload, uploadToCloud } from '@/lib/storage';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('video');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to local storage first
    const fileName = `${Date.now()}-${file.name}`;
    const localPath = join(process.cwd(), 'public', 'uploads', fileName);
    await writeFile(localPath, buffer);

    // Upload to cloud storage
    const cloudUrl = await uploadToCloud({
      originalname: fileName,
      buffer: buffer,
    });

    return NextResponse.json({
      success: true,
      localPath: `/uploads/${fileName}`,
      cloudUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    ) 
  }
} 