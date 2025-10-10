const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function fixUser() {
  try {
    const email = 'o.b@gmail.com';
    const orgId = 'cmggn97vv0000u0a8svrc0m7e'; // From credentials check

    console.log('Fixing user for:', email);

    // Check if user exists
    let user = await prisma.user.findFirst({
      where: {
        email: email,
        organizationId: orgId
      }
    });

    if (user) {
      console.log('User already exists:', user.id);
    } else {
      // Create user
      user = await prisma.user.create({
        data: {
          name: 'o.b',
          email: email,
          role: 'EMPLOYEE',
          organizationId: orgId,
          accessKeyUsed: 'CREDENTIAL_69U2HM50LGLU'
        }
      });
      console.log('Created user:', user.id);
    }

    // Get all Baldrige questions
    const questions = await prisma.baldrigeQuestion.findMany({
      select: {
        id: true,
        itemCode: true,
        subcategory: {
          select: {
            category: {
              select: {
                displayOrder: true
              }
            }
          }
        }
      }
    });

    console.log('\nTotal Baldrige questions in DB:', questions.length);

    const mainQuestions = questions.filter(q =>
      q.subcategory.category.displayOrder > 0
    );
    console.log('Main category questions (excluding Org Profile):', mainQuestions.length);

    // Check existing responses
    const existing = await prisma.baldrigeResponse.findMany({
      where: { userId: user.id }
    });
    console.log('Existing responses for user:', existing.length);

    if (existing.length > 0) {
      console.log('\nDeleting existing responses...');
      await prisma.baldrigeResponse.deleteMany({
        where: { userId: user.id }
      });
      console.log('Deleted', existing.length, 'responses');
    }

    console.log('\n✅ User is ready. User ID:', user.id);
    console.log('\nNow you need to:');
    console.log('1. Open browser console (F12)');
    console.log('2. Run: localStorage.getItem("user")');
    console.log('3. Verify the user ID matches:', user.id);
    console.log('4. If different, update localStorage:');
    console.log(`   localStorage.setItem('user', '${JSON.stringify({
      id: user.id,
      email: email,
      name: 'o.b',
      credentialId: 'credential_id_here',
      organizationId: orgId,
      organizationName: 'Organization Name',
      assessmentTypes: ['OCAI', 'BALDRIGE'],
      role: 'CREDENTIAL_USER'
    })}')`);
    console.log('\n5. Refresh the page and try submitting again');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUser();
