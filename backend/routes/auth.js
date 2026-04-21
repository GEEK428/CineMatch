const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Strong password regex: 8+ chars, 1 upper, 1 lower, 1 digit, 1 special
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Register
router.post('/register', [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('favoriteMovie').notEmpty().withMessage('Favorite movie is required'),
  body('password').matches(passwordRegex).withMessage('Password must be at least 8 characters, with uppercase, lowercase, number, and special character')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { username, email, favoriteMovie, password } = req.body;
    
    let userByEmail = await User.findOne({ email });
    if (userByEmail) return res.status(400).json({ message: 'Email already registered' });

    let userByUsername = await User.findOne({ username });
    if (userByUsername) return res.status(400).json({ message: 'Username already taken' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, favoriteMovie, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Forgot Password
router.post('/forgot-password', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('newPassword').matches(passwordRegex).withMessage('Password must meet complexity requirements (8+ chars, mixed case, number, special)'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Password confirmation does not match');
        }
        return true;
    })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Profile
router.post('/update-profile', [
    body('email').isEmail().withMessage('Identification email failed')
], async (req, res) => {
    try {
        const { email, username, bio, avatar, favoriteMovie } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (username && username !== user.username) {
            const existing = await User.findOne({ username });
            if (existing) return res.status(400).json({ message: 'Username already taken' });
            user.username = username;
        }

        if (bio !== undefined) user.bio = bio;
        if (avatar !== undefined) user.avatar = avatar;
        if (favoriteMovie !== undefined) user.favoriteMovie = favoriteMovie;

        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete Account
router.post('/delete-account', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // If user has a password (JWT user), they must provide it to delete
        if (user.password) {
            if (!password) return res.status(400).json({ message: 'Please provide your password to delete account' });
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });
        }

        await User.deleteOne({ _id: user._id });
        res.json({ message: 'Account permanently deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'No account found with this email. Please register first.' });

    // Handle Google Users trying to login with password
    if (!user.password && password) {
        return res.status(400).json({ message: 'This account uses Google Login. Please use the Google button.' });
    }

    if (user.password) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
        token, 
        user: { 
            id: user._id, 
            username: user.username, 
            email: user.email, 
            favoriteMovie: user.favoriteMovie, 
            avatar: user.avatar,
            bio: user.bio 
        } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Complete Profile
router.post('/complete-profile', [
    body('username').notEmpty().withMessage('Username is required'),
    body('favoriteMovie').notEmpty().withMessage('Favorite movie is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email, username, favoriteMovie } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const existing = await User.findOne({ username, _id: { $ne: user._id } });
        if (existing) return res.status(400).json({ message: 'Username already taken' });

        user.username = username;
        user.favoriteMovie = favoriteMovie;
        await user.save();

        res.json({ message: 'Profile completed successfully', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Google Auth
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  prompt: 'select_account'
}));

router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  const userData = { 
    id: req.user._id, 
    email: req.user.email, 
    username: req.user.username,
    favoriteMovie: req.user.favoriteMovie,
    avatar: req.user.avatar,
    bio: req.user.bio
  };

  const isIncomplete = !req.user.username || !req.user.favoriteMovie;
  const redirectTarget = isIncomplete ? 'complete-profile' : '';
  
  res.redirect(`${process.env.CLIENT_URL}/${redirectTarget}?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`);
});

module.exports = router;
