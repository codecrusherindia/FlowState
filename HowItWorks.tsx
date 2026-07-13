/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import Vaults from './components/Vaults.tsx';
import RoutingRules from './components/RoutingRules.tsx';
import ConsistencyGauge from './components/ConsistencyGauge.tsx';
import LandingPage from './components/LandingPage.tsx';
import LoginPage from './components/LoginPage.tsx';
import RegisterPage from './components/RegisterPage.tsx';
import HowItWorks from './components/HowItWorks.tsx';
import WalkthroughWizard from './components/WalkthroughWizard.tsx';
import { IDashboardData, IPriorityBill } from './types.ts';
import { RefreshCw, AlertCircle, Loader2, Award, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('flowstate_token'));
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [dashboardData, setDashboardData] = useState<IDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);

  // Helper to construct request headers with JWT authorization
  const getHeaders = () => {
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  // Fetch full state aggregation from Express API
  const fetchDashboardData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await fetch('/api/dashboard', {
        headers: getHeaders(),
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      const data = await response.json();
      setDashboardData(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load dashboard data', err);
      setError(err.message || 'Connection failed. Ensure the server is online.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Sync token and routing rules on load / change
  useEffect(() => {
    if (token) {
      if (activeTab === 'landing' || activeTab === 'login' || activeTab === 'register') {
        setActiveTab('dashboard');
      }
    } else {
      if (activeTab !== 'login' && activeTab !== 'register') {
        setActiveTab('landing');
      }
    }
    fetchDashboardData();
  }, [token]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData(true);
  };

  // Auth Handlers
  const handleLoginSuccess = (newToken: string, user: any) => {
    localStorage.setItem('flowstate_token', newToken);
    setToken(newToken);
    setActiveTab('dashboard');
  };

  const handleRegisterSuccess = (newToken: string, user: any) => {
    localStorage.setItem('flowstate_token', newToken);
    setToken(newToken);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('flowstate_token');
    setToken(null);
    setDashboardData(null);
    setActiveTab('landing');
  };

  // 1. Simulate Incoming Webhook
  const handleSimulateDeposit = async (amount: number, rawNarrative: string) => {
    try {
      const transactionId = 'webhook_tx_' + Math.random().toString(36).substring(2, 9);
      const response = await fetch('/api/webhooks/bank-deposit', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ amount, rawNarrative, transactionId }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to simulate bank deposit');
      }
      // Re-fetch database states
      await fetchDashboardData(true);
    } catch (err: any) {
      alert(err.message || 'Error processing bank deposit simulation');
    }
  };

  // 2. Withdraw from Locked Vaults (triggers warning modal, discipline penalties)
  const handleWithdrawVault = async (vaultType: string, amount: number): Promise<boolean> => {
    try {
      const response = await fetch('/api/vaults/withdraw', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ vaultType, amount }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to process vault withdrawal');
      }
      const data = await response.json();
      alert(data.message);
      await fetchDashboardData(true);
      return true;
    } catch (err: any) {
      alert(err.message || 'Error performing vault withdrawal');
      return false;
    }
  };

  // 3. Create Custom Goal Lockers
  const handleCreateCustomVault = async (name: string, targetAmount: number) => {
    try {
      const response = await fetch('/api/vaults/create', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, targetAmount }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to create goal locker');
      }
      await fetchDashboardData(true);
      alert(`Savings goal locker "${name}" created successfully!`);
    } catch (err: any) {
      alert(err.message || 'Error creating custom goal locker');
    }
  };

  // 4. Fund Custom Savings Locker from Checking
  const handleFundCustomVault = async (vaultName: string, amount: number) => {
    try {
      const response = await fetch('/api/vaults/fund', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ vaultName, amount }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to fund savings locker');
      }
      await fetchDashboardData(true);
      alert(`Successfully transferred ₹${amount.toLocaleString('en-IN')} to "${vaultName}"!`);
    } catch (err: any) {
      alert(err.message || 'Error transferring funds');
    }
  };

  // 5. Update auto-routing ratios and priorities
  const handleUpdateRoutingRules = async (splits: any, priorityBills: IPriorityBill[], dynamicTaxEnabled: boolean) => {
    try {
      const response = await fetch('/api/routing/update', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ splits, priorityBills, dynamicTaxEnabled }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to update rules configuration');
      }
      await fetchDashboardData(true);
    } catch (err: any) {
      alert(err.message || 'Error updating rules configuration');
    }
  };

  return (
    <div className="flex bg-[#0a0a0a] text-gray-100 min-h-screen">
      {/* Dynamic Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={dashboardData?.user && token ? dashboardData.user : null}
        onLogout={handleLogout}
      />

      {/* Main Content Pane */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto no-scrollbar flex flex-col justify-between">
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Main Top Header */}
          <header className="flex justify-between items-center pb-5 border-b border-white/5">
            <div>
              <h2 className="font-display font-bold text-2xl tracking-tight text-white capitalize">
                {activeTab === 'landing' && 'Autonomous Liquidity Manager'}
                {activeTab === 'login' && 'SaaS Portal Entrance'}
                {activeTab === 'register' && 'BaaS Account Registration'}
                {activeTab === 'dashboard' && 'Flow State Overview'}
                {activeTab === 'vaults' && 'Tax & Emergency Vaults'}
                {activeTab === 'routing' && 'Auto-Sweep Routing Pipeline'}
                {activeTab === 'credit' && 'Alternative Consistency Score'}
                {activeTab === 'guide' && 'Walkthrough & Integration Handbook'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {activeTab === 'landing' && 'Indian gig economy financial co-pilot with Section 44ADA integration.'}
                {activeTab === 'login' && 'Sign in using credentials to access automated sweeps.'}
                {activeTab === 'register' && 'Choose a plan and claim your Decentro Virtual Account.'}
                {activeTab === 'dashboard' && 'Manage cashflows, sweep pipelines, and trace raw narratives.'}
                {activeTab === 'vaults' && 'Audit locked taxes, emergency buffers, and customize long-term goal lockers.'}
                {activeTab === 'routing' && 'Scale auto-withholding parameters and priority EMI allocations.'}
                {activeTab === 'credit' && 'Review your alternative credit worthiness scorecard and history.'}
                {activeTab === 'guide' && 'Learn how our autonomous split engines, sandbox rails, and tax math operate.'}
              </p>
            </div>

            {/* Quick Utility Indicators */}
            <div className="flex items-center gap-3">
              {dashboardData?.user && token && (
                <div className="flex items-center gap-2 bg-white/3 border border-white/5 px-3 py-1.5 rounded-xl text-xs font-mono">
                  <Award size={14} className="text-electric-green" />
                  <span>Consistency: <strong className="text-white">{dashboardData.user.consistencyScore}</strong></span>
                </div>
              )}
              
              {activeTab !== 'landing' && activeTab !== 'login' && activeTab !== 'register' && (
                <button
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="p-2.5 rounded-xl bg-white/3 border border-white/5 hover:bg-white/8 text-gray-400 hover:text-white transition cursor-pointer disabled:opacity-40"
                >
                  <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                </button>
              )}
            </div>
          </header>

          {/* Loading and Error states */}
          {loading && activeTab !== 'landing' && activeTab !== 'login' && activeTab !== 'register' ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
              <Loader2 className="animate-spin text-electric-green" size={32} />
              <p className="text-xs text-gray-400 font-mono">Retrieving live financial balances...</p>
            </div>
          ) : error && activeTab !== 'landing' && activeTab !== 'login' && activeTab !== 'register' ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center max-w-lg mx-auto">
              <AlertCircle size={32} className="text-red-400 mx-auto mb-3" />
              <h3 className="font-display font-bold text-base text-white">Database Out of Sync</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">{error}</p>
              <button
                onClick={() => fetchDashboardData()}
                className="mt-4 bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Retry Database Link
              </button>
            </div>
          ) : (
            /* Tab Renderer Switch */
            <div className="space-y-8 animate-fade-in">
              {activeTab === 'landing' && (
                <LandingPage
                  onGetStarted={() => setActiveTab('register')}
                  onLogin={() => setActiveTab('login')}
                />
              )}

              {activeTab === 'login' && (
                <LoginPage
                  onLoginSuccess={handleLoginSuccess}
                  onNavigateToRegister={() => setActiveTab('register')}
                />
              )}

              {activeTab === 'register' && (
                <RegisterPage
                  onRegisterSuccess={handleRegisterSuccess}
                  onNavigateToLogin={() => setActiveTab('login')}
                />
              )}

              {activeTab === 'dashboard' && (
                <Dashboard
                  user={dashboardData?.user || null}
                  wallet={dashboardData?.wallet || null}
                  transactions={dashboardData?.transactions || []}
                  onSimulateDeposit={handleSimulateDeposit}
                  onSetActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'vaults' && (
                <Vaults
                  wallet={dashboardData?.wallet || null}
                  onWithdrawVault={handleWithdrawVault}
                  onCreateCustomVault={handleCreateCustomVault}
                  onFundCustomVault={handleFundCustomVault}
                />
              )}

              {activeTab === 'routing' && (
                <RoutingRules
                  routingRules={dashboardData?.routingRules || null}
                  onUpdateRoutingRules={handleUpdateRoutingRules}
                />
              )}

              {activeTab === 'credit' && (
                <ConsistencyGauge
                  score={dashboardData?.user?.consistencyScore || 600}
                  scoreMetrics={dashboardData?.scoreMetrics || null}
                />
              )}

              {activeTab === 'guide' && (
                <HowItWorks />
              )}
            </div>
          )}
        </div>

        {/* Floating Help / Onboarding Trigger Button */}
        <button
          onClick={() => setIsWizardOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-electric-green hover:bg-opacity-90 text-black px-4 py-3 rounded-full flex items-center gap-2 font-display font-semibold text-xs shadow-[0_0_20px_rgba(0,255,204,0.4)] cursor-pointer transition-all group"
        >
          <Sparkles size={14} className="animate-pulse group-hover:scale-110 transition" />
          <span>Interactive Onboarding</span>
        </button>

        {/* Onboarding Walkthrough Wizard Modal */}
        <WalkthroughWizard
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          userEmail={dashboardData?.user?.email || 'guest@flowstate.in'}
          virtualAccNo={dashboardData?.user?.virtualAccountNumber || 'DECN849302198'}
          virtualIFSC={dashboardData?.user?.virtualAccountIFSC || 'DECN0000001'}
        />

        {/* Global Footer */}
        <footer className="w-full py-4 text-center border-t border-white/2 bg-black/10 text-[10px] text-gray-500 font-mono mt-auto">
          FlowState © 2026. B2C Micro-SaaS Financial Assistant. Secured with RBI Account Aggregator Framework and Gemini AI.
        </footer>
      </main>
    </div>
  );
}
