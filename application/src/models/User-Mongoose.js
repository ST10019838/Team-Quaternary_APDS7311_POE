import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
    match: [
      // The following regex was taken from stackoverflow.com
      // Author: Wiktor Stribiżew (https://stackoverflow.com/users/3832970/wiktor-stribi%c5%bcew)
      // Link: https://stackoverflow.com/questions/35392798/regex-to-validate-full-name-having-atleast-four-characters
      /^[A-Z][a-zA-Z]{3,}(?: [A-Z][a-zA-Z]*){0,2}$/,
      // /^[a-zA-Z0-9_]+$/,
      /* Only alphanumric characters and underscores */
    ], // NEED TO ADD REGEX
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9_]+$/,
      /* Only alphanumric characters and underscores */
    ], // NEED TO ADD REGEX
  },
  idNumber: {
    type: Number,
    required: true,
    min: 1000000000000, // Id needs to be a 13 digit number
    max: 9999999999999,
  },
  accountNumber: {
    type: Number,
    required: true,
    unique: true,
    min: 100000000, // Account number must have a minimum of 9 digits
    max: 999999999999, // Account number must have a maximum of 12 digits
  },
  password: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    // match: [
    /* Only alphanumric characters and underscores */
    // ], // NEED TO ADD REGEX
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
    immutable: true,
  },
  isEmployee: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default mongoose.model('User', userSchema);

// email: {
//   type: String,
//   required: true,
//   unique: true,
//   trim: true,
//   match: [
//     /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
//     'Invalid email address',
//   ], // Basic email pattern

//   // match: [
//   //   /^[a-zA-Z0-9_-]+@[a-zA-Z0-9-]+\-[a-zA-Z0-9--]+$/,
//   /* Only alphanumric characters and underscores */
//   // ], // NEED TO ADD REGEX
// },
