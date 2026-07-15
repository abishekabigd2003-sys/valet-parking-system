const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

try {
  if (getApps().length === 0) {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      // Use individual environment variables (Best for Render/Vercel)
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Robust private key parsing:
        // 1. Strip surrounding quotes if accidentally included when pasting
        // 2. Replace literal \n escape sequences with real newline characters
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          .replace(/^["']|["']$/g, '')   // strip surrounding quotes
          .replace(/\\n/g, '\n'),         // convert \n to real newlines
      };
      initializeApp({
        credential: cert(serviceAccount)
      });
      console.log('Firebase Admin SDK initialized successfully via Environment Variables');
    } else {
      // Fallback for local development if GOOGLE_APPLICATION_CREDENTIALS is set
      const { applicationDefault } = require('firebase-admin/app');
      initializeApp({
        credential: applicationDefault(), 
      });
      console.log('Firebase Admin SDK initialized via Application Default Credentials');
    }
  }
} catch (error) {
  console.error('\n=========================================');
  console.error('❌ FIREBASE INITIALIZATION ERROR');
  console.error('=========================================');
  console.error(`Error Message: ${error.message}`);
  console.error('Please ensure FIREBASE_PRIVATE_KEY is formatted correctly and includes newlines if set.');
  console.error('=========================================\n');
  process.exit(1);
}

// Export an object that mimics the old default export structure for auth
module.exports = {
  auth: getAuth
};
