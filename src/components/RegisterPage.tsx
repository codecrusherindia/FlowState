/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, Loader2, ArrowRight, ShieldAlert, Sparkles, Check } from 'lucide-react';

interface IRegisterPageProps {
  onRegisterSuccess: (token: string, user: any) => void;
  onNavigateToLogin: () => void;
}

export default function RegisterPage({ onRegisterSuccess, onNavigateToLogin }: IRegisterPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscriptionTier, setSubscriptionTier] = useState<'freemium' | 'premium'>('premium');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill out all the input fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, subscriptionTier }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed. Please try again.');
      }

      onRegisterSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-6 bg-white/3 border border-white/5 p-8 rounded-3xl space-y-6 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-deep-purple/5 to-transparent blur-2xl -z-10 rounded-3xl" />
      
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-deep-purple/20 text-purple-400 mb-1">
          <Sparkles size={20} />
        </div>
        <h2 className="font-display font-bold text-2xl text-white">Create Your Account</h2>
        <p className="text-xs text-gray-400 font-sans">
          Establish an autonomous virtual account with real-time BaaS routing splits
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-xs text-red-400 p-3.5 rounded-xl text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 uppercase font-mono font-bold tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-gray-500" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="freelancer@domain.in"
                className="w-full bg-white/2 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric-green font-mono"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 uppercase font-mono font-bold tracking-wider">Account Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-gray-500" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose safe password"
                className="w-full bg-white/2 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric-green font-mono"
                required
              />
            </div>
          </div>
        </div>

        {/* Plan Selector */}
        <div className="space-y-3">
          <label className="text-[10px] text-gray-400 uppercase font-mono font-bold tracking-wider block">
            Select Your Subscription Plan
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Freemium Card */}
            <div
              onClick={() => setSubscriptionTier('freemium')}
              className={`border rounded-2xl p-4 cursor-pointer transition flex flex-col justify-between ${
                subscriptionTier === 'freemium'
                  ? 'border-white/20 bg-white/5 shadow-inner'
                  : 'border-white/5 bg-transparent hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-white font-sans">Basic Freemium</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">Manual sweeps & dashboard ledger tools</p>
                </div>
                {subscriptionTier === 'freemium' && (
                  <div className="bg-electric-green text-black rounded-full p-0.5">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </div>
              <span className="text-sm font-semibold text-white mt-4 font-mono">₹0 / Lifetime Free</span>
            </div>

            {/* Premium Card */}
            <div
              onClick={() => setSubscriptionTier('premium')}
              className={`border rounded-2xl p-4 cursor-pointer transition flex flex-col justify-between relative ${
                subscriptionTier === 'premium'
                  ? 'border-electric-green bg-electric-green/5 shadow-[0_0_15px_rgba(0,255,204,0.1)]'
                  : 'border-white/5 bg-transparent hover:border-white/10'
              }`}
            >
              <div className="absolute -top-2.5 right-4 bg-electric-green text-black px-2 py-0.5 rounded-full text-[8px] font-bold tracking-wider font-mono">
                RECOMMENDED
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-white font-sans">Premium Co-Pilot</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">Automated Decentro Virtual Accounts</p>
                </div>
                {subscriptionTier === 'premium' && (
                  <div className="bg-electric-green text-black rounded-full p-0.5">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </div>
              <span className="text-sm font-semibold text-electric-green mt-4 font-mono">₹199 / Month</span>
            </div>
          </div>
        </div>

        {subscriptionTier === 'premium' && (
          <div className="flex items-start gap-3 bg-electric-green/5 border border-electric-green/20 p-4 rounded-2xl text-xs text-gray-300">
            <ShieldAlert size={18} className="text-electric-green shrink-0 mt-0.5 animate-pulse" />
            <div className="leading-relaxed font-sans">
              <strong className="text-white">Live Banking Sandbox Active:</strong> Registered premium users get a real-world simulated Decentro Virtual Bank Account mapped instantly to their wallet splits.
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-electric-green text-black font-semibold py-3.5 rounded-xl hover:bg-opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Generating Virtual Account Profile...
            </>
          ) : (
            <>
              Complete Autonomous Registration
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="border-t border-white/5 pt-4 text-center">
        <p className="text-xs text-gray-400">
          Already have a FlowState account?{' '}
          <button
            onClick={onNavigateToLogin}
            className="text-electric-green hover:underline font-semibold cursor-pointer font-sans"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
}
