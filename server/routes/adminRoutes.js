const express = require('express');
const router = express.Router();
const { protect, admin, staff } = require('../middleware/authMiddleware');
const { getStats, getVehicles, getSlots, getStaff, createStaff, updateStaff, deleteStaff, seedSlots, getCustomers, createCustomer, getPayments, getTariffs, getTransactions } = require('../controllers/adminController');

router.route('/stats').get(protect, staff, getStats);
router.route('/vehicles').get(protect, staff, getVehicles);
router.route('/slots').get(protect, staff, getSlots);
router.route('/staff')
  .get(protect, admin, getStaff)
  .post(protect, admin, createStaff);
router.route('/staff/:id')
  .put(protect, admin, updateStaff)
  .delete(protect, admin, deleteStaff);
router.route('/customers').get(protect, staff, getCustomers).post(protect, staff, createCustomer);
router.route('/payments').get(protect, admin, getPayments);
router.route('/transactions').get(protect, admin, getTransactions);
router.route('/tariffs').get(protect, staff, getTariffs);
router.route('/seed-slots').post(protect, staff, seedSlots);

module.exports = router;
