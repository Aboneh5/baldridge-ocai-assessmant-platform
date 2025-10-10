const fetch = require('node-fetch');

async function testAdminAPI() {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    // Get a SYSTEM_ADMIN user
    const admin = await prisma.user.findFirst({
      where: {
        role: 'SYSTEM_ADMIN'
      }
    });

    if (!admin) {
      console.log('No admin found');
      return;
    }

    console.log('Testing with admin:', admin.name, admin.id);

    await prisma.$disconnect();

    // Test the API
    const response = await fetch('http://localhost:3010/api/admin/baldrige/responses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': admin.id
      }
    });

    const data = await response.json();
    console.log('\nAPI Response Status:', response.status);

    if (data.success) {
      console.log('\nSummary:', data.summary);
      console.log('\nOrganizations:', data.data.length);

      data.data.forEach(org => {
        console.log(`\n  Organization: ${org.organizationName}`);
        console.log(`    Total Users: ${org.totalUsers}`);
        org.users.forEach(user => {
          console.log(`    User: ${user.userName} (${user.userEmail})`);
          console.log(`      Assessment ID: ${user.assessmentId}`);
          console.log(`      Completed: ${user.completedAt}`);
          console.log(`      Responses: ${user.responses.length}`);
        });
      });
    } else {
      console.log('API returned error:', data);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAdminAPI();
