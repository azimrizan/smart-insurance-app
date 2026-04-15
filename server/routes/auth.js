const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { db, uuidv4 } = require('../mockDb');
const { generateTokens } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, password, monthlyIncome } = req.body;
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    if (db.users.find((u) => u.email === email)) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      fullName,
      email,
      phone,
      passwordHash,
      role: 'user',
      isVerified: false,
      kycStatus: 'not_submitted',
      creditScore: 0,
      monthlyIncome: parseFloat(monthlyIncome) || 0,
      createdAt: new Date().toISOString(),
      bnplLimit: 0,
      bnplUsed: 0,
    };
    db.users.push(newUser);

    // Mock OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    db.otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
    console.log(`[OTP] ${email}: ${otp}`);

    res.status(201).json({ success: true, message: 'Registration successful. OTP sent to email.', otpHint: otp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const record = db.otpStore[email];
  if (!record) return res.status(400).json({ success: false, message: 'No OTP found for this email' });
  if (Date.now() > record.expiresAt) return res.status(400).json({ success: false, message: 'OTP expired' });
  if (record.otp !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP' });

  const user = db.users.find((u) => u.email === email);
  if (user) {
    user.isVerified = true;
    // Auto-compute BNPL limit from income
    const score = Math.min(850, Math.max(300, Math.floor(600 + (user.monthlyIncome / 1000) * 5)));
    user.creditScore = score;
    user.bnplLimit = Math.floor(user.monthlyIncome * 2);
  }
  delete db.otpStore[email];

  const tokens = generateTokens(user);
  const { passwordHash, ...safeUser } = user;
  res.json({ success: true, message: 'Email verified', user: safeUser, ...tokens });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.users.find((u) => u.email === email);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const tokens = generateTokens(user);
    const { passwordHash, ...safeUser } = user;
    res.json({ success: true, user: safeUser, ...tokens });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/refresh
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token required' });
  try {
    const jwt = require('jsonwebtoken');
    const { JWT_REFRESH_SECRET } = require('../middleware/auth');
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = db.users.find((u) => u.id === decoded.id);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    const tokens = generateTokens(user);
    res.json({ success: true, ...tokens });
  } catch {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
});

module.exports = router;
