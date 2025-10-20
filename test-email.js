// Quick test script to check if Resend API is working
const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.RESEND_API_KEY;

console.log('===========================================');
console.log('Resend Email Test - Updated');
console.log('===========================================');
console.log('API Key exists:', !!apiKey);
console.log('API Key starts with:', apiKey ? apiKey.substring(0, 10) + '...' : 'NOT FOUND');
console.log('');

if (!apiKey) {
  console.error('❌ RESEND_API_KEY not found in .env.local');
  console.log('Please add: RESEND_API_KEY=re_your_key_here');
  process.exit(1);
}

const resend = new Resend(apiKey);

async function testEmail() {
  try {
    console.log('✉️  Sending test email to info@tenadamconsulting.com...');
    console.log('📧 From: onboarding@resend.dev');
    console.log('');

    const { data, error } = await resend.emails.send({
      from: 'Tenadam Assessment Hub <noreply@hub.tenadamconsulting.com>',
      to: ['info@tenadamconsulting.com'],
      subject: '🎉 Test Email - Domain Verified & Working!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0f766e, #10b981); padding: 30px; text-align: center; border-radius: 10px;">
            <h1 style="color: white; margin: 0;">🎉 Success!</h1>
            <p style="color: #a7f3d0; margin: 10px 0 0 0; font-size: 18px;">Resend Email Service is Working</p>
          </div>

          <div style="padding: 30px; background: #f9fafb; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #1f2937;">Email Delivery Confirmed</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              This test email confirms that your Resend email service is properly configured
              and working correctly with the Tenadam Assessment Hub.
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0f766e;">
              <p style="margin: 5px 0;"><strong>✅ API Key:</strong> Valid and working</p>
              <p style="margin: 5px 0;"><strong>✅ Email Service:</strong> Connected</p>
              <p style="margin: 5px 0;"><strong>✅ Delivery:</strong> Successful</p>
              <p style="margin: 5px 0;"><strong>🕐 Time:</strong> ${new Date().toLocaleString()}</p>
            </div>

            <h3 style="color: #1f2937; margin-top: 30px;">What's Next?</h3>
            <ol style="color: #4b5563; line-height: 1.8;">
              <li>Your contact form is now working!</li>
              <li>Verify domain <strong>hub.tenadamconsulting.com</strong> in Resend</li>
              <li>Update sender email to <strong>noreply@hub.tenadamconsulting.com</strong></li>
              <li>Enjoy professional email delivery! 🚀</li>
            </ol>
          </div>

          <div style="background: #e5e7eb; padding: 20px; text-align: center; border-radius: 10px; margin-top: 20px;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              <strong>Tenadam Assessment Hub</strong><br>
              Powered by Resend Email Service
            </p>
          </div>
        </div>
      `,
      text: `
🎉 Success! Resend Email Service is Working

Email Delivery Confirmed
This test email confirms that your Resend email service is properly configured and working correctly with the Tenadam Assessment Hub.

✅ API Key: Valid and working
✅ Email Service: Connected
✅ Delivery: Successful
🕐 Time: ${new Date().toLocaleString()}

What's Next?
1. Your contact form is now working!
2. Verify domain hub.tenadamconsulting.com in Resend
3. Update sender email to noreply@hub.tenadamconsulting.com
4. Enjoy professional email delivery! 🚀

---
Tenadam Assessment Hub
Powered by Resend Email Service
      `,
    });

    if (error) {
      console.error('');
      console.error('❌ Error sending email:', error);
      console.error('');

      if (error.message && error.message.includes('verify a domain')) {
        console.log('📝 NOTE: This error is expected if the Resend account owner email');
        console.log('         is NOT info@tenadamconsulting.com');
        console.log('');
        console.log('🔧 SOLUTION: Verify domain hub.tenadamconsulting.com in Resend');
        console.log('   See: SETUP_DOMAIN_hub.tenadamconsulting.com.md for instructions');
      }

      process.exit(1);
    }

    console.log('');
    console.log('✅ Email sent successfully!');
    console.log('📧 Email ID:', data.id);
    console.log('');
    console.log('👀 Check your inbox at: info@tenadamconsulting.com');
    console.log('📊 Check Resend dashboard: https://resend.com/emails');
    console.log('');
    console.log('🎉 The contact form should now work perfectly!');

  } catch (err) {
    console.error('❌ Exception occurred:', err.message);
    process.exit(1);
  }
}

testEmail();
