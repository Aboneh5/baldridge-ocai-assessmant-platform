import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all organizations
export async function GET(request: NextRequest) {
  try {
    const organizations = await prisma.organization.findMany({
      include: {
        _count: {
          select: {
            users: true,
            surveys: true,
            accessKeys: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ organizations })
  } catch (error) {
    console.error('Error fetching organizations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch organizations' },
      { status: 500 }
    )
  }
}

// POST create new organization
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      industry,
      size,
      country,
      subscribedAssessments,
      logoUrl,
      primaryColor,
      createdById,
    } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Organization name is required' },
        { status: 400 }
      )
    }

    const organization = await prisma.organization.create({
      data: {
        name,
        industry,
        size,
        country,
        subscribedAssessments: subscribedAssessments || 'OCAI,BALDRIGE',
        logoUrl,
        primaryColor: primaryColor || '#3B82F6',
        isActive: true,
        createdById,
      },
    })

    return NextResponse.json({ organization }, { status: 201 })
  } catch (error) {
    console.error('Error creating organization:', error)
    return NextResponse.json(
      { error: 'Failed to create organization' },
      { status: 500 }
    )
  }
}
