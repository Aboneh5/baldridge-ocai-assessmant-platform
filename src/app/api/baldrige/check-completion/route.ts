import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/get-user-id';

// GET /api/baldrige/check-completion
// Check if user has already completed the Baldrige assessment
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
    const surveyId = searchParams.get('surveyId') || null;

    // Get user info to check email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, organizationId: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has a completed submission
    const submission = await prisma.baldrigeSubmission.findFirst({
      where: {
        userId: userId,
        isCompleted: true
      },
    });

    // Also check progress table
    const progress = await prisma.baldrigeProgress.findFirst({
      where: {
        userId: userId,
        isCompleted: true
      },
    });

    const isCompleted = !!(submission || progress);

    return NextResponse.json({
      success: true,
      isCompleted,
      submissionId: submission?.id || null,
      assessmentId: submission?.assessmentId || null,
      completedAt: submission?.submittedAt || progress?.completedAt || null,
      message: isCompleted ? 'Assessment already completed by this email' : 'No completion found'
    });
  } catch (error) {
    console.error('Error checking completion:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to check completion status',
      },
      { status: 500 }
    );
  }
}
