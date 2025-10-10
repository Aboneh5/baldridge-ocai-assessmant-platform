const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function testPassword() {
  try {
    const email = 'o.b@gmail.com';
    const testPassword = 'pass123456'; // Try common passwords

    console.log('Testing password for:', email);
    console.log('Test password:', testPassword);

    const credential = await prisma.assessmentCredential.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        isActive: true
      }
    });

    if (!credential) {
      console.log('No credential found!');
      return;
    }

    console.log('\nCredential found:');
    console.log('Email:', credential.email);
    console.log('Hashed password:', credential.password);

    // Test password
    const match = await bcrypt.compare(testPassword, credential.password);
    console.log('\nPassword match with "pass123456":', match);

    // Also test some other common passwords
    const testPasswords = ['pass123456', 'password', '123456', 'temp123', 'abc123'];
    console.log('\nTesting common passwords:');
    for (const pwd of testPasswords) {
      const result = await bcrypt.compare(pwd, credential.password);
      console.log(`  "${pwd}": ${result ? '✓ MATCH' : '✗ no match'}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPassword();
