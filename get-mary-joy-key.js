const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getKey() {
  try {
    const key = await prisma.accessKey.findFirst({
      where: {
        isActive: true,
        organization: { name: 'Mary Joy' }
      },
      include: { organization: true }
    });

    if (key) {
      console.log('Mary Joy Access Key:', key.key);
      console.log('Org ID:', key.organizationId);
      console.log('Org Name:', key.organization.name);
      console.log('\nUse this at: http://localhost:3012/auth/access-key');
    } else {
      console.log('No active access key for Mary Joy');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getKey();
