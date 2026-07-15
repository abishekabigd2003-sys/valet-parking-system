const request = require('supertest');
const express = require('express');
const parkingRoutes = require('../routes/parkingRoutes');
const { connect, closeDatabase, clearDatabase } = require('./setup');
const Customer = require('../models/Customer');
const ParkingSlot = require('../models/ParkingSlot');
const Tariff = require('../models/Tariff');

const app = express();
app.use(express.json());
// Mock auth middleware to automatically authenticate requests
jest.mock('../middleware/authMiddleware', () => ({
  protect: (req, res, next) => {
    req.user = { _id: 'admin_id_123', role: 'Admin' };
    next();
  },
  adminOrValet: (req, res, next) => next()
}));

app.use('/api/parking', require('../routes/parkingRoutes'));

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe('CRUD Operations Integration Tests', () => {
  describe('POST /api/parking/check-in', () => {
    it('should successfully check-in a vehicle and return a ticket', async () => {
      // Seed required data for check-in
      await ParkingSlot.create({ floor: '1', slotNumber: '101', status: 'Available' });
      await Tariff.create({ vehicleType: 'Car', hourlyRate: 50, minimumHours: 2 });

      const payload = {
        customerName: 'John Doe',
        mobileNumber: '1234567890',
        vehicleNumber: 'AB12CD3456',
        vehicleType: 'Car',
        color: 'Black',
        brand: 'Toyota'
      };

      const res = await request(app)
        .post('/api/parking/check-in')
        .send(payload);

      expect(res.statusCode).toEqual(201);
      expect(res.body.ticketNumber).toBeDefined();
      expect(res.body.status).toBe('Parked');

      // Verify customer was created
      const customer = await Customer.findOne({ mobileNumber: '1234567890' });
      expect(customer).toBeTruthy();
    });
  });
});
