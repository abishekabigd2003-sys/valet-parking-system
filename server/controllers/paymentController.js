const Payment = require('../models/Payment');
const ParkingTransaction = require('../models/ParkingTransaction');
const sendEmail = require('../utils/sendEmail');
const moment = require('moment');

// @desc    Process Payment
// @route   POST /api/payments/process
// @access  Private
const processPayment = async (req, res) => {
  const { transactionId, amount, paymentMethod } = req.body;

  try {
    const transaction = await ParkingTransaction.findById(transactionId).populate('customerId vehicleId valetStaffId');
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.paymentStatus === 'Completed') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    if (Number(amount) !== transaction.feeCalculated) {
      return res.status(400).json({ message: 'Payment amount does not match the calculated fee.' });
    }

    const payment = await Payment.create({
      transactionId,
      amount,
      paymentMethod,
      status: 'Completed',
      receiptUrl: `/api/payments/receipt/${transactionId}`, // Mock receipt URL
    });

    transaction.paymentStatus = 'Completed';
    transaction.status = 'Completed';
    await transaction.save();

    // Send Check-Out Email to Customer
    const checkInTime = moment(transaction.checkInTime).format('DD/MM/YYYY HH:mm');
    const checkOutTime = moment(transaction.checkOutTime || new Date()).format('DD/MM/YYYY HH:mm');
    const durationMs = (transaction.checkOutTime || new Date()) - transaction.checkInTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    const emailHtml = `
      <p>Dear ${transaction.customerId.name},</p>
      <p>Your vehicle has been successfully returned.</p>
      <br/>
      <ul>
        <li><strong>Vehicle Number:</strong> ${transaction.vehicleId.vehicleNumber}</li>
        <li><strong>Vehicle Type:</strong> ${transaction.vehicleId.vehicleType}</li>
        <li><strong>Check-In Time:</strong> ${checkInTime}</li>
        <li><strong>Check-Out Time:</strong> ${checkOutTime}</li>
        <li><strong>Parking Duration:</strong> ${hours} Hours ${minutes} Minutes</li>
        <li><strong>Parking Fee:</strong> ₹${transaction.feeCalculated}</li>
        <li><strong>Handled By:</strong> ${transaction.valetStaffId.name}</li>
      </ul>
      <br/>
      <p>Thank you for using our Valet Parking Service. Have a safe journey!</p>
    `;

    sendEmail({
      email: transaction.customerId.email,
      subject: 'Valet Parking - Return Confirmation & Receipt',
      html: emailHtml
    });

    res.status(201).json({
      message: 'Payment processed successfully',
      payment,
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Receipt
// @route   GET /api/payments/receipt/:id
// @access  Private
const getReceipt = async (req, res) => {
  try {
    const payment = await Payment.findOne({ transactionId: req.params.id })
      .populate({
        path: 'transactionId',
        populate: ['vehicleId', 'customerId', 'slotId'],
      });

    if (payment) {
      res.json(payment);
    } else {
      res.status(404).json({ message: 'Receipt not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  processPayment,
  getReceipt,
};
