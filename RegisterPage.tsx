/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sliders, ToggleLeft, ToggleRight, Plus, HelpCircle, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { IRoutingRules, IPriorityBill } from '../types.ts';

interface IRoutingRulesProps {
  routingRules: IRoutingRules | null;
  onUpdateRoutingRules: (splits: any, priorityBills: IPriorityBill[], dynamicTaxEnabled: boolean) => Promise<void>;
}

export default function RoutingRules({ routingRules, onUpdateRoutingRules }: IRoutingRulesProps) {
  const [showAddBill, setShowAddBill] = useState(false);
  const [billName, setBillName] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billDueDate, setBillDueDate] = useState('');

  // Local state edit copy
  const [taxSplit, setTaxSplit] = useState(routingRules?.splits?.tax || 15);
  const [bufferSplit, setBufferSplit] = useState(routingRules?.splits?.buffer || 10);
  const [checkingSplit, setCheckingSplit] = useState(routingRules?.splits?.checking || 75);

  if (!routingRules) return null;

  const handleToggleDynamicTax = async () => {
    const updatedEnabled = !routingRules.dynamicTaxEnabled;
    await onUpdateRoutingRules(routingRules.splits, routingRules.priorityBills, updatedEnabled);
  };

  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!billName || !billAmount || !billDueDate || isNaN(Number(billAmount))) return;
    
    const newBill: IPriorityBill = {
      name: billName,
      amount: Number(billAmount),
      dueDate: billDueDate,
      filledAmount: 0
    };

    const updatedBills = [...routingRules.priorityBills, newBill];
    await onUpdateRoutingRules(routingRules.splits, updatedBills, routingRules.dynamicTaxEnabled);
    
    setBillName('');
    setBillAmount('');
    setBillDueDate('');
    setShowAddBill(false);
  };

  const handleDeleteBill = async (idxToDelete: number) => {
    const updatedBills = routingRules.priorityBills.filter((_, idx) => idx !== idxToDelete);
    await onUpdateRoutingRules(routingRules.splits, updatedBills, routingRules.dynamicTaxEnabled);
  };

  const handleUpdateSplits = async () => {
    const sum = Number(taxSplit) + Number(bufferSplit) + Number(checkingSplit);
    if (sum !== 100) {
      alert(`Auto-Routing Splitting totals must equal exactly 100%. Current sum: ${sum}%`);
      return;
    }
    await onUpdateRoutingRules(
      { tax: Number(taxSplit), buffer: Number(bufferSplit), checking: Number(checkingSplit) },
      routingRules.priorityBills,
      routingRules.dynamicTaxEnabled
    );
    alert('Split allocations updated successfully!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Pillar 2: Dynamic Tax Control Panel */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Dynamic Tax Engine Toggle Card */}
        <div className="glassmorphism-card rounded-[2rem] p-8 border border-white/10 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-deep-purple/10 border border-deep-purple/30 flex items-center justify-center shrink-0">
                <Sliders size={22} className="text-purple-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">Dynamic Tax Scaling Engine</h3>
                <p className="text-xs text-gray-400 mt-0.5">Pillar 2 active monitoring</p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={handleToggleDynamicTax}
              className="focus:outline-none transition-colors duration-200"
            >
              {routingRules.dynamicTaxEnabled ? (
                <ToggleRight size={44} className="text-electric-green drop-shadow-[0_0_8px_rgba(0,255,204,0.3)]" />
              ) : (
                <ToggleLeft size={44} className="text-gray-600" />
              )}
            </button>
          </div>

          <div className="mt-5 p-4 rounded-xl bg-white/2 border border-white/5 space-y-3">
            <div className="flex items-start gap-2 text-xs text-gray-300">
              <span className="text-electric-green font-bold">✔</span>
              <p>Automatically tracks Indian Advance Tax thresholds (₹7,00,000 rebate limits).</p>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-300">
              <span className="text-electric-green font-bold">✔</span>
              <p>Dynamically scales withholding splits from 15% up to 25% if cumulative payouts cross thresholds.</p>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-300">
              <span className="text-purple-400 font-bold">✔</span>
              <p>Keeps you compliant with Chapter XVII-B TDS and Section 234B penalty provisions.</p>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4 leading-normal font-mono">
            State: {routingRules.dynamicTaxEnabled ? (
              <span className="text-electric-green font-bold">ACTIVE — AUTOMATIC SLAB SCALING</span>
            ) : (
              <span className="text-gray-400">INACTIVE — FIXED 15% BASELINE</span>
            )}
          </p>
        </div>

        {/* Split rules slider controls */}
        <div className="glassmorphism-card rounded-[2rem] p-8 border border-white/10">
          <h3 className="font-display font-bold text-base text-white mb-2">Configure Default Auto-Routing Splits</h3>
          <p className="text-xs text-gray-400 mb-6">Split allocations apply to deposits remaining after priority EMIs are satisfied</p>

          <div className="space-y-5">
            {/* Tax Split */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-gray-400">Locked Tax Vault withholding</span>
                <span className="text-purple-400 font-bold">{taxSplit}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={taxSplit}
                onChange={(e) => {
                  setTaxSplit(Number(e.target.value));
                  setCheckingSplit(100 - Number(e.target.value) - Number(bufferSplit));
                }}
                className="w-full accent-deep-purple bg-white/5"
              />
            </div>

            {/* Buffer Split */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-gray-400">Emergency Buffer split</span>
                <span className="text-soft-amber font-bold">{bufferSplit}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={bufferSplit}
                onChange={(e) => {
                  setBufferSplit(Number(e.target.value));
                  setCheckingSplit(100 - Number(taxSplit) - Number(e.target.value));
                }}
                className="w-full accent-soft-amber bg-white/5"
              />
            </div>

            {/* Checking Split */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-gray-400">Safe Spend Checking account (auto-calculated)</span>
                <span className="text-electric-green font-bold">{checkingSplit}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-lg overflow-hidden flex">
                <div className="bg-deep-purple h-full" style={{ width: `${taxSplit}%` }} />
                <div className="bg-soft-amber h-full" style={{ width: `${bufferSplit}%` }} />
                <div className="bg-electric-green h-full" style={{ width: `${checkingSplit}%` }} />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <p className="text-[10px] text-gray-500 font-mono">
                Formula: Tax ({taxSplit}%) + Buffer ({bufferSplit}%) + Spending ({checkingSplit}%) = <span className="text-white font-bold">100%</span>
              </p>
              <button
                onClick={handleUpdateSplits}
                className="bg-electric-green text-black font-display font-bold text-xs px-4 py-2 rounded-xl"
              >
                Save Split Rules
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pillar 1: Priority Bills (EMIs) Panel */}
      <div className="glassmorphism-card rounded-[2rem] p-8 border border-white/10 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base text-white">Priority Bills (EMIs)</h3>
            <button
              onClick={() => setShowAddBill(!showAddBill)}
              className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition"
            >
              <Plus size={14} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Specify mandatory liabilities (e.g., home loan, car loan EMI, GST pool). Income will prioritize filling these completely first.
          </p>

          {/* Add Bill Form */}
          {showAddBill && (
            <form onSubmit={handleAddBill} className="bg-black/40 border border-white/5 p-3 rounded-xl mb-6 space-y-3">
              <h4 className="text-[10px] font-display font-bold text-white uppercase tracking-wider">Configure Priority Liability</h4>
              <div className="space-y-2 text-xs">
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFC Car EMI"
                  value={billName}
                  onChange={(e) => setBillName(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded px-2.5 py-1.5 text-white focus:outline-none"
                />
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Liability amount (INR)"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded px-2.5 py-1.5 text-white focus:outline-none"
                />
                <input
                  type="date"
                  required
                  value={billDueDate}
                  onChange={(e) => setBillDueDate(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded px-2.5 py-1.5 text-white focus:outline-none"
                />
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddBill(false)}
                  className="text-[10px] text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-electric-green text-black font-display font-semibold text-[10px] px-3 py-1 rounded"
                >
                  Create
                </button>
              </div>
            </form>
          )}

          {/* Bills List */}
          <div className="space-y-3">
            {routingRules.priorityBills && routingRules.priorityBills.length > 0 ? (
              routingRules.priorityBills.map((bill, index) => {
                const isFilled = bill.filledAmount >= bill.amount;
                const pct = Math.min(100, Math.round((bill.filledAmount / bill.amount) * 100)) || 0;
                return (
                  <div key={index} className="bg-black/30 border border-white/5 rounded-xl p-3 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2 min-w-0">
                        {isFilled ? (
                          <CheckCircle2 size={14} className="text-electric-green shrink-0" />
                        ) : (
                          <Circle size={14} className="text-purple-400 shrink-0" />
                        )}
                        <span className="text-xs font-display font-medium text-white truncate">{bill.name}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteBill(index)}
                        className="text-[10px] text-gray-500 hover:text-red-400 shrink-0"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="mt-2.5">
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isFilled ? 'bg-electric-green' : 'bg-purple-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono mt-1.5">
                        <span className="text-gray-500">Due {bill.dueDate}</span>
                        <span className="text-gray-300 font-bold">
                          ₹{bill.filledAmount.toLocaleString('en-IN')} / ₹{bill.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 bg-black/20 rounded-xl border border-dashed border-white/5">
                <p className="text-xs text-gray-500 font-mono">No active liabilities configured.</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/5 pt-4 mt-6">
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 flex gap-2">
            <AlertCircle size={14} className="text-purple-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-purple-300 leading-normal">
              Priority Sweeps trigger automatically upon bank deposit alerts. Splitting operates in order of bill appearance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
