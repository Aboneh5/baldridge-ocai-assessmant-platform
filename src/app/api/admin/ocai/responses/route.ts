import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/ocai/responses
// Fetch all OCAI responses organized by company/organization
export async function GET(request: NextRequest) {
  try {
    // Get all OCAI responses with user and organization info
    const responses = await prisma.response.findMany({
      include: {
        user: {
          include: {
            organization: true,
          },
        },
        survey: true,
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    // Organize responses by organization
    const organizationData: Record<string, any> = {};

    responses.forEach(response => {
      const orgId = response.user?.organizationId || 'no-organization';
      const orgName = response.user?.organization?.name || 'No Organization';
      const userId = response.userId || 'anonymous';
      const userName = response.user?.name || 'Anonymous User';
      const userEmail = response.user?.email || 'N/A';
      const accessKey = response.user?.accessKeyUsed || 'N/A';

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
        organizationData[orgId].users[userId] = {
          userId,
          userName,
          userEmail,
          accessKey,
          completedAt: response.submittedAt,
          surveyId: response.surveyId,
          surveyTitle: response.survey?.title || 'Individual Assessment',
          responses: [],
        };
      }

      // Parse scores if they're JSON strings
      const nowScores = typeof response.nowScores === 'string'
        ? JSON.parse(response.nowScores)
        : response.nowScores;

      const preferredScores = typeof response.preferredScores === 'string'
        ? JSON.parse(response.preferredScores)
        : response.preferredScores;

      const demographics = typeof response.demographics === 'string'
        ? JSON.parse(response.demographics)
        : response.demographics;

      // Add response
      organizationData[orgId].users[userId].responses.push({
        id: response.id,
        demographics: demographics,
        nowScores: nowScores,
        preferredScores: preferredScores,
        submittedAt: response.submittedAt,
        userId: response.userId,
        surveyId: response.surveyId,
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
        totalUsers: responses.filter((r, i, arr) => arr.findIndex(x => x.userId === r.userId) === i).length,
        totalResponses: responses.length,
      },
    });
  } catch (error) {
    console.error('Error fetching OCAI responses:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch OCAI responses',
      },
      { status: 500 }
    );
  }
}
