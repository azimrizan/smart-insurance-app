// ============================================================
// MOCK IN-MEMORY DATABASE
// ============================================================
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Seed data
const users = [
  {
    id: 'admin-001',
    fullName: 'Admin User',
    email: 'admin@smartfinance.com',
    phone: '+971501234567',
    passwordHash: bcrypt.hashSync('Admin@123', 10),
    role: 'admin',
    isVerified: true,
    kycStatus: 'approved',
    creditScore: 800,
    monthlyIncome: 50000,
    createdAt: new Date('2024-01-01').toISOString(),
    bnplLimit: 100000,
    bnplUsed: 0,
  },
  {
    id: 'user-001',
    fullName: 'Ahmed Al Mansouri',
    email: 'ahmed@example.com',
    phone: '+971509876543',
    passwordHash: bcrypt.hashSync('User@123', 10),
    role: 'user',
    isVerified: true,
    kycStatus: 'approved',
    creditScore: 720,
    monthlyIncome: 15000,
    createdAt: new Date('2024-03-15').toISOString(),
    bnplLimit: 30000,
    bnplUsed: 5000,
  },
  {
    id: 'user-002',
    fullName: 'Sara Al Hashimi',
    email: 'sara@example.com',
    phone: '+971507654321',
    passwordHash: bcrypt.hashSync('User@123', 10),
    role: 'user',
    isVerified: false,
    kycStatus: 'pending',
    creditScore: 0,
    monthlyIncome: 12000,
    createdAt: new Date('2024-04-01').toISOString(),
    bnplLimit: 0,
    bnplUsed: 0,
  },
];

const kycRecords = [
  {
    id: 'kyc-001',
    userId: 'user-001',
    emiratesIdFront: 'https://placehold.co/600x400/0B1F3A/C9A227?text=Emirates+ID+Front',
    emiratesIdBack: 'https://placehold.co/600x400/0B1F3A/C9A227?text=Emirates+ID+Back',
    selfie: 'https://placehold.co/400x400/0B1F3A/C9A227?text=Selfie',
    status: 'approved',
    submittedAt: new Date('2024-03-16').toISOString(),
    reviewedAt: new Date('2024-03-17').toISOString(),
  },
  {
    id: 'kyc-002',
    userId: 'user-002',
    emiratesIdFront: 'https://placehold.co/600x400/0B1F3A/C9A227?text=Emirates+ID+Front',
    emiratesIdBack: 'https://placehold.co/600x400/0B1F3A/C9A227?text=Emirates+ID+Back',
    selfie: 'https://placehold.co/400x400/0B1F3A/C9A227?text=Selfie',
    status: 'pending',
    submittedAt: new Date('2024-04-02').toISOString(),
    reviewedAt: null,
  },
];

const applications = [
  {
    id: 'app-001',
    userId: 'user-001',
    type: 'loan',
    amount: 50000,
    tenure: 24,
    purpose: 'Home Renovation',
    monthlyEMI: 2380,
    interestRate: 5.5,
    status: 'approved',
    creditScore: 720,
    createdAt: new Date('2024-03-20').toISOString(),
    updatedAt: new Date('2024-03-22').toISOString(),
    adminNote: 'Strong credit profile. Approved.',
  },
  {
    id: 'app-002',
    userId: 'user-001',
    type: 'loan',
    amount: 20000,
    tenure: 12,
    purpose: 'Education',
    monthlyEMI: 1750,
    interestRate: 4.9,
    status: 'pending',
    creditScore: 720,
    createdAt: new Date('2024-04-10').toISOString(),
    updatedAt: new Date('2024-04-10').toISOString(),
    adminNote: '',
  },
  {
    id: 'bnpl-001',
    userId: 'user-001',
    type: 'bnpl',
    merchant: 'Amazon.ae',
    amount: 3000,
    installments: 3,
    installmentAmount: 1000,
    status: 'active',
    createdAt: new Date('2024-04-01').toISOString(),
    updatedAt: new Date('2024-04-01').toISOString(),
  },
  {
    id: 'bnpl-002',
    userId: 'user-001',
    type: 'bnpl',
    merchant: 'Apple Store',
    amount: 2000,
    installments: 4,
    installmentAmount: 500,
    status: 'active',
    createdAt: new Date('2024-04-05').toISOString(),
    updatedAt: new Date('2024-04-05').toISOString(),
  },
];

const virtualCards = [
  {
    id: 'card-001',
    userId: 'user-001',
    cardNumber: '4532 7891 2345 6789',
    cardHolder: 'AHMED AL MANSOURI',
    expiryDate: '12/27',
    cvv: '432',
    cardType: 'Visa',
    status: 'active',
    limit: 25000,
    used: 3500,
    createdAt: new Date('2024-03-21').toISOString(),
  },
];

const transactions = [
  {
    id: 'txn-001',
    cardId: 'card-001',
    userId: 'user-001',
    merchant: 'Dubai Mall',
    category: 'Shopping',
    amount: 1200,
    type: 'debit',
    status: 'completed',
    date: new Date('2024-04-05').toISOString(),
  },
  {
    id: 'txn-002',
    cardId: 'card-001',
    userId: 'user-001',
    merchant: 'Carrefour',
    category: 'Groceries',
    amount: 450,
    type: 'debit',
    status: 'completed',
    date: new Date('2024-04-08').toISOString(),
  },
  {
    id: 'txn-003',
    cardId: 'card-001',
    userId: 'user-001',
    merchant: 'Noon.com',
    category: 'E-commerce',
    amount: 850,
    type: 'debit',
    status: 'completed',
    date: new Date('2024-04-12').toISOString(),
  },
  {
    id: 'txn-004',
    cardId: 'card-001',
    userId: 'user-001',
    merchant: 'Repayment',
    category: 'Payment',
    amount: 1000,
    type: 'credit',
    status: 'completed',
    date: new Date('2024-04-13').toISOString(),
  },
];

const notifications = [
  {
    id: 'notif-001',
    userId: 'user-001',
    title: 'Loan Application Approved',
    message: 'Your loan of AED 50,000 has been approved. Funds will be disbursed within 24 hours.',
    type: 'success',
    read: false,
    createdAt: new Date('2024-03-22').toISOString(),
  },
  {
    id: 'notif-002',
    userId: 'user-001',
    title: 'Virtual Card Activated',
    message: 'Your Visa virtual card ending in 6789 is now active and ready to use.',
    type: 'info',
    read: true,
    createdAt: new Date('2024-03-21').toISOString(),
  },
  {
    id: 'notif-003',
    userId: 'user-001',
    title: 'Transaction Alert',
    message: 'AED 1,200 spent at Dubai Mall.',
    type: 'warning',
    read: false,
    createdAt: new Date('2024-04-05').toISOString(),
  },
];

// OTP Store (in-memory, expires in 5 min)
const otpStore = {};

module.exports = {
  db: { users, kycRecords, applications, virtualCards, transactions, notifications, otpStore },
  uuidv4,
};
