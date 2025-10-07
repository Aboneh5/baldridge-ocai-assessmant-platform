const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkResponses() {
  try {
    console.log('=== OCAI RESPONSES ===\n')

    const responses = await prisma.response.findMany({
      include: {
        survey: {
          select: {
            id: true,
            title: true,
            assessmentType: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      }
    })

    console.log(`Total OCAI responses: ${responses.length}\n`)

    if (responses.length > 0) {
      console.log('Sample OCAI Responses:')
      responses.slice(0, 3).forEach((r, i) => {
        console.log(`\n${i + 1}. Response ID: ${r.id}`)
        console.log(`   Survey: ${r.survey.title} (${r.survey.assessmentType})`)
        console.log(`   User: ${r.user?.name || 'Anonymous'} (${r.user?.role || 'N/A'})`)
        console.log(`   Submitted: ${r.submittedAt}`)
        console.log(`   Now Scores:`, r.nowScores)
        console.log(`   Preferred Scores:`, r.preferredScores)
        console.log(`   Demographics:`, r.demographics)
      })
    }

    console.log('\n\n=== BALDRIGE RESPONSES ===\n')

    const baldrigeResponses = await prisma.baldrigeResponse.findMany({
      include: {
        question: {
          select: {
            itemCode: true,
            questionText: true
          }
        },
        survey: {
          select: {
            title: true,
            assessmentType: true
          }
        },
        user: {
          select: {
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`Total Baldrige responses: ${baldrigeResponses.length}\n`)

    if (baldrigeResponses.length > 0) {
      console.log('Sample Baldrige Responses:')
      baldrigeResponses.slice(0, 5).forEach((r, i) => {
        console.log(`\n${i + 1}. Response ID: ${r.id}`)
        console.log(`   Question: ${r.question.itemCode}`)
        console.log(`   Question Text: ${r.question.questionText.substring(0, 80)}...`)
        console.log(`   Survey: ${r.survey?.title || 'N/A'}`)
        console.log(`   User: ${r.user.name} (${r.user.email || 'N/A'})`)
        console.log(`   Response: ${r.responseText.substring(0, 100)}...`)
        console.log(`   Time Spent: ${r.timeSpent}s`)
        console.log(`   Created: ${r.createdAt}`)
      })
    }

    console.log('\n\n=== SUMMARY ===\n')
    console.log(`✓ Total OCAI Responses: ${responses.length}`)
    console.log(`✓ Total Baldrige Responses: ${baldrigeResponses.length}`)
    console.log(`✓ Total Responses: ${responses.length + baldrigeResponses.length}`)
    console.log(`\n${responses.length + baldrigeResponses.length > 0 ? '✅ Database IS storing responses' : '❌ Database is NOT storing responses'}`)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkResponses()
