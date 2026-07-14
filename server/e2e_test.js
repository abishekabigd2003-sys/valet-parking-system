const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const BASE_URL = 'http://localhost:5001/api';

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

const vehicles = [
  { customerName: 'Alice', mobileNumber: '9999999991', email: 'alice@example.com', vehicleNumber: 'TN01AB1234', vehicleType: 'Car', color: 'Red', brand: 'Sedan' },
  { customerName: 'Bob', mobileNumber: '9999999992', vehicleNumber: 'TN10CD5678', vehicleType: 'SUV', color: 'Black', brand: 'Ford' },
  { customerName: 'Charlie', mobileNumber: '9999999993', vehicleNumber: 'TN22EF9012', vehicleType: 'Car', color: 'White', brand: 'Hatchback' },
  { customerName: 'Dave', mobileNumber: '9999999994', vehicleNumber: 'TN45GH3456', vehicleType: 'Bike', color: 'Blue', brand: 'Honda' },
  { customerName: 'Eve', mobileNumber: '9999999995', vehicleNumber: 'TN66JK7890', vehicleType: 'Car', color: 'Silver', brand: 'Luxury' },
];

async function run() {
  console.log('Starting E2E Tests...');
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not set in the environment variables');
  }
  await mongoose.connect(process.env.MONGO_URI);
  
  // 1. Admin Auth
  const adminUid = 'e2e_admin_uid';
  const adminEmail = 'admin_e2e@example.com';
  const adminToken = jwt.sign({ user_id: adminUid, email: adminEmail }, 'secret');
  
  const User = mongoose.connection.collection('users');
  await User.updateOne({ email: adminEmail }, { 
    $set: { role: 'Admin', firebaseUid: adminUid, name: 'Admin E2E' } 
  }, { upsert: true });
  console.log('✅ Admin authenticated');

  // 2. Seed Slots
  await request('/admin/seed-slots', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` }
  }).catch(e => {
    if(!e.message.includes('Slots already seeded')) throw e;
  });
  console.log('✅ Slots seeded (if not already)');

  // 3. Register Valet
  const valetUid = 'e2e_valet_uid';
  const valetEmail = 'valet_e2e@example.com';
  const valetToken = jwt.sign({ user_id: valetUid, email: valetEmail }, 'secret');

  await User.updateOne({ email: valetEmail }, { 
    $set: { role: 'Valet', firebaseUid: valetUid, name: 'Valet E2E' } 
  }, { upsert: true });
  console.log('✅ Valet authenticated');

  for (let i = 0; i < vehicles.length; i++) {
    const v = vehicles[i];
    console.log(`\n🚗 Testing Vehicle ${i+1}: ${v.vehicleNumber} (${v.vehicleType})`);
    
    // Check in
    const checkInRes = await request('/parking/check-in', {
      method: 'POST',
      headers: { Authorization: `Bearer ${valetToken}` },
      body: JSON.stringify(v)
    });
    const ticketNumber = checkInRes.transaction.ticketNumber;
    const transactionId = checkInRes.transaction._id;
    console.log(`   Check-In Success! Ticket: ${ticketNumber}, Slot: ${checkInRes.slot.slotNumber}`);

    // Search Vehicle (Lower Case to test case-insensitivity fix)
    const searchRes = await request(`/parking/search?q=${v.vehicleNumber.toLowerCase()}`, {
      headers: { Authorization: `Bearer ${valetToken}` }
    });
    if (searchRes.ticketNumber !== ticketNumber) throw new Error('Search failed to match vehicle');
    console.log('   Search Verification Success');

    // Retrieval Requested
    await request(`/parking/retrieve/${transactionId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${valetToken}` }
    });
    console.log('   Retrieval Requested');

    // Time simulation (modify checkInTime in DB)
    const ParkingTransaction = mongoose.connection.collection('parkingtransactions');
    // Random duration between 2 and 10 hours
    const durationHours = Math.floor(Math.random() * 8) + 2; 
    const hoursAgo = new Date(Date.now() - durationHours * 60 * 60 * 1000);
    await ParkingTransaction.updateOne({ _id: new mongoose.Types.ObjectId(transactionId) }, { $set: { checkInTime: hoursAgo } });

    // Check-out
    const checkOutRes = await request(`/parking/check-out/${transactionId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${valetToken}` }
    });
    console.log(`   Check-Out Success! Calculated Fee: ₹${checkOutRes.feeCalculated} for ~${durationHours} hours`);

    // Payment
    await request(`/payments/process`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${valetToken}` },
      body: JSON.stringify({
        transactionId,
        amount: checkOutRes.feeCalculated,
        paymentMethod: ['Cash', 'Card', 'UPI'][i % 3] 
      })
    });
    console.log('   Payment Processed');

    // Receipt
    const receiptRes = await request(`/payments/receipt/${transactionId}`, {
      headers: { Authorization: `Bearer ${valetToken}` }
    });
    if (receiptRes.status !== 'Completed') throw new Error('Receipt status mismatch');
    console.log('   Receipt Verified');
  }

  // Final Stats Check
  const finalStats = await request('/admin/stats', { headers: { Authorization: `Bearer ${adminToken}` }});
  console.log(`\n📊 Final Dashboard Stats:`);
  console.log(`   Total Vehicles (All Time): ${finalStats.totalVehicles}`);
  console.log(`   Available Slots: ${finalStats.availableSlots}`);
  console.log(`   Occupied Slots: ${finalStats.occupiedSlots}`);
  console.log(`   Total Revenue: ₹${finalStats.revenue}`);

  await mongoose.disconnect();
  console.log('\n✅ All 5 vehicles tested successfully! System is fully functional.');
}

run().catch(e => {
  console.error('\n❌ Test Failed:', e);
  process.exit(1);
});
