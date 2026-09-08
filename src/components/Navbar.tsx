import React from 'react';
import { Flame, Settings, Users, BookOpen, MessageCircle, User } from 'lucide-react';
import { ProfileConfig, SiblingProgress } from '../types';

interface NavbarProps {
  config: ProfileConfig;
  progress: SiblingProgress;
  activeTab: 'chat' | 'squad' | 'archive' | 'profile';
  setActiveTab: (tab: 'chat' | 'squad' | 'archive' | 'profile') => void;
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
  const headerBgClass =
    config.theme === 'kdrama'
      ? 'bg-[#13081e]/80 border-pink-900/40 shadow-lg shadow-pink-950/20'
      : config.theme === 'catppuccin'
      ? 'bg-[#1e2030]/85 border-[#c6a0f6]/30 shadow-lg shadow-purple-950/20'
      : config.theme === 'gamer'
      ? 'bg-[#030914]/85 border-cyan-900/40 shadow-lg shadow-cyan-950/20'
      : config.theme === 'mlbb_jjk'
      ? 'bg-[#0e061c]/85 border-purple-900/40 shadow-lg shadow-purple-950/20'
      : config.theme === 'mlbb_transformers'
      ? 'bg-[#0b1220]/85 border-yellow-900/40 shadow-lg shadow-yellow-950/20'
      : config.theme === 'rengoku'
      ? 'bg-[#1c0804]/85 border-orange-900/40 shadow-lg shadow-orange-950/20'
      : (config.theme === 'cozy' || config.theme === 'tanjiro' || config.theme === 'mha_deku')
      ? 'bg-[#021610]/85 border-emerald-900/40 shadow-lg shadow-emerald-950/20'
      : 'bg-slate-950/85 border-slate-800 shadow-lg shadow-black/20';

  const avatarBgClass =
    config.theme === 'kdrama'
      ? 'bg-pink-600/20 border-pink-500/40 text-pink-200'
      : config.theme === 'catppuccin'
      ? 'bg-[#c6a0f6]/20 border-[#c6a0f6]/40 text-[#c6a0f6]'
      : config.theme === 'gamer'
      ? 'bg-cyan-600/20 border-cyan-500/40 text-cyan-200'
      : config.theme === 'mlbb_jjk'
      ? 'bg-purple-600/20 border-purple-500/40 text-purple-200'
      : config.theme === 'mlbb_transformers'
      ? 'bg-yellow-600/20 border-yellow-500/40 text-yellow-200'
      : config.theme === 'rengoku'
      ? 'bg-orange-600/20 border-orange-500/40 text-orange-200'
      : (config.theme === 'cozy' || config.theme === 'tanjiro' || config.theme === 'mha_deku')
      ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-200'
      : 'bg-indigo-600/20 border-indigo-500/40 text-indigo-200';

  const tabActiveClass =
    config.theme === 'kdrama'
      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/40'
      : config.theme === 'catppuccin'
      ? 'bg-gradient-to-r from-[#c6a0f6] to-[#b7bdf8] text-[#181926] font-black shadow-md shadow-[#c6a0f6]/40'
      : config.theme === 'gamer'
      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/40'
      : config.theme === 'mlbb_jjk'
      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/40'
      : config.theme === 'mlbb_transformers'
      ? 'bg-gradient-to-r from-yellow-500 to-blue-600 text-white shadow-md shadow-yellow-500/40'
      : config.theme === 'rengoku'
      ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md shadow-orange-600/40'
      : (config.theme === 'cozy' || config.theme === 'tanjiro' || config.theme === 'mha_deku')
      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/40'
      : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/40';

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-xl border-b px-4 py-2.5 transition-all ${headerBgClass}`}>
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Profile Info */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 bg-slate-900/60 hover:bg-slate-800/80 p-1.5 pr-3 rounded-full border border-slate-700/60 backdrop-blur transition-all text-left"
          >
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-inner border ${avatarBgClass}`}>
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
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Тохиргоо (Einstellungen)"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="max-w-md mx-auto flex items-center justify-around mt-2 pt-2 border-t border-slate-800/40">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-1.5 text-xs font-semibold py-1 px-3.5 rounded-full transition-all ${
            activeTab === 'chat'
              ? tabActiveClass
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
            className={`flex items-center gap-1.5 text-xs font-semibold py-1 px-3.5 rounded-full transition-all ${
              activeTab === 'squad'
                ? tabActiveClass
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
              ? tabActiveClass
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Архив
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-1.5 text-xs font-semibold py-1 px-3 rounded-full transition-all ${
            activeTab === 'profile'
              ? tabActiveClass
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Профайл
        </button>
      </div>
    </header>
  );
};
