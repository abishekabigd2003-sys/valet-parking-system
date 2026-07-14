const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobileNumber: {
      type: String,
      required: false,
    },
    authProvider: {
      type: String,
      enum: ['Email', 'Google'],
      default: 'Email',
    },
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
    },
    lastLogin: {
      type: Date,
    },
    profilePicture: {
      type: String,
    },
    role: {
      type: String,
      enum: ['Admin', 'Valet', 'Customer'],
      default: 'Customer',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);



const User = mongoose.model('User', userSchema);
module.exports = User;
