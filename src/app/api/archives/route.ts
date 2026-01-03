import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {db} from '@/lib/db';

const prisma = new PrismaClient();

// GET all archives
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const exam = searchParams.get('exam');
    const category = searchParams.get('category');
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (exam) where.exam = exam;
    if (category) where.category = category;
    
    const archives = await db.archivePDF.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(archives);
  } catch (error) {
    console.error('Error fetching archives:', error);
    return NextResponse.json(
      { error: 'Failed to fetch archives' },
      { status: 500 }
    );
  }
}

// POST create new archive
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.downloadUrl) {
      return NextResponse.json(
        { error: 'Title and download URL are required' },
        { status: 400 }
      );
    }
    
    const archive = await db.archivePDF.create({
      data: {
        title: data.title,
        description: data.description || '',
        subjects: data.subjects || [],
        exam: data.exam || null,
        year: data.year ? parseInt(data.year) : null,
        fileSize: data.fileSize || null,
        pages: data.pages ? parseInt(data.pages) : null,
        fileType: data.fileType || 'PDF',
        downloadUrl: data.downloadUrl,
        category: data.category || 'Notes',
      },
    });
    
    return NextResponse.json(archive, { status: 201 });
  } catch (error) {
    console.error('Error creating archive:', error);
    return NextResponse.json(
      { error: 'Failed to create archive' },
      { status: 500 }
    );
  }
}

// DELETE archive by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Archive ID is required' },
        { status: 400 }
      );
    }
    
    // Check if archive exists
    const existingArchive = await db.archivePDF.findUnique({
      where: { id: id },
    });
    
    if (!existingArchive) {
      return NextResponse.json(
        { error: 'Archive not found' },
        { status: 404 }
      );
    }
    
    // Delete the archive
    await db.archivePDF.delete({
      where: { id: id },
    });
    
    return NextResponse.json(
      { message: 'Archive deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting archive:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('RecordNotFound')) {
        return NextResponse.json(
          { error: 'Archive not found' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to delete archive' },
      { status: 500 }
    );
  }
}