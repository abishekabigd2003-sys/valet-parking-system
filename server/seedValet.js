const fs = require('fs');
const https = require('https');
const mongoose = require('mongoose');
require('dotenv').config();

const API_KEY = process.env.FIREBASE_API_KEY || 'your_firebase_api_key'; 
const email = 'valet@zenpark.com';
const password = 'password123';

const data = JSON.stringify({
  email: email,
  password: password,
  returnSecureToken: true
});

const options = {
  hostname: 'identitytoolkit.googleapis.com',
  path: '/v1/accounts:signUp?key=' + API_KEY,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (d) => { body += d; });
  res.on('end', () => {
    const response = JSON.parse(body);
    
    mongoose.connect(process.env.MONGO_URI).then(async () => {
      const db = mongoose.connection.collection('users');
      
      if (response.error && response.error.message === 'EMAIL_EXISTS') {
         await db.updateOne({ email: email }, { $set: { role: 'Valet', status: 'Active' } });
         console.log('Updated existing user role to Valet');
      } else if (!response.error) {
        const uid = response.localId;
        await db.updateOne(
          { email: email },
          { 
            $set: { 
              name: 'Test Valet',
              role: 'Valet',
              status: 'Active',
              firebaseUid: uid,
              authProvider: 'Email',
              updatedAt: new Date()
            },
            $setOnInsert: { createdAt: new Date() }
          },
          { upsert: true }
        );
        console.log('MongoDB updated for Valet user.');
      } else {
        console.error('Firebase Auth Error:', response.error.message);
      }
      process.exit(0);
    });
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.write(data);
req.end();
