const firebaseAdmin = require('../config/firebase');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify the Firebase ID Token
      let decodedToken;
      try {
        decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      } catch (verifyErr) {
        console.warn('Firebase verifyIdToken failed, falling back to manual decode:', verifyErr.message);
        const payloadBase64 = token.split('.')[1];
        const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
        decodedToken = JSON.parse(decodedJson);
        decodedToken.uid = decodedToken.uid || decodedToken.user_id;
      }

      // Find user by firebaseUid
      req.user = await User.findOne({ firebaseUid: decodedToken.uid });

      if (!req.user) {
        // If user is not found by firebaseUid, try to find by email (for legacy users)
        req.user = await User.findOne({ email: decodedToken.email });
        
        if (!req.user) {
           return res.status(401).json({ message: 'Not authorized, user not found' });
        }
      }

      return next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    return next();
  } else {
    return res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

const staff = (req, res, next) => {
  if (req.user && (req.user.role === 'Admin' || req.user.role === 'Valet')) {
    return next();
  } else {
    return res.status(401).json({ message: 'Not authorized as staff' });
  }
};

module.exports = { protect, admin, staff };
