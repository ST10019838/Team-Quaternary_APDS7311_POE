import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      "Invalid email address",
    ], // Basic email pattern

    // match: [
    //   /^[a-zA-Z0-9_-]+@[a-zA-Z0-9-]+\-[a-zA-Z0-9--]+$/,
    /* Only alphanumric characters and underscores */
    // ], // NEED TO ADD REGEX
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
});

export default mongoose.model("User", userSchema);
