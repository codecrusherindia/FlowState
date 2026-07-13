/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDownRight, ArrowDownLeft, ArrowDown, Sparkles, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { ITransaction } from '../types.ts';

interface ISweepVisualizerProps {
  lastTransaction: ITransaction | null;
}

export default function SweepVisualizer({ lastTransaction }: ISweepVisualizerProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (lastTransaction) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastTransaction]);

  if (!lastTransaction) {
    return (
      <div className="glassmorphism-card rounded-[2rem] p-8 border border-white/10 flex flex-col items-center justify-center text-center min-h-[300px]">
        <AlertCircle size={32} className="text-gray-500 mb-2" />
        <p className="text-sm text-gray-400 font-display">No incoming deposits simulated yet.</p>
        <p className="text-xs text-gray-500 mt-1 max-w-xs">
          Trigger a bank deposit simulation using the tool below to watch the FlowState Auto-Sweep animation.
        </p>
      </div>
    );
  }

  const { amount, parsedSource, category, routingBreakdown, rawNarrative } = lastTransaction;
  const taxAmount = routingBreakdown.tax;
  const bufferAmount = routingBreakdown.buffer;
  const billsAmount = routingBreakdown.priorityBills;
  const checkingAmount = routingBreakdown.checking;

  // Calculate actual percentages for visualization
  const taxPct = Math.round((taxAmount / amount) * 100) || 15;
  const bufferPct = Math.round((bufferAmount / amount) * 100) || 10;
  const billsPct = Math.round((billsAmount / amount) * 100) || 0;
  const checkingPct = Math.round((checkingAmount / amount) * 100) || 75;

  return (
    <div className="glassmorphism-card rounded-[2rem] p-8 border border-white/10 overflow-hidden relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-semibold text-base text-white flex items-center gap-2">
            The FlowState Sweep Visualizer
            {isAnimating && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-green"></span>
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Watch how incoming raw UPI/NEFT amounts are instantly split.
          </p>
        </div>
        <div className="bg-electric-green/10 text-electric-green px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 uppercase">
          <Sparkles size={10} className="animate-spin" />
          Active AI Sweep
        </div>
      </div>

      {/* Narrative Card */}
      <div className="bg-black/30 border border-white/5 rounded-xl p-3 mb-8 flex items-center justify-between">
        <div className="min-w-0 flex-1 mr-3">
          <p className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">Messy Bank Narrative Received</p>
          <p className="text-xs font-mono text-gray-300 truncate mt-0.5">{rawNarrative}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] text-gray-400 font-mono">Amount</p>
          <p className="text-sm font-mono font-bold text-electric-green text-glow-green">₹{amount.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="flex flex-col items-center relative py-4">
        {/* Source Node */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="z-10 bg-gradient-to-r from-electric-green/10 to-deep-purple/10 border border-white/20 rounded-2xl p-4 text-center shadow-lg w-64 glassmorphism"
        >
          <p className="text-[10px] font-mono text-electric-green uppercase tracking-wider font-bold">Income Ingested</p>
          <h4 className="font-display font-bold text-lg text-white truncate mt-1">{parsedSource}</h4>
          <span className="text-[10px] bg-white/5 text-gray-300 px-2 py-0.5 rounded-full font-mono mt-1 inline-block">
            {category}
          </span>
          <p className="font-mono text-xl font-bold text-white mt-2">₹{amount.toLocaleString('en-IN')}</p>
        </motion.div>

        {/* Animated Connecting Streams */}
        <div className="w-full max-w-2xl h-16 relative">
          <svg className="w-full h-full absolute top-0 left-0 overflow-visible" xmlns="http://www.w3.org/2000/svg">
            {/* Left Stream: Tax */}
            <path d="M 336 0 Q 336 24, 112 50" fill="none" stroke="rgba(138, 43, 226, 0.2)" strokeWidth="3" />
            {isAnimating && (
              <motion.path
                d="M 336 0 Q 336 24, 112 50"
                fill="none"
                stroke="#8a2be2"
                strokeWidth="4"
                strokeDasharray="10 20"
                animate={{ strokeDashoffset: [-60, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            )}

            {/* Middle Stream: Buffer */}
            <path d="M 336 0 Q 336 24, 336 50" fill="none" stroke="rgba(255, 170, 0, 0.2)" strokeWidth="3" />
            {isAnimating && (
              <motion.path
                d="M 336 0 Q 336 24, 336 50"
                fill="none"
                stroke="#ffaa00"
                strokeWidth="4"
                strokeDasharray="10 20"
                animate={{ strokeDashoffset: [-60, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            )}

            {/* Right Stream: Checking */}
            <path d="M 336 0 Q 336 24, 560 50" fill="none" stroke="rgba(0, 255, 204, 0.2)" strokeWidth="3" />
            {isAnimating && (
              <motion.path
                d="M 336 0 Q 336 24, 560 50"
                fill="none"
                stroke="#00ffcc"
                strokeWidth="4"
                strokeDasharray="10 20"
                animate={{ strokeDashoffset: [-60, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            )}
          </svg>
        </div>

        {/* Destination Buckets */}
        <div className="grid grid-cols-3 gap-4 w-full mt-2 z-10">
          {/* Tax Vault */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glassmorphism rounded-xl p-4 border border-deep-purple/20 relative group text-center"
          >
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-deep-purple to-transparent opacity-60" />
            <span className="text-[10px] font-mono font-bold text-purple-400">{taxPct}% TAX WITHHELD</span>
            <h5 className="text-xs text-gray-400 font-display mt-1">Locked Advance Tax</h5>
            <p className="font-mono font-bold text-base text-white text-glow-purple mt-2">
              +₹{taxAmount.toLocaleString('en-IN')}
            </p>
          </motion.div>

          {/* Emergency Buffer */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glassmorphism rounded-xl p-4 border border-soft-amber/20 relative group text-center"
          >
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-soft-amber to-transparent opacity-60" />
            <span className="text-[10px] font-mono font-bold text-soft-amber">{bufferPct}% BUFFERED</span>
            <h5 className="text-xs text-gray-400 font-display mt-1">Emergency Buffer</h5>
            <p className="font-mono font-bold text-base text-white mt-2">
              +₹{bufferAmount.toLocaleString('en-IN')}
            </p>
          </motion.div>

          {/* Checking Split (Safe Spend + Priority Bills) */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glassmorphism rounded-xl p-4 border border-electric-green/20 relative group text-center flex flex-col justify-between"
          >
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-electric-green to-transparent opacity-60" />
            <div>
              <span className="text-[10px] font-mono font-bold text-electric-green">{checkingPct}% AVAILABLE</span>
              <h5 className="text-xs text-gray-400 font-display mt-1">Safe-to-Spend</h5>
            </div>
            
            {/* Dynamic Branching for Priority Bills (EMIs) */}
            {billsAmount > 0 ? (
              <div className="mt-3 bg-black/40 border border-white/5 rounded-lg p-2 text-left">
                <p className="text-[9px] text-purple-300 font-mono uppercase font-bold flex items-center gap-1">
                  <CheckCircle size={8} className="text-purple-300" />
                  Priority Bill Sweep
                </p>
                <p className="text-[10px] font-display font-medium text-white truncate mt-0.5">
                  Routed to EMI
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-gray-400 font-mono">Bills:</span>
                  <span className="text-[10px] font-mono text-purple-300 font-bold">₹{billsAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center mt-0.5 pt-0.5 border-t border-white/5">
                  <span className="text-[10px] text-gray-400 font-mono">Checking:</span>
                  <span className="text-[10px] font-mono text-electric-green font-bold">₹{checkingAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ) : (
              <p className="font-mono font-bold text-base text-white text-glow-green mt-3">
                +₹{checkingAmount.toLocaleString('en-IN')}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
