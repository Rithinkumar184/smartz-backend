const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

// Initialize Firebase Admin SDK
// Make sure you have downloaded serviceAccountKey.json from Firebase console
// and placed it in your backend folder
const serviceAccount = require(path.join(__dirname, "../firebase/serviceAccountKey.json"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

/**
 * Send push notification to a device
 * @param {string} deviceToken - FCM device token
 * @param {string} title - Notification title
 * @param {string} body - Notification message
 * @param {object} data - Optional data payload
 */
const sendPushNotification = async (deviceToken, title, body, data = {}) => {
  try {
    const message = {
      token: deviceToken,
      notification: {
        title,
        body,
      },
      android: {
        notification: {
          sound: "default", // ringtone
          defaultSound: true,
          vibrateTimingsMillis: [0, 500, 500, 500], // vibration pattern
          priority: "high",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            alert: { title, body },
            contentAvailable: true,
            badge: 1,
          },
        },
      },
      data, // optional custom data
    };

    const response = await admin.messaging().send(message);
    console.log("Push sent:", response);
    return response;
  } catch (err) {
    console.error("Error sending push:", err.message);
  }
};

/**
 * Send OTP via push (optional) or via SMS provider
 * @param {string} phone - user phone number
 * @param {string} otp - OTP code
 */
const sendOTP = async (phone, otp) => {
  // For simplicity, here we just log it. In production, integrate Twilio/Nexmo
  console.log(`Sending OTP ${otp} to phone ${phone}`);
  // Example: integrate Twilio here if needed
};

module.exports = { sendPushNotification, sendOTP };
