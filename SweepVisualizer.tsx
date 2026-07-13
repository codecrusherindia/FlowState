/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import { User, Wallet, Transaction, RoutingRules, IdempotencyLog, connectMongoDB, getUserId } from './db.ts';
import { parseNarrative } from './services/geminiService.ts';
import { executeSweep, calculateConsistencyScore } from './services/mathEngine.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'flowstate_jwt_super_secret_key_123';

// Cache vault discipline penalty count locally for demo state
let vaultDisciplinePenalties = 0;

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Setup body parser
  app.use(express.json());

  // Attempt real MongoDB connection (will fall back to db.json safely if not provided)
  await connectMongoDB();

  // Helper to extract authenticated user ID from Bearer Token or fallback to default
  async function getUserIdFromReq(req: express.Request): Promise<string> {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        if (decoded && decoded.userId) {
          return decoded.userId;
        }
      } catch (err) {
        // Token expired or invalid, fallback to default
      }
    }
    return getUserId(); // Fallback to default user
  }

  // --- AUTHENTICATION API ROUTES ---

  /**
   * POST /api/auth/register
   * Registers a new gig worker, generates a Decentro Virtual Account and sets default wallets/rules
   */
  app.post('/api/auth/register', async (req, res) => {
    const { email, password, subscriptionTier = 'freemium' } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'A user with this email address already exists.' });
      }

      // Hash password using pure bcryptjs
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Decentro Virtual Account Integration (BaaS API Call)
      let virtualAccountNumber = 'DECN' + Math.floor(1000000000 + Math.random() * 9000000000);
      let virtualAccountIFSC = 'DECN0000001';

      try {
        console.log(`[Decentro integration] Requesting virtual bank account generation for: ${email}`);
        const decentroResponse = await fetch('https://staging.api.decentro.tech/v3/banking/account/virtual', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'client_id': process.env.DECENTRO_CLIENT_ID || 'mock_client_id_decentro_sandbox',
            'client_secret': process.env.DECENTRO_CLIENT_SECRET || 'mock_client_secret_decentro_sandbox',
            'module_secret': process.env.DECENTRO_MODULE_SECRET || 'mock_module_secret_decentro_sandbox',
            'provider_secret': process.env.DECENTRO_PROVIDER_SECRET || 'mock_provider_secret_decentro_sandbox'
          },
          body: JSON.stringify({
            bank_code: 'YESB',
            name: email.split('@')[0],
            email: email,
            mobile: '9999999999',
            kyc_verified: true,
            subscription_tier: subscriptionTier
          })
        });

        if (decentroResponse.ok) {
          const decentroData = await decentroResponse.json();
          if (decentroData?.data?.accountNumber) {
            virtualAccountNumber = decentroData.data.accountNumber;
            virtualAccountIFSC = decentroData.data.ifsc || 'DECN0000001';
            console.log(`[Decentro integration] Virtual account successfully generated: ${virtualAccountNumber}`);
          }
        } else {
          console.log(`[Decentro integration] Decentro responded with code ${decentroResponse.status}. Triggering premium virtual mock credentials.`);
        }
      } catch (err) {
        console.warn('[Decentro integration] BaaS sandbox endpoint currently offline or keys unconfigured. Applying premium virtual bank fallback.');
      }

      // Create new user record
      const newUser = await User.create({
        email,
        passwordHash,
        subscriptionTier,
        annualIncomeYTD: 0,
        consistencyScore: 600,
        virtualAccountNumber,
        virtualAccountIFSC
      });

      // Initialize corresponding Wallet state for user
      await Wallet.findOneAndUpdate(
        { userId: newUser._id },
        {
          checkingBalance: 12000, // Initial seed balance
          taxVaultBalance: 0,
          bufferBalance: 0,
          customVaults: [
            { name: 'GST Q2 Pool', balance: 0, targetAmount: 35000 },
            { name: 'New MacBook Pro', balance: 0, targetAmount: 150000 }
          ]
        }
      );

      // Initialize corresponding Routing Rules state for user
      await RoutingRules.findOneAndUpdate(
        { userId: newUser._id },
        {
          priorityBills: [
            { name: 'HDFC Car Loan EMI', amount: 15000, dueDate: '2026-07-20', filledAmount: 0 },
            { name: 'Office Co-working Rent', amount: 8000, dueDate: '2026-07-25', filledAmount: 0 },
            { name: 'Health Insurance Premium', amount: 5000, dueDate: '2026-08-01', filledAmount: 0 }
          ],
          dynamicTaxEnabled: true,
          splits: { tax: 15, buffer: 10, checking: 75 }
        }
      );

      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({
        success: true,
        token,
        user: {
          _id: newUser._id,
          email: newUser.email,
          subscriptionTier: newUser.subscriptionTier,
          annualIncomeYTD: newUser.annualIncomeYTD,
          consistencyScore: newUser.consistencyScore,
          virtualAccountNumber: newUser.virtualAccountNumber,
          virtualAccountIFSC: newUser.virtualAccountIFSC
        }
      });
    } catch (err: any) {
      console.error('Registration failed', err);
      res.status(500).json({ error: 'Failed to complete registration', message: err.message });
    }
  });

  /**
   * POST /api/auth/login
   * Authenticates credentials and issues secure JWT token
   */
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isMatch = user.passwordHash 
        ? await bcrypt.compare(password, user.passwordHash)
        : false;

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          email: user.email,
          subscriptionTier: user.subscriptionTier,
          annualIncomeYTD: user.annualIncomeYTD,
          consistencyScore: user.consistencyScore,
          virtualAccountNumber: user.virtualAccountNumber,
          virtualAccountIFSC: user.virtualAccountIFSC
        }
      });
    } catch (err: any) {
      console.error('Login error', err);
      res.status(500).json({ error: 'Authentication failed', message: err.message });
    }
  });

  /**
   * GET /api/auth/me
   * Resolves currently active authenticated user session from JWT
   */
  app.get('/api/auth/me', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const user = await User.findOne({ _id: decoded.userId });
      if (!user) {
        return res.status(404).json({ error: 'Session user not found' });
      }

      res.json({
        success: true,
        user: {
          _id: user._id,
          email: user.email,
          subscriptionTier: user.subscriptionTier,
          annualIncomeYTD: user.annualIncomeYTD,
          consistencyScore: user.consistencyScore,
          virtualAccountNumber: user.virtualAccountNumber,
          virtualAccountIFSC: user.virtualAccountIFSC
        }
      });
    } catch (err) {
      res.status(401).json({ error: 'Invalid or expired session token' });
    }
  });

  // --- CORE SYSTEM API ROUTES ---

  /**
   * GET /api/dashboard
   * Aggregates and returns the user's entire financial state (supports Auth / Fallback)
   */
  app.get('/api/dashboard', async (req, res) => {
    try {
      const userId = await getUserIdFromReq(req);
      
      let user = await User.findOne({ _id: userId });
      if (!user) {
        user = await User.create({ _id: userId, email: 'justmakingsome@gmail.com' });
      }

      let wallet = await Wallet.findOne({ userId });
      let routingRules = await RoutingRules.findOne({ userId });
      let transactions = await Transaction.find({ userId });

      // Calculate Cashflow Consistency Score dynamically (Pillar 3)
      const scoreData = calculateConsistencyScore(transactions, vaultDisciplinePenalties);
      
      // Sync score back to user db profile
      if (user.consistencyScore !== scoreData.score) {
        user = await User.findByIdAndUpdate(userId, { consistencyScore: scoreData.score }, { new: true });
      }

      res.json({
        user,
        wallet,
        routingRules,
        transactions,
        scoreMetrics: scoreData
      });
    } catch (err: any) {
      console.error('Error fetching dashboard', err);
      res.status(500).json({ error: 'Internal server error', message: err.message });
    }
  });

  /**
   * POST /api/webhooks/bank-deposit
   * Entrypoint for simulated bank AA framework webhooks or SMS scraping with IDEMPOTENCY
   */
  app.post('/api/webhooks/bank-deposit', async (req, res) => {
    const { amount, rawNarrative, transactionId } = req.body;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Invalid deposit amount' });
    }
    if (!rawNarrative || typeof rawNarrative !== 'string') {
      return res.status(400).json({ error: 'rawNarrative string is required' });
    }

    // Webhook Idempotency Check (preventing double sweeps from banking retries)
    if (transactionId) {
      const alreadyProcessed = await IdempotencyLog.exists(transactionId);
      if (alreadyProcessed) {
        console.log(`[FlowState Idempotency] transactionId ${transactionId} already processed. Halting and returning 200 OK.`);
        return res.status(200).json({
          success: true,
          message: 'Duplicate webhook transaction ID. Ignored to maintain transaction idempotency.',
          duplicate: true,
        });
      }
      // Record transactionId to Idempotency Log
      await IdempotencyLog.create(transactionId);
    }

    try {
      const userId = await getUserIdFromReq(req);
      const depositAmount = Math.round(Number(amount));

      // Get user, wallet, rules
      const user = await User.findOne({ _id: userId });
      if (!user) return res.status(404).json({ error: 'User not found' });

      const wallet = await Wallet.findOne({ userId });
      if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

      const routingRules = await RoutingRules.findOne({ userId });
      if (!routingRules) return res.status(404).json({ error: 'Routing rules not found' });

      // 1. Call Gemini AI to parse Narrative (or RegEx fallback if API key is blank)
      const parsed = await parseNarrative(rawNarrative);

      // 2. Core math sweep calculations under Section 44ADA
      const sweep = executeSweep(depositAmount, user.annualIncomeYTD, routingRules);

      // 3. Atomically update wallet state
      const updatedWallet = await Wallet.findOneAndUpdate(
        { userId },
        {
          $inc: {
            checkingBalance: sweep.checkingAdded,
            taxVaultBalance: sweep.taxWithheld,
            bufferBalance: sweep.bufferWithheld,
            annualIncomeYTD: depositAmount // Increments YTD in DB representation
          }
        },
        { new: true }
      );

      // 4. Record updated Routing rules in DB (updates the priority bills filled status)
      await RoutingRules.findOneAndUpdate({ userId }, { priorityBills: routingRules.priorityBills });

      // 5. Create Transaction entry
      const transaction = await Transaction.create({
        userId,
        rawNarrative,
        parsedSource: parsed.source,
        category: parsed.category,
        amount: depositAmount,
        date: new Date().toISOString(),
        routingBreakdown: {
          tax: sweep.taxWithheld,
          buffer: sweep.bufferWithheld,
          checking: sweep.checkingAdded,
          priorityBills: sweep.priorityBillsFilled
        },
        type: 'credit'
      });

      // 6. Refresh Consistency Score
      const allTxs = await Transaction.find({ userId });
      const scoreData = calculateConsistencyScore(allTxs, vaultDisciplinePenalties);
      await User.findByIdAndUpdate(userId, { 
        annualIncomeYTD: sweep.newAnnualIncomeYTD,
        consistencyScore: scoreData.score 
      });

      res.status(200).json({
        success: true,
        message: 'Deposit processed and auto-routed successfully.',
        transaction,
        sweep,
        wallet: updatedWallet,
        score: scoreData.score
      });
    } catch (err: any) {
      console.error('Webhook error', err);
      res.status(500).json({ error: 'Internal server processing error', message: err.message });
    }
  });

  /**
   * POST /api/routing/update
   * Configures user routing rules (splits, EMIs)
   */
  app.post('/api/routing/update', async (req, res) => {
    const { splits, priorityBills, dynamicTaxEnabled } = req.body;
    try {
      const userId = await getUserIdFromReq(req);

      const updatePayload: any = {};
      if (splits) updatePayload.splits = splits;
      if (priorityBills) updatePayload.priorityBills = priorityBills;
      if (dynamicTaxEnabled !== undefined) updatePayload.dynamicTaxEnabled = dynamicTaxEnabled;

      const updatedRules = await RoutingRules.findOneAndUpdate(
        { userId },
        updatePayload,
        { new: true }
      );

      res.json({ success: true, routingRules: updatedRules });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update routing rules', message: err.message });
    }
  });

  /**
   * POST /api/vaults/withdraw
   * Locked Tax Vault or Buffer Vault extraction (deducts consistency score for undisciplined behaviour)
   */
  app.post('/api/vaults/withdraw', async (req, res) => {
    const { vaultType, amount } = req.body;
    const withdrawAmount = Number(amount);

    if (!vaultType || isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return res.status(400).json({ error: 'Invalid vault type or withdrawal amount' });
    }

    try {
      const userId = await getUserIdFromReq(req);
      const wallet = await Wallet.findOne({ userId });
      if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

      let currentBalance = 0;
      if (vaultType === 'tax') {
        currentBalance = wallet.taxVaultBalance;
      } else if (vaultType === 'buffer') {
        currentBalance = wallet.bufferBalance;
      } else {
        return res.status(400).json({ error: 'Unsupported vault type for double-confirmation penalty withdrawal' });
      }

      if (withdrawAmount > currentBalance) {
        return res.status(400).json({ error: 'Insufficient funds inside selected vault' });
      }

      // Vault Discipline Breach! Apply score deduction penalty
      vaultDisciplinePenalties++;

      const walletUpdate: any = {};
      if (vaultType === 'tax') {
        walletUpdate.taxVaultBalance = wallet.taxVaultBalance - withdrawAmount;
        walletUpdate.checkingBalance = wallet.checkingBalance + withdrawAmount;
      } else {
        walletUpdate.bufferBalance = wallet.bufferBalance - withdrawAmount;
        walletUpdate.checkingBalance = wallet.checkingBalance + withdrawAmount;
      }

      const updatedWallet = await Wallet.findOneAndUpdate({ userId }, walletUpdate, { new: true });

      // Record transaction
      await Transaction.create({
        userId,
        rawNarrative: `EMERGENCY_VAULT_BREACH_${vaultType.toUpperCase()}`,
        parsedSource: `FlowState ${vaultType.charAt(0).toUpperCase() + vaultType.slice(1)} Vault`,
        category: 'Discipline Breach Withdrawal',
        amount: withdrawAmount,
        date: new Date().toISOString(),
        routingBreakdown: { tax: 0, buffer: 0, checking: 0, priorityBills: 0 },
        type: 'debit'
      });

      // Recalculate score
      const txs = await Transaction.find({ userId });
      const scoreData = calculateConsistencyScore(txs, vaultDisciplinePenalties);
      await User.findByIdAndUpdate(userId, { consistencyScore: scoreData.score });

      res.json({
        success: true,
        message: 'Withdrawal processed. Warning: Vault discipline breach has impacted your FlowState Consistency Score.',
        wallet: updatedWallet,
        penaltyCount: vaultDisciplinePenalties,
        newScore: scoreData.score
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to process vault withdrawal', message: err.message });
    }
  });

  /**
   * POST /api/vaults/create
   * Creates a custom savings target vault
   */
  app.post('/api/vaults/create', async (req, res) => {
    const { name, targetAmount } = req.body;
    if (!name || isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
      return res.status(400).json({ error: 'Invalid custom vault name or target amount' });
    }

    try {
      const userId = await getUserIdFromReq(req);
      const wallet = await Wallet.findOne({ userId });
      if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

      const updatedVaults = [...wallet.customVaults, { name, balance: 0, targetAmount: Number(targetAmount) }];
      const updatedWallet = await Wallet.findOneAndUpdate({ userId }, { customVaults: updatedVaults }, { new: true });

      res.json({ success: true, wallet: updatedWallet });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to create custom vault', message: err.message });
    }
  });

  /**
   * POST /api/vaults/fund
   * Manually transfer from Checking to a Custom savings vault
   */
  app.post('/api/vaults/fund', async (req, res) => {
    const { vaultName, amount } = req.body;
    const transferAmount = Number(amount);

    if (!vaultName || isNaN(transferAmount) || transferAmount <= 0) {
      return res.status(400).json({ error: 'Invalid vault name or transfer amount' });
    }

    try {
      const userId = await getUserIdFromReq(req);
      const wallet = await Wallet.findOne({ userId });
      if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

      if (wallet.checkingBalance < transferAmount) {
        return res.status(400).json({ error: 'Insufficient funds in Checking balance to fund vault' });
      }

      const idx = wallet.customVaults.findIndex(v => v.name === vaultName);
      if (idx === -1) return res.status(404).json({ error: 'Custom vault not found' });

      const updatedVaults = [...wallet.customVaults];
      updatedVaults[idx] = {
        ...updatedVaults[idx],
        balance: updatedVaults[idx].balance + transferAmount
      };

      const updatedWallet = await Wallet.findOneAndUpdate(
        { userId },
        {
          checkingBalance: wallet.checkingBalance - transferAmount,
          customVaults: updatedVaults
        },
        { new: true }
      );

      // Record transfer debit
      await Transaction.create({
        userId,
        rawNarrative: `VAULT_FUNDING_${vaultName.toUpperCase().replace(/\s+/g, '_')}`,
        parsedSource: `Savings Vault: ${vaultName}`,
        category: 'Vault Transfer',
        amount: transferAmount,
        date: new Date().toISOString(),
        routingBreakdown: { tax: 0, buffer: 0, checking: 0, priorityBills: 0 },
        type: 'debit'
      });

      res.json({ success: true, wallet: updatedWallet });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fund custom vault', message: err.message });
    }
  });

  // --- VITE INTERPRETATION & MIDDLEWARE ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FlowState full-stack server running securely on http://localhost:${PORT}`);
  });
}

startServer();
