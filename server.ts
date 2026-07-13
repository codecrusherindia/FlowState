/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import mongoose, { Schema } from 'mongoose';
import { IUser, IWallet, ITransaction, IRoutingRules, IIdempotencyLog } from './types.ts';

const DB_FILE = path.join(process.cwd(), 'db.json');

// --- Helper for file database persistence ---
interface IDBStore {
  users: IUser[];
  wallets: IWallet[];
  transactions: ITransaction[];
  routingRules: IRoutingRules[];
  idempotencyLogs: IIdempotencyLog[];
}

const DEFAULT_USER_ID = 'user_gig_worker_001';
const DEFAULT_USER_EMAIL = 'justmakingsome@gmail.com';

function getInitialStore(): IDBStore {
  return {
    users: [
      {
        _id: DEFAULT_USER_ID,
        email: DEFAULT_USER_EMAIL,
        // password123 hashed with bcryptjs
        passwordHash: '$2a$10$f3N7TpxeD88Nl28T.q9P/eVhZ5m0eU/pYshLwY7p/VdI1g2P9g.uS',
        subscriptionTier: 'premium',
        annualIncomeYTD: 580000, // Close to ₹7,00,000 to show dynamic tax slab transition
        consistencyScore: 780, // Out of 900
        virtualAccountNumber: 'DECN849302198',
        virtualAccountIFSC: 'DECN0000001',
      },
    ],
    idempotencyLogs: [],
    wallets: [
      {
        _id: 'wallet_001',
        userId: DEFAULT_USER_ID,
        checkingBalance: 45200,
        taxVaultBalance: 87000,
        bufferBalance: 25000,
        customVaults: [
          { name: 'GST Q2 Pool', balance: 12000, targetAmount: 35000 },
          { name: 'New MacBook Pro', balance: 40000, targetAmount: 150000 },
        ],
      },
    ],
    routingRules: [
      {
        _id: 'rules_001',
        userId: DEFAULT_USER_ID,
        priorityBills: [
          { name: 'HDFC Car Loan EMI', amount: 15000, dueDate: '2026-07-20', filledAmount: 15000 },
          { name: 'Office Co-working Rent', amount: 8000, dueDate: '2026-07-25', filledAmount: 4000 },
          { name: 'Health Insurance Premium', amount: 5000, dueDate: '2026-08-01', filledAmount: 0 },
        ],
        dynamicTaxEnabled: true,
        splits: { tax: 15, buffer: 10, checking: 75 },
      },
    ],
    transactions: [
      {
        _id: 'tx_001',
        userId: DEFAULT_USER_ID,
        rawNarrative: 'NEFT/INB/UPWRK/09384/PAYOUT',
        parsedSource: 'Upwork Client',
        category: 'Freelance Payout',
        amount: 45000,
        date: '2026-07-10T14:30:00Z',
        routingBreakdown: { tax: 6750, buffer: 4500, checking: 33750, priorityBills: 0 },
        type: 'credit',
      },
      {
        _id: 'tx_002',
        userId: DEFAULT_USER_ID,
        rawNarrative: 'UPI/SWIGGY-DELIVERY/8493021/REP',
        parsedSource: 'Swiggy Delivery Partner',
        category: 'Gig Delivery Services',
        amount: 3500,
        date: '2026-07-11T19:15:00Z',
        routingBreakdown: { tax: 525, buffer: 350, checking: 2625, priorityBills: 0 },
        type: 'credit',
      },
      {
        _id: 'tx_003',
        userId: DEFAULT_USER_ID,
        rawNarrative: 'IMPS/HDFC-EMI-LOAN/SWEEP',
        parsedSource: 'HDFC Car Loan',
        category: 'Loan EMI Payment',
        amount: 15000,
        date: '2026-07-12T10:00:00Z',
        routingBreakdown: { tax: 0, buffer: 0, checking: 0, priorityBills: 15000 },
        type: 'debit',
      },
      {
        _id: 'tx_004',
        userId: DEFAULT_USER_ID,
        rawNarrative: 'UPI/KREATOR/INFLUENCER/SPONSOR',
        parsedSource: 'Kreator Collab Brand',
        category: 'Brand Sponsorship',
        amount: 12000,
        date: '2026-07-13T08:00:00Z',
        routingBreakdown: { tax: 1800, buffer: 1200, checking: 9000, priorityBills: 0 },
        type: 'credit',
      },
    ],
  };
}

// Ensure database file exists
function loadStore(): IDBStore {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading db.json file, falling back to initial store', err);
  }
  const initial = getInitialStore();
  saveStore(initial);
  return initial;
}

