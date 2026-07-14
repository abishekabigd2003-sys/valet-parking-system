const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  checkInVehicle,
  getAvailableSlots,
  searchVehicle,
  requestRetrieval,
  checkOutVehicle,
  createBooking,
  getActiveTransactionForSlot,
} = require('../controllers/parkingController');

// Public route for landing page booking form
router.post('/bookings', createBooking);

router.route('/check-in').post(protect, checkInVehicle);
router.route('/slots').get(protect, getAvailableSlots);
router.route('/search').get(protect, searchVehicle);
router.route('/retrieve/:id').put(protect, requestRetrieval);
router.route('/check-out/:id').post(protect, checkOutVehicle);
router.route('/slot/:slotId/transaction').get(protect, getActiveTransactionForSlot);

module.exports = router;
