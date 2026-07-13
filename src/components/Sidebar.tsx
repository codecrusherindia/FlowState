/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutDashboard, ShieldAlert, Sliders, Award, Zap, LogOut, HelpCircle } from 'lucide-react';
import { IUser } from '../types.ts';

interface ISidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: IUser | null;
  onLogout?: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, user, onLogout }: ISidebarProps) {
  const authenticatedItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'vaults', name: 'Vaults & Lockers', icon: ShieldAlert },
    { id: 'routing', name: 'Smart Auto-Routing', icon: Sliders },
    { id: 'credit', name: 'Consistency Score', icon: Award },
    { id: 'guide', name: 'How It Works', icon: HelpCircle },
  ];

  const publicItems = [
    { id: 'landing', name: 'Product Home', icon: LayoutDashboard },
    { id: 'guide', name: 'How It Works', icon: HelpCircle },
    { id: 'login', name: 'Login Portal', icon: Sliders },
    { id: 'register', name: 'Create Account', icon: Zap },
  ];

  const menuItems = user ? authenticatedItems : publicItems;

  return (
    <aside className="w-80 h-screen bg-[#0a0a0a] border-r border-white/10 p-6 flex flex-col justify-between shrink-0 sticky top-0">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-electric-green flex items-center justify-center shadow-[0_0_15px_rgba(0,255,204,0.4)]">
            <div className="w-5 h-5 border-2 border-black rotate-45"></div>
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
              FlowState
              <span className="text-[10px] bg-electric-green/20 text-electric-green px-1.5 py-0.5 rounded font-mono font-medium">
                v2.0
              </span>
            </h1>
            <p className="text-xs text-gray-400 font-mono">Autonomous Liquidity</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-display font-medium text-sm transition-all duration-200 border ${
                  isActive
                    ? 'bg-white/5 border-white/10 text-electric-green shadow-[inset_1px_0_0_rgba(255,255,255,0.05)]'
                    : 'text-gray-400 border-transparent hover:text-white hover:bg-white/2'
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? 'text-electric-green drop-shadow-[0_0_8px_rgba(0,255,204,0.6)]' : 'text-gray-400'}
                />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Pro Plan Active & User Session Profile Card */}
      <div className="space-y-4">
        {user ? (
          <>
            <div className={`p-4 rounded-2xl bg-gradient-to-br border transition-all ${
              user.subscriptionTier === 'premium' 
                ? 'from-deep-purple/20 to-transparent border-deep-purple/30' 
                : 'from-gray-900/40 to-transparent border-white/5'
            }`}>
              <div className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full animate-pulse ${user.subscriptionTier === 'premium' ? 'bg-deep-purple' : 'bg-gray-500'}`} />
                {user.subscriptionTier === 'premium' ? 'PREMIUM CO-PILOT' : 'FREEMIUM ACCOUNT'}
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-mono">
                {user.subscriptionTier === 'premium' 
                  ? 'Auto-routing enabled for 12 incoming channels. Real-time BaaS integration.'
                  : 'Upgrade to Premium for automated Decentro virtual account triggers.'}
              </p>
            </div>

            <div className="border-t border-white/5 pt-4">
              <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white/3 border border-white/5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-deep-purple/30 border border-deep-purple/50 flex items-center justify-center shrink-0">
                    <span className="font-display font-semibold text-sm text-purple-300">
                      {user.email.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-white truncate">{user.email}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Zap size={10} className="text-electric-green fill-electric-green" />
                      <span className="text-[10px] text-electric-green font-mono font-bold uppercase tracking-wider">
                        {user.subscriptionTier}
                      </span>
                    </div>
                  </div>
                </div>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    title="Log out of FlowState"
                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/5 transition cursor-pointer"
                  >
                    <LogOut size={16} />
                  </button>
                )}
              </div>
              <p className="text-[10px] text-gray-500 text-center mt-3 font-mono">
                Secured with Account Aggregator (AA)
              </p>
            </div>
          </>
        ) : (
          <div className="p-4 rounded-2xl bg-white/3 border border-white/5 text-center">
            <p className="text-xs text-gray-400 mb-3 font-mono">Explore FlowState's automated ledger tools.</p>
            <button
              onClick={() => setActiveTab('register')}
              className="w-full bg-electric-green text-black font-semibold text-xs py-2 rounded-xl hover:bg-opacity-90 transition cursor-pointer"
            >
              Get Started Now
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