function saveStore(store: IDBStore) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to db.json file', err);
  }
}

// --- Mongoose schemas for production / actual DB ---
const UserMongooseSchema = new Schema({
  email: { type: String, required: true },
  passwordHash: { type: String },
  subscriptionTier: { type: String, enum: ['freemium', 'premium'], default: 'freemium' },
  annualIncomeYTD: { type: Number, default: 0 },
  consistencyScore: { type: Number, default: 600 },
  virtualAccountNumber: { type: String },
  virtualAccountIFSC: { type: String },
});

const IdempotencyLogMongooseSchema = new Schema({
  webhookId: { type: String, required: true, unique: true },
  processedAt: { type: Date, default: Date.now },
});

const WalletMongooseSchema = new Schema({
  userId: { type: String, required: true },
  checkingBalance: { type: Number, default: 0 },
  taxVaultBalance: { type: Number, default: 0 },
  bufferBalance: { type: Number, default: 0 },
  customVaults: [
    {
      name: { type: String, required: true },
      balance: { type: Number, default: 0 },
      targetAmount: { type: Number, default: 0 },
    },
  ],
});

const TransactionMongooseSchema = new Schema({
  userId: { type: String, required: true },
  rawNarrative: { type: String, required: true },
  parsedSource: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  routingBreakdown: {
    tax: { type: Number, default: 0 },
    buffer: { type: Number, default: 0 },
    checking: { type: Number, default: 0 },
    priorityBills: { type: Number, default: 0 },
  },
  type: { type: String, enum: ['credit', 'debit'], required: true },
});

const RoutingRulesMongooseSchema = new Schema({
  userId: { type: String, required: true },
  priorityBills: [
    {
      name: { type: String, required: true },
      amount: { type: Number, required: true },
      dueDate: { type: String, required: true },
      filledAmount: { type: Number, default: 0 },
    },
  ],
  dynamicTaxEnabled: { type: Boolean, default: true },
  splits: {
    tax: { type: Number, default: 15 },
    buffer: { type: Number, default: 10 },
    checking: { type: Number, default: 75 },
  },
});

// Real Mongo DB Client
let UserRealModel: any;
let WalletRealModel: any;
let TransactionRealModel: any;
let RoutingRulesRealModel: any;

let isMongoConnected = false;

export async function connectMongoDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('⚡ No MONGODB_URI found. Utilizing high-fidelity local JSON database (db.json) for AI Studio Preview.');
    return false;
  }
  try {
    await mongoose.connect(uri);
    isMongoConnected = true;
    console.log('✅ Real MongoDB successfully connected!');
    return true;
  } catch (err) {
    console.error('❌ Failed to connect to real MongoDB specified in environment. Defaulting to local db.json fallback.', err);
    return false;
  }
}

// Lazy load real models or fallback to local JSON database simulation
export const User = {
  async findOne(query: { email?: string; _id?: string }): Promise<IUser | null> {
    const store = loadStore();
    if (query.email) {
      return store.users.find((u) => u.email === query.email) || null;
    }
    if (query._id) {
      return store.users.find((u) => u._id === query._id) || null;
    }
    return store.users[0] || null;
  },

  async findByIdAndUpdate(id: string, update: Partial<IUser>, options?: { new: boolean }): Promise<IUser | null> {
    const store = loadStore();
    const idx = store.users.findIndex((u) => u._id === id);
    if (idx === -1) return null;
    store.users[idx] = { ...store.users[idx], ...update };
    saveStore(store);
    return store.users[idx];
  },

  async create(user: Partial<IUser>): Promise<IUser> {
    const store = loadStore();
    const newUser: IUser = {
      _id: user._id || 'user_' + Math.random().toString(36).substring(2, 9),
      email: user.email || DEFAULT_USER_EMAIL,
      passwordHash: user.passwordHash || '',
      subscriptionTier: user.subscriptionTier || 'freemium',
      annualIncomeYTD: user.annualIncomeYTD || 0,
      consistencyScore: user.consistencyScore || 600,
      virtualAccountNumber: user.virtualAccountNumber || '',
      virtualAccountIFSC: user.virtualAccountIFSC || '',
    };
    store.users.push(newUser);
    saveStore(store);
    return newUser;
  },
};

export const IdempotencyLog = {
  async exists(webhookId: string): Promise<boolean> {
    const store = loadStore();
    if (!store.idempotencyLogs) {
      store.idempotencyLogs = [];
      saveStore(store);
    }
    return store.idempotencyLogs.some((log) => log.webhookId === webhookId);
  },

  async create(webhookId: string): Promise<IIdempotencyLog> {
    const store = loadStore();
    if (!store.idempotencyLogs) {
      store.idempotencyLogs = [];
    }
    const newLog: IIdempotencyLog = {
      webhookId,
      processedAt: new Date().toISOString(),
    };
    store.idempotencyLogs.push(newLog);
    saveStore(store);
    return newLog;
  },
};

