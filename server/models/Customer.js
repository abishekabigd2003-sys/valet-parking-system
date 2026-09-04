const mongoose = require('mongoose');

const customerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

customerSchema.index({ email: 1 });
customerSchema.index({ createdAt: -1 });

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
