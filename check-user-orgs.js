const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUserOrgs() {
  console.log('=== CHECKING USER ORGANIZATIONS ===\n');

  try {
    // Get all users with their organization info
    const users = await prisma.user.findMany({
      include: {
        organization: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Total Users: ${users.length}\n`);

    // Group by organization
    const usersByOrg = {};
    const noOrgUsers = [];

    users.forEach(u => {
      if (u.organizationId) {
        if (!usersByOrg[u.organizationId]) {
          usersByOrg[u.organizationId] = {
            orgName: u.organization?.name || 'Unknown',
            users: []
          };
        }
        usersByOrg[u.organizationId].users.push(u);
      } else {
        noOrgUsers.push(u);
      }
    });

    // Display users by organization
    console.log('USERS BY ORGANIZATION:\n');
    Object.entries(usersByOrg).forEach(([orgId, data]) => {
      console.log(`📁 ${data.orgName} (${orgId})`);
      data.users.forEach(u => {
        console.log(`   - ${u.name} | ${u.role} | ID: ${u.id}`);
      });
      console.log(''); 
    });

    // Display users without organization
    if (noOrgUsers.length > 0) {
      console.log('⚠️  USERS WITHOUT ORGANIZATION:\n');
      noOrgUsers.forEach(u => {
        console.log(`   - ${u.name} | ${u.role} | ID: ${u.id}`);
      });
      console.log('');
    }

    // Now check responses
    console.log('\n=== CHECKING RESPONSES ===\n');

    const responses = await prisma.response.findMany({
      include: {
        user: {
          include: {
            organization: true
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      }
    });

    console.log(`Total Responses: ${responses.length}\n`);

    if (responses.length > 0) {
      responses.forEach((r, i) => {
        const userOrg = r.user?.organization?.name || 'NO ORG';
        const userName = r.user?.name || 'NO USER';
        console.log(`${i + 1}. User: ${userName} | Org: ${userOrg} | Submitted: ${r.submittedAt.toLocaleString()}`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserOrgs();
