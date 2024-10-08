import ExpressBrute from 'express-brute';
import MongooseStore from 'express-brute-mongoose';
import mongoose from 'mongoose';

const bruteForceSchema = new mongoose.Schema({
  _id: String,
  data: {
    count: Number,
    lastRequest: Date,
    firstRequest: Date,
  },
  expires: { type: Date, index: { expires: 'id' } },
});

const BruteForceModel = mongoose.model('bruteforce', bruteForceSchema);

const store = new MongooseStore(BruteForceModel);

const bruteForce = new ExpressBrute(store, {
  freeRetries: 2,
  minwait: 2 * 60 * 1000, // 2 minutes
  maxwait: 60 * 60 * 1000, // 1 hour
  fallCallback: function (req, res, next, nextValidRequestDate) {
    res.status(429).json({
      message: 'Too many failed attempts. Please try again later.',
      nextValidRequestDate,
    });
  },
});

export default bruteForce;
