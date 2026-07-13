/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, Loader2, ArrowRight, Sparkles } from 'lucide-react';

interface ILoginPageProps {
  onLoginSuccess: (token: string, user: any) => void;
  onNavigateToRegister: () => void;
}

export default function LoginPage({ onLoginSuccess, onNavigateToRegister }: ILoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both your email and account password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify your credentials.');
      }

      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white/3 border border-white/5 p-8 rounded-3xl space-y-6 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-electric-green/5 to-transparent blur-2xl -z-10 rounded-3xl" />
      
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-electric-green/10 text-electric-green mb-2">
          <Sparkles size={20} />
        </div>
        <h2 className="font-display font-bold text-2xl text-white">Welcome Back</h2>
        <p className="text-xs text-gray-400">Sign in to manage your autonomous gig cashflows securely</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-xs text-red-400 p-3.5 rounded-xl text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] text-gray-400 uppercase font-mono font-bold tracking-wider">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 text-gray-500" size={16} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="worker@flowstate.in"
              className="w-full bg-white/2 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric-green font-mono"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-gray-400 uppercase font-mono font-bold tracking-wider">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 text-gray-500" size={16} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-white/2 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric-green font-mono"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-electric-green text-black font-semibold py-3.5 rounded-xl hover:bg-opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2 text-sm"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Securing connection...
            </>
          ) : (
            <>
              Access Account Dashboard
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="border-t border-white/5 pt-4 text-center">
        <p className="text-xs text-gray-400">
          New to FlowState?{' '}
          <button
            onClick={onNavigateToRegister}
            className="text-electric-green hover:underline font-semibold cursor-pointer font-sans"
          >
            Create your account
          </button>
        </p>
      </div>
    </div>
  );
}
