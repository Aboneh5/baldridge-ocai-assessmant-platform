import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET all users
export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      include: {
        organization: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      password,
      role,
      organizationId,
    } = body

    if (!name || !role) {
      return NextResponse.json(
        { error: 'Name and role are required' },
        { status: 400 }
      )
    }

    // Validate role-specific requirements
    if ((role === 'SYSTEM_ADMIN' || role === 'FACILITATOR') && (!email || !password)) {
      return NextResponse.json(
        { error: 'Email and password are required for Admin and Facilitator roles' },
        { status: 400 }
      )
    }

    if (role === 'FACILITATOR' && !organizationId) {
      return NextResponse.json(
        { error: 'Organization is required for Facilitator role' },
        { status: 400 }
      )
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        )
      }
    }

    // Hash password if provided
    let hashedPassword = null
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10)
    }

    const user = await prisma.user.create({
      data: {
        name,
        email: email || null,
        password: hashedPassword,
        role,
        organizationId: organizationId || null,
      },
      include: {
        organization: {
          select: {
            name: true,
          },
        },
      },
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
