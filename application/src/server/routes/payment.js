import express from 'express';
import Post from '../../models/Post.js';
import Payment from '../../models/Payment-Mongoose.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// base route
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments.reverse()); // reverses list to show newest payments first
  } catch (error) {
    res.status(500).json({ message: 'Internal Server error', error });
  }
});

router.get('/pending', async (req, res) => {
  try {
    const payments = await Payment.find({ isVerificationPending: true }).exec();
    res.json(payments.reverse()); // reverses list to show newest payments first
  } catch (error) {
    res.status(500).json({ message: 'Internal Server error', error });
  }
});

// get by id
router.get('/:accountNumber', async (req, res) => {
  try {
    const payments = await Payment.find({
      senderAccountNumber: req.params.accountNumber,
    }).exec();

    if (!payments) {
      return res.status(404).json({ message: 'Payments not found' });
    }

    return res.json(payments.reverse()); // reverses list to show newest payments first
  } catch (err) {
    console.error('Error getting payments', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// create
router.post('/create', async (req, res) => {
  const {
    paymentAmount,
    currency,
    paymentProvider,
    senderIdNumber,
    senderAccountNumber,
    recipientAccountNumber,
    paymentCode,
  } = req.body;

  //validate request body
  if (
    !paymentAmount ||
    !currency ||
    !paymentProvider ||
    !senderIdNumber ||
    !senderAccountNumber ||
    !recipientAccountNumber ||
    !paymentCode
  ) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  //Create a new payment
  const newPayment = new Payment({
    paymentAmount,
    currency,
    paymentProvider,
    senderIdNumber,
    senderAccountNumber,
    recipientAccountNumber,
    paymentCode,
  });
  try {
    const savedPayment = await newPayment.save();
    res.status(201).json({ message: 'Payment uploaded', savedPayment });
  } catch (error) {
    console.error('Error saving payment', err);
    res.status(500).json({ message: 'Server error', error });
  }
});

// update by id
router.put('/:id', async (req, res) => {
  //validate request body
  const {
    paymentAmount,
    currency,
    paymentProvider,
    senderIdNumber,
    senderAccountNumber,
    recipientAccountNumber,
    paymentCode,
    isVerified,
    isVerificationPending,
  } = req.body;

  // Need to add verfication changes aswell
  if (/* user is not an admin */ false) {
    if (!isVerificationPending)
      return res.status(400).json({ message: 'Cannot update the Payment' });
  }

  if (
    !paymentAmount &&
    !currency &&
    !paymentProvider &&
    !senderIdNumber &&
    !senderAccountNumber &&
    !recipientAccountNumber &&
    !paymentCode &&
    !isVerified &&
    !isVerificationPending
  ) {
    return res
      .status(400)
      .json({ message: 'Nothing to update please fill in one of the fields' });
  }

  const updatedFields = {};
  if (paymentAmount) updatedFields.paymentAmount = paymentAmount;
  if (currency) updatedFields.currency = currency;
  if (paymentProvider) updatedFields.paymentProvider = paymentProvider;
  if (senderIdNumber) updatedFields.senderIdNumber = senderIdNumber;
  if (senderAccountNumber)
    updatedFields.senderAccountNumber = senderAccountNumber;
  if (recipientAccountNumber)
    updatedFields.recipientAccountNumber = recipientAccountNumber;
  if (paymentCode) updatedFields.paymentCode = paymentCode;
  if (isVerified) updatedFields.isVerified = isVerified;
  if (isVerificationPending !== null)
    updatedFields.isVerificationPending = isVerificationPending;

  // if(admin logged in){
  // updatedFields.verifiedBy = ADMIN
  // }

  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: false }
    );

    if (!updatedPayment) {
      return res.status(484).json({ message: 'Payment not found' });
    }

    res.json({ message: 'Payment updated', updatedPayment });
  } catch (err) {
    console.error('Error updating payment', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// delete by id
router.delete('/:id', async (req, res) => {
  try {
    const { isVerificationPending } = req.body;

    if (!isVerificationPending)
      return res.status(400).json({ message: 'Cannot delete the Payment' });

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    console.error('Error deleting Payment', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;
