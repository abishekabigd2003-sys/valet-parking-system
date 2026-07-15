const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const { connect, closeDatabase, clearDatabase } = require('./setup');
const admin = require('../config/firebase');

// Setup a small express app for testing
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Mock the Firebase Admin verifyIdToken globally
jest.mock('../config/firebase', () => {
  return {
    auth: () => ({
      verifyIdToken: jest.fn()
    })
  };
});

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe('Auth Controller Integration Tests', () => {
  describe('POST /api/auth/sync', () => {
    it('should return 400 if no idToken is provided', async () => {
      const res = await request(app)
        .post('/api/auth/sync')
        .send({ name: 'Test User' });
        
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe('No Firebase ID Token provided');
    });

    it('should sync user and return success when token is valid', async () => {
      // Mock successful verification
      admin.auth().verifyIdToken.mockResolvedValue({
        uid: 'firebase_123',
        email: 'test@example.com',
        picture: 'http://example.com/pic.jpg',
        name: 'Test Google Name',
        sign_in_provider: 'google.com'
      });

      const res = await request(app)
        .post('/api/auth/sync')
        .send({ idToken: 'valid_mock_token' });
        
      expect(res.statusCode).toEqual(200);
      expect(res.body.email).toBe('test@example.com');
      expect(res.body.role).toBe('Customer'); // Defaults to customer
    });
  });
});
