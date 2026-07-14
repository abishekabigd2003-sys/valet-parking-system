const { initializeApp, applicationDefault, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

try {
  if (getApps().length === 0) {
    initializeApp({
      // We will use standard application default credentials.
      // Make sure to set GOOGLE_APPLICATION_CREDENTIALS in .env pointing to your service account JSON file
      credential: applicationDefault(), 
    });
    console.log('Firebase Admin SDK initialized successfully');
  }
} catch (error) {
  console.error('Firebase Admin SDK initialization error:', error);
}

// Export an object that mimics the old default export structure for auth
module.exports = {
  auth: getAuth
};
