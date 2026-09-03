const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Add event listeners for robust monitoring
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connection established successfully.');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB connection lost. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully.');
    });

    let uri = process.env.MONGO_URI;
    const isPlaceholder = !uri || uri.includes('<db_username>') || uri.includes('<');

    if (process.env.E2E_TEST === 'true' || (isPlaceholder && process.env.NODE_ENV !== 'production')) {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
        console.log('\n⚠️  Notice: MONGO_URI is a placeholder or E2E_TEST is active.');
        console.log('✅ Started in-memory MongoDB server instance for development.\n');
      } catch (memErr) {
        console.warn('Could not start MongoMemoryServer:', memErr.message);
      }
    }

    let conn;
    try {
      conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4 // Use IPv4, skip trying IPv6
      });
    } catch (connErr) {
      if (process.env.NODE_ENV !== 'production' && !uri.includes('127.0.0.1')) {
        console.warn(`\n⚠️  Could not connect to configured MONGO_URI (${connErr.message})`);
        console.warn('🔄 Falling back to in-memory MongoDB server for local development...\n');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const memoryUri = mongoServer.getUri();
        conn = await mongoose.connect(memoryUri, {
          serverSelectionTimeoutMS: 5000,
          family: 4
        });
      } else {
        throw connErr;
      }
    }

    console.log(`\n=========================================`);
    console.log(`✅ Connected to MongoDB (${conn.connection.host || 'localhost'})`);
    console.log(`📂 Database Name: ${conn.connection.name}`);
    console.log(`=========================================\n`);
  } catch (error) {
    console.error('\n=========================================');
    console.error('❌ MONGODB CONNECTION ERROR');
    console.error('=========================================');
    console.error(`Error Message: ${error.message}`);
    console.error('Tip: Update MONGO_URI in server/.env with your valid MongoDB Atlas credentials or local MongoDB URI.');
    console.error('=========================================\n');
    process.exit(1);
  }
};

module.exports = connectDB;
