const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const responses = await prisma.response.findMany({
    include: {
      survey: true,
      user: { include: { organization: true } }
    }
  });

  console.log('=== RESPONSE & SURVEY LINKAGE ===\n');
  responses.forEach(r => {
    console.log('Response ID:', r.id);
    console.log('  User org:', r.user?.organization?.name || 'NO ORG');
    console.log('  Survey:', r.survey?.title || 'NO SURVEY');
    console.log('  Survey org:', r.survey?.organizationId || 'NO SURVEY ORG');
    console.log('');
  });

  const surveys = await prisma.survey.findMany({
    where: { organizationId: 'cmgbkw1ul0001uuxkezll33or' },
  });

  console.log('\n=== SURVEYS FOR MARY JOY ===');
  console.log('Count:', surveys.length);
  surveys.forEach(s => console.log('  -', s.title, '(', s.id, ')'));

  await prisma.$disconnect();
}

check();
