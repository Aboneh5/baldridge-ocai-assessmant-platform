import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserId } from '@/lib/get-user-id'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'

// Helper function to validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Helper function to parse CSV
function parseCSV(content: string): { email: string; password: string }[] {
  const lines = content.trim().split('\n')
  const credentials: { email: string; password: string }[] = []
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    const [email, password] = line.split(',').map(s => s.trim())
    if (email && password) {
      credentials.push({ email, password })
    }
  }
  
  return credentials
}

// POST - Upload CSV and create credentials
export async function POST(request: NextRequest) {
  try {
    // Check authentication - only SYSTEM_ADMIN
    const userId = await getUserId(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user || user.role !== 'SYSTEM_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Only admins can create assessment credentials' },
        { status: 403 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const organizationId = formData.get('organizationId') as string
    const assessmentTypes = formData.get('assessmentTypes') as string
    const expiresAt = formData.get('expiresAt') as string
    const batchName = formData.get('batchName') as string | null

    // Validation
    if (!file || !organizationId || !assessmentTypes || !expiresAt) {
      return NextResponse.json(
        { error: 'Missing required fields: file, organizationId, assessmentTypes, expiresAt' },
        { status: 400 }
      )
    }

    // Verify organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId }
    })

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Read and parse CSV file
    const text = await file.text()
    const rawCredentials = parseCSV(text)

    if (rawCredentials.length === 0) {
      return NextResponse.json(
        { error: 'No valid credentials found in CSV file' },
        { status: 400 }
      )
    }

    // Validate credentials
    const validationErrors: string[] = []
    const validCredentials: { email: string; password: string }[] = []
    const emailsSeen = new Set<string>()

    for (let i = 0; i < rawCredentials.length; i++) {
      const { email, password } = rawCredentials[i]
      const row = i + 2 // +2 because: header row + 0-based index

      // Validate email
      if (!isValidEmail(email)) {
        validationErrors.push(`Row ${row}: Invalid email format: ${email}`)
        continue
      }

      // Validate password length
      if (password.length < 6) {
        validationErrors.push(`Row ${row}: Password must be at least 6 characters: ${email}`)
        continue
      }

      // Check for duplicates in same batch
      if (emailsSeen.has(email)) {
        validationErrors.push(`Row ${row}: Duplicate email in CSV: ${email}`)
        continue
      }

      emailsSeen.add(email)
      validCredentials.push({ email, password })
    }

    // If there are validation errors, return them
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          validationErrors,
          validCount: validCredentials.length,
          invalidCount: validationErrors.length
        },
        { status: 400 }
      )
    }

    // Generate batch ID
    const batchId = nanoid(12)

    // Check for existing credentials with same emails (across all batches)
    const existingEmails = await prisma.assessmentCredential.findMany({
      where: {
        email: {
          in: validCredentials.map(c => c.email)
        }
      },
      select: {
        email: true,
        batchId: true
      }
    })

    // Delete old credentials for these emails (overwrite)
    if (existingEmails.length > 0) {
      await prisma.assessmentCredential.deleteMany({
        where: {
          email: {
            in: existingEmails.map(e => e.email)
          }
        }
      })
    }

    // Create credentials
    const credentialsToCreate = await Promise.all(
      validCredentials.map(async ({ email, password }) => ({
        email,
        password: await bcrypt.hash(password, 10),
        organizationId,
        assessmentTypes,
        expiresAt: new Date(expiresAt),
        batchId,
        batchName,
        createdBy: userId,
        isActive: true,
        loginCount: 0
      }))
    )

    // Bulk create
    const result = await prisma.assessmentCredential.createMany({
      data: credentialsToCreate
    })

    return NextResponse.json({
      success: true,
      batchId,
      created: result.count,
      overwritten: existingEmails.length,
      message: `Successfully created ${result.count} credentials${existingEmails.length > 0 ? ` (${existingEmails.length} overwritten)` : ''}`
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating assessment credentials:', error)
    return NextResponse.json(
      { error: 'Failed to create assessment credentials' },
      { status: 500 }
    )
  }
}

// GET - List all credential batches with stats
export async function GET(request: NextRequest) {
  try {
    // Check authentication - only SYSTEM_ADMIN
    const userId = await getUserId(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user || user.role !== 'SYSTEM_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get all credentials grouped by batch
    const credentials = await prisma.assessmentCredential.findMany({
      include: {
        organization: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Group by batch
    const batches = credentials.reduce((acc, cred) => {
      if (!acc[cred.batchId]) {
        acc[cred.batchId] = {
          batchId: cred.batchId,
          batchName: cred.batchName,
          organizationId: cred.organizationId,
          organizationName: cred.organization.name,
          assessmentTypes: cred.assessmentTypes,
          expiresAt: cred.expiresAt,
          createdAt: cred.createdAt,
          credentials: [],
          stats: {
            total: 0,
            used: 0,
            unused: 0,
            expired: false
          }
        }
      }
      
      acc[cred.batchId].credentials.push({
        id: cred.id,
        email: cred.email,
        isActive: cred.isActive,
        loginCount: cred.loginCount,
        lastUsedAt: cred.lastUsedAt
      })
      
      acc[cred.batchId].stats.total++
      if (cred.loginCount > 0) {
        acc[cred.batchId].stats.used++
      } else {
        acc[cred.batchId].stats.unused++
      }
      
      if (new Date() > new Date(cred.expiresAt)) {
        acc[cred.batchId].stats.expired = true
      }
      
      return acc
    }, {} as Record<string, any>)

    return NextResponse.json({
      batches: Object.values(batches)
    })

  } catch (error) {
    console.error('Error fetching assessment credentials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assessment credentials' },
      { status: 500 }
    )
  }
}

