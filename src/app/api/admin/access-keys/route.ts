import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all access keys
export async function GET(request: NextRequest) {
  try {
    const accessKeys = await prisma.accessKey.findMany({
      include: {
        organization: {
          select: {
            name: true,
            isActive: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ accessKeys })
  } catch (error) {
    console.error('Error fetching access keys:', error)
    return NextResponse.json(
      { error: 'Failed to fetch access keys' },
      { status: 500 }
    )
  }
}

// POST create new access key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      key,
      organizationId,
      assessmentTypes,
      maxUses,
      expiresAt,
      description,
      createdBy,
    } = body

    if (!key || !organizationId) {
      return NextResponse.json(
        { error: 'Access key and organization are required' },
        { status: 400 }
      )
    }

    // Check if key already exists
    const existingKey = await prisma.accessKey.findUnique({
      where: { key },
    })

    if (existingKey) {
      return NextResponse.json(
        { error: 'Access key already exists' },
        { status: 400 }
      )
    }

    // Verify organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    })

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    const accessKey = await prisma.accessKey.create({
      data: {
        key,
        organizationId,
        assessmentTypes: assessmentTypes || 'OCAI,BALDRIGE',
        maxUses: maxUses || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        description,
        createdBy,
        isActive: true,
        usageCount: 0,
      },
      include: {
        organization: {
          select: {
            name: true,
            isActive: true,
          },
        },
      },
    })

    return NextResponse.json({ accessKey }, { status: 201 })
  } catch (error) {
    console.error('Error creating access key:', error)
    return NextResponse.json(
      { error: 'Failed to create access key' },
      { status: 500 }
    )
  }
}
