const mongoose = require('mongoose');

const parkingTransactionSchema = mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
    },
    qrCodeUrl: {
      type: String,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Vehicle',
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Customer',
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'ParkingSlot',
    },
    valetStaffId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    checkInTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    checkOutTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Parked', 'RetrievalRequested', 'Retrieved', 'Completed'],
      default: 'Parked',
    },
    feeCalculated: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

parkingTransactionSchema.index({ vehicleId: 1, status: 1 });
parkingTransactionSchema.index({ slotId: 1, status: 1 });

const ParkingTransaction = mongoose.model('ParkingTransaction', parkingTransactionSchema);
module.exports = ParkingTransaction;
