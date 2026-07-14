const mongoose = require('mongoose');

const parkingSlotSchema = mongoose.Schema(
  {
    slotNumber: {
      type: String,
      required: true,
      unique: true,
    },
    zone: {
      type: String,
      required: true,
    },
    floor: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Available', 'Occupied', 'Maintenance'],
      default: 'Available',
    },
    vehicleType: {
      type: String,
      enum: ['Car', 'Bike', 'SUV', 'Any'],
      default: 'Any',
    },
  },
  {
    timestamps: true,
  }
);

parkingSlotSchema.index({ status: 1, vehicleType: 1 });

const ParkingSlot = mongoose.model('ParkingSlot', parkingSlotSchema);
module.exports = ParkingSlot;
