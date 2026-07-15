const validateEnv = () => {
  // These variables are REQUIRED — the server cannot function without them
  const requiredVars = [
    'MONGO_URI',
    'JWT_SECRET',
  ];

  // These variables are OPTIONAL — the server handles their absence gracefully
  const optionalVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
    'CLIENT_URL', // Optional: if missing, CORS allows all origins
  ];

  const missingRequired = requiredVars.filter(envVar => !process.env[envVar]);

  if (missingRequired.length > 0) {
    console.error('\n=========================================');
    console.error('🔥 STARTUP ERROR: Missing Required Environment Variables');
    console.error('=========================================');
    console.error('The following environment variables must be set:');
    missingRequired.forEach(envVar => {
      console.error(`  - ${envVar}`);
    });
    console.error('-----------------------------------------');
    console.error('Please add these to your .env file locally or to the Environment Variables section in the Render Dashboard.');
    console.error('=========================================\n');
    process.exit(1);
  }

  // Warn about missing optional vars
  const missingOptional = optionalVars.filter(envVar => !process.env[envVar]);
  if (missingOptional.length > 0) {
    console.warn('⚠️  Optional environment variables not set (features may be degraded):');
    missingOptional.forEach(envVar => console.warn(`   - ${envVar}`));
  }

  console.log('✅ Environment variables validation passed.');
};

module.exports = validateEnv;
