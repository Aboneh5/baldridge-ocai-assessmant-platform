// Test Baldrige Submission Right Now
const fetch = require('node-fetch');

async function testSubmission() {
  const userId = 'cmgpb93lf0001u0m0dv0gb5d0';
  const url = 'http://localhost:3010/api/baldrige/submit';

  console.log('Testing Baldrige Submission...');
  console.log('User ID:', userId);
  console.log('URL:', url);
  console.log('');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId
      },
      body: JSON.stringify({ surveyId: null })
    });

    const data = await response.json();

    console.log('Response Status:', response.status);
    console.log('Response Body:', JSON.stringify(data, null, 2));
    console.log('');

    if (!data.success) {
      console.log('❌ SUBMISSION FAILED');
      console.log('Reason:', data.message);
      console.log('');
      
      if (data.data) {
        console.log('Details:');
        console.log('  - Answered Questions:', data.data.answeredQuestions || 0);
        console.log('  - Total Questions:', data.data.totalQuestions || 97);
        console.log('  - Remaining Questions:', data.data.remainingQuestions || '?');
        console.log('');

        if (data.data.unansweredQuestions && data.data.unansweredQuestions.length > 0) {
          console.log('Sample Unanswered Questions (first 5):');
          data.data.unansweredQuestions.slice(0, 5).forEach((q, i) => {
            console.log(`  ${i + 1}. [${q.itemCode}] ${q.category} - ${q.subcategory}`);
          });
        }
      }
    } else {
      console.log('✅ SUBMISSION SUCCESSFUL!');
      console.log('Assessment ID:', data.data.assessmentId);
      console.log('Submitted At:', data.data.submittedAt);
    }
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error(error);
  }
}

testSubmission();


