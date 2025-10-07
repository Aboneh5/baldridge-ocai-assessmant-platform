const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  console.log('=== CHECKING DATABASE ===\n');

  // Check organizations
  const orgs = await prisma.organization.findMany();
  console.log('Organizations:', orgs.length);
  orgs.forEach(org => {
    console.log(`  - ${org.name} (ID: ${org.id})`);
  });

  console.log('\n');

  // Check users
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      role: true,
      organizationId: true,
    }
  });
  console.log('Users:', users.length);
  users.forEach(u => {
    console.log(`  - ${u.name} | Role: ${u.role} | OrgID: ${u.organizationId || 'NONE'}`);
  });

  console.log('\n');

  // Check responses
  const responses = await prisma.response.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          organizationId: true,
        }
      }
    }
  });
  console.log('Total Responses:', responses.length);
  responses.forEach(r => {
    const nowScoresType = typeof r.nowScores;
    const userOrg = r.user?.organizationId || 'NO ORG';
    console.log(`  - User: ${r.user?.name || 'N/A'} | OrgId: ${userOrg} | Scores Type: ${nowScoresType}`);
  });

  // Check if responses match organizations
  console.log('\n=== MATCHING RESPONSES TO ORGS ===\n');
  for (const org of orgs) {
    const orgResponses = await prisma.response.findMany({
      where: {
        user: {
          organizationId: org.id
        }
      }
    });
    console.log(`${org.name}: ${orgResponses.length} responses`);
  }

  await prisma.$disconnect();
}

checkData().catch(console.error);
