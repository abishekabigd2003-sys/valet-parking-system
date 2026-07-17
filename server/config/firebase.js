const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

let firebaseInitialized = false;

try {
  if (getApps().length === 0) {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      // Use individual environment variables (Best for Render/Vercel)
      // Robust private key parsing:
      // 1. Strip surrounding quotes if accidentally included when pasting
      // 2. Replace literal \n escape sequences with real newline characters
      const rawKey = process.env.FIREBASE_PRIVATE_KEY || '';
      const parsedKey = rawKey
        .replace(/^["']|["']$/g, '')
        .replace(/\\n/g, '\n');

      const projectId = (process.env.FIREBASE_PROJECT_ID || '').trim().replace(/^["']|["']$/g, '').trim();
      const clientEmail = (process.env.FIREBASE_CLIENT_EMAIL || '').trim().replace(/^["']|["']$/g, '').trim();

      const serviceAccount = {
        projectId,
        clientEmail,
        privateKey: parsedKey,
      };
      initializeApp({
        credential: cert(serviceAccount)
      });
      firebaseInitialized = true;
      console.log('✅ Firebase Admin SDK initialized successfully via Environment Variables');
    } else {
      // Fallback for local development if GOOGLE_APPLICATION_CREDENTIALS is set
      const { applicationDefault } = require('firebase-admin/app');
      initializeApp({
        credential: applicationDefault(),
      });
      firebaseInitialized = true;
      console.log('✅ Firebase Admin SDK initialized via Application Default Credentials');
    }
  } else {
    firebaseInitialized = true;
  }
} catch (error) {
  console.error('\n=========================================');
  console.error('⚠️  FIREBASE INITIALIZATION WARNING');
  console.error('=========================================');
  console.error(`Error: ${error.message}`);
  console.error('Firebase auth will be unavailable. JWT fallback will be used for token verification.');
  console.error('To fix: ensure FIREBASE_PRIVATE_KEY in Render is the raw value from the service account JSON,');
  console.error('with literal \\n characters (not real newlines), and no surrounding quotes.');
  console.error('=========================================\n');
  // Do NOT exit — the server will still start and use the JWT fallback in authMiddleware
}

// Export an object that mimics the old default export structure for auth
module.exports = {
  auth: () => {
    if (!firebaseInitialized) {
      // Return a stub that throws a descriptive error, triggering the fallback in authMiddleware
      return {
        verifyIdToken: async () => {
          throw new Error('Firebase not initialized — using JWT fallback');
        }
      };
    }
    return getAuth();
  }
};
