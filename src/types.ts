/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IUser {
  _id: string;
  email: string;
  subscriptionTier: 'freemium' | 'premium';
  annualIncomeYTD: number;
  consistencyScore: number;
  virtualAccountNumber?: string;
  virtualAccountIFSC?: string;
}

export interface ICustomVault {
  name: string;
  balance: number;
  targetAmount: number;
}

export interface IWallet {
  _id: string;
  userId: string;
  checkingBalance: number;
  taxVaultBalance: number;
  bufferBalance: number;
  customVaults: ICustomVault[];
}

export interface IRoutingBreakdown {
  tax: number;
  buffer: number;
  checking: number;
  priorityBills: number;
}

export interface ITransaction {
  _id: string;
  userId: string;
  rawNarrative: string;
  parsedSource: string;
  category: string;
  amount: number;
  date: string;
  routingBreakdown: IRoutingBreakdown;
  type: 'credit' | 'debit';
}

export interface IPriorityBill {
  name: string;
  amount: number;
  dueDate: string;
  filledAmount: number;
}

export interface ISplits {
  tax: number;
  buffer: number;
  checking: number;
}

export interface IRoutingRules {
  _id: string;
  userId: string;
  priorityBills: IPriorityBill[];
  dynamicTaxEnabled: boolean;
  splits: ISplits;
}

export interface IDashboardData {
  user: IUser;
  wallet: IWallet;
  routingRules: IRoutingRules;
  transactions: ITransaction[];
}
