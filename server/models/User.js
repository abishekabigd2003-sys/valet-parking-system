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

userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);
module.exports = User;
