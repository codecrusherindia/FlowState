/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Shield, Landmark, Sparkles, Send, Play, Clipboard, HelpCircle } from 'lucide-react';
import { IWallet, ITransaction, IUser } from '../types.ts';
import SweepVisualizer from './SweepVisualizer.tsx';

interface IDashboardProps {
  user: IUser | null;
  wallet: IWallet | null;
  transactions: ITransaction[];
  onSimulateDeposit: (amount: number, rawNarrative: string) => Promise<void>;
  onSetActiveTab?: (tab: string) => void;
}

export default function Dashboard({ user, wallet, transactions, onSimulateDeposit, onSetActiveTab }: IDashboardProps) {
  // Webhook Simulator States
  const [customAmount, setCustomAmount] = useState('30000');
  const [customNarrative, setCustomNarrative] = useState('NEFT/INB/UPWRK/09384/PAYOUT');
  const [isSimulating, setIsSimulating] = useState(false);

  const bankTemplates = [
    { label: 'Upwork Invoice Payout', amount: '45000', narrative: 'NEFT/INB/UPWRK/09384/PAYOUT' },
    { label: 'Swiggy Delivery Batch Payout', amount: '3500', narrative: 'UPI/SWIGGY-DELIVERY/8493021/REP' },
    { label: 'YouTube Partner AdSense Earnings', amount: '22000', narrative: 'NEFT/YOUTUBE-PARTNERS/98430/GOOGLE' },
    { label: 'Kreator Sponsorship Payout', amount: '12000', narrative: 'UPI/KREATOR/INFLUENCER/SPONSOR' },
    { label: 'Direct Client Fiverr Milestone', amount: '15000', narrative: 'IMPS/FIVERR-TRANSFER/MILESTONE-03' },
  ];

  const handleApplyTemplate = (amount: string, narrative: string) => {
    setCustomAmount(amount);
    setCustomNarrative(narrative);
  };

  const handleSubmitSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAmount || !customNarrative || isNaN(Number(customAmount))) return;
    setIsSimulating(true);
    await onSimulateDeposit(Number(customAmount), customNarrative);
    setIsSimulating(false);
  };

  if (!wallet) return null;

  // Last credit transaction for the Sweep Visualizer
  const creditTransactions = transactions.filter(t => t.type === 'credit');
  const lastCreditTx = creditTransactions.length > 0 ? creditTransactions[0] : null;

  // Determine onboarding checklist completion
  const hasConfiguredSplits = transactions.length > 0;
  const hasSimulatedDeposit = transactions.length > 0;
  
  // Calculate progress percentage
  let progressCount = 2; // Registration & Provisioning are automatically done on register
  if (hasConfiguredSplits) progressCount += 1;
  if (hasSimulatedDeposit) progressCount += 1;
  const progressPercent = (progressCount / 4) * 100;

  return (
    <div className="space-y-8">
      {/* Onboarding Checklist Banner */}
      <div className="relative p-6 rounded-[2rem] bg-gradient-to-r from-deep-purple/10 via-white/2 to-electric-green/5 border border-white/10 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-electric-green/5 blur-3xl rounded-full" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-electric-green/10 text-electric-green text-[10px] font-mono px-2 py-0.5 rounded border border-electric-green/20">
                GIG CO-PILOT CONFIGURATION
              </span>
              <span className="text-[11px] text-gray-400 font-mono">
                {progressCount} of 4 Setup Steps Finished ({progressPercent}%)
              </span>
            </div>
            <h3 className="font-display font-bold text-white text-base">
              Establish Your Autonomous Financial Flow
            </h3>
            
            {/* Horizontal Onboarding Stepper Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="flex items-start gap-2 text-xs font-mono">
                <span className="text-electric-green font-bold shrink-0">✓</span>
                <div>
                  <span className="text-white font-semibold">1. Account Active</span>
                  <p className="text-[10px] text-gray-500">YESB BaaS Ready</p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs font-mono">
                <span className="text-electric-green font-bold shrink-0">✓</span>
                <div>
                  <span className="text-white font-semibold">2. Contract Link</span>
                  <p className="text-[10px] text-gray-500">Routing details live</p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs font-mono">
                {hasConfiguredSplits ? (
                  <span className="text-electric-green font-bold shrink-0">✓</span>
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full border border-gray-600 shrink-0 mt-1" />
                )}
                <div>
                  <span className={hasConfiguredSplits ? "text-white font-semibold" : "text-gray-400"}>
                    3. Configure Splits
                  </span>
                  {onSetActiveTab && !hasConfiguredSplits ? (
                    <button 
                      onClick={() => onSetActiveTab('routing')}
                      className="text-[10px] text-electric-green hover:underline block text-left cursor-pointer"
                    >
                      Define auto-sweeps →
                    </button>
                  ) : (
                    <p className="text-[10px] text-gray-500">Sec 44ADA active</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs font-mono">
                {hasSimulatedDeposit ? (
                  <span className="text-electric-green font-bold shrink-0">✓</span>
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full border border-gray-600 shrink-0 mt-1" />
                )}
                <div>
                  <span className={hasSimulatedDeposit ? "text-white font-semibold" : "text-gray-400"}>
                    4. Simulated Sweep
                  </span>
                  {!hasSimulatedDeposit ? (
                    <p className="text-[10px] text-gray-500">Run sandbox deposit below</p>
                  ) : (
                    <p className="text-[10px] text-gray-500">Verified & logged</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-2 justify-end shrink-0">
            {onSetActiveTab && (
              <button
                onClick={() => onSetActiveTab('guide')}
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition font-sans"
              >
                <HelpCircle size={14} className="text-gray-400" />
                View User Handbook
              </button>
            )}
            <button
              onClick={() => {
                const button = document.querySelector('button[class*="fixed bottom-6"]');
                if (button) (button as HTMLElement).click();
              }}
              className="bg-electric-green/10 border border-electric-green/20 hover:bg-electric-green/20 text-electric-green font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition font-sans"
            >
              <Sparkles size={14} className="animate-pulse" />
              Launch Live Tour
            </button>
          </div>
        </div>
        
        {/* Animated Progress Bar underlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
          <div 
            className="h-full bg-gradient-to-r from-deep-purple to-electric-green transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Balances Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main safe-to-spend card */}
        <div className="lg:col-span-2 glassmorphism-card rounded-[2rem] p-8 border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-electric-green to-transparent opacity-60" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-electric-green/5 rounded-full blur-3xl" />
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-gray-400 font-mono tracking-wider uppercase">Safe-To-Spend checking</p>
              <h1 className="text-5xl font-display font-extrabold text-white text-glow-green mt-2 font-mono">
                ₹{wallet.checkingBalance.toLocaleString('en-IN')}
              </h1>
            </div>
            <div className="p-3 rounded-xl bg-electric-green/10 border border-electric-green/20">
              <Landmark size={22} className="text-electric-green" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-gray-400 mt-6 pt-5 border-t border-white/5">
            {user?.virtualAccountNumber ? (
              <>
                <div>
                  <span className="text-gray-500">Virtual Bank Account (YESB):</span> <strong className="text-white selection:bg-electric-green selection:text-black">{user.virtualAccountNumber}</strong>
                </div>
                <div>
                  <span className="text-gray-500">IFSC:</span> <strong className="text-white selection:bg-electric-green selection:text-black">{user.virtualAccountIFSC || 'DECN0000001'}</strong>
                </div>
              </>
            ) : (
              <div>
                <span className="text-gray-500">Connected Bank:</span> ICICI Savings **4092
              </div>
            )}
            <div>
              <span className="text-gray-500">Aggregator ID:</span> {user?.email || 'guest@flowstate'}
            </div>
            <div className="text-electric-green flex items-center gap-1 font-bold ml-auto">
              <span className="h-2 w-2 rounded-full bg-electric-green animate-pulse" />
              LIVE LEDGER CONNECTED
            </div>
          </div>
        </div>

        {/* Locked values overview card */}
        <div className="glassmorphism-card rounded-[2rem] p-8 border border-white/10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-deep-purple/5 rounded-full blur-2xl" />
          
          <div className="space-y-4">
            {/* Tax vault mini summary */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] text-gray-500 font-mono uppercase">Tax Reserve</p>
                <p className="font-mono text-base font-bold text-white mt-0.5">
                  ₹{wallet.taxVaultBalance.toLocaleString('en-IN')}
                </p>
              </div>
              <span className="text-[10px] bg-deep-purple/20 text-purple-300 border border-deep-purple/30 px-2 py-0.5 rounded font-mono">
                Locked Slab
              </span>
            </div>

            {/* Emergency buffer mini summary */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] text-gray-500 font-mono uppercase">Emergency Buffer</p>
                <p className="font-mono text-base font-bold text-white mt-0.5">
                  ₹{wallet.bufferBalance.toLocaleString('en-IN')}
                </p>
              </div>
              <span className="text-[10px] bg-soft-amber/10 text-soft-amber border border-soft-amber/20 px-2 py-0.5 rounded font-mono">
                10% Rule
              </span>
            </div>

            {/* Custom goal goals count */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] text-gray-500 font-mono uppercase">Goal Lockers</p>
                <p className="font-mono text-base font-bold text-white mt-0.5">
                  {wallet.customVaults ? wallet.customVaults.length : 0} Targets Active
                </p>
              </div>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">
                Savings
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 text-[10px] text-gray-400 font-mono flex items-center gap-1.5">
            <Shield size={12} className="text-purple-400" />
            Total Locked Reserves: ₹{(wallet.taxVaultBalance + wallet.bufferBalance).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Sweep visualizer row */}
      <SweepVisualizer lastTransaction={lastCreditTx} />

      {/* Ingestion Webhook Simulator */}
      <div className="glassmorphism-card rounded-[2rem] p-8 border border-white/10">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-electric-green/15 flex items-center justify-center border border-electric-green/20">
            <Sparkles size={16} className="text-electric-green" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-base text-white">Ingestion Webhook Simulator</h3>
            <p className="text-xs text-gray-400 mt-0.5">Simulate India Account Aggregator (AA) real-time deposit webhook</p>
          </div>
        </div>

        {/* Template Selectors */}
        <div className="flex flex-wrap gap-2 mb-6 pt-3">
          {bankTemplates.map((template, index) => (
            <button
              key={index}
              onClick={() => handleApplyTemplate(template.amount, template.narrative)}
              className="text-[10px] font-mono border border-white/5 bg-white/2 hover:bg-white/8 hover:border-white/10 text-gray-300 px-3 py-2 rounded-lg flex items-center gap-1.5 transition"
            >
              <Clipboard size={10} className="text-gray-400" />
              {template.label} (₹{Number(template.amount).toLocaleString('en-IN')})
            </button>
          ))}
        </div>

        {/* Simulation Submission Form */}
        <form onSubmit={handleSubmitSimulation} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-black/40 border border-white/5 p-4 rounded-xl">
          <div className="md:col-span-2 space-y-2">
            <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Unstructured Bank Transaction SMS Receipt Narrative</label>
            <input
              type="text"
              required
              placeholder="e.g. NEFT/INB/UPWRK/09384/PAYOUT/JULY"
              value={customNarrative}
              onChange={(e) => setCustomNarrative(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-electric-green"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Deposit Amount (INR)</label>
            <div className="flex gap-2">
              <input
                type="number"
                required
                min="100"
                placeholder="e.g. 30000"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-electric-green"
              />
              <button
                type="submit"
                disabled={isSimulating}
                className="shrink-0 bg-gradient-to-r from-electric-green to-emerald-400 hover:from-emerald-400 hover:to-emerald-500 text-black font-display font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <Play size={12} className="fill-black" />
                {isSimulating ? 'AI parsing...' : 'Trigger'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Transactions Ledger */}
      <div className="glassmorphism-card rounded-[2rem] border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div>
            <h3 className="font-display font-semibold text-base text-white">Recent Transactions Ledger</h3>
            <p className="text-xs text-gray-400 mt-0.5">Real-time parsed banking narrative events log</p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/2 text-gray-400 font-mono uppercase tracking-wider text-[10px]">
                <th className="p-4">Transaction Source</th>
                <th className="p-4">Raw Narrative</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Type</th>
                <th className="p-4">Auto-Routing Breakdown</th>
                <th className="p-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {transactions && transactions.length > 0 ? (
                transactions.map((tx) => {
                  const isCredit = tx.type === 'credit';
                  const dateFormatted = new Date(tx.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={tx._id} className="hover:bg-white/1 transition duration-150">
                      {/* Parsed Source & Category */}
                      <td className="p-4 font-display">
                        <div className="font-semibold text-white truncate max-w-[160px]">
                          {tx.parsedSource}
                        </div>
                        <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-full inline-block mt-1 font-mono">
                          {tx.category}
                        </span>
                      </td>

                      {/* Raw narrative */}
                      <td className="p-4 font-mono text-gray-400 truncate max-w-[180px]">
                        {tx.rawNarrative}
                      </td>

                      {/* Amount */}
                      <td className="p-4 font-mono font-bold text-white">
                        ₹{tx.amount.toLocaleString('en-IN')}
                      </td>

                      {/* Type Badge */}
                      <td className="p-4">
                        {isCredit ? (
                          <span className="bg-electric-green/10 text-electric-green border border-electric-green/20 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider">
                            INCOME
                          </span>
                        ) : (
                          <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider">
                            DEBIT
                          </span>
                        )}
                      </td>

                      {/* Split details breakdown */}
                      <td className="p-4 font-mono text-gray-400">
                        {isCredit ? (
                          <div className="flex gap-2 flex-wrap text-[10px]">
                            <span className="text-purple-300">Tax: ₹{tx.routingBreakdown.tax.toLocaleString('en-IN')}</span>
                            <span className="text-amber-300">Buf: ₹{tx.routingBreakdown.buffer.toLocaleString('en-IN')}</span>
                            {tx.routingBreakdown.priorityBills > 0 && (
                              <span className="text-purple-300">EMI: ₹{tx.routingBreakdown.priorityBills.toLocaleString('en-IN')}</span>
                            )}
                            <span className="text-electric-green">Spend: ₹{tx.routingBreakdown.checking.toLocaleString('en-IN')}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-500">Vault Withdrawal / Outward Transfer</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="p-4 text-right text-gray-400 font-mono whitespace-nowrap">
                        {dateFormatted}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500 font-mono">
                    No transactions captured in current ledger.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
