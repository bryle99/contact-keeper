const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/User');

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Please add name').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  // async for asynchronous communication with db
  async (req, res) => {
    //req.body is for displaying request data
    // checking for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // finding email in db using mongoose
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // creating new user
      user = new User({
        name,
        email,
        password,
      });

      // encrypting
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      // using mongoose and saves to db
      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      // signing a token to generate it
      // first parameter is secret and second is option
      jwt.sign(
        // payload
        payload,
        // secret
        config.get('jwtSecret'),
        // options
        {
          expiresIn: 36000, // expires in 3600secs/1hour
        },
        // call back
        (err, token) => {
          if (err) throw err;
          // outputs json
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
