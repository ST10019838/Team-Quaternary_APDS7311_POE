import express from 'express';
import User from '../../models/User-Mongoose.js';
import bruteForce from '../middleware/bruteForceProtectionMiddleware.js';
import bcrypt from 'bcrypt';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// base route
// router.get('/', async (req, res) => {
//   try {
//     const payments = await Payment.find();
//     res.json(payments.reverse()); // reverses list to show newest payments first
//   } catch (error) {
//     res.status(500).json({ message: 'Internal Server error', error });
//   }
// });

router.get('/', authMiddleware, async (req, res) => {
  try {
    const userLoggedIn = await User.findOne({ _id: req.user.id });

    if (!userLoggedIn.isAdmin) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server error', error });
  }
});

// register
router.post(
  '/register',
  // bruteForce.prevent,
  authMiddleware,
  async (req, res) => {
    try {
      const userLoggedIn = await User.findOne({ _id: req.user.id });

      if (!userLoggedIn.isAdmin) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      const {
        fullname,
        username,
        idNumber,
        accountNumber,
        password,
        isEmployee,
      } = req.body;

      if (!fullname || !username || !idNumber || !accountNumber || !password) {
        return res
          .status(488)
          .json({ message: 'Insufficient credentials to create a user' });
      }

      //check if the user already exisits
      const existingUser = await User.findOne({
        $or: [{ username }, { accountNumber }],
      });

      if (existingUser) {
        return res
          .status(408)
          .json({ message: 'Username or account number already exists' });
      }

      //hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      //create the new user
      const newUser = new User({
        username,
        fullname,
        idNumber,
        accountNumber,
        password: hashedPassword,
        isEmployee: isEmployee == null ? false : isEmployee,
      });
      await newUser.save();

      return res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      console.log(err.message);
      res
        .status(500)
        .json({ message: 'Internal Server error', error: err.message });
    }
  }
);

// update by id
router.put('/update/:id', authMiddleware, async (req, res) => {
  const userLoggedIn = await User.findOne({ _id: req.user.id });

  if (!userLoggedIn.isAdmin) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }

  const { fullname, username, idNumber, accountNumber, isEmployee, password } =
    req.body;

  if (
    !fullname &&
    !username &&
    !idNumber &&
    !accountNumber &&
    !isEmployee &&
    !password
  ) {
    return res.status(400).json({
      message: 'Nothing to update, please fill in one of the fields',
    });
  }

  console.log('USER UPDATED? 1 IS EMPLOYEE NOW?', isEmployee);

  const updatedFields = {};
  if (fullname) updatedFields.fullname = fullname;
  if (username) updatedFields.username = username;
  if (idNumber) updatedFields.idNumber = idNumber;
  if (accountNumber) updatedFields.accountNumber = accountNumber;
  if (isEmployee != null || isEmployee != undefined)
    updatedFields.isEmployee = isEmployee;
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    updatedFields.password = hashedPassword;
  }

  console.log('USER UPDATED? 2');

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('USER UPDATED?');

    res.json({ message: 'User updated', updatedUser });
  } catch (err) {
    console.error('Error updating user', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// delete by id
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const userLoggedIn = await User.findOne({ _id: req.user.id });

    if (!userLoggedIn.isAdmin) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting User', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;
