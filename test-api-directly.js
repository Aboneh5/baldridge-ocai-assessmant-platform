// Test the Baldrige response API directly
const fetch = require('node-fetch');

async function testAPI() {
  try {
    // First, get a user ID
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const user = await prisma.user.findFirst({
      where: {
        email: 'o.b@gmail.com'
      }
    });

    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('Testing with user:', user.name, user.id);

    // Get a question ID
    const question = await prisma.baldrigeQuestion.findFirst();
    console.log('Testing with question:', question.itemCode);

    await prisma.$disconnect();

    // Test the API
    const response = await fetch('http://localhost:3010/api/baldrige/response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user.id
      },
      body: JSON.stringify({
        questionId: question.id,
        responseText: 'This is a test response',
        surveyId: null,
        timeSpent: 10
      })
    });

    const data = await response.json();
    console.log('\nAPI Response Status:', response.status);
    console.log('API Response:', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testAPI();
