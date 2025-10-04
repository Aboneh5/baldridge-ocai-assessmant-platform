import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/get-user-id';

// POST /api/baldrige/submit
// Submit completed Baldrige assessment
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
    const { surveyId } = body;

    // Get total question count
    const totalQuestions = await prisma.baldrigeQuestion.count();

    // Get user's answered questions count
    const answeredQuestions = await prisma.baldrigeResponse.count({
      where: {
        userId: userId,
        surveyId: surveyId || null,
      },
    });

    console.log(
      `User ${userId} attempting submission: ${answeredQuestions}/${totalQuestions} questions answered`
    );

    if (answeredQuestions < totalQuestions) {
      return NextResponse.json(
        {
          success: false,
          message: `Assessment incomplete. Please answer all questions before submitting. ${answeredQuestions}/${totalQuestions} questions completed.`,
          data: {
            answeredQuestions,
            totalQuestions,
            remainingQuestions: totalQuestions - answeredQuestions,
          },
        },
        { status: 400 }
      );
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    // Mark assessment as completed
    await prisma.baldrigeProgress.upsert({
      where: {
        userId_surveyId: {
          userId: userId,
          surveyId: surveyId || null,
        },
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
      },
      create: {
        userId: userId,
        surveyId: surveyId || null,
        completedQuestions: [],
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message:
        'Thank you for completing the Baldrige Excellence Framework Assessment! Your responses have been successfully submitted.',
      data: {
        submissionId: `BALDRIGE-${Date.now()}`,
        submittedAt: new Date(),
        totalQuestions,
        answeredQuestions,
        completionRate: 100,
        user: {
          id: user?.id,
          name: user?.name,
          email: user?.email,
        },
      },
    });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit assessment',
      },
      { status: 500 }
    );
  }
}
