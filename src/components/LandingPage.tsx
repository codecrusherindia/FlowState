/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Zap, ShieldCheck, TrendingUp, Sliders, ArrowRight, CheckCircle, HelpCircle, Sparkles, Award } from 'lucide-react';

interface ILandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LandingPage({ onGetStarted, onLogin }: ILandingPageProps) {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-10 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-electric-green/10 to-deep-purple/10 blur-3xl -z-10 rounded-full" />
        
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs text-electric-green font-mono">
          <Sparkles size={14} className="animate-pulse" />
          <span>Section 44ADA Indian Tax Compliant Autonomous Copilot</span>
        </div>

        <h1 className="font-display font-black text-5xl md:text-6xl tracking-tight text-white leading-none">
          Automate your cashflows.<br />
          <span className="bg-gradient-to-r from-electric-green via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Secure your peace of mind.
          </span>
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          FlowState is the autonomous liquidity manager built specifically for the Indian gig economy. 
          It acts as an invisible layer between your incoming raw UPI/NEFT payouts and your daily spending. 
          Never get caught in the tax trap again.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={onGetStarted}
            className="flex items-center gap-2 bg-electric-green text-black font-semibold px-6 py-3.5 rounded-xl hover:bg-opacity-90 transition shadow-[0_0_20px_rgba(0,255,204,0.3)] cursor-pointer text-sm"
          >
            Create Your Free Account
            <ArrowRight size={16} />
          </button>
          <button
            onClick={onLogin}
            className="bg-white/5 border border-white/10 text-white font-medium px-6 py-3.5 rounded-xl hover:bg-white/10 transition cursor-pointer text-sm"
          >
            Access Portal
          </button>
        </div>

