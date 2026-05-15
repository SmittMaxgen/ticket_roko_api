const twilio = require("twilio");

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Create client only if credentials are provided
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

// Send SMS function
const sendSMS = async (to, message) => {
  if (!client) {
    console.warn("SMS service not configured. Skipping SMS send.");
    return { success: false, error: "SMS service not configured" };
  }

  try {
    const sms = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to,
    });
    console.log("SMS sent:", sms.sid);
    return { success: true, sid: sms.sid };
  } catch (error) {
    console.error("SMS send error:", error);
    return { success: false, error: error.message };
  }
};

module.exports = sendSMS;
