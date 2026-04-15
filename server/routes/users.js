const express = require('express');
const router = express.Router();
const { db, uuidv4 } = require('../mockDb');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// GET /api/users/me
router.get('/me', verifyToken, (req, res) => {
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const { passwordHash, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});

// PUT /api/users/me
router.put('/me', verifyToken, (req, res) => {
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const { fullName, phone, monthlyIncome } = req.body;
  if (fullName) user.fullName = fullName;
  if (phone) user.phone = phone;
  if (monthlyIncome) user.monthlyIncome = parseFloat(monthlyIncome);
  const { passwordHash, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});

// POST /api/users/kyc — submit KYC
router.post('/kyc', verifyToken, (req, res) => {
  const { emiratesIdFront, emiratesIdBack, selfie } = req.body;
  const existing = db.kycRecords.find((k) => k.userId === req.user.id);
  if (existing) return res.status(409).json({ success: false, message: 'KYC already submitted' });

  const kyc = {
    id: uuidv4(),
    userId: req.user.id,
    emiratesIdFront: emiratesIdFront || 'https://placehold.co/600x400/0B1F3A/C9A227?text=ID+Front',
    emiratesIdBack: emiratesIdBack || 'https://placehold.co/600x400/0B1F3A/C9A227?text=ID+Back',
    selfie: selfie || 'https://placehold.co/400x400/0B1F3A/C9A227?text=Selfie',
    status: 'pending',
    submittedAt: new Date().toISOString(),
    reviewedAt: null,
  };
  db.kycRecords.push(kyc);
  const user = db.users.find((u) => u.id === req.user.id);
  if (user) user.kycStatus = 'pending';

  res.json({ success: true, message: 'KYC submitted for review', kyc });
});

// GET /api/users/kyc — get my KYC
router.get('/kyc', verifyToken, (req, res) => {
  const kyc = db.kycRecords.find((k) => k.userId === req.user.id);
  res.json({ success: true, kyc: kyc || null });
});

// ---- ADMIN ----

// GET /api/users — all users
router.get('/', verifyToken, requireAdmin, (req, res) => {
  const safeUsers = db.users.map(({ passwordHash, ...u }) => u);
  res.json({ success: true, users: safeUsers });
});

// PUT /api/users/:id/kyc — approve/reject KYC
router.put('/:id/kyc', verifyToken, requireAdmin, (req, res) => {
  const { status, note } = req.body; // status: 'approved' | 'rejected'
  const kyc = db.kycRecords.find((k) => k.userId === req.params.id);
  if (!kyc) return res.status(404).json({ success: false, message: 'KYC not found' });
  kyc.status = status;
  kyc.reviewedAt = new Date().toISOString();
  kyc.adminNote = note || '';

  const user = db.users.find((u) => u.id === req.params.id);
  if (user) {
    user.kycStatus = status;
    if (status === 'approved') {
      user.isVerified = true;
      const score = Math.min(850, Math.max(300, Math.floor(600 + (user.monthlyIncome / 1000) * 5)));
      user.creditScore = score;
      user.bnplLimit = Math.floor(user.monthlyIncome * 2);
    }
  }
  res.json({ success: true, message: `KYC ${status}`, kyc });
});

// PUT /api/users/:id/role
router.put('/:id/role', verifyToken, requireAdmin, (req, res) => {
  const user = db.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  user.role = req.body.role;
  const { passwordHash, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});

module.exports = router;
