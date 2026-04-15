const express = require('express');
const router = express.Router();
const { db, uuidv4 } = require('../mockDb');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const INTEREST_RATE = 5.5; // % per annum

function calculateEMI(principal, months, annualRate) {
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  return Math.round(emi);
}

// POST /api/loans/apply
router.post('/apply', verifyToken, (req, res) => {
  const { amount, tenure, purpose } = req.body;
  if (!amount || !tenure || !purpose) {
    return res.status(400).json({ success: false, message: 'amount, tenure, purpose required' });
  }
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  if (user.kycStatus !== 'approved') {
    return res.status(403).json({ success: false, message: 'KYC must be approved before applying for a loan' });
  }

  const monthlyEMI = calculateEMI(parseFloat(amount), parseInt(tenure), INTEREST_RATE);
  const application = {
    id: uuidv4(),
    userId: req.user.id,
    type: 'loan',
    amount: parseFloat(amount),
    tenure: parseInt(tenure),
    purpose,
    monthlyEMI,
    interestRate: INTEREST_RATE,
    status: 'pending',
    creditScore: user.creditScore,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    adminNote: '',
  };
  db.applications.push(application);

  // Notification
  db.notifications.push({
    id: uuidv4(),
    userId: req.user.id,
    title: 'Loan Application Submitted',
    message: `Your loan application for AED ${amount.toLocaleString()} is under review.`,
    type: 'info',
    read: false,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json({ success: true, message: 'Loan application submitted', application });
});

// GET /api/loans/my
router.get('/my', verifyToken, (req, res) => {
  const loans = db.applications.filter((a) => a.userId === req.user.id && a.type === 'loan');
  res.json({ success: true, loans });
});

// ---- ADMIN ----

// GET /api/loans — all loans
router.get('/', verifyToken, requireAdmin, (req, res) => {
  const loans = db.applications.filter((a) => a.type === 'loan');
  const enriched = loans.map((l) => {
    const user = db.users.find((u) => u.id === l.userId);
    return { ...l, userFullName: user?.fullName, userEmail: user?.email };
  });
  res.json({ success: true, loans: enriched });
});

// PUT /api/loans/:id/review
router.put('/:id/review', verifyToken, requireAdmin, (req, res) => {
  const { status, adminNote } = req.body; // status: 'approved' | 'rejected'
  const app = db.applications.find((a) => a.id === req.params.id && a.type === 'loan');
  if (!app) return res.status(404).json({ success: false, message: 'Loan application not found' });
  app.status = status;
  app.adminNote = adminNote || '';
  app.updatedAt = new Date().toISOString();

  const notifType = status === 'approved' ? 'success' : 'error';
  const notifMsg = status === 'approved'
    ? `Your loan of AED ${app.amount.toLocaleString()} has been approved! Disbursement within 24 hours.`
    : `Your loan application was rejected. Reason: ${adminNote || 'Insufficient eligibility'}`;
  db.notifications.push({
    id: uuidv4(),
    userId: app.userId,
    title: `Loan Application ${status === 'approved' ? 'Approved' : 'Rejected'}`,
    message: notifMsg,
    type: notifType,
    read: false,
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, message: `Loan ${status}`, application: app });
});

module.exports = router;
