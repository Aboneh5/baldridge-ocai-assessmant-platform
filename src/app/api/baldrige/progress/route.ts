import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/get-user-id';

// GET /api/baldrige/progress
// Get user's Baldrige assessment progress
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required',
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const surveyId = searchParams.get('surveyId');

    const progress = await prisma.baldrigeProgress.findUnique({
      where: {
        userId_surveyId: {
          userId: userId,
          surveyId: surveyId || null,
        },
      },
    });

    if (!progress) {
      return NextResponse.json({
        success: true,
        data: {
          completedQuestions: [],
          isCompleted: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch progress',
      },
      { status: 500 }
    );
  }
}

// POST /api/baldrige/progress
// Update user's Baldrige assessment progress
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required',
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { completedQuestions, surveyId, isCompleted } = body;

    const progress = await prisma.baldrigeProgress.upsert({
      where: {
        userId_surveyId: {
          userId: userId,
          surveyId: surveyId || null,
        },
      },
      update: {
        completedQuestions: completedQuestions || [],
        isCompleted: isCompleted || false,
        completedAt: isCompleted ? new Date() : null,
      },
      create: {
        userId: userId,
        surveyId: surveyId || null,
        completedQuestions: completedQuestions || [],
        isCompleted: isCompleted || false,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to save progress',
      },
      { status: 500 }
    );
  }
}
