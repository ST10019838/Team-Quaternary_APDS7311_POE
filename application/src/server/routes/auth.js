import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/User-Mongoose.js';
import bruteForce from '../middleware/bruteForceProtectionMiddleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// base route
// router.get('/', (req, res) => {
//   res.send('Hello Auth World');
// });

// login
router.post(
  '/login',
  /* bruteForce.prevent, */ async (req, res) => {
    try {
      const { username, accountNumber, password } = req.body;
      //find the user by the username
      // const user = await User.findOne({ username });

      const user = await User.findOne({
        $and: [{ username }, { accountNumber }],
      });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
      }

      //check the password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(408).json({ message: 'Invalid credentials' });
      }

      //Create a JWT token
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

      // res.json({ token });
      res.json({
        username,
        accountNumber,
        idNumber: user.idNumber,
        isAdmin: user.isAdmin,
        isEmployee: user.isEmployee,
        token,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Internal Server error', error: err.message });
    }
  }
);

export default router;
