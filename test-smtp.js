const nodemailer = require('nodemailer');
require('dotenv').config();

async function testSMTP() {
  console.log("Testing SMTP connection for:", process.env.SMTP_USER);
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    // Verify connection configuration
    await transporter.verify();
    console.log("✅ SMTP Server is ready to take our messages");
    
    // Optionally send a test email
    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: process.env.SMTP_USER, // send to self
      subject: "Test Email from Entry Club",
      text: "If you are reading this, your App Password configuration is working perfectly!",
    });
    
    console.log("✅ Test email sent successfully! Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Error with SMTP configuration:");
    console.error(error);
  }
}

testSMTP();
