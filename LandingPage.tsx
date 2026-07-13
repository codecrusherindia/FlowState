/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, Zap, ShieldAlert, Sparkles, HelpCircle, Activity, Heart, RefreshCw } from 'lucide-react';

interface IConsistencyGaugeProps {
  score: number;
  scoreMetrics: {
    depositFrequencyScore: number;
    diversificationScore: number;
    disciplineScore: number;
  } | null;
}

export default function ConsistencyGauge({ score, scoreMetrics }: IConsistencyGaugeProps) {
  const metrics = scoreMetrics || {
    depositFrequencyScore: 260,
    diversificationScore: 240,
    disciplineScore: 280,
  };

  // Convert credit score (300 to 900) to a percentage for the circular progress gauge
  const minScore = 300;
  const maxScore = 900;
  const percentage = Math.max(0, Math.min(100, ((score - minScore) / (maxScore - minScore)) * 100));

  // Determine credit rating description
  let rating = 'Fair';
  let ratingColor = 'text-orange-400';
  let badgeBg = 'bg-orange-500/10 text-orange-400';
  let borderGlow = 'border-orange-500/10';

  if (score >= 800) {
    rating = 'Elite Gig-Credit';
    ratingColor = 'text-electric-green text-glow-green';
    badgeBg = 'bg-electric-green/10 text-electric-green border border-electric-green/20';
    borderGlow = 'glow-border-green';
  } else if (score >= 720) {
    rating = 'Prime Partner';
    ratingColor = 'text-electric-green';
    badgeBg = 'bg-electric-green/10 text-electric-green';
    borderGlow = 'border-electric-green/10';
  } else if (score >= 650) {
    rating = 'Good Stand';
    ratingColor = 'text-amber-400';
    badgeBg = 'bg-amber-400/10 text-amber-400';
    borderGlow = 'border-amber-400/10';
  } else {
    rating = 'Subprime / Unrated';
    ratingColor = 'text-red-400';
    badgeBg = 'bg-red-500/10 text-red-400';
    borderGlow = 'border-red-500/10';
  }

  // SVG parameters for circular track
  const radius = 64;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`glassmorphism-card rounded-[2rem] p-8 border ${borderGlow} flex flex-col md:flex-row gap-8 items-center`}>
      {/* Circle Guage Component */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg className="w-44 h-44 transform -rotate-90">
          {/* Background Track */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="#1a1a1a"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active Path with Gradient Glow */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          {/* Define gradients for high-fidelity look */}
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8a2be2" />
              <stop offset="50%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#00ffcc" />
            </linearGradient>
          </defs>
        </svg>

        {/* Inner Label */}
        <div className="absolute text-center">
          <span className="text-[10px] font-mono tracking-wider text-gray-500 font-bold uppercase">FlowScore</span>
          <h2 className="text-4xl font-display font-extrabold text-white mt-1 leading-none">{score}</h2>
          <span className="text-[10px] font-mono text-gray-400">/ 900</span>
        </div>
      </div>

      {/* Credit Metric Details */}
      <div className="flex-1 w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display font-bold text-lg text-white">Cashflow Consistency Score</h4>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-display font-bold uppercase tracking-wider ${badgeBg}`}>
                {rating}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Alternative banking score that replaces the traditional fixed-salary bureau checks.
            </p>
          </div>
        </div>

        {/* Sub-metrics bars */}
        <div className="space-y-4">
          {/* 1. Deposit Frequency Predictability */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-1.5">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Activity size={12} className="text-electric-green" />
                Deposit Frequency & Predictability
              </span>
              <span className="text-white font-bold">{metrics.depositFrequencyScore} / 300</span>
            </div>
            <div className="h-2 bg-black/50 border border-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-deep-purple to-electric-green rounded-full transition-all duration-1000"
                style={{ width: `${(metrics.depositFrequencyScore / 300) * 100}%` }}
              />
            </div>
          </div>

          {/* 2. Client Diversification */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-1.5">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Sparkles size={12} className="text-blue-400" />
                Client Source Diversification
              </span>
              <span className="text-white font-bold">{metrics.diversificationScore} / 300</span>
            </div>
            <div className="h-2 bg-black/50 border border-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-deep-purple to-blue-400 rounded-full transition-all duration-1000"
                style={{ width: `${(metrics.diversificationScore / 300) * 100}%` }}
              />
            </div>
          </div>

          {/* 3. Vault Discipline */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-1.5">
              <span className="text-gray-400 flex items-center gap-1.5">
                <ShieldAlert size={12} className="text-purple-400" />
                Vault Retentive Discipline
              </span>
              <span className="text-white font-bold">{metrics.disciplineScore} / 300</span>
            </div>
            <div className="h-2 bg-black/50 border border-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r rounded-full transition-all duration-1000 ${
                  metrics.disciplineScore < 200 
                    ? 'from-red-500 to-orange-500' 
                    : 'from-deep-purple to-purple-400'
                }`}
                style={{ width: `${(metrics.disciplineScore / 300) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Benefits notice */}
        <div className="mt-5 p-3 rounded-xl bg-white/3 border border-white/5 flex gap-2.5 items-start">
          <Award size={16} className="text-electric-green shrink-0 mt-0.5" />
          <div className="text-[11px] text-gray-400 leading-normal">
            <span className="text-white font-medium">Gig-Credit Profile Lock:</span> Your score currently puts you in the{' '}
            <span className="text-electric-green font-bold">top 8% of digital freelancers</span>. This opens up instant pre-approved loan tiers with partnered Indian neo-banks at sub-10% interest rates.
          </div>
        </div>
      </div>
    </div>
  );
}
