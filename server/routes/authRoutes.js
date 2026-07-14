const express = require('express');
const router = express.Router();
const { syncUser, getUserProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/sync', syncUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateProfile);

module.exports = router;
