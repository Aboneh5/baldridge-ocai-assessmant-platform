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

    // Normalize surveyId to null if undefined or empty string
    const normalizedSurveyId = surveyId || null;

    const progress = await prisma.baldrigeProgress.findFirst({
      where: {
        userId: userId,
        surveyId: normalizedSurveyId,
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

    // Normalize surveyId to null if undefined or empty string
    const normalizedSurveyId = surveyId || null;

    // Find existing progress
    const existingProgress = await prisma.baldrigeProgress.findFirst({
      where: {
        userId: userId,
        surveyId: normalizedSurveyId,
      },
    });

    let progress;
    if (existingProgress) {
      // Update existing progress
      progress = await prisma.baldrigeProgress.update({
        where: { id: existingProgress.id },
        data: {
          completedQuestions: completedQuestions || [],
          isCompleted: isCompleted || false,
          completedAt: isCompleted ? new Date() : null,
        },
      });
    } else {
      // Create new progress
      progress = await prisma.baldrigeProgress.create({
        data: {
          userId: userId,
          surveyId: normalizedSurveyId,
          completedQuestions: completedQuestions || [],
          isCompleted: isCompleted || false,
          completedAt: isCompleted ? new Date() : null,
        },
      });
    }

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
