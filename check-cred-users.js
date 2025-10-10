const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.user.findMany({
  where: {
    accessKeyUsed: { startsWith: 'CREDENTIAL_' }
  },
  select: {
    id: true,
    name: true,
    email: true,
    accessKeyUsed: true,
    createdAt: true
  }
}).then(users => {
  console.log('Credential-based users:', users.length);
  console.log(JSON.stringify(users, null, 2));
}).finally(() => prisma.$disconnect());
