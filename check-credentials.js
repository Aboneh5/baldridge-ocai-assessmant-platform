const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCredentials() {
  try {
    console.log('Checking credentials for o.b@gmail.com and a.t@gmail.com...\n');

    const credentials = await prisma.assessmentCredential.findMany({
      where: {
        email: {
          in: ['o.b@gmail.com', 'a.t@gmail.com']
        }
      },
      select: {
        email: true,
        isActive: true,
        expiresAt: true,
        organizationId: true,
        batchId: true,
        assessmentTypes: true,
        loginCount: true,
        lastUsedAt: true
      }
    });

    console.log('Found credentials:', JSON.stringify(credentials, null, 2));
    console.log('\nExpiration check:');
    credentials.forEach(cred => {
      const now = new Date();
      const expiry = new Date(cred.expiresAt);
      console.log(`${cred.email}: Expires ${expiry.toISOString()}, Expired: ${now > expiry}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCredentials();
