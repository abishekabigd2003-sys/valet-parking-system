const validateEnv = () => {
  const requiredEnvVars = [
    'MONGO_URI',
    'JWT_SECRET',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
    'CLIENT_URL'
  ];

  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingVars.length > 0) {
    console.error('\n=========================================');
    console.error('🔥 STARTUP ERROR: Missing Environment Variables');
    console.error('=========================================');
    console.error('The following environment variables must be set:');
    missingVars.forEach(envVar => {
      console.error(`  - ${envVar}`);
    });
    console.error('-----------------------------------------');
    console.error('Please add these to your .env file locally or to the Environment Variables section in the Render Dashboard.');
    console.error('=========================================\n');
    process.exit(1);
  }

  console.log('✅ Environment variables validation passed.');
};

module.exports = validateEnv;
