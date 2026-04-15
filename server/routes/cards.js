const express = require('express');
const router = express.Router();
const { db, uuidv4 } = require('../mockDb');
const { verifyToken } = require('../middleware/auth');

// GET /api/cards/my
router.get('/my', verifyToken, (req, res) => {
  const cards = db.virtualCards.filter((c) => c.userId === req.user.id);
  // Mask CVV
  const safeCards = cards.map(({ cvv, ...c }) => ({ ...c, cvv: '***' }));
  res.json({ success: true, cards: safeCards });
});

// GET /api/cards/:id/details — full card details (for show card modal)
router.get('/:id/details', verifyToken, (req, res) => {
  const card = db.virtualCards.find((c) => c.id === req.params.id && c.userId === req.user.id);
  if (!card) return res.status(404).json({ success: false, message: 'Card not found' });
  res.json({ success: true, card });
});

// POST /api/cards/generate
router.post('/generate', verifyToken, (req, res) => {
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user || user.kycStatus !== 'approved') {
    return res.status(403).json({ success: false, message: 'KYC approval required to generate a virtual card' });
  }
  const existingActive = db.virtualCards.find((c) => c.userId === req.user.id && c.status === 'active');
  if (existingActive) {
    return res.status(409).json({ success: false, message: 'You already have an active virtual card' });
  }

  const cardNumber = Array.from({ length: 4 }, () => Math.floor(1000 + Math.random() * 9000)).join(' ');
  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 3);
  const expiryStr = `${String(expiry.getMonth() + 1).padStart(2, '0')}/${String(expiry.getFullYear()).slice(-2)}`;
  const cvv = Math.floor(100 + Math.random() * 900).toString();
  const limit = Math.min(user.creditScore * 30, 50000);

  const card = {
    id: uuidv4(),
    userId: req.user.id,
    cardNumber,
    cardHolder: user.fullName.toUpperCase(),
    expiryDate: expiryStr,
    cvv,
    cardType: 'Visa',
    status: 'active',
    limit,
    used: 0,
    createdAt: new Date().toISOString(),
  };
  db.virtualCards.push(card);

  db.notifications.push({
    id: uuidv4(),
    userId: req.user.id,
    title: 'Virtual Card Generated',
    message: `Your Visa virtual card ending in ${cardNumber.split(' ').pop()} is now active with a limit of AED ${limit.toLocaleString()}.`,
    type: 'success',
    read: false,
    createdAt: new Date().toISOString(),
  });

  const { cvv: _, ...safeCard } = card;
  res.status(201).json({ success: true, message: 'Virtual card created', card: safeCard });
});

// PUT /api/cards/:id/toggle — freeze/unfreeze
router.put('/:id/toggle', verifyToken, (req, res) => {
  const card = db.virtualCards.find((c) => c.id === req.params.id && c.userId === req.user.id);
  if (!card) return res.status(404).json({ success: false, message: 'Card not found' });
  card.status = card.status === 'active' ? 'frozen' : 'active';
  const { cvv, ...safeCard } = card;
  res.json({ success: true, card: safeCard, status: card.status });
});

// GET /api/cards/:id/transactions
router.get('/:id/transactions', verifyToken, (req, res) => {
  const card = db.virtualCards.find((c) => c.id === req.params.id && c.userId === req.user.id);
  if (!card) return res.status(404).json({ success: false, message: 'Card not found' });
  const txns = db.transactions.filter((t) => t.cardId === req.params.id);
  res.json({ success: true, transactions: txns });
});

// POST /api/cards/:id/spend — simulate a spend
router.post('/:id/spend', verifyToken, (req, res) => {
  const { merchant, category, amount } = req.body;
  const card = db.virtualCards.find((c) => c.id === req.params.id && c.userId === req.user.id);
  if (!card) return res.status(404).json({ success: false, message: 'Card not found' });
  if (card.status !== 'active') return res.status(400).json({ success: false, message: 'Card is frozen' });
  const spendAmount = parseFloat(amount);
  if (card.used + spendAmount > card.limit) return res.status(400).json({ success: false, message: 'Exceeds card limit' });
  card.used += spendAmount;

  const txn = {
    id: uuidv4(),
    cardId: card.id,
    userId: req.user.id,
    merchant: merchant || 'Unknown',
    category: category || 'General',
    amount: spendAmount,
    type: 'debit',
    status: 'completed',
    date: new Date().toISOString(),
  };
  db.transactions.push(txn);

  db.notifications.push({
    id: uuidv4(),
    userId: req.user.id,
    title: 'Transaction Alert',
    message: `AED ${spendAmount.toLocaleString()} spent at ${merchant}.`,
    type: 'warning',
    read: false,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json({ success: true, transaction: txn });
});

module.exports = router;
