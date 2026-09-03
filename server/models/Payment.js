const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'ParkingTransaction',
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'UPI', 'Card'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Completed',
    },
    receiptUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
