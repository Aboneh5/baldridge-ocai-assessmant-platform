import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/baldrige/responses
// Fetch all Baldrige responses organized by company/organization
export async function GET(request: NextRequest) {
  try {
    // Get all completed submissions with assessment IDs
    const submissions = await prisma.baldrigeSubmission.findMany({
      where: {
        isCompleted: true,
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    // Get all completed Baldrige assessments with user and organization info
    const completedAssessments = await prisma.baldrigeProgress.findMany({
      where: {
        isCompleted: true,
      },
      include: {
        user: {
          include: {
            organization: true,
          },
        },
        survey: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    // Get all responses for completed assessments
    const responses = await prisma.baldrigeResponse.findMany({
      where: {
        userId: {
          in: completedAssessments.map(a => a.userId),
        },
      },
      include: {
        question: {
          include: {
            subcategory: {
              include: {
                category: true,
              },
            },
          },
        },
        user: {
          include: {
            organization: true,
          },
        },
        survey: true,
      },
      orderBy: [
        { question: { subcategory: { category: { displayOrder: 'asc' } } } },
        { question: { subcategory: { displayOrder: 'asc' } } },
        { question: { orderIndex: 'asc' } },
      ],
    });

    // Organize responses by organization
    const organizationData: Record<string, any> = {};

    responses.forEach(response => {
      const orgId = response.user.organizationId || 'no-organization';
      const orgName = response.user.organization?.name || 'No Organization';
      const userId = response.userId;
      const userName = response.user.name;
      const userEmail = response.user.email || 'N/A';
      const accessKey = response.user.accessKeyUsed || 'N/A';

      // Find submission for this user
      const userSubmission = submissions.find(
        s => s.userId === userId && (s.surveyId === response.surveyId || (!s.surveyId && !response.surveyId))
      );

      // Initialize organization if not exists
      if (!organizationData[orgId]) {
        organizationData[orgId] = {
          organizationId: orgId,
          organizationName: orgName,
          users: {},
        };
      }

      // Initialize user if not exists
      if (!organizationData[orgId].users[userId]) {
        const userProgress = completedAssessments.find(a => a.userId === userId);
        organizationData[orgId].users[userId] = {
          userId,
          userName,
          userEmail,
          accessKey,
          assessmentId: userSubmission?.assessmentId || 'N/A',
          completedAt: userProgress?.completedAt,
          surveyId: response.surveyId,
          surveyTitle: response.survey?.title || 'Individual Assessment',
          responses: [],
        };
      }

      // Add response
      organizationData[orgId].users[userId].responses.push({
        questionId: response.questionId,
        itemCode: response.question.itemCode,
        questionText: response.question.questionText,
        categoryName: response.question.subcategory.category.name,
        subcategoryName: response.question.subcategory.name,
        categoryOrder: response.question.subcategory.category.displayOrder,
        subcategoryOrder: response.question.subcategory.displayOrder,
        responseText: response.responseText,
        timeSpent: response.timeSpent,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      });
    });

    // Convert to array format
    const organizedData = Object.values(organizationData).map(org => ({
      ...org,
      users: Object.values(org.users),
      totalUsers: Object.keys(org.users).length,
    }));

    return NextResponse.json({
      success: true,
      data: organizedData,
      summary: {
        totalOrganizations: organizedData.length,
        totalUsers: completedAssessments.length,
        totalResponses: responses.length,
        totalSubmissions: submissions.length,
      },
    });
  } catch (error) {
    console.error('Error fetching Baldrige responses:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch Baldrige responses',
      },
      { status: 500 }
    );
  }
}