        {/* Real-world KPI Badges */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-10 max-w-3xl mx-auto">
          <div className="bg-white/2 border border-white/5 p-4 rounded-2xl text-left">
            <span className="block text-2xl font-bold text-white font-mono">50%</span>
            <span className="text-xs text-gray-400 font-mono">Section 44ADA Presumptive Tax Shield</span>
          </div>
          <div className="bg-white/2 border border-white/5 p-4 rounded-2xl text-left">
            <span className="block text-2xl font-bold text-electric-green font-mono">Instant</span>
            <span className="text-xs text-gray-400 font-mono">Decentro Virtual Bank Trigger</span>
          </div>
          <div className="bg-white/2 border border-white/5 p-4 rounded-2xl text-left col-span-2 md:col-span-1">
            <span className="block text-2xl font-bold text-purple-400 font-mono">900 Max</span>
            <span className="text-xs text-gray-400 font-mono">FICO-Compliant Consistency Score</span>
          </div>
        </div>
      </section>

      {/* The Core Problem & FlowState Solution */}
      <section className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div className="bg-red-500/5 border border-red-500/10 p-8 rounded-3xl space-y-4">
          <h3 className="font-display font-bold text-xl text-red-300">The Raw Income Trap</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            As a freelancer, creator, or consultant, you receive gross UPI, NEFT, and Stripe payouts without any tax deducted at source. 
            When Advance Tax deadlines arrive or you need a home loan, you're faced with:
          </p>
          <ul className="space-y-2 text-xs text-gray-400 font-mono">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✕</span> Large unplanned bulk cash outflows for annual Advance Tax.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✕</span> Zero credit score progression due to lack of standard payslips.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✕</span> Mixing business revenue with personal coffee/rent transactions.
            </li>
          </ul>
        </div>

        <div className="bg-electric-green/5 border border-electric-green/10 p-8 rounded-3xl space-y-4">
          <h3 className="font-display font-bold text-xl text-electric-green">The FlowState Solution</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            FlowState creates an intelligent virtual buffer bank account that automates compliance. 
            We sweep tax liabilities dynamically, leaving checking balances safe to spend:
          </p>
          <ul className="space-y-2 text-xs text-gray-400 font-mono">
            <li className="flex items-start gap-2">
              <span className="text-electric-green mt-0.5">✓</span> Section 44ADA-compliant 50% presumptive income shield.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-electric-green mt-0.5">✓</span> Built-in FICO-style consistency credit metrics.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-electric-green mt-0.5">✓</span> Automated priority bill allocation matching due dates.
            </li>
          </ul>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section className="space-y-12">
        <div className="text-center space-y-2">
          <h2 className="font-display font-bold text-3xl text-white">Three Pillars of FlowState</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">Designed for the Indian gig economy & presumptive tax shield.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Pillar 1 */}
          <div className="bg-white/2 border border-white/5 p-6 rounded-2xl space-y-3 relative hover:border-white/10 transition">
            <div className="w-10 h-10 rounded-xl bg-electric-green/10 border border-electric-green/20 flex items-center justify-center text-electric-green">
              <Sliders size={20} />
            </div>
            <h3 className="font-display font-semibold text-white">1. Smart Auto-Routing</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every deposit into your Virtual Bank Account is auto-split. Your tax obligation and emergency buffer are instantly diverted, and pending EMI or co-working dues are filled chronologically.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white/2 border border-white/5 p-6 rounded-2xl space-y-3 relative hover:border-white/10 transition">
            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-display font-semibold text-white">2. Section 44ADA Math</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              We assume only 50% of your gross receipts are taxable presumptive income. Our real-time engine dynamically adjusts sweeps between 7.5% and 12.5% of gross incoming based on the ₹7 Lakh rebate limits.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white/2 border border-white/5 p-6 rounded-2xl space-y-3 relative hover:border-white/10 transition">
            <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-purple-400">
              <Award size={20} />
            </div>
            <h3 className="font-display font-semibold text-white">3. Consistency Score</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Ditch traditional banking profiles. FlowState computes an alternative credit scorecard (300 to 900) analyzing payout frequency, client diversification, and vault lock retention discipline.
            </p>
          </div>
        </div>
      </section>

      {/* Premium Business Model and Pricing Tiers */}
      <section className="space-y-12">
        <div className="text-center space-y-2">
          <h2 className="font-display font-bold text-3xl text-white">Transparent, Simple Pricing</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">Powering your autonomous financial future, with no hidden margins.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Freemium Tier */}
          <div className="bg-white/2 border border-white/5 p-8 rounded-3xl space-y-6 flex flex-col justify-between hover:border-white/10 transition">
            <div className="space-y-4">
              <div className="inline-block bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-[10px] text-gray-400 font-mono">
                BASIC LEDGER
              </div>
              <div>
                <h3 className="font-display font-black text-2xl text-white">Freemium</h3>
                <p className="text-xs text-gray-400 mt-1">Manual sweeps and credit logs</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-3xl font-black text-white">₹0</span>
                <span className="text-xs text-gray-400 font-mono">/ lifetime free</span>
              </div>
              <div className="border-t border-white/5 pt-4 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <CheckCircle size={14} className="text-electric-green shrink-0" />
                  <span>Interactive manual cashflow sweeps</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <CheckCircle size={14} className="text-electric-green shrink-0" />
                  <span>Section 44ADA presumptive tax calculator</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <CheckCircle size={14} className="text-electric-green shrink-0" />
                  <span>Consistency Score tracker (FICO-style)</span>
                </div>
              </div>
            </div>
            <button
              onClick={onGetStarted}
              className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs py-3 rounded-xl transition cursor-pointer"
            >
              Get Started for Free
            </button>
          </div>

          {/* Premium Tier */}
          <div className="bg-[#111] border border-electric-green/30 p-8 rounded-3xl space-y-6 flex flex-col justify-between relative shadow-[0_0_30px_rgba(0,255,204,0.1)]">
            <div className="absolute -top-3.5 right-6 bg-electric-green text-black px-3 py-1 rounded-full text-[10px] font-bold tracking-wider font-mono uppercase">
              RECOMMENDED
            </div>
            <div className="space-y-4">
              <div className="inline-block bg-electric-green/20 border border-electric-green/30 px-2.5 py-1 rounded-lg text-[10px] text-electric-green font-mono font-bold">
                AUTONOMOUS LIQUIDITY
              </div>
              <div>
                <h3 className="font-display font-black text-2xl text-white">Premium Co-Pilot</h3>
                <p className="text-xs text-gray-400 mt-1">Real-time banking and automated routing</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-3xl font-black text-white">₹199</span>
                <span className="text-xs text-gray-400 font-mono">/ month billing</span>
              </div>
              <div className="border-t border-white/5 pt-4 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <CheckCircle size={14} className="text-electric-green shrink-0" />
                  <span className="font-semibold text-white">Real-Time Decentro Virtual Account (BaaS)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <CheckCircle size={14} className="text-electric-green shrink-0" />
                  <span>Automated webhook-driven incoming sweeps</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <CheckCircle size={14} className="text-electric-green shrink-0" />
                  <span>AI-driven SMS transaction narrative parser</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <CheckCircle size={14} className="text-electric-green shrink-0" />
                  <span>Webhook Idempotency Protection logs</span>
                </div>
              </div>
            </div>
            <button
              onClick={onGetStarted}
              className="w-full bg-electric-green text-black font-semibold text-xs py-3 rounded-xl hover:bg-opacity-90 transition shadow-[0_0_15px_rgba(0,255,204,0.3)] cursor-pointer"
            >
              Unlock Premium Access
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
