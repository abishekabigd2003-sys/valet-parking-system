const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { processPayment, getReceipt } = require('../controllers/paymentController');

router.route('/process').post(protect, processPayment);
router.route('/receipt/:id').get(protect, getReceipt);

module.exports = router;
