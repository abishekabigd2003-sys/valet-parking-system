const User = require('../models/User');
const firebaseAdmin = require('../config/firebase');
const ParkingTransaction = require('../models/ParkingTransaction');
const ParkingSlot = require('../models/ParkingSlot');
const Vehicle = require('../models/Vehicle');
const Payment = require('../models/Payment');
const Customer = require('../models/Customer');
const Tariff = require('../models/Tariff');
// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    const availableSlots = await ParkingSlot.countDocuments({ status: 'Available' });
    const occupiedSlots = await ParkingSlot.countDocuments({ status: 'Occupied' });
    
    // Revenue calculation (sum of all completed payments)
    const payments = await Payment.find({ status: 'Completed' }).lean();
    const revenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

    // Recent transactions
    const recentTransactions = await ParkingTransaction.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('vehicleId customerId slotId')
      .lean();

    res.json({
      totalVehicles,
      availableSlots,
      occupiedSlots,
      revenue,
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all vehicles
// @route   GET /api/admin/vehicles
// @access  Private/Admin
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('customerId').sort({ createdAt: -1 }).lean();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all slots
// @route   GET /api/admin/slots
// @access  Private/Admin
const getSlots = async (req, res) => {
  try {
    const slots = await ParkingSlot.find().sort({ floor: 1, slotNumber: 1 }).lean();
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all staff
// @route   GET /api/admin/staff
// @access  Private/Admin
const getStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: { $in: ['Valet', 'Admin'] } }).select('-password').lean();
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update staff
// @route   PUT /api/admin/staff/:id
// @access  Private/Admin
const updateStaff = async (req, res) => {
  try {
    const { name, email, role, status, password } = req.body;
    const staff = await User.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    const updateData = {};
    if (email && email !== staff.email) {
      updateData.email = email;
    }
    if (name && name !== staff.name) {
      updateData.displayName = name;
    }
    if (password) {
      updateData.password = password;
    }

    if (Object.keys(updateData).length > 0 && staff.firebaseUid) {
      try {
        await firebaseAdmin.auth().updateUser(staff.firebaseUid, updateData);
      } catch (fbError) {
        return res.status(400).json({ message: fbError.message || 'Failed to update Firebase user' });
      }
    }

    if (name) staff.name = name;
    if (email) staff.email = email;
    if (role) staff.role = role;
    if (status) staff.status = status;

    const updatedStaff = await staff.save();
    res.json({
      _id: updatedStaff._id,
      name: updatedStaff.name,
      email: updatedStaff.email,
      role: updatedStaff.role,
      status: updatedStaff.status
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete staff
// @route   DELETE /api/admin/staff/:id
// @access  Private/Admin
const deleteStaff = async (req, res) => {
  try {
    const staff = await User.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    // Check if trying to delete yourself
    if (staff._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Check if Valet is associated with any parking transactions
    const hasTransactions = await ParkingTransaction.exists({ valetStaffId: req.params.id });
    if (hasTransactions) {
      return res.status(400).json({ message: 'Cannot delete staff associated with parking transactions. Please mark them as Inactive instead.' });
    }

    if (staff.firebaseUid) {
      await firebaseAdmin.auth().deleteUser(staff.firebaseUid).catch(e => console.log('Firebase user not found or already deleted'));
    }

    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'Staff member removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create staff
// @route   POST /api/admin/staff
// @access  Private/Admin
const createStaff = async (req, res) => {
  const { name, email, password, role, status } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let firebaseUser;
    try {
      firebaseUser = await firebaseAdmin.auth().createUser({
        email,
        password,
        displayName: name,
      });
    } catch (fbError) {
      return res.status(400).json({ message: fbError.message || 'Error creating Firebase user' });
    }

    const user = await User.create({
      name,
      email,
      firebaseUid: firebaseUser.uid,
      authProvider: 'Email',
      role: role || 'Valet',
      status: status || 'Active',
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Private/Admin
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 }).lean();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a customer
// @route   POST /api/admin/customers
// @access  Private/Admin
const createCustomer = async (req, res) => {
  const { name, mobileNumber, email } = req.body;
  try {
    const existing = await Customer.findOne({ mobileNumber });
    if (existing) {
      return res.status(400).json({ message: 'Customer with this mobile number already exists' });
    }
    const customer = await Customer.create({ name, mobileNumber, email });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all payments
// @route   GET /api/admin/payments
// @access  Private/Admin
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: 'transactionId',
        populate: ['vehicleId', 'customerId', 'slotId']
      })
      .sort({ createdAt: -1 })
      .lean();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tariffs
// @route   GET /api/admin/tariffs
// @access  Private/Admin
const getTariffs = async (req, res) => {
  try {
    const tariffs = await Tariff.find().lean();
    res.json(tariffs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed slots (Utility)
// @route   POST /api/admin/seed-slots
// @access  Private/Admin
const seedSlots = async (req, res) => {
  try {
    const existing = await ParkingSlot.countDocuments();
    if (existing > 0) return res.status(400).json({ message: 'Slots already seeded' });

    const slotsToSeed = [];
    ['A', 'B'].forEach(zone => {
      [1, 2].forEach(floor => {
        for(let i=1; i<=10; i++) {
          slotsToSeed.push({
            slotNumber: `${zone}${floor}-${i.toString().padStart(2, '0')}`,
            zone,
            floor: floor.toString(),
            vehicleType: i > 8 ? 'SUV' : (i > 6 ? 'Bike' : 'Car')
          });
        }
      });
    });

    await ParkingSlot.insertMany(slotsToSeed);

    const existingTariffs = await Tariff.countDocuments();
    if (existingTariffs === 0) {
      await Tariff.insertMany([
        { vehicleType: 'Car', hourlyRate: 50, dailyRate: 500 },
        { vehicleType: 'SUV', hourlyRate: 80, dailyRate: 800 },
        { vehicleType: 'Bike', hourlyRate: 20, dailyRate: 200 }
      ]);
    }

    res.json({ message: '40 Slots seeded successfully and default Tariffs created.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all transactions
// @route   GET /api/admin/transactions
// @access  Private/Admin
const getTransactions = async (req, res) => {
  try {
    const transactions = await ParkingTransaction.find()
      .populate('vehicleId customerId slotId valetStaffId')
      .sort({ createdAt: -1 })
      .lean();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats,
  getVehicles,
  getSlots,
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  seedSlots,
  getCustomers,
  createCustomer,
  getPayments,
  getTariffs,
  getTransactions
};
