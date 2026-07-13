/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sliders, ShieldCheck, Award, HelpCircle, ArrowRight, CheckCircle2, 
  Sparkles, Landmark, LandmarkIcon, Receipt, MessageSquare, AlertTriangle, 
  ChevronDown, ChevronUp, RefreshCw, Zap, Users
} from 'lucide-react';

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<'mission' | 'timeline' | 'sandbox' | 'faq'>('mission');
  const [sandboxAmount, setSandboxAmount] = useState<number>(65000);
  const [customTaxRate, setCustomTaxRate] = useState<number>(15);
  const [customBufferRate, setCustomBufferRate] = useState<number>(10);
  const [showSandboxResult, setShowSandboxResult] = useState<boolean>(true);
  
  // Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does India's Section 44ADA Presumptive Taxation apply to my gig earnings?",
      a: "Section 44ADA allows professionals (software developers, designers, writers, consultants) with gross receipts under ₹75 Lakh to declare just 50% of their gross earnings as taxable income. FlowState leverages this: we only apply your tax withholding rate (e.g., 15%) to the 50% taxable portion. This effectively halves your withholding on every incoming credit, maximizing your immediate checking liquidity while safely reserving enough to clear advance tax liabilities."
    },
    {
      q: "Are Decentro virtual accounts safe and secure?",
      a: "Absolutely. Decentro acts as an RBI-regulated banking technology layer operating on top of licensed commercial banking partners like YES Bank and ICICI Bank. When funds are deposited into your Decentro Virtual Account, they are immediately cleared and auto-routed to your connected balances within milliseconds. Your money never sits in an unregulated holding pool."
    },
    {
      q: "What happens if I withdraw early from the Locked Tax Vault?",
      a: "The Tax Vault is specifically designed to prevent you from accidentally spending your tax reserves. If an emergency arises, you can override the lock and transfer funds to Checking immediately. However, this is flagged as a 'Discipline Breach' by our Cashflow Engine, which dynamically reduces your FlowState Consistency alternative credit score."
    },
    {
      q: "What exactly is the Consistency Score and how does it help me?",
      a: "Since traditional CIBIL scores rely heavily on credit cards or old-school banking salary slips, freelancers are often locked out of financing. The FlowState Consistency Score (300 to 900) tracks the frequency of your client deposits, the diversity of your clients, and your vault discipline. We are building connections to micro-lenders to accept this score as secondary verification for equipment loans and personal credit."
    },
    {
      q: "Does FlowState store my real bank passwords?",
      a: "No. FlowState utilizes safe banking webhooks and Account Aggregator (AA) read-only consent. We never ask for, see, or store your internet banking passwords or PINs."
    }
  ];

  // Calculated sandbox variables
  const isTaxSlabCrossed = sandboxAmount >= 150000; // Triggering high-income warning for demo
  const presumptiveIncome = sandboxAmount * 0.5;
  const taxWithheld = presumptiveIncome * (customTaxRate / 100);
  const bufferWithheld = sandboxAmount * (customBufferRate / 100);
  const checkingAdded = Math.max(0, sandboxAmount - taxWithheld - bufferWithheld);

  return (
    <div className="space-y-12">
      {/* Top Header Jumbotron */}
      <div className="relative p-8 rounded-3xl bg-white/2 border border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-electric-green/5 to-deep-purple/5 blur-3xl -z-10 rounded-3xl" />
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-electric-green/10 border border-electric-green/20 px-3 py-1.5 rounded-full text-xs text-electric-green font-mono">
            <Sparkles size={14} className="animate-pulse" />
            <span>Developer Reference Hub & User Manual</span>
          </div>
          <h2 className="font-display font-black text-3xl md:text-4xl text-white leading-tight">
            How FlowState Automates Your Independent Finances
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed font-sans">
            Welcome to the technical handbook. This section lays bare our core systems—the Decentro sandbox rails, the Section 44ADA tax calculations, our alternative credit engines, and why we designed this invisible layer to handle your cashflow.
          </p>
        </div>
      </div>

      {/* Segment Navigation Tabs */}
      <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar gap-2">
        {[
          { id: 'mission', label: '1. The Core Problem & Why', icon: Users },
          { id: 'timeline', label: '2. System Timeline Flow', icon: LandmarkIcon },
          { id: 'sandbox', label: '3. Math Splitting Sandbox', icon: Sliders },
          { id: 'faq', label: '4. Compliance FAQ', icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3.5 font-display font-medium text-sm transition-all whitespace-nowrap border-b-2 cursor-pointer ${
                isActive 
                  ? 'border-electric-green text-electric-green' 
                  : 'border-transparent text-gray-400 hover:text-white hover:border-white/10'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Switch Viewports */}
      <div className="space-y-8">
        {activeTab === 'mission' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* The Raw Income Dilemma */}
            <div className="bg-[#110505]/40 border border-red-500/10 p-8 rounded-3xl space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <AlertTriangle size={24} />
              </div>
              <h3 className="font-display font-bold text-2xl text-red-300">The Variable Income Dilemma</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                Unlike corporate employees, freelancers receive erratic lump-sum client deposits with **zero TDS** (Tax Deducted at Source) or auto-withholdings. This presents structural vulnerabilities:
              </p>
              
              <div className="space-y-4 font-sans text-xs">
                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-2">
                  <strong className="text-white block">Accidental Overspending:</strong>
                  <span className="text-gray-400">
                    A ₹1,00,000 credit looks like ₹1,00,000 of disposable cash, but in reality, up to ₹20,000 of it already belongs to the Income Tax Department as Advance Tax.
                  </span>
                </div>
                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-2">
                  <strong className="text-white block">Advance Tax Interest Penalties (Sec 234B/C):</strong>
                  <span className="text-gray-400">
                    Failing to pay 15% of your annual estimated tax by June 15, 45% by Sept 15, and 75% by Dec 15 incurs an inescapable compounding 1% monthly penalty interest on arrears.
                  </span>
                </div>
                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-2">
                  <strong className="text-white block">The Credit Score Wall:</strong>
                  <span className="text-gray-400">
                    Traditional banking considers you 'unemployed' without standard monthly payslips. You have to save huge cash sums or pay high rates just to secure simple equipment loans.
                  </span>
                </div>
              </div>
            </div>

            {/* How FlowState Resolves It */}
            <div className="bg-[#05110c]/40 border border-electric-green/10 p-8 rounded-3xl space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-electric-green/10 border border-electric-green/20 flex items-center justify-center text-electric-green">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-display font-bold text-2xl text-electric-green">The FlowState Autonomous Guard</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                FlowState acts as an autonomous digital firewall between your gross earnings and your checking account, taking the cognitive stress out of cashflow management.
              </p>

              <div className="space-y-4 font-sans text-xs">
                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-2">
                  <strong className="text-white block">The Virtual Banking Isolation Layer:</strong>
                  <span className="text-gray-400">
                    Rather than pointing clients directly to your primary personal bank, they pay your FlowState Decentro virtual credentials. Deposits are analyzed and split instantly upon receipt.
                  </span>
                </div>
                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-2">
                  <strong className="text-white block">Presumptive Tax Optimization (Sec 44ADA):</strong>
                  <span className="text-gray-400">
                    We automatically shield 50% of your incoming gross from withholding. Only the remaining 50% presumptive income is swept, giving you maximum liquid spending cash today.
                  </span>
                </div>
                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-2">
                  <strong className="text-white block">Alternative FICO-style Scoring:</strong>
                  <span className="text-gray-400">
                    By showing high lock retention, diverse client incoming channels, and steady UPI frequencies, FlowState establishes a high Consistency Score, helping prove your dynamic credit worthiness.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'timeline' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="text-center max-w-lg mx-auto space-y-2 mb-4">
              <h3 className="font-display font-bold text-xl text-white">Behind the Scenes Operational Loop</h3>
              <p className="text-xs text-gray-400">From client credit triggers to final checking settlement in milliseconds.</p>
            </div>

            <div className="relative border-l-2 border-white/5 pl-8 ml-4 space-y-12">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-[#0a0a0a] border-2 border-electric-green flex items-center justify-center text-[10px] font-bold text-electric-green font-mono">
                  1
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] text-purple-400 font-mono uppercase tracking-wider block">INFRASTRUCTURE ESTABLISHMENT</span>
                  <h4 className="font-display font-bold text-white text-base">Instant Sandbox Bank Generation</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    FlowState uses Decentro BaaS APIs to configure a unique virtual account mapping directly to your client profile. This is sandbox-backed for testing real-time webhooks.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-[#0a0a0a] border-2 border-cyan-400 flex items-center justify-center text-[10px] font-bold text-cyan-400 font-mono">
                  2
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] text-purple-400 font-mono uppercase tracking-wider block">CLIENT DEPOSIT DISPATCH</span>
                  <h4 className="font-display font-bold text-white text-base">Client Payout Transmitted</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    Clients pay your invoices. Whether it is an IMPS/UPI transfer, an exchange withdrawal, or an international wire, the money hits Yes Bank staging servers, triggering a real-time HTTP POST webhook back to our backend.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-[#0a0a0a] border-2 border-purple-400 flex items-center justify-center text-[10px] font-bold text-purple-400 font-mono">
                  3
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] text-purple-400 font-mono uppercase tracking-wider block">AI INTERPRETATION & SAFEGUARDS</span>
                  <h4 className="font-display font-bold text-white text-base">Idempotency & SMS NLP Parse</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    The backend router instantly checks the unique webhook transaction UUID against the `IdempotencyLogs` schema to prevent double sweeps. Once cleared, Gemini AI processes any noisy bank narrative text to safely extract the client source name and payout category.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-[#0a0a0a] border-2 border-yellow-400 flex items-center justify-center text-[10px] font-bold text-yellow-400 font-mono">
                  4
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] text-purple-400 font-mono uppercase tracking-wider block">DETERMINISTIC DISTRIBUTION</span>
                  <h4 className="font-display font-bold text-white text-base">Section 44ADA Sweeps & Allocation</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    The math engine applies the 50% presumptive tax buffer. The system then routes the pre-allocated tax and buffer reserves directly to your locked digital vaults and automatically funds outstanding priority bills chronologically by due date.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'sandbox' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          >
            {/* Split controls */}
            <div className="bg-white/2 border border-white/5 p-6 rounded-3xl space-y-6">
              <h3 className="font-display font-bold text-lg text-white">Sweep Split Configuration Simulator</h3>
              
              <div className="space-y-4 text-xs font-sans">
                <div className="space-y-2">
                  <div className="flex justify-between font-mono">
                    <span className="text-gray-400">Gross Incoming Invoice:</span>
                    <span className="text-white font-bold">₹{sandboxAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <input 
                    type="range" 
                    min="10000" 
                    max="500000" 
                    step="5000"
                    value={sandboxAmount}
                    onChange={(e) => setSandboxAmount(Number(e.target.value))}
                    className="w-full accent-electric-green cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between font-mono">
                    <span className="text-gray-400">Tax Withholding (On Presumptive 50%):</span>
                    <span className="text-cyan-400 font-bold">{customTaxRate}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="30" 
                    step="1"
                    value={customTaxRate}
                    onChange={(e) => setCustomTaxRate(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between font-mono">
                    <span className="text-gray-400">Emergency Buffer:</span>
                    <span className="text-purple-400 font-bold">{customBufferRate}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="2" 
                    max="20" 
                    step="1"
                    value={customBufferRate}
                    onChange={(e) => setCustomBufferRate(Number(e.target.value))}
                    className="w-full accent-purple-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Section 44ADA Compliance Card */}
              <div className="p-4 rounded-2xl bg-electric-green/5 border border-electric-green/10 space-y-2 text-xs">
                <div className="text-electric-green font-bold flex items-center gap-1.5 uppercase tracking-wider font-mono text-[10px]">
                  <CheckCircle2 size={12} />
                  Section 44ADA presumptive compliance active
                </div>
                <p className="text-gray-400 leading-relaxed font-sans">
                  The calculations below declare that 50% of your ₹{sandboxAmount.toLocaleString('en-IN')} is entirely shielded from tax reserve splits. Taxes are only withheld on the remaining ₹{presumptiveIncome.toLocaleString('en-IN')}.
                </p>
              </div>
            </div>

            {/* Split Visualization */}
            <div className="bg-white/2 border border-white/5 p-6 rounded-3xl flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg text-white">Dynamic Asset Allocation Results</h3>
                
                {/* Visual stacked bar chart of the split */}
                <div className="h-4 rounded-full bg-white/5 overflow-hidden flex">
                  <div 
                    title="Tax Reserve"
                    className="bg-cyan-400 h-full transition-all duration-300"
                    style={{ width: `${(taxWithheld / sandboxAmount) * 100}%` }}
                  />
                  <div 
                    title="Buffer Reserve"
                    className="bg-purple-500 h-full transition-all duration-300"
                    style={{ width: `${(bufferWithheld / sandboxAmount) * 100}%` }}
                  />
                  <div 
                    title="Checking Allocation"
                    className="bg-electric-green h-full transition-all duration-300"
                    style={{ width: `${(checkingAdded / sandboxAmount) * 100}%` }}
                  />
                </div>

                <div className="space-y-3 font-mono text-xs pt-4">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0e161c] border border-cyan-500/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded bg-cyan-400" />
                      <span className="text-gray-400">Locked Tax Vault (Withheld):</span>
                    </div>
                    <span className="text-white font-bold">₹{taxWithheld.toLocaleString('en-IN')} ({( (taxWithheld/sandboxAmount)*100 ).toFixed(1)}%)</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#130d1a] border border-purple-500/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded bg-purple-500" />
                      <span className="text-gray-400">Locked Buffer Vault:</span>
                    </div>
                    <span className="text-white font-bold">₹{bufferWithheld.toLocaleString('en-IN')} ({( (bufferWithheld/sandboxAmount)*100 ).toFixed(1)}%)</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#091612] border border-electric-green/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded bg-electric-green" />
                      <span className="text-gray-400">Settled to Checking Balance:</span>
                    </div>
                    <span className="text-electric-green font-extrabold">₹{checkingAdded.toLocaleString('en-IN')} ({( (checkingAdded/sandboxAmount)*100 ).toFixed(1)}%)</span>
                  </div>
                </div>
              </div>

              {/* Effective Gross Tax rate display */}
              <div className="border-t border-white/5 pt-4 text-xs font-mono text-gray-400 flex justify-between items-center">
                <span>Effective Tax Rate on Gross:</span>
                <span className="text-white font-bold">
                  {((taxWithheld / sandboxAmount) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'faq' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            <div className="text-center space-y-1 mb-6">
              <h3 className="font-display font-bold text-xl text-white">Compliance FAQ & Guidelines</h3>
              <p className="text-xs text-gray-400">Frequently asked questions concerning taxation under the Indian IT framework.</p>
            </div>

            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white/2 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 flex items-center justify-between text-left font-display font-semibold text-white text-sm cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} className="text-electric-green" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5"
                      >
                        <p className="p-5 text-xs text-gray-400 leading-relaxed font-sans font-normal">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
