/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ChevronRight, ChevronLeft, Sparkles, ShieldCheck, 
  ArrowRight, Sliders, Award, Landmark, Play, AlertCircle, Info, HelpCircle
} from 'lucide-react';

interface IWalkthroughWizardProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  virtualAccNo?: string;
  virtualIFSC?: string;
}

export default function WalkthroughWizard({ 
  isOpen, 
  onClose, 
  userEmail = 'gig_worker@flowstate.in',
  virtualAccNo = 'DECN849302198',
  virtualIFSC = 'DECN0000001'
}: IWalkthroughWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [simulationInput, setSimulationInput] = useState('30000');
  const [simulationNarrative, setSimulationNarrative] = useState('UPI/CR/93021/DEVELOPER_FREELANCE_PAYOUT/YESB');
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const steps = [
    {
      title: '1. Secure BaaS Provisioning',
      icon: Landmark,
      color: 'text-electric-green bg-electric-green/10 border-electric-green/20',
      tag: 'DECENTRO SANDBOX BANKING',
      description: 'FlowState provisions a fully segregated Virtual Account via Decentro banking APIs as soon as you sign up.',
      content: (
        <div className="space-y-4">
          <p className="text-xs text-gray-400 leading-relaxed font-sans">
            Every gig worker receives a unique, RBI-compliant virtual bank account. All payments sent here are automatically routed by FlowState in real time before reaching your main checking balance.
          </p>
          <div className="p-4 rounded-xl bg-white/2 border border-white/5 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-gray-500">Virtual Bank Provider:</span>
              <span className="text-white font-semibold">Yes Bank (BaaS Staging)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Virtual Account Number:</span>
              <span className="text-electric-green font-bold select-all">{virtualAccNo}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">IFSC Code:</span>
              <span className="text-white select-all">{virtualIFSC}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Registered Email:</span>
              <span className="text-gray-300 truncate max-w-[180px]">{userEmail}</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 bg-electric-green/5 border border-electric-green/10 p-3 rounded-xl text-[11px] text-gray-400 leading-relaxed font-sans">
            <Info size={14} className="text-electric-green shrink-0 mt-0.5" />
            <span>This eliminates the need to expose your primary savings account to dozens of different client portals.</span>
          </div>
        </div>
      )
    },
    {
      title: '2. Route Your Client Payouts',
      icon: Sliders,
      color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
      tag: 'INCOMING BILLING DIVERSION',
      description: 'Point your freelancing platforms, invoice templates, or direct client contracts to your FlowState details.',
      content: (
        <div className="space-y-4">
          <p className="text-xs text-gray-400 leading-relaxed">
            Redirecting your incoming cashflows is simple. Copy your virtual account and IFSC, then update your withdrawal details in standard gig hubs:
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/2 border border-white/5 rounded-xl hover:border-white/10 transition">
              <div className="text-xs font-bold text-white mb-1">Global Clients</div>
              <p className="text-[10px] text-gray-500 font-sans leading-relaxed">
                Add Yes Bank virtual details to platforms like Upwork, Fiverr, or Stripe Payout settings.
              </p>
            </div>
            <div className="p-3 bg-white/2 border border-white/5 rounded-xl hover:border-white/10 transition">
              <div className="text-xs font-bold text-white mb-1">Domestic UPI Contracts</div>
              <p className="text-[10px] text-gray-500 font-sans leading-relaxed">
                Provide these bank credentials for NEFT, IMPS, or link them to your business UPI handles.
              </p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-purple-950/10 border border-purple-500/20 text-[11px] text-purple-300 font-mono flex items-center gap-2">
            <Sparkles size={14} className="animate-pulse" />
            <span>No tax is withheld on initial payout, leaving FlowState to sweep autonomously!</span>
          </div>
        </div>
      )
    },
    {
      title: '3. Autonomous Sweep & Presumptive Tax Math',
      icon: ShieldCheck,
      color: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
      tag: 'SECTION 44ADA TAX OPTIMIZATION',
      description: 'Indian Income Tax presumptive rules state that only 50% of your gross receipts count as taxable income.',
      content: (
        <div className="space-y-4">
          <p className="text-xs text-gray-400 leading-relaxed font-sans">
            Our smart routing algorithm automatically utilizes the <strong className="text-white">Section 44ADA</strong> presumptive shield. When a client payment arrives, it runs:
          </p>
          
          <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-3 font-mono text-[11px]">
            <div className="flex justify-between items-center text-gray-400">
              <span>Gross Payout:</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={simulationInput}
                  onChange={(e) => setSimulationInput(e.target.value)}
                  className="w-20 bg-white/5 border border-white/10 rounded px-2 py-0.5 text-right text-white focus:outline-none focus:border-electric-green"
                />
                <span className="text-[10px] text-gray-500">INR</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-gray-400">
              <span>Taxable Portion (50%):</span>
              <span className="text-white font-semibold">
                ₹{Math.round(Number(simulationInput) * 0.5).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between items-center text-gray-400">
              <span>Dynamic Tax Rate on Taxable:</span>
              <span className="text-cyan-400 font-bold">15%</span>
            </div>

            <div className="border-t border-white/5 pt-2 flex justify-between items-center text-xs text-white">
              <span className="text-gray-400">Tax Withheld (7.5% Effective Gross):</span>
              <span className="text-electric-green font-bold">
                ₹{Math.round(Number(simulationInput) * 0.075).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              const amount = Number(simulationInput) || 10000;
              const tax = Math.round(amount * 0.075);
              const buffer = Math.round(amount * 0.10);
              const checking = amount - tax - buffer;
              setSimulationResult({
                tax,
                buffer,
                checking,
                effective: '7.5%'
              });
            }}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <Play size={12} className="text-electric-green" />
            Calculate Autonomous Splitting Scheme
          </button>

          {simulationResult && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="p-3 bg-electric-green/5 border border-electric-green/20 rounded-xl space-y-1.5 font-mono text-[10px] text-gray-300"
            >
              <div className="text-xs text-white font-bold mb-1 flex items-center justify-between">
                <span>Routing Breakdown Results</span>
                <span className="text-[9px] bg-electric-green/20 text-electric-green px-1.5 py-0.2 rounded font-mono">OK</span>
              </div>
              <div className="flex justify-between">
                <span>🛡️ Locked Tax Vault (Sec 44ADA):</span>
                <span className="text-white">₹{simulationResult.tax.toLocaleString('en-IN')} (7.5%)</span>
              </div>
              <div className="flex justify-between">
                <span>💼 Locked Buffer Vault:</span>
                <span className="text-white">₹{simulationResult.buffer.toLocaleString('en-IN')} (10%)</span>
              </div>
              <div className="flex justify-between font-bold text-electric-green border-t border-white/5 pt-1.5 mt-1">
                <span>💸 Added to Spent/Checking:</span>
                <span>₹{simulationResult.checking.toLocaleString('en-IN')} (82.5%)</span>
              </div>
            </motion.div>
          )}
        </div>
      )
    },
    {
      title: '4. Consistency Alternatives & Credit Score',
      icon: Award,
      color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
      tag: 'FICO-COMPLIANT ALTERNATIVE SCORECARD',
      description: 'Gig workers usually struggle to secure loans or housing due to lack of stable monthly salary slips.',
      content: (
        <div className="space-y-4">
          <p className="text-xs text-gray-400 leading-relaxed">
            FlowState dynamically aggregates your alternative cashflow profile, analyzing deposits, client diversifications, and vault lock discipline to output a dynamic score out of 900.
          </p>
          
          <div className="grid grid-cols-3 gap-2 font-mono text-[9px] text-center">
            <div className="p-2 bg-white/2 border border-white/5 rounded-xl">
              <span className="block text-gray-500">300 - 550</span>
              <span className="text-red-400 font-bold">Unstable</span>
            </div>
            <div className="p-2 bg-white/2 border border-white/5 rounded-xl">
              <span className="block text-gray-500">550 - 750</span>
              <span className="text-yellow-400 font-bold">Balanced</span>
            </div>
            <div className="p-2 bg-electric-green/5 border border-electric-green/10 rounded-xl">
              <span className="block text-gray-400">750 - 900</span>
              <span className="text-electric-green font-bold">Flow Master</span>
            </div>
          </div>

          <div className="p-3 bg-red-950/10 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-xs text-gray-400 leading-relaxed font-sans">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Discipline Breach Warning!</strong>
              withdrawing funds prematurely from your locked tax or emergency vaults counts as a discipline breach, docking your Consistency Score dynamically.
            </div>
          </div>
        </div>
      )
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-[#0e0e0e] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[550px] md:h-[480px]"
        >
          {/* Decorative Neon Accent Glows */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-electric-green/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-deep-purple/10 blur-3xl rounded-full" />

          {/* Left Panel: Stepper Indicator */}
          <div className="w-full md:w-52 bg-black/40 border-r border-white/5 p-6 flex flex-col justify-between shrink-0">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-electric-green">
                <Sparkles size={16} className="animate-spin" />
                <span className="font-display font-bold text-xs tracking-wider uppercase">Interactive Tour</span>
              </div>
              <div className="space-y-3.5">
                {steps.map((step, idx) => {
                  const StepIcon = step.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentStep(idx);
                        setSimulationResult(null);
                      }}
                      className={`w-full flex items-center gap-3 text-left transition cursor-pointer ${
                        currentStep === idx ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                        currentStep === idx 
                          ? 'border-electric-green text-electric-green bg-electric-green/5 shadow-[0_0_8px_rgba(0,255,204,0.3)]' 
                          : 'border-white/5 text-gray-500 bg-white/2'
                      }`}>
                        <StepIcon size={14} />
                      </div>
                      <span className="text-[11px] font-sans font-medium truncate">{step.title.split('. ')[1]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step Counter */}
            <div className="hidden md:block font-mono text-[10px] text-gray-600">
              PROMPT CO-PILOT v2.1 • {currentStep + 1} / {steps.length}
            </div>
          </div>

          {/* Right Panel: Active Step Content */}
          <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto no-scrollbar relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/3 border border-white/5 text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition"
            >
              <X size={14} />
            </button>

            {/* Step Content */}
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="inline-block px-2 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider border border-white/5 bg-white/2 text-gray-400">
                  {steps[currentStep].tag}
                </div>
                <h3 className="font-display font-extrabold text-lg text-white">
                  {steps[currentStep].title}
                </h3>
              </div>

              <div className="text-xs text-gray-300 font-sans leading-relaxed">
                {steps[currentStep].content}
              </div>
            </div>

            {/* Bottom Stepper Actions */}
            <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-6">
              <button
                onClick={() => {
                  setCurrentStep((prev) => Math.max(0, prev - 1));
                  setSimulationResult(null);
                }}
                disabled={currentStep === 0}
                className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-white transition disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft size={14} />
                Back
              </button>

              <div className="flex gap-1">
                {steps.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentStep === idx ? 'w-4 bg-electric-green' : 'w-1.5 bg-white/10'
                    }`}
                  />
                ))}
              </div>

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={() => {
                    setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
                    setSimulationResult(null);
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-electric-green hover:text-white transition cursor-pointer"
                >
                  Next step
                  <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="flex items-center gap-1 text-[11px] font-bold bg-electric-green text-black px-3 py-1.5 rounded-lg hover:bg-opacity-90 transition cursor-pointer"
                >
                  Claim Virtual Account
                  <ArrowRight size={12} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
