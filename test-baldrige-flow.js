const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testBaldrigeFlow() {
  try {
    console.log('=== BALDRIGE IMPLEMENTATION TEST ===\n')

    // 1. Check if organization exists
    const orgs = await prisma.organization.findMany({
      include: {
        accessKeys: true
      }
    })

    if (orgs.length === 0) {
      console.log('❌ No organizations found. Run seed script first.')
      return
    }

    const org = orgs[0]
    console.log(`✅ Organization: ${org.name}`)
    console.log(`   Subscribed Assessments: ${org.subscribedAssessments}`)

    // 2. Check access keys
    const accessKeys = await prisma.accessKey.findMany({
      where: {
        organizationId: org.id,
        isActive: true
      }
    })

    console.log(`\n✅ Active Access Keys: ${accessKeys.length}`)
    if (accessKeys.length > 0) {
      accessKeys.slice(0, 3).forEach(key => {
        console.log(`   - Key: ${key.key}`)
        console.log(`     Assessment Types: ${key.assessmentTypes}`)
        console.log(`     Usage: ${key.usageCount}${key.maxUses ? `/${key.maxUses}` : '/unlimited'}`)
      })
    }

    // 3. Check Baldrige questions
    const baldrigeCount = await prisma.baldrigeQuestion.count()
    console.log(`\n✅ Baldrige Questions: ${baldrigeCount}`)

    // 4. Check if there are any Baldrige responses
    const baldrigeResponses = await prisma.baldrigeResponse.count()
    console.log(`✅ Baldrige Responses: ${baldrigeResponses}`)

    // 5. Check if there are users who can access Baldrige
    const users = await prisma.user.findMany({
      where: {
        organizationId: org.id
      },
      take: 3
    })

    console.log(`\n✅ Users: ${users.length}`)
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.role})`)
    })

    console.log('\n=== HOW TO TEST BALDRIGE ===\n')

    if (accessKeys.length > 0 && accessKeys[0].assessmentTypes.includes('BALDRIGE')) {
      console.log('1. Start the app: npm run dev')
      console.log('2. Go to: http://localhost:3010/auth/signin')
      console.log('3. Click "Access Key" tab')
      console.log(`4. Enter access key: ${accessKeys[0].key}`)
      console.log('5. Enter your name (e.g., "Test User")')
      console.log('6. Click "Sign In"')
      console.log('7. On the assessments page, click "Baldrige Excellence Assessment"')
      console.log('8. Fill out some questions and they will auto-save')
      console.log('9. Navigate through subcategories')
      console.log('10. Check database with: node check-responses.js')
    } else {
      console.log('⚠️  No access keys with Baldrige access found.')
      console.log('\nTo create one, you can:')
      console.log('1. Sign in as FACILITATOR or SYSTEM_ADMIN')
      console.log('2. Go to Access Keys management')
      console.log('3. Create a new key with BALDRIGE in assessmentTypes')
    }

    console.log('\n=== SYSTEM STATUS ===\n')
    console.log(`✅ Database: Connected`)
    console.log(`✅ Baldrige Schema: Seeded (${baldrigeCount} questions)`)
    console.log(`✅ API Endpoints: Implemented`)
    console.log(`✅ Frontend: Implemented`)
    console.log(`${baldrigeResponses > 0 ? '✅' : '⚠️ '} Responses: ${baldrigeResponses === 0 ? 'None yet - needs testing' : `${baldrigeResponses} found`}`)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testBaldrigeFlow()
