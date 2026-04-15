const express = require('express');
const router = express.Router();
const { db } = require('../mockDb');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// GET /api/admin/stats — dashboard KPIs
router.get('/stats', verifyToken, requireAdmin, (req, res) => {
  const totalUsers = db.users.filter((u) => u.role === 'user').length;
  const pendingKyc = db.kycRecords.filter((k) => k.status === 'pending').length;
  const pendingLoans = db.applications.filter((a) => a.type === 'loan' && a.status === 'pending').length;
  const approvedLoans = db.applications.filter((a) => a.type === 'loan' && a.status === 'approved').length;
  const totalLoanDisbursed = db.applications
    .filter((a) => a.type === 'loan' && a.status === 'approved')
    .reduce((sum, a) => sum + a.amount, 0);
  const totalCards = db.virtualCards.length;
  const totalBnplActive = db.applications.filter((a) => a.type === 'bnpl' && a.status === 'active').length;
  const avgCreditScore = Math.round(
    db.users.filter((u) => u.creditScore > 0).reduce((sum, u) => sum + u.creditScore, 0) /
      Math.max(1, db.users.filter((u) => u.creditScore > 0).length)
  );

  res.json({
    success: true,
    stats: {
      totalUsers,
      pendingKyc,
      pendingLoans,
      approvedLoans,
      totalLoanDisbursed,
      totalCards,
      totalBnplActive,
      avgCreditScore,
    },
  });
});

// GET /api/admin/kyc-pending
router.get('/kyc-pending', verifyToken, requireAdmin, (req, res) => {
  const pending = db.kycRecords.filter((k) => k.status === 'pending');
  const enriched = pending.map((kyc) => {
    const user = db.users.find((u) => u.id === kyc.userId);
    return { ...kyc, userFullName: user?.fullName, userEmail: user?.email };
  });
  res.json({ success: true, kycs: enriched });
});

// GET /api/admin/transactions — all transactions
router.get('/transactions', verifyToken, requireAdmin, (req, res) => {
  const txns = db.transactions.map((t) => {
    const user = db.users.find((u) => u.id === t.userId);
    return { ...t, userFullName: user?.fullName };
  });
  res.json({ success: true, transactions: txns });
});

module.exports = router;
