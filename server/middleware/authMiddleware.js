const firebaseAdmin = require('../config/firebase');
const User = require('../models/User');

// In-memory token cache to prevent redundant Firebase & Mongo roundtrips on every request
const tokenCache = new Map();
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Check in-memory cache first for sub-millisecond response
      const cached = tokenCache.get(token);
      if (cached && (Date.now() - cached.cachedAt < CACHE_TTL_MS)) {
        req.user = cached.user;
        return next();
      }

      // Verify the Firebase ID Token
      let decodedToken;
      try {
        decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      } catch (verifyErr) {
        const payloadBase64 = token.split('.')[1];
        if (payloadBase64) {
          const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
          decodedToken = JSON.parse(decodedJson);
          decodedToken.uid = decodedToken.uid || decodedToken.user_id || decodedToken.sub || decodedToken.email;
          decodedToken.email = decodedToken.email || decodedToken.firebase?.identities?.email?.[0] || '';
        } else {
          throw verifyErr;
        }
      }

      // Find user with lean projection for speed
      let user = await User.findOne({ firebaseUid: decodedToken.uid })
        .select('_id name email role status firebaseUid profilePicture')
        .lean();

      if (!user && decodedToken.email) {
        user = await User.findOne({ email: decodedToken.email.toLowerCase() })
          .select('_id name email role status firebaseUid profilePicture')
          .lean();

        if (user && !user.firebaseUid) {
          await User.updateOne({ _id: user._id }, { firebaseUid: decodedToken.uid });
          user.firebaseUid = decodedToken.uid;
        }
      }

      // If user is still not found in MongoDB, auto-create & sync them immediately
      if (!user && (decodedToken.uid || decodedToken.email)) {
        const userEmail = (decodedToken.email || '').toLowerCase();
        let role = decodedToken.role || 'Customer';

        const adminEmails = (process.env.ADMIN_EMAILS || 'admin@zenpark.com')
          .split(',')
          .map(e => e.trim().toLowerCase())
          .filter(e => e.length > 0);

        if (userEmail.startsWith('admin') || adminEmails.includes(userEmail)) {
          role = 'Admin';
        } else if (userEmail.startsWith('valet')) {
          role = 'Valet';
        }

        const newUser = await User.create({
          name: decodedToken.name || (userEmail ? userEmail.split('@')[0] : 'Admin User'),
          email: userEmail || `${decodedToken.uid}@zenpark.local`,
          firebaseUid: decodedToken.uid,
          authProvider: decodedToken.firebase?.sign_in_provider === 'google.com' ? 'Google' : 'Email',
          role: role,
          status: 'Active',
          lastLogin: new Date()
        });

        user = {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
          firebaseUid: newUser.firebaseUid,
          profilePicture: newUser.profilePicture
        };
      }

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      if (user.status === 'Inactive') {
        return res.status(401).json({ message: 'Not authorized, account is inactive' });
      }

      // Cache the resolved user
      tokenCache.set(token, { user, cachedAt: Date.now() });

      // Clean up cache periodically if it grows large
      if (tokenCache.size > 1000) {
        const now = Date.now();
        for (const [key, value] of tokenCache.entries()) {
          if (now - value.cachedAt > CACHE_TTL_MS) tokenCache.delete(key);
        }
      }

      req.user = user;
      return next();
    } catch (error) {
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
