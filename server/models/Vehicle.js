const mongoose = require('mongoose');

const vehicleSchema = mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Customer',
    },
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ['Car', 'Bike', 'SUV'],
    },
    color: {
      type: String,
    },
    brand: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

vehicleSchema.index({ customerId: 1 });
vehicleSchema.index({ vehicleType: 1 });
vehicleSchema.index({ createdAt: -1 });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle;
