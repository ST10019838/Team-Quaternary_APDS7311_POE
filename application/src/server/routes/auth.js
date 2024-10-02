import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import bruteForce from "../middleware/bruteForceProtectionMiddleware.js";
import loginAttemptLogger from "../middleware/loginAttemptLogMiddleware.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// base route
router.get("/", (req, res) => {
  res.send("Hello Auth World");
});

// register
router.post("/register", bruteForce.prevent, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //check if the user already exisits
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res
        .status(488)
        .json({ message: "username or email already exists" });
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create the new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server error", error: err.message });
  }
});

// login
router.post(
  "/login",
  bruteForce.prevent,
  loginAttemptLogger,
  async (req, res) => {
    try {
      const { username, password } = req.body;
      //find the user by the username
      const user = await User.findOne({ username });

      if (!user) {
        res.status(404).json({ message: "User not found" });
      }

      //check the password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(408).json({ message: "Invalid credentials" });
      }

      //Create a JWT token
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Internal Server error", error: err.message });
    }
  }
);

export default router;
