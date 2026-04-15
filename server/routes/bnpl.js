const express = require('express');
const router = express.Router();
const { db, uuidv4 } = require('../mockDb');
const { verifyToken } = require('../middleware/auth');

// GET /api/bnpl/my
router.get('/my', verifyToken, (req, res) => {
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const bnplTxns = db.applications.filter((a) => a.userId === req.user.id && a.type === 'bnpl');
  res.json({
    success: true,
    limit: user.bnplLimit,
    used: user.bnplUsed,
    available: Math.max(0, user.bnplLimit - user.bnplUsed),
    transactions: bnplTxns,
  });
});

// POST /api/bnpl/purchase
router.post('/purchase', verifyToken, (req, res) => {
  const { merchant, amount, installments } = req.body;
  if (!merchant || !amount || !installments) {
    return res.status(400).json({ success: false, message: 'merchant, amount, installments required' });
  }
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user || user.kycStatus !== 'approved') {
    return res.status(403).json({ success: false, message: 'KYC approval required for BNPL' });
  }
  const purchaseAmount = parseFloat(amount);
  if (purchaseAmount > user.bnplLimit - user.bnplUsed) {
    return res.status(400).json({ success: false, message: 'Exceeds available BNPL limit' });
  }
  user.bnplUsed += purchaseAmount;

  const purchase = {
    id: uuidv4(),
    userId: req.user.id,
    type: 'bnpl',
    amount: purchaseAmount,
    merchant,
    installments: parseInt(installments),
    installmentAmount: Math.ceil(purchaseAmount / parseInt(installments)),
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.applications.push(purchase);

  db.notifications.push({
    id: uuidv4(),
    userId: req.user.id,
    title: 'BNPL Purchase Confirmed',
    message: `AED ${purchaseAmount.toLocaleString()} purchase at ${merchant} split into ${installments} installments of AED ${purchase.installmentAmount.toLocaleString()}.`,
    type: 'info',
    read: false,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json({ success: true, purchase });
});

// POST /api/bnpl/repay
router.post('/repay', verifyToken, (req, res) => {
  const { purchaseId, amount } = req.body;
  const purchase = db.applications.find((a) => a.id === purchaseId && a.type === 'bnpl' && a.userId === req.user.id);
  if (!purchase) return res.status(404).json({ success: false, message: 'BNPL purchase not found' });

  const user = db.users.find((u) => u.id === req.user.id);
  const repayAmount = Math.min(parseFloat(amount), user.bnplUsed);
  user.bnplUsed = Math.max(0, user.bnplUsed - repayAmount);

  purchase.amount = Math.max(0, purchase.amount - repayAmount);
  if (purchase.amount === 0) purchase.status = 'repaid';
  purchase.updatedAt = new Date().toISOString();

  res.json({ success: true, message: `Repaid AED ${repayAmount}`, purchase });
});

module.exports = router;
