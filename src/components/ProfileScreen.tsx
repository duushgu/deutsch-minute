import React, { useState } from 'react';
import {
  Flame,
  Sparkles,
  Trophy,
  Heart,
  Zap,
  ShieldCheck,
  Star,
  Settings,
  Edit2,
  Check,
  Palette,
} from 'lucide-react';
import { ProfileConfig, ProfileId, SiblingProgress, SquadState, ThemeId } from '../types';
import { ActivityHeatmap } from './ActivityHeatmap';
import { getSisterMemory, getIstpRank, getIsfjHeroRank } from '../services/gamification';
import { updateCustomName, saveSquadState } from '../services/storage';
import { soundFX } from '../services/soundEffects';

interface ProfileScreenProps {
  config: ProfileConfig;
  progress: SiblingProgress;
  squadState: SquadState;
  onUpdateSquadState: (newState: SquadState) => void;
  onOpenSettings: () => void;
}

const PROFILE_THEMES: Record<
  ProfileId,
  Array<{
    id: ThemeId;
    title: string;
    icon: string;
    dotClass: string;
  }>
> = {
  sister: [
    { id: 'kdrama', title: 'K-Drama Twilight', icon: '🌸', dotClass: 'bg-pink-400' },
    { id: 'catppuccin', title: 'Catppuccin Macchiato', icon: '☕', dotClass: 'bg-[#c6a0f6]' },
    { id: 'standard', title: 'Стандарт', icon: '🌙', dotClass: 'bg-slate-400' },
  ],
  brother1: [
    { id: 'gamer', title: 'MLBB: Cyber Arena', icon: '⚡', dotClass: 'bg-cyan-400' },
    { id: 'mlbb_jjk', title: 'MLBB x JJK', icon: '🤞', dotClass: 'bg-purple-400' },
    { id: 'mlbb_transformers', title: 'MLBB x Transformers', icon: '🤖', dotClass: 'bg-yellow-400' },
    { id: 'standard', title: 'Стандарт', icon: '🌙', dotClass: 'bg-slate-400' },
  ],
  brother2: [
    { id: 'tanjiro', title: 'Demon Slayer: Tanjiro', icon: '🌊', dotClass: 'bg-emerald-400' },
    { id: 'rengoku', title: 'Demon Slayer: Fire Hashira', icon: '🔥', dotClass: 'bg-orange-500' },
    { id: 'mha_deku', title: 'My Hero Academia: Deku', icon: '⚡', dotClass: 'bg-teal-400' },
    { id: 'standard', title: 'Стандарт', icon: '🌙', dotClass: 'bg-slate-400' },
  ],
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  config,
  progress,
  squadState,
  onUpdateSquadState,
  onOpenSettings,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(progress.name || config.name);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const activeId = squadState.activeProfileId;
  const userName = progress.name || config.name;
  const partnerName = progress.partnerName || config.partnerName;
  const completedCount = progress.completedDays?.length || 0;
  const currentDay = progress.currentDay || 1;

  // Gamification data by profile
  const sisterMemory = getSisterMemory(currentDay, partnerName, userName);
  const istpRank = getIstpRank(completedCount, progress.xp || 0);
  const isfjHeroRank = getIsfjHeroRank(completedCount, partnerName);

  const availableThemes = PROFILE_THEMES[activeId] || [];

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    const updated = updateCustomName(squadState, activeId, nameInput.trim());
    onUpdateSquadState(updated);
    setIsEditingName(false);
    setSaveToast('Нэр амжилттай солигдлоо! ✅');
    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleSelectTheme = (themeId: ThemeId) => {
    soundFX.playTap();
    const updated: SquadState = {
      ...squadState,
      profiles: {
        ...squadState.profiles,
        [activeId]: {
          ...progress,
          customTheme: themeId,
        },
      },
    };
    saveSquadState(updated);
    onUpdateSquadState(updated);
    setSaveToast('Загвар амжилттай солигдлоо! ✨');
    setTimeout(() => setSaveToast(null), 2500);
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-24 space-y-4">
      {/* Profile Header Hero Card */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 flex items-center justify-center text-3xl shadow-inner">
              {config.userAvatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-black text-white">{userName}</h2>
                <button
                  onClick={() => setIsEditingName(!isEditingName)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                  title="Нэр засах"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <span>Хамтрагч:</span>
                <span className="font-semibold text-slate-200">
                  {progress.partnerAvatar || config.partnerAvatar} {partnerName}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                {config.id === 'sister' && '🌸 K-Drama & Дурсамж'}
                {config.id === 'brother1' && '⚡ Тулааны талбар & Gaming'}
                {config.id === 'brother2' && '🛡️ Баатрын зам & Анимэ'}
              </div>
            </div>
          </div>

          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition-all active:scale-95"
            title="Бүх тохиргоо"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Inline Name Edit Input */}
        {isEditingName && (
          <div className="mt-3 pt-3 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              maxLength={20}
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
            />
            <button
              onClick={handleSaveName}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              Хадгалах
            </button>
          </div>
        )}

        {saveToast && (
          <div className="mt-3 p-2 rounded-xl bg-indigo-950/80 border border-indigo-700/60 text-indigo-200 text-xs text-center font-semibold animate-fadeIn">
            {saveToast}
          </div>
        )}

        {/* Top Stats Trio */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center">
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-center gap-1 text-amber-400 font-mono font-bold text-sm">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              {progress.streak}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Өдөр дараалан</div>
          </div>

          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-center gap-1 text-indigo-400 font-mono font-bold text-sm">
              <Sparkles className="w-3.5 h-3.5" />
              {progress.xp}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Нийт XP</div>
          </div>

          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-center gap-1 text-emerald-400 font-mono font-bold text-sm">
              <Trophy className="w-3.5 h-3.5" />
              {completedCount}/60
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Дууссан хичээл</div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MINIMAL GITHUB 60-DAY ACTIVITY HEATMAP (IN PROFILE!)        */}
      {/* ============================================================ */}
      <ActivityHeatmap progress={progress} theme={config.theme} />

      {/* ============================================================ */}
      {/* PERSONALIZED GAMIFICATION CARD FOR PROFILE                  */}
      {/* ============================================================ */}

      {/* 1. SISTER (INFJ) - K-Drama Aesthetic Daily Polaroid Memory Card */}
      {config.id === 'sister' && (
        <div className="bg-gradient-to-br from-pink-950/40 via-purple-950/30 to-slate-900 border border-pink-500/30 rounded-3xl p-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-pink-300 uppercase tracking-wider">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400/50" />
              {sisterMemory.tag}
            </div>
            <span className="text-[11px] text-pink-300/80 font-mono">
              📖 {completedCount}/10 дурсамж
            </span>
          </div>

          <div className="bg-slate-950/80 border border-pink-500/20 rounded-2xl p-3.5 text-center shadow-lg">
            <div className="text-xs font-bold text-pink-200 mb-1">
              {partnerName} & {userName}
            </div>
            <p className="text-xs text-slate-300 italic px-2 py-1 leading-relaxed">
              "{sisterMemory.quoteMn}"
            </p>
            <div className="mt-2 pt-2 border-t border-pink-900/40 text-[11px] text-pink-300 font-mono">
              🇩🇪 {sisterMemory.quoteDe}
            </div>
          </div>
        </div>
      )}

      {/* 2. BROTHER 1 (ISTP) - Mobile Legends Combat HUD & Rank Badge */}
      {config.id === 'brother1' && (
        <div className="bg-gradient-to-br from-cyan-950/60 via-slate-900 to-emerald-950/40 border border-cyan-500/40 rounded-3xl p-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              Mobile Legends • Цол & Зэрэг
            </div>
            <span className="text-[10px] text-cyan-400 font-mono font-bold bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800">
              {istpRank.combatRole}
            </span>
          </div>

          <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-400/50 flex items-center justify-center text-2xl shadow-inner">
                {istpRank.tierBadge}
              </div>
              <div>
                <div className="text-xs font-black text-white tracking-wide">
                  {istpRank.tierName}
                </div>
                <div className="flex items-center gap-0.5 text-amber-400 mt-1">
                  {Array.from({ length: istpRank.stars }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Дараагийн цол: {istpRank.nextTier}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono font-bold text-cyan-300">
                {istpRank.progressPercent}%
              </div>
              <div className="text-[9px] text-slate-400">Цолны ахиц</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. BROTHER 2 (ISFJ) - Anime Buddy Bond & Hero Shield Card */}
      {config.id === 'brother2' && (
        <div className="bg-gradient-to-br from-emerald-950/60 via-slate-900 to-amber-950/40 border border-emerald-500/40 rounded-3xl p-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Багийн нөхөрлөл & Баатрын цол
            </div>
            <span className="text-[10px] text-emerald-300 font-mono font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
              {isfjHeroRank.rankBadge} {isfjHeroRank.rankTitle.split('•')[0]}
            </span>
          </div>

          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Нөхөрлөлийн холбоо</span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {isfjHeroRank.buddyBondPercent}%
              </span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-emerald-900/50">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${isfjHeroRank.buddyBondPercent}%` }}
              />
            </div>
            <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-200 italic flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>"{isfjHeroRank.heroQuote}"</span>
            </div>
          </div>
        </div>
      )}

      {/* Theme Selection in Profile */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <Palette className="w-4 h-4 text-indigo-400" />
            <span>Аппликейшны загвар (Theme)</span>
          </div>
          <span className="text-[10px] text-slate-400">Хүссэн үедээ солих</span>
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          {availableThemes.map((t) => {
            const isSelected = (progress.customTheme || config.theme) === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTheme(t.id)}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all active:scale-98 ${
                  isSelected
                    ? 'bg-slate-800 border-indigo-500 text-white font-bold shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{t.icon}</span>
                  <span>{t.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${t.dotClass}`} />
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
