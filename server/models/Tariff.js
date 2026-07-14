const mongoose = require('mongoose');

const tariffSchema = mongoose.Schema(
  {
    vehicleType: {
      type: String,
      enum: ['Car', 'Bike', 'SUV'],
      required: true,
      unique: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
    },
    dailyRate: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Tariff = mongoose.model('Tariff', tariffSchema);
module.exports = Tariff;
