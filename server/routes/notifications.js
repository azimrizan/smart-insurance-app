const express = require('express');
const router = express.Router();
const { db } = require('../mockDb');
const { verifyToken } = require('../middleware/auth');

// GET /api/notifications/my
router.get('/my', verifyToken, (req, res) => {
  const notifs = db.notifications
    .filter((n) => n.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const unread = notifs.filter((n) => !n.read).length;
  res.json({ success: true, notifications: notifs, unread });
});

// PUT /api/notifications/:id/read
router.put('/:id/read', verifyToken, (req, res) => {
  const notif = db.notifications.find((n) => n.id === req.params.id && n.userId === req.user.id);
  if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });
  notif.read = true;
  res.json({ success: true, notification: notif });
});

// PUT /api/notifications/read-all
router.put('/read-all', verifyToken, (req, res) => {
  db.notifications
    .filter((n) => n.userId === req.user.id)
    .forEach((n) => (n.read = true));
  res.json({ success: true, message: 'All notifications marked as read' });
});

module.exports = router;
