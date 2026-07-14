const ParkingTransaction = require('../models/ParkingTransaction');
const ParkingSlot = require('../models/ParkingSlot');
const Customer = require('../models/Customer');
const Vehicle = require('../models/Vehicle');
const Tariff = require('../models/Tariff');
const QRCode = require('qrcode');
const sendEmail = require('../utils/sendEmail');

// Helper to generate a unique ticket number
const generateTicketNumber = () => {
  return `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// @desc    Check-in vehicle
// @route   POST /api/parking/check-in
// @access  Private (Valet/Admin)
const checkInVehicle = async (req, res) => {
  const { customerName, mobileNumber, vehicleNumber, vehicleType, color, brand } = req.body;
  const vehicleNumUpper = vehicleNumber ? vehicleNumber.toUpperCase() : '';

  try {
    // 1. Find or create customer
    let customer = await Customer.findOne({ mobileNumber });
    if (!customer) {
      customer = await Customer.create({ name: customerName, mobileNumber });
    }

    // 2. Find or create vehicle
    let vehicle = await Vehicle.findOne({ vehicleNumber: vehicleNumUpper });
    if (!vehicle) {
      vehicle = await Vehicle.create({
        customerId: customer._id,
        vehicleNumber: vehicleNumUpper,
        vehicleType,
        color,
        brand,
      });
    } else {
      // 2b. Check if vehicle is already checked in (active transaction exists)
      const activeTransaction = await ParkingTransaction.findOne({
        vehicleId: vehicle._id,
        status: { $ne: 'Completed' }
      });
      if (activeTransaction) {
        return res.status(400).json({ message: 'This vehicle is already checked in and has not been retrieved yet.' });
      }
    }

    // 3. Assign an available parking slot atomically to prevent duplicate booking
    const slot = await ParkingSlot.findOneAndUpdate(
      {
        status: 'Available',
        $or: [{ vehicleType }, { vehicleType: 'Any' }],
      },
      { status: 'Occupied' },
      { returnDocument: 'after', sort: { floor: 1, slotNumber: 1 } }
    );

    if (!slot) {
      return res.status(400).json({ message: 'No parking slots available for this vehicle type.' });
    }

    // Status already updated to Occupied by findOneAndUpdate

    // 5. Generate ticket and QR code
    const ticketNumber = generateTicketNumber();
    const qrCodeUrl = await QRCode.toDataURL(ticketNumber);

    // 6. Create parking transaction
    const transaction = await ParkingTransaction.create({
      ticketNumber,
      qrCodeUrl,
      vehicleId: vehicle._id,
      customerId: customer._id,
      slotId: slot._id,
      valetStaffId: req.user._id,
    });

    // Emit real-time events
    const io = req.app.get('io');
    if (io) {
      io.emit('slotUpdated', slot);
      io.emit('statsUpdated');
    }

    // 9. Send Check-In Email to Customer
    const emailHtml = `
      <h2>Vehicle Check-In Successful</h2>
      <p>Dear ${customer.name},</p>
      <p>Your vehicle (${vehicle.vehicleNumber}) has been parked at slot <strong>${slot.floor}-${slot.slotNumber}</strong>.</p>
      <p><strong>Ticket Number:</strong> ${ticketNumber}</p>
      <p>Please present the QR Code attached below when retrieving your vehicle.</p>
      <br/>
      <img src="${qrCodeUrl}" alt="QR Code" />
      <br/>
      <p>Thank you for using our Valet Parking Service.</p>
    `;
    
    sendEmail({
      email: customer.email,
      subject: 'Valet Parking - Check-In Details',
      html: emailHtml
    });

    res.status(201).json({
      message: 'Vehicle checked in successfully',
      transaction,
      slot,
      customer,
      vehicle,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all available slots
// @route   GET /api/parking/slots
// @access  Private
const getAvailableSlots = async (req, res) => {
  try {
    const slots = await ParkingSlot.find({ status: 'Available' }).lean();
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search transaction by ticket, vehicle number, or phone
// @route   GET /api/parking/search?q=
// @access  Private
const searchVehicle = async (req, res) => {
  const { q } = req.query;
  const queryUpper = q ? q.toUpperCase() : '';

  try {
    let transaction = await ParkingTransaction.findOne({ ticketNumber: queryUpper })
      .populate('vehicleId')
      .populate('customerId')
      .populate('slotId')
      .lean();

    // If not found by ticket, try vehicle number
    if (!transaction) {
      const vehicle = await Vehicle.findOne({ vehicleNumber: queryUpper }).lean();
      if (vehicle) {
        transaction = await ParkingTransaction.findOne({ vehicleId: vehicle._id, status: { $ne: 'Completed' } })
          .populate('vehicleId')
          .populate('customerId')
          .populate('slotId')
          .lean();
      }
    }

    if (transaction) {
      if (transaction.status === 'Completed') {
        return res.status(400).json({ message: 'This parking transaction has already been completed.' });
      }
      res.json(transaction);
    } else {
      res.status(404).json({ message: 'No active parking record found.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark vehicle as retrieval requested
// @route   PUT /api/parking/retrieve/:id
// @access  Private
const requestRetrieval = async (req, res) => {
  try {
    const transaction = await ParkingTransaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    transaction.status = 'RetrievalRequested';
    await transaction.save();

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check out vehicle and calculate fee
// @route   POST /api/parking/check-out/:id
// @access  Private
const checkOutVehicle = async (req, res) => {
  try {
    const transaction = await ParkingTransaction.findById(req.params.id).populate('vehicleId').populate('slotId');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status === 'Completed') {
      return res.status(400).json({ message: 'Transaction already completed' });
    }

    if (transaction.status === 'Retrieved') {
      return res.status(400).json({ message: 'Vehicle already retrieved, pending payment.' });
    }

    // Free the parking slot
    const slot = await ParkingSlot.findById(transaction.slotId._id);
    if (slot) {
      slot.status = 'Available';
      await slot.save();
      
      const io = req.app.get('io');
      if (io) {
        io.emit('slotUpdated', slot);
        io.emit('statsUpdated');
      }
    }

    transaction.checkOutTime = Date.now();
    transaction.status = 'Retrieved'; // Awaiting payment to be Completed

    // Calculate fee
    const hours = Math.max(1, Math.ceil((transaction.checkOutTime - transaction.checkInTime) / (1000 * 60 * 60)));
    
    const tariff = await Tariff.findOne({ vehicleType: transaction.vehicleId.vehicleType });
    let fee = 0;
    
    if (tariff) {
      // Basic logic: if > 24 hours use daily rate + hourly rate for remainder
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      fee = (days * tariff.dailyRate) + (remainingHours * tariff.hourlyRate);
    } else {
      // Default fallback fee
      fee = hours * 50; 
    }

    transaction.feeCalculated = fee;
    await transaction.save();

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Public Booking API
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res) => {
  const { location, vehicleType, vehicleNumber, checkInDate, checkInTime, checkOutDate, checkOutTime, promoCode } = req.body;

  try {
    // Basic mock logic for saving a pre-booking
    // In a real system, you would save this to a Booking collection or handle it as a Pending Transaction
    res.status(201).json({
      message: 'Booking created successfully',
      data: { location, vehicleType, checkInDate, checkInTime }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active transaction for a given parking slot
// @route   GET /api/parking/slot/:slotId/transaction
// @access  Private
const getActiveTransactionForSlot = async (req, res) => {
  try {
    const transaction = await ParkingTransaction.findOne({
      slotId: req.params.slotId,
      status: { $ne: 'Completed' }
    })
    .populate('vehicleId')
    .populate('customerId')
    .populate('valetStaffId')
    .populate('slotId')
    .lean();

    if (!transaction) {
      return res.status(404).json({ message: 'No active transaction found for this slot.' });
    }

    // calculate current fee dynamically
    const hours = Math.max(1, Math.ceil((Date.now() - transaction.checkInTime) / (1000 * 60 * 60)));
    const tariff = await Tariff.findOne({ vehicleType: transaction.vehicleId.vehicleType }).lean();
    let currentFee = 0;
    if (tariff) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      currentFee = (days * tariff.dailyRate) + (remainingHours * tariff.hourlyRate);
    } else {
      currentFee = hours * 50;
    }

    transaction.currentFee = currentFee;

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  checkInVehicle,
  getAvailableSlots,
  searchVehicle,
  requestRetrieval,
  checkOutVehicle,
  createBooking,
  getActiveTransactionForSlot,
};
