const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

// Defaulting to 5000 to match backend port directly. 
// If the backend runs on 5001, update this.
const BASE_URL = 'http://localhost:5000/api';
const CONCURRENT_USERS = 50;

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(`API Error ${res.status}: ${JSON.stringify(data) || res.statusText}`);
  }
  return data;
}

async function simulateValetFlow(index, valetToken) {
  const vehicleNumber = `STRESS-${index}-${Date.now().toString().slice(-4)}`;
  const vehicleData = {
    customerName: `StressUser${index}`,
    mobileNumber: `90000${index.toString().padStart(5, '0')}`,
    vehicleNumber,
    vehicleType: 'Car',
    color: 'White',
    brand: 'Simulated',
  };

  const startCheckIn = Date.now();
  // 1. Check In
  const checkInRes = await request('/parking/check-in', {
    method: 'POST',
    headers: { Authorization: `Bearer ${valetToken}` },
    body: JSON.stringify(vehicleData)
  });
  const transactionId = checkInRes.transaction._id;
  const checkInTime = Date.now() - startCheckIn;

  // 2. Search
  const startSearch = Date.now();
  await request(`/parking/search?q=${vehicleNumber}`, {
    headers: { Authorization: `Bearer ${valetToken}` }
  });
  const searchTime = Date.now() - startSearch;

  // 3. Request Retrieval
  await request(`/parking/retrieve/${transactionId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${valetToken}` }
  });

  // 4. Check Out
  const startCheckOut = Date.now();
  const checkOutRes = await request(`/parking/check-out/${transactionId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${valetToken}` }
  });
  const checkOutTime = Date.now() - startCheckOut;

  // 5. Payment
  const startPayment = Date.now();
  await request(`/payments/process`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${valetToken}` },
    body: JSON.stringify({
      transactionId,
      amount: checkOutRes.feeCalculated,
      paymentMethod: 'Card'
    })
  });
  const paymentTime = Date.now() - startPayment;

  return { checkInTime, searchTime, checkOutTime, paymentTime };
}

async function runStressTest() {
  console.log(`Starting Stress Test with ${CONCURRENT_USERS} concurrent vehicle flows...`);
  if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('<db_username>')) {
    console.error('❌ MONGO_URI is invalid or still has placeholders. Update .env first.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  
  const valetToken = jwt.sign({ user_id: 'stress_valet_id', email: 'stress_valet@test.com', role: 'Valet' }, 'secret');
  
  const User = mongoose.connection.collection('users');
  await User.updateOne({ email: 'stress_valet@test.com' }, { 
    $set: { role: 'Valet', firebaseUid: 'stress_valet_id', name: 'Stress Valet' } 
  }, { upsert: true });

  const promises = [];
  const globalStart = Date.now();

  for (let i = 0; i < CONCURRENT_USERS; i++) {
    promises.push(simulateValetFlow(i, valetToken).catch(e => {
      console.error(`Flow ${i} Failed:`, e.message);
      return null;
    }));
  }

  const results = await Promise.all(promises);
  const globalEnd = Date.now();

  const validResults = results.filter(r => r !== null);
  
  if (validResults.length === 0) {
    console.log('❌ All requests failed. Ensure the server is running and DB is accessible.');
    process.exit(1);
  }

  const avgCheckIn = validResults.reduce((sum, r) => sum + r.checkInTime, 0) / validResults.length;
  const avgSearch = validResults.reduce((sum, r) => sum + r.searchTime, 0) / validResults.length;
  const avgCheckOut = validResults.reduce((sum, r) => sum + r.checkOutTime, 0) / validResults.length;

  console.log('\n✅ Stress Test Completed');
  console.log('--------------------------------------------------');
  console.log(`Total Concurrent Workflows : ${CONCURRENT_USERS}`);
  console.log(`Successful Workflows       : ${validResults.length}`);
  console.log(`Failed Workflows           : ${CONCURRENT_USERS - validResults.length}`);
  console.log(`Total Time Elapsed         : ${globalEnd - globalStart}ms`);
  console.log('--------------------------------------------------');
  console.log(`Average Check-In latency   : ${avgCheckIn.toFixed(2)}ms`);
  console.log(`Average Search latency     : ${avgSearch.toFixed(2)}ms`);
  console.log(`Average Check-Out latency  : ${avgCheckOut.toFixed(2)}ms`);

  await mongoose.disconnect();
  process.exit(0);
}

runStressTest();
