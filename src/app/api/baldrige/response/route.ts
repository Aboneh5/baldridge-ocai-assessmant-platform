import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/get-user-id';

// POST /api/baldrige/response
// Save or update a response to a Baldrige question
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
    const { questionId, responseText, surveyId, timeSpent } = body;

    if (!questionId) {
      return NextResponse.json(
        {
          success: false,
          message: 'questionId is required',
        },
        { status: 400 }
      );
    }

    // Verify question exists
    const question = await prisma.baldrigeQuestion.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          message: 'Question not found',
        },
        { status: 404 }
      );
    }

    // Save or update response
    const response = await prisma.baldrigeResponse.upsert({
      where: {
        userId_questionId_surveyId: {
          userId: userId,
          questionId: questionId,
          surveyId: surveyId || null,
        },
      },
      update: {
        responseText: responseText?.trim() || '',
        timeSpent: timeSpent || 0,
        updatedAt: new Date(),
      },
      create: {
        userId: userId,
        questionId,
        surveyId: surveyId || null,
        responseText: responseText?.trim() || '',
        timeSpent: timeSpent || 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Response saved successfully',
      data: {
        id: response.id,
        responseText: response.responseText,
        updatedAt: response.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error saving Baldrige response:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to save response',
        error: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
