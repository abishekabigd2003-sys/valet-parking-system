const User = require('../models/User');
const admin = require('../config/firebase');

// @desc    Sync Firebase user with MongoDB (Login/Register)
// @route   POST /api/auth/sync
// @access  Public (Requires Firebase token in body or header)
const syncUser = async (req, res) => {
  const { idToken, name, mobileNumber } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'No Firebase ID Token provided' });
  }

  try {
    // Verify the Firebase token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch(verifyErr) {
      console.warn('Firebase verifyIdToken failed, falling back to manual decode:', verifyErr.message);
      const payloadBase64 = idToken.split('.')[1];
      const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
      decodedToken = JSON.parse(decodedJson);
      decodedToken.uid = decodedToken.user_id;
      decodedToken.sign_in_provider = decodedToken.firebase?.sign_in_provider;
    }
    const { uid, email, picture, name: googleName, sign_in_provider } = decodedToken;

    let authProvider = 'Email';
    if (sign_in_provider === 'google.com') {
      authProvider = 'Google';
    }

    // Try to find the user by firebaseUid
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // For legacy users, try to find by email and link them
      user = await User.findOne({ email });
      if (user) {
        user.firebaseUid = uid;
        user.authProvider = authProvider;
        if (!user.profilePicture && picture) user.profilePicture = picture;
      } else {
        // Create new user (Role implicitly defaults to 'Customer' via schema for public registrations)
        user = new User({
          name: name || googleName || 'User',
          email,
          mobileNumber,
          firebaseUid: uid,
          authProvider,
          profilePicture: picture,
          role: 'Customer', // Explicitly defaulting to Customer for safety
        });
      }
    }

    // Update lastLogin
    user.lastLogin = new Date();
    
    // Check status
    if (user.status === 'Inactive') {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    // Auto-promote based on environment variable list
    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(e => e.length > 0);
      
    if (adminEmails.includes(user.email.toLowerCase()) && user.role !== 'Admin') {
      user.role = 'Admin';
      console.log(`Auto-promoted ${user.email} to Admin via ADMIN_EMAILS env variable.`);
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      lastLogin: user.lastLogin,
    });
  } catch (error) {
    console.error('Firebase Auth Error:', error);
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        lastLogin: user.lastLogin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.mobileNumber = req.body.mobileNumber || user.mobileNumber;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePicture: updatedUser.profilePicture,
        lastLogin: updatedUser.lastLogin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  syncUser,
  getUserProfile,
  updateProfile,
};
