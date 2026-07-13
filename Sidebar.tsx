/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IWallet, IRoutingRules, ITransaction, IUser } from '../types.ts';

interface ISweepResult {
  taxWithheld: number;
  bufferWithheld: number;
  priorityBillsFilled: number;
  checkingAdded: number;
  taxRateUsed: number;
  billsAllocation: Array<{ name: string; amountAdded: number }>;
  newAnnualIncomeYTD: number;
}

/**
 * Pillar 2: Dynamic Tax Engine (Indian Income Tax Section 44ADA compliance)
 * Section 44ADA allows presumptive taxation where only 50% of gross receipts are deemed as taxable income.
 * Checks the ₹7 Lakh annual rebate threshold (Section 87A limit) on presumptive income.
 * Bumps the presumptive tax withholding rate from 15% to 25% of the taxable portion if total presumptive income >= ₹7,00,000.
 */
export function calculateDynamicTaxRate(currentYTD: number, incomingAmount: number, dynamicEnabled: boolean): { taxRateUsedOnTaxablePortion: number; effectiveGrossTaxRate: number; presumptiveIncomeYTD: number } {
  const presumptiveIncoming = incomingAmount * 0.5;
  const presumptiveYTD = (currentYTD + incomingAmount) * 0.5;

  if (!dynamicEnabled) {
    return {
      taxRateUsedOnTaxablePortion: 15,
      effectiveGrossTaxRate: 15, // Non-compliant fallback / flat 15%
      presumptiveIncomeYTD: presumptiveYTD,
    };
  }

  // Under Section 44ADA, if presumptive taxable income (50% of YTD) is ₹7 Lakh or more,
  // we bump the tax withholding rate to 25% of the taxable portion (12.5% effective on gross)
  // to avoid Section 234B/C interest penalties.
  if (presumptiveYTD >= 700000) {
    return {
      taxRateUsedOnTaxablePortion: 25,
      effectiveGrossTaxRate: 12.5, // 25% of 50% of gross
      presumptiveIncomeYTD: presumptiveYTD,
    };
  }

  return {
    taxRateUsedOnTaxablePortion: 15,
    effectiveGrossTaxRate: 7.5, // 15% of 50% of gross
    presumptiveIncomeYTD: presumptiveYTD,
  };
}

/**
 * Pillar 1: Smart Auto-Routing with Priority Bill Filling and 44ADA compliant sweep
 * Split the deposit, then fund due priority bills first.
 */
export function executeSweep(
  depositAmount: number,
  userYTD: number,
  routingRules: IRoutingRules
): ISweepResult {
  const taxInfo = calculateDynamicTaxRate(userYTD, depositAmount, routingRules.dynamicTaxEnabled);
  const bufferRate = routingRules.splits.buffer; // e.g. 10%
  
  // 1. Calculate Core Withholdings based on 44ADA presumptive taxation
  const taxWithheld = Math.round(depositAmount * (taxInfo.effectiveGrossTaxRate / 100));
  const bufferWithheld = Math.round(depositAmount * (bufferRate / 100));
  
  // Remaining amount that would normally go to general Checking
  let checkingRemaining = depositAmount - taxWithheld - bufferWithheld;
  
  // 2. Fund Pending Priority Bills First (Pillar 1)
  let priorityBillsFilled = 0;
  const billsAllocation: Array<{ name: string; amountAdded: number }> = [];
  
  // Clone priority bills to work on them
  const updatedBills = routingRules.priorityBills.map(b => ({ ...b }));
  
  for (const bill of updatedBills) {
    const pendingAmount = bill.amount - bill.filledAmount;
    if (pendingAmount > 0 && checkingRemaining > 0) {
      const allocate = Math.min(pendingAmount, checkingRemaining);
      bill.filledAmount += allocate;
      checkingRemaining -= allocate;
      priorityBillsFilled += allocate;
      
      billsAllocation.push({
        name: bill.name,
        amountAdded: allocate
      });
    }
  }
  
  // Update the original routingRules object references so the caller can save them
  routingRules.priorityBills = updatedBills;

  return {
    taxWithheld,
    bufferWithheld,
    priorityBillsFilled,
    checkingAdded: checkingRemaining,
    taxRateUsed: taxInfo.effectiveGrossTaxRate, // Expose the effective rate on gross for display
    billsAllocation,
    newAnnualIncomeYTD: userYTD + depositAmount
  };
}

/**
 * Pillar 3: Cashflow Consistency Score Algorithm
 * Calculates a FICO-like credit score out of 900 based on Indian gig metrics.
 */
export function calculateConsistencyScore(
  transactions: ITransaction[],
  vaultDisciplinePenalties: number = 0
): {
  score: number;
  depositFrequencyScore: number;
  diversificationScore: number;
  disciplineScore: number;
} {
  const creditTx = transactions.filter(t => t.type === 'credit');
  
  // A. Deposit Predictability & Frequency (Max 300)
  let depositFrequencyScore = 150; // Default baseline
  if (creditTx.length >= 2) {
    // Calculate average days between deposits
    const dates = creditTx.map(t => new Date(t.date).getTime()).sort((a, b) => a - b);
    let totalDiffDays = 0;
    for (let i = 1; i < dates.length; i++) {
      totalDiffDays += (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
    }
    const avgDaysBetween = totalDiffDays / (dates.length - 1);
    
    if (avgDaysBetween <= 5) {
      depositFrequencyScore = 300;
    } else if (avgDaysBetween <= 10) {
      depositFrequencyScore = 270;
    } else if (avgDaysBetween <= 15) {
      depositFrequencyScore = 230;
    } else if (avgDaysBetween <= 30) {
      depositFrequencyScore = 190;
    } else {
      depositFrequencyScore = 140;
    }
  } else if (creditTx.length === 1) {
    depositFrequencyScore = 180;
  }

  // B. Client Diversification / Revenue Stability (Max 300)
  let diversificationScore = 150; // Default baseline
  const uniqueSources = new Set(creditTx.map(t => t.parsedSource.toLowerCase()));
  const clientCount = uniqueSources.size;
  
  if (clientCount >= 4) {
    diversificationScore = 300;
  } else if (clientCount === 3) {
    diversificationScore = 280;
  } else if (clientCount === 2) {
    diversificationScore = 220;
  } else if (clientCount === 1) {
    diversificationScore = 160;
  }

  // C. Vault Discipline / Lock Retention (Max 300)
  // Deduct 50 points per tax-vault early withdrawal penalty
  let disciplineScore = Math.max(100, 300 - (vaultDisciplinePenalties * 60));

  // If there are no credits and discipline is perfect, don't let it look maxed out artificially
  if (creditTx.length === 0) {
    depositFrequencyScore = 100;
    diversificationScore = 100;
  }

  const score = Math.round(depositFrequencyScore + diversificationScore + disciplineScore);
  
  return {
    score: Math.min(900, Math.max(300, score)),
    depositFrequencyScore,
    diversificationScore,
    disciplineScore
  };
}
