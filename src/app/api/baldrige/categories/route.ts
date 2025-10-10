import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/get-user-id';

// GET /api/baldrige/categories
// Get all Baldrige categories with subcategories and questions
// Also loads user's existing responses for resuming assessment
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    const { searchParams } = new URL(request.url);
    const surveyId = searchParams.get('surveyId') || null;

    // Get categories with questions
    const categories = await prisma.baldrigeCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        subcategories: {
          orderBy: { displayOrder: 'asc' },
          include: {
            questions: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
    });

    // If user is authenticated, load their existing responses
    let userResponses: any[] = [];
    if (userId) {
      userResponses = await prisma.baldrigeResponse.findMany({
        where: {
          userId: userId,
          surveyId: surveyId,
        },
      });
    }

    // Map responses to questions
    const responseMap = new Map(
      userResponses.map(r => [r.questionId, r])
    );

    // Attach responses to questions
    const categoriesWithResponses = categories.map(cat => ({
      ...cat,
      subcategories: cat.subcategories.map(sub => ({
        ...sub,
        questions: sub.questions.map(q => ({
          ...q,
          userResponse: responseMap.get(q.id) || null,
        })),
      })),
    }));

    return NextResponse.json({
      success: true,
      data: categoriesWithResponses,
    });
  } catch (error) {
    console.error('Error fetching Baldrige categories:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}
