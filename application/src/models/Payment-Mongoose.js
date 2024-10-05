import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  paymentAmount: {
    type: Number,
    required: true,
    max: 10000000,
  },
  currency: {
    type: String,
    required: true,
    trim: true,
    enum: ['Rand'],
  },
  paymentProvider: {
    type: String,
    required: true,
    trim: true,
    enum: ['Swift'],
  },
  senderIdNumber: {
    type: Number,
    required: true,
  },
  senderAccountNumber: {
    type: Number,
    required: true,
  },
  recipientAccountNumber: {
    type: Number,
    required: true,
  },
  paymentCode: {
    type: String,
    required: true,
    trim: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  isVerificationPending: {
    type: Boolean,
    required: true,
    default: true,
  },
  verifiedBy: {
    type: String,
    required: false,
    default: null,
  },

  // title: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   match: [/^[a-zA-Z0-9\s]+$/, 'Only alphanumeric characters and underscores'],
  // },
  // postImage: {
  //   type: String,
  //   required: false,
  //   trim: true,
  //   default: 'https://www.trschools.com/templates/imgs/default_placeholder.png',
  //   match: [/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/, 'invalid url'], // Basic URL pattern
  // },
  // content: {
  //   type: String,
  //   required: true,
  //   minlength: 5,
  //   maxlength: 20000,
  // },
  // category: {
  //   type: String,
  //   required: true,
  //   enum: ['Pending', 'Technology', 'Health', 'Business', 'Entertainment'],
  //   default: 'Pending',
  // },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

export default mongoose.model('Payment', paymentSchema);