export const Wallet = {
  async findOne(query: { userId: string }): Promise<IWallet | null> {
    const store = loadStore();
    const wallet = store.wallets.find((w) => w.userId === query.userId);
    if (!wallet) {
      // Auto-create wallet for consistent experience
      const newWallet: IWallet = {
        _id: 'wallet_' + Math.random().toString(36).substring(2, 9),
        userId: query.userId,
        checkingBalance: 0,
        taxVaultBalance: 0,
        bufferBalance: 0,
        customVaults: [],
      };
      store.wallets.push(newWallet);
      saveStore(store);
      return newWallet;
    }
    return wallet;
  },

  async findOneAndUpdate(
    query: { userId: string },
    update: Partial<IWallet> | any,
    options?: { new: boolean }
  ): Promise<IWallet | null> {
    const store = loadStore();
    const idx = store.wallets.findIndex((w) => w.userId === query.userId);
    if (idx === -1) return null;
    
    // Support standard update and fields
    const current = store.wallets[idx];
    const updated = { ...current };

    if (update.$inc) {
      if (update.$inc.checkingBalance !== undefined) updated.checkingBalance += update.$inc.checkingBalance;
      if (update.$inc.taxVaultBalance !== undefined) updated.taxVaultBalance += update.$inc.taxVaultBalance;
      if (update.$inc.bufferBalance !== undefined) updated.bufferBalance += update.$inc.bufferBalance;
      if (update.$inc.annualIncomeYTD !== undefined) {
        // Find user & increment YTD
        const userIdx = store.users.findIndex((u) => u._id === query.userId);
        if (userIdx !== -1) {
          store.users[userIdx].annualIncomeYTD += update.$inc.annualIncomeYTD;
        }
      }
    }

    if (update.checkingBalance !== undefined) updated.checkingBalance = update.checkingBalance;
    if (update.taxVaultBalance !== undefined) updated.taxVaultBalance = update.taxVaultBalance;
    if (update.bufferBalance !== undefined) updated.bufferBalance = update.bufferBalance;
    if (update.customVaults !== undefined) updated.customVaults = update.customVaults;

    store.wallets[idx] = updated;
    saveStore(store);
    return updated;
  },
};

export const Transaction = {
  async find(query: { userId: string }): Promise<ITransaction[]> {
    const store = loadStore();
    return store.transactions
      .filter((t) => t.userId === query.userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async create(tx: Partial<ITransaction>): Promise<ITransaction> {
    const store = loadStore();
    const newTx: ITransaction = {
      _id: 'tx_' + Math.random().toString(36).substring(2, 9),
      userId: tx.userId || DEFAULT_USER_ID,
      rawNarrative: tx.rawNarrative || 'UPI/EXTERNAL-DEPOSIT',
      parsedSource: tx.parsedSource || 'Unknown Source',
      category: tx.category || 'Income',
      amount: tx.amount || 0,
      date: tx.date || new Date().toISOString(),
      routingBreakdown: tx.routingBreakdown || { tax: 0, buffer: 0, checking: 0, priorityBills: 0 },
      type: tx.type || 'credit',
    };
    store.transactions.push(newTx);
    saveStore(store);
    return newTx;
  },
};

export const RoutingRules = {
  async findOne(query: { userId: string }): Promise<IRoutingRules | null> {
    const store = loadStore();
    const rules = store.routingRules.find((r) => r.userId === query.userId);
    if (!rules) {
      const defaultRules: IRoutingRules = {
        _id: 'rules_' + Math.random().toString(36).substring(2, 9),
        userId: query.userId,
        priorityBills: [],
        dynamicTaxEnabled: true,
        splits: { tax: 15, buffer: 10, checking: 75 },
      };
      store.routingRules.push(defaultRules);
      saveStore(store);
      return defaultRules;
    }
    return rules;
  },

  async findOneAndUpdate(
    query: { userId: string },
    update: Partial<IRoutingRules> | any,
    options?: { new: boolean }
  ): Promise<IRoutingRules | null> {
    const store = loadStore();
    const idx = store.routingRules.findIndex((r) => r.userId === query.userId);
    if (idx === -1) return null;
    
    const current = store.routingRules[idx];
    const updated = { ...current, ...update };

    store.routingRules[idx] = updated;
    saveStore(store);
    return updated;
  },
};

export function getUserId() {
  return DEFAULT_USER_ID;
}
