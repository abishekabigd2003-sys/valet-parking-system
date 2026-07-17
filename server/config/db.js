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
    if (process.env.E2E_TEST === 'true') {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log('✅ Using in-memory MongoDB for E2E tests');
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    });

    console.log(`\n=========================================`);
    console.log(`✅ Connected to MongoDB Atlas`);
    console.log(`📂 Database Name: ${conn.connection.name}`);
    console.log(`=========================================\n`);
  } catch (error) {
    console.error('\n=========================================');
    console.error('❌ MONGODB CONNECTION ERROR');
    console.error('=========================================');
    console.error(`Error Message: ${error.message}`);
    console.error('=========================================\n');
    process.exit(1);
  }
};

module.exports = connectDB;
