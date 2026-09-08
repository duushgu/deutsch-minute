import React from 'react';
import { Flame, Settings, Users, BookOpen, MessageCircle } from 'lucide-react';
import { ProfileConfig, SiblingProgress } from '../types';

interface NavbarProps {
  config: ProfileConfig;
  progress: SiblingProgress;
  activeTab: 'chat' | 'squad' | 'archive';
  setActiveTab: (tab: 'chat' | 'squad' | 'archive') => void;
  onOpenSettings: () => void;
  testModeUnlocked: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  progress,
  activeTab,
  setActiveTab,
  onOpenSettings,
  testModeUnlocked,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Profile Info */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 p-1.5 pr-3 rounded-full border border-slate-700/60 transition-all text-left"
          >
            <span className="w-8 h-8 rounded-full bg-indigo-600/30 flex items-center justify-center text-lg shadow-inner">
              {config.userAvatar}
            </span>
            <div>
              <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <span>{progress.name || config.name}</span>
                <span className="text-xs">{progress.partnerAvatar || config.partnerAvatar}</span>
              </div>
              <div className="text-[10px] text-slate-400">
                <span>{progress.currentDay}/60-р өдөр</span>
              </div>
            </div>
          </button>
        </div>

        {/* Streak & Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span className="text-xs font-black text-amber-400 font-mono">
              {progress.streak}
            </span>
          </div>

          {/* Settings / Admin Gear */}
          <button
            onClick={onOpenSettings}
            className={`p-2 rounded-full border transition-all ${
              testModeUnlocked
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Тохиргоо (Einstellungen)"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="max-w-md mx-auto flex items-center justify-around mt-2 pt-2 border-t border-slate-800/60">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-1.5 text-xs font-semibold py-1 px-3 rounded-full transition-all ${
            activeTab === 'chat'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          1-Min Quest
        </button>

        {/* Squad is ONLY visible for ISTP (Томоо - brother1) */}
        {config.id === 'brother1' && (
          <button
            onClick={() => setActiveTab('squad')}
            className={`flex items-center gap-1.5 text-xs font-semibold py-1 px-3 rounded-full transition-all ${
              activeTab === 'squad'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Squad
          </button>
        )}

        <button
          onClick={() => setActiveTab('archive')}
          className={`flex items-center gap-1.5 text-xs font-semibold py-1 px-3 rounded-full transition-all ${
            activeTab === 'archive'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Архив
        </button>
      </div>
    </header>
  );
};
