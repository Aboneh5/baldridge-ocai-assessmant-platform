import { NextRequest, NextResponse } from 'next/server';
import { prisma, ensurePrismaConnected } from '@/lib/prisma';
import { getUserId } from '@/lib/get-user-id';

// Generate unique assessment ID for organization
async function generateAssessmentId(organizationId: string | null): Promise<string> {
  const year = new Date().getFullYear();
  const orgPrefix = organizationId ? organizationId.substring(0, 6).toUpperCase() : 'INDV';

  // Count existing submissions for this organization this year
  const startOfYear = new Date(year, 0, 1);
  const count = await prisma.baldrigeSubmission.count({
    where: {
      organizationId: organizationId,
      createdAt: {
        gte: startOfYear,
      },
    },
  });

  const sequenceNumber = String(count + 1).padStart(3, '0');
  return `BLD-${orgPrefix}-${year}-${sequenceNumber}`;
}

// POST /api/baldrige/submit
// Submit completed Baldrige assessment
export async function POST(request: NextRequest) {
  try {
    await ensurePrismaConnected();
    console.log('[Baldrige Submit API] Starting POST request');
    const userId = await getUserId(request);

    console.log('[Baldrige Submit API] User ID:', userId);

    if (!userId) {
      console.log('[Baldrige Submit API] No user ID - returning 401');
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

    // Normalize surveyId to null if undefined or empty string
    const normalizedSurveyId = surveyId || null;

    console.log('[Baldrige Submit API] Survey ID:', normalizedSurveyId);

    // Get total question count (ALL questions including Organizational Profile)
    const totalQuestions = await prisma.baldrigeQuestion.count();
    console.log('[Baldrige Submit API] Total questions in system:', totalQuestions);

    // Get user's answered questions count with non-empty responses
    // Note: Explicitly handle null surveyId for proper Prisma query matching
    const answeredQuestions = await prisma.baldrigeResponse.count({
      where: {
        userId: userId,
        ...(normalizedSurveyId ? { surveyId: normalizedSurveyId } : { surveyId: null }),
        responseText: {
          not: '',
        },
      },
    });

    console.log(
      `[Baldrige Submit API] User ${userId} attempting submission: ${answeredQuestions}/${totalQuestions} questions answered`
    );

    // Debug: Log all responses for this user
    const allUserResponses = await prisma.baldrigeResponse.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        surveyId: true,
        responseText: true,
        questionId: true,
      },
    });
    console.log(`[Baldrige Submit API] DEBUG - Total responses for user: ${allUserResponses.length}`);
    console.log(`[Baldrige Submit API] DEBUG - Responses with null surveyId: ${allUserResponses.filter(r => r.surveyId === null).length}`);
    console.log(`[Baldrige Submit API] DEBUG - Responses with empty text: ${allUserResponses.filter(r => r.responseText === '').length}`);
    console.log(`[Baldrige Submit API] DEBUG - Valid responses (non-empty, null surveyId): ${allUserResponses.filter(r => r.surveyId === null && r.responseText !== '').length}`);

    if (answeredQuestions < totalQuestions) {
      // Get all questions
      const allQuestions = await prisma.baldrigeQuestion.findMany({
        select: {
          id: true,
          itemCode: true,
          subcategory: {
            select: {
              name: true,
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: [
          {
            subcategory: {
              category: {
                displayOrder: 'asc',
              },
            },
          },
          {
            subcategory: {
              displayOrder: 'asc',
            },
          },
          {
            orderIndex: 'asc',
          },
        ],
      });

      // Get answered question IDs
      const answeredQuestionIds = await prisma.baldrigeResponse.findMany({
        where: {
          userId: userId,
          ...(normalizedSurveyId ? { surveyId: normalizedSurveyId } : { surveyId: null }),
          responseText: {
            not: '',
          },
        },
        select: {
          questionId: true,
        },
      });

      const answeredIds = new Set(answeredQuestionIds.map((r) => r.questionId));

      // Find unanswered questions
      const unansweredQuestions = allQuestions
        .filter((q) => !answeredIds.has(q.id))
        .map((q) => ({
          itemCode: q.itemCode,
          category: q.subcategory.category.name,
          subcategory: q.subcategory.name,
        }));

      console.log('[Baldrige Submit API] Unanswered questions:', JSON.stringify(unansweredQuestions, null, 2));

      return NextResponse.json(
        {
          success: false,
          message: `Assessment incomplete. Please answer all questions before submitting. ${answeredQuestions}/${totalQuestions} questions completed.`,
          data: {
            answeredQuestions,
            totalQuestions,
            remainingQuestions: totalQuestions - answeredQuestions,
            unansweredQuestions: unansweredQuestions.slice(0, 10), // Return first 10 for display
          },
        },
        { status: 400 }
      );
    }

    // Get user details with organization
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        organizationId: true,
        accessKeyUsed: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    // Generate unique assessment ID
    const assessmentId = await generateAssessmentId(user.organizationId);

    // Create submission record
    const submission = await prisma.baldrigeSubmission.create({
      data: {
        assessmentId,
        userId: user.id,
        organizationId: user.organizationId,
        surveyId: normalizedSurveyId,
        accessKey: user.accessKeyUsed,
        submittedAt: new Date(),
        isCompleted: true,
        totalQuestions,
        answeredQuestions,
        metadata: {
          userName: user.name,
          userEmail: user.email,
          submissionTimestamp: new Date().toISOString(),
        },
      },
    });

    // Mark assessment as completed
    const existingProgress = await prisma.baldrigeProgress.findFirst({
      where: {
        userId: userId,
        ...(normalizedSurveyId ? { surveyId: normalizedSurveyId } : { surveyId: null }),
      },
    });

    if (existingProgress) {
      await prisma.baldrigeProgress.update({
        where: { id: existingProgress.id },
        data: {
          isCompleted: true,
          completedAt: new Date(),
        },
      });
    } else {
      await prisma.baldrigeProgress.create({
        data: {
          userId: userId,
          surveyId: normalizedSurveyId,
          completedQuestions: [],
          isCompleted: true,
          completedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message:
        'Thank you for completing the Baldrige Excellence Framework Assessment! Your responses have been successfully submitted.',
      data: {
        submissionId: submission.id,
        assessmentId: submission.assessmentId,
        submittedAt: submission.submittedAt,
        totalQuestions,
        answeredQuestions,
        completionRate: 100,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error('[Baldrige Submit API] ERROR:', error);
    console.error('[Baldrige Submit API] Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit assessment',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
