const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function createBaldrigeAccess() {
  try {
    console.log('🔑 Creating Baldrige Access Key...\n')

    // Get first organization
    const org = await prisma.organization.findFirst()

    if (!org) {
      console.log('❌ No organization found. Run seed script first.')
      return
    }

    console.log(`Organization: ${org.name}`)

    // Generate random access key
    const accessKey = 'BALD' + Math.random().toString(36).substring(2, 6).toUpperCase()

    // Create access key for Baldrige
    const key = await prisma.accessKey.create({
      data: {
        key: accessKey,
        organizationId: org.id,
        assessmentTypes: 'OCAI,BALDRIGE', // Both assessments
        maxUses: null, // Unlimited uses
        isActive: true,
        description: 'Test access key for Baldrige assessment',
      }
    })

    console.log('\n✅ Access Key Created Successfully!\n')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`Access Key: ${key.key}`)
    console.log(`Organization: ${org.name}`)
    console.log(`Assessment Types: ${key.assessmentTypes}`)
    console.log(`Max Uses: Unlimited`)
    console.log(`Status: Active`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    console.log('\n📝 HOW TO TEST:\n')
    console.log('1. Start the app: npm run dev')
    console.log('2. Go to: http://localhost:3010/auth/signin')
    console.log('3. Click "Access Key" tab')
    console.log(`4. Enter access key: ${key.key}`)
    console.log('5. Enter your name (e.g., "John Doe")')
    console.log('6. Click "Sign In"')
    console.log('7. You will see both OCAI and Baldrige assessment options')
    console.log('8. Click "Baldrige Excellence Assessment"')
    console.log('9. Fill out questions - they auto-save after 1 second')
    console.log('10. Navigate through categories and subcategories')
    console.log('11. Run: node check-responses.js to verify storage')

    console.log('\n✅ Baldrige is now ready to test!')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createBaldrigeAccess()
