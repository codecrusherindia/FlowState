/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, Unlock, ShieldAlert, PiggyBank, Plus, TrendingUp, AlertOctagon, HelpCircle, ArrowRight } from 'lucide-react';
import { IWallet } from '../types.ts';

interface IVaultsProps {
  wallet: IWallet | null;
  onWithdrawVault: (vaultType: string, amount: number) => Promise<boolean>;
  onCreateCustomVault: (name: string, targetAmount: number) => Promise<void>;
  onFundCustomVault: (vaultName: string, amount: number) => Promise<void>;
}

export default function Vaults({
  wallet,
  onWithdrawVault,
  onCreateCustomVault,
  onFundCustomVault,
}: IVaultsProps) {
  // States for locked double-confirmation modal
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawType, setWithdrawType] = useState<'tax' | 'buffer' | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [confirmStep, setConfirmStep] = useState(1); // Double confirmation: Step 1 = warning, Step 2 = penalty commitment
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // States for custom vault creations
  const [showCreateVault, setShowCreateVault] = useState(false);
  const [newVaultName, setNewVaultName] = useState('');
  const [newVaultTarget, setNewVaultTarget] = useState('');

  // States for manual vault funding transfers
  const [showFundVault, setShowFundVault] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState('');

  if (!wallet) return null;

  const handleOpenWithdraw = (type: 'tax' | 'buffer') => {
    setWithdrawType(type);
    setShowWithdrawModal(true);
    setConfirmStep(1);
    setWithdrawAmount('');
  };

  const handleExecuteWithdraw = async () => {
    if (!withdrawType || !withdrawAmount || isNaN(Number(withdrawAmount))) return;
    const amountNum = Number(withdrawAmount);
    
    if (confirmStep === 1) {
      setConfirmStep(2);
      return;
    }

    setIsWithdrawing(true);
    const success = await onWithdrawVault(withdrawType, amountNum);
    setIsWithdrawing(false);
    
    if (success) {
      setShowWithdrawModal(false);
      setConfirmStep(1);
      setWithdrawAmount('');
    }
  };

  const handleCreateVault = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVaultName || !newVaultTarget || isNaN(Number(newVaultTarget))) return;
    await onCreateCustomVault(newVaultName, Number(newVaultTarget));
    setNewVaultName('');
    setNewVaultTarget('');
    setShowCreateVault(false);
  };

  const handleFundVault = async (vaultName: string) => {
    if (!fundAmount || isNaN(Number(fundAmount))) return;
    await onFundCustomVault(vaultName, Number(fundAmount));
    setFundAmount('');
    setShowFundVault(null);
  };

  return (
    <div className="space-y-8">
      {/* Dynamic Vault grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Protected Tax Locker (Dynamic Slab) */}
        <div className="glassmorphism-card rounded-[2rem] p-8 border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-deep-purple/10 rounded-full blur-2xl" />
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-deep-purple/20 flex items-center justify-center border border-deep-purple/40">
                <Lock size={20} className="text-purple-400" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-white">Locked Tax Vault</h3>
                <p className="text-xs text-gray-400 font-mono">Secured for Indian Advance Tax</p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-deep-purple/20 text-purple-300 border border-deep-purple/30 px-2 py-0.5 rounded">
              Locked Slab
            </span>
          </div>

          <div className="mb-6">
            <p className="text-xs text-gray-400 font-mono">Current Locker Balance</p>
            <h1 className="text-4xl font-display font-bold text-white text-glow-purple mt-1.5 font-mono">
              ₹{wallet.taxVaultBalance.toLocaleString('en-IN')}
            </h1>
          </div>

          <p className="text-xs text-gray-500 mb-5 leading-relaxed">
            Funds locked to satisfy quarterly advance tax installments. Withdrawing early results in automatic discipline penalties docking your Cashflow Consistency Score.
          </p>

          <button
            onClick={() => handleOpenWithdraw('tax')}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-deep-purple to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-display font-medium text-xs px-4 py-3 rounded-xl transition duration-200"
          >
            Unlock & Break Vault
          </button>
        </div>

        {/* Protected Emergency Buffer */}
        <div className="glassmorphism-card rounded-[2rem] p-8 border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-soft-amber/10 rounded-full blur-2xl" />
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-soft-amber/20 flex items-center justify-center border border-soft-amber/40">
                <PiggyBank size={20} className="text-soft-amber" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-white">Emergency Buffer Vault</h3>
                <p className="text-xs text-gray-400 font-mono">10% Automated Ingestion</p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-soft-amber/20 text-soft-amber border border-soft-amber/30 px-2 py-0.5 rounded">
              Buffer Split
            </span>
          </div>

          <div className="mb-6">
            <p className="text-xs text-gray-400 font-mono">Current Locker Balance</p>
            <h1 className="text-4xl font-display font-bold text-white mt-1.5 font-mono">
              ₹{wallet.bufferBalance.toLocaleString('en-IN')}
            </h1>
          </div>

          <p className="text-xs text-gray-500 mb-5 leading-relaxed">
            Reserved for periods of lean payout frequencies or general personal medical emergencies. Try to maintain at least 3 months of basic living standards here.
          </p>

          <button
            onClick={() => handleOpenWithdraw('buffer')}
            className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-display font-medium text-xs px-4 py-3 rounded-xl transition duration-200"
          >
            Emergency Withdrawal
          </button>
        </div>
      </div>

      {/* Custom Savings Lockers (Pillar 1/2) */}
      <div className="glassmorphism-card rounded-[2rem] p-8 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display font-semibold text-base text-white">Custom Goal Savings Lockers</h3>
            <p className="text-xs text-gray-400 mt-0.5">Define custom targets and fund them manually from checking</p>
          </div>
          <button
            onClick={() => setShowCreateVault(!showCreateVault)}
            className="flex items-center gap-1.5 bg-electric-green/15 text-electric-green hover:bg-electric-green/25 font-display font-medium text-xs px-3.5 py-2 rounded-xl border border-electric-green/20 transition duration-200"
          >
            <Plus size={14} /> Create Goal Locker
          </button>
        </div>

        {/* Custom Vault Form */}
        {showCreateVault && (
          <form onSubmit={handleCreateVault} className="bg-black/40 border border-white/5 p-4 rounded-xl mb-6 space-y-4 max-w-md">
            <h4 className="text-xs font-display font-bold text-white uppercase tracking-wider">Configure Savings Goal</h4>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GST Q3 Liability, New iPad Pro"
                  value={newVaultName}
                  onChange={(e) => setNewVaultName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-electric-green"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Target Amount (INR)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 50000"
                  value={newVaultTarget}
                  onChange={(e) => setNewVaultTarget(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-electric-green"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowCreateVault(false)}
                className="text-xs text-gray-400 hover:text-white px-3 py-1.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-electric-green text-black font-display font-semibold text-xs px-4 py-1.5 rounded-lg"
              >
                Launch Locker
              </button>
            </div>
          </form>
        )}

        {/* Custom Vaults display */}
        {wallet.customVaults && wallet.customVaults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wallet.customVaults.map((vault) => {
              const pct = Math.min(100, Math.round((vault.balance / vault.targetAmount) * 100)) || 0;
              return (
                <div key={vault.name} className="bg-black/30 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-display font-medium text-sm text-white truncate mr-2">{vault.name}</h4>
                      <span className="text-[10px] font-mono text-gray-400 font-bold">{pct}%</span>
                    </div>
                    {/* Goal Progress Bar */}
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-gradient-to-r from-deep-purple to-electric-green rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between font-mono text-xs mb-4">
                      <div>
                        <p className="text-[9px] text-gray-500 uppercase">Saved</p>
                        <p className="font-bold text-gray-300">₹{vault.balance.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-gray-500 uppercase">Target</p>
                        <p className="font-bold text-gray-300">₹{vault.targetAmount.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Fund Form toggler */}
                  {showFundVault === vault.name ? (
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Amount"
                          value={fundAmount}
                          onChange={(e) => setFundAmount(e.target.value)}
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                        />
                        <button
                          onClick={() => handleFundVault(vault.name)}
                          className="bg-electric-green text-black font-display font-bold text-xs px-3 rounded-lg"
                        >
                          Send
                        </button>
                      </div>
                      <button
                        onClick={() => setShowFundVault(null)}
                        className="text-[10px] text-gray-500 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setShowFundVault(vault.name);
                        setFundAmount('');
                      }}
                      className="w-full bg-white/3 border border-white/5 hover:bg-white/8 text-center py-2 rounded-lg font-display font-medium text-xs text-white transition"
                    >
                      Fund from Checking
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-black/20 rounded-xl border border-dashed border-white/5">
            <p className="text-xs text-gray-500 font-mono">No custom goal savings vaults defined yet.</p>
          </div>
        )}
      </div>

      {/* Double Confirmation Modal for Locked Withdrawals */}
      {showWithdrawModal && withdrawType && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glassmorphism rounded-2xl border border-red-500/30 max-w-md w-full p-6 relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-red-500/10 rounded-full blur-2xl" />
            
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <AlertOctagon size={28} className="animate-pulse" />
              <h3 className="font-display font-bold text-lg text-white">Protected Vault Extraction</h3>
            </div>

            {confirmStep === 1 ? (
              // Step 1: Warning and Amount Input
              <div className="space-y-4">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-200 leading-relaxed">
                  <span className="font-bold">CAUTION:</span> Withdrawing from the{' '}
                  <span className="font-bold text-white uppercase">{withdrawType} vault</span> triggers an immediate{' '}
                  <span className="font-bold underline text-white">Vault Discipline Penalty</span>. This reflects on your banking profile and docks your FlowState Consistency Score by up to <span className="font-bold text-white">60 points</span>, impacting potential loans.
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                    Amount to Extract (Max: ₹
                    {(withdrawType === 'tax' ? wallet.taxVaultBalance : wallet.bufferBalance).toLocaleString('en-IN')}
                    )
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => setShowWithdrawModal(false)}
                    className="text-xs text-gray-400 hover:text-white px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > (withdrawType === 'tax' ? wallet.taxVaultBalance : wallet.bufferBalance)}
                    onClick={() => setConfirmStep(2)}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-display font-bold text-xs px-5 py-2 rounded-xl transition"
                  >
                    Assess Score Impact
                  </button>
                </div>
              </div>
            ) : (
              // Step 2: Confirmation
              <div className="space-y-4">
                <div className="p-4 bg-black/60 border border-red-500/40 rounded-xl">
                  <p className="text-[10px] font-mono text-red-400 uppercase font-bold tracking-wider">Simulated Impact Report</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Withdrawal amount: <span className="text-white font-bold font-mono">₹{Number(withdrawAmount).toLocaleString('en-IN')}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Vault Discipline Score: <span className="text-red-400 font-bold font-mono">Deduction -60 pts</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Loan Eligibility status: <span className="text-orange-400 font-bold font-mono">Rating downgrades</span>
                  </p>
                </div>
                <p className="text-xs text-gray-300 leading-normal">
                  Are you absolutely certain you want to bypass the FlowState safety locks? This action is tracked by the smart ledger.
                </p>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => setConfirmStep(1)}
                    className="text-xs text-gray-400 hover:text-white px-4 py-2"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={handleExecuteWithdraw}
                    disabled={isWithdrawing}
                    className="bg-red-600 hover:bg-red-700 text-white font-display font-extrabold text-xs px-6 py-2 rounded-xl flex items-center gap-1.5"
                  >
                    {isWithdrawing ? 'Withdrawing...' : 'Execute & Accept Penalty'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
