import React, { useState } from 'react';
import { X, Volume2, VolumeX, Shield, RefreshCw, Edit2, Check, Palette } from 'lucide-react';
import { ProfileId, SquadState, ThemeId } from '../types';
import { PROFILES } from '../data/profiles';
import { FRIENDS_BY_PROFILE, FriendCharacter } from '../data/friends';
import { soundFX } from '../services/soundEffects';
import { updateCustomName, saveSquadState } from '../services/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  squadState: SquadState;
  onUpdateSquadState: (newState: SquadState) => void;
}

const THEME_OPTIONS: Array<{
  id: ThemeId;
  title: string;
  icon: string;
  description: string;
  dotClass: string;
  selectedBorderClass: string;
  selectedBgClass: string;
}> = [
  {
    id: 'cozy',
    title: 'Demon Slayer & My Hero Academia',
    icon: '🛡️',
    description: 'Ногоон хаори хээ, баатрын энерги, амьсгалын зэрэг',
    dotClass: 'bg-emerald-400 border-emerald-300 shadow-[0_0_8px_#10b981]',
    selectedBorderClass: 'border-emerald-500/80 shadow-emerald-500/20',
    selectedBgClass: 'bg-emerald-950/60',
  },
  {
    id: 'gamer',
    title: 'Mobile Legends Cyber Arena',
    icon: '⚡',
    description: 'Кибер тактик, неон цэнхэр гэрэл, сканлайн шугам',
    dotClass: 'bg-cyan-400 border-cyan-300 shadow-[0_0_8px_#06b6d4]',
    selectedBorderClass: 'border-cyan-500/80 shadow-cyan-500/20',
    selectedBgClass: 'bg-cyan-950/60',
  },
  {
    id: 'kdrama',
    title: 'K-Drama & Aesthetic Twilight',
    icon: '🌸',
    description: 'Сакура цэцгийн дэлбээ, ягаан туяа, өдрийн дурсамж',
    dotClass: 'bg-pink-400 border-pink-300 shadow-[0_0_8px_#ec4899]',
    selectedBorderClass: 'border-pink-500/80 shadow-pink-500/20',
    selectedBgClass: 'bg-pink-950/60',
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  squadState,
  onUpdateSquadState,
}) => {
  const activeId = squadState.activeProfileId;
  const config = PROFILES[activeId];
  const progress = squadState.profiles[activeId];
  const friendsList = FRIENDS_BY_PROFILE[activeId] || [];

  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [isChoosingFriend, setIsChoosingFriend] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(progress.name || config.name);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundFX.enabled);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isPhoneticsActive = Boolean(
    progress.showPhoneticsArchiveDays1to5 ?? squadState.showPhoneticsArchiveDays1to5
  );

  const effectiveTheme: ThemeId = progress.customTheme || config.theme || 'gamer';

  const handleToggleSound = () => {
    soundFX.enabled = !soundFX.enabled;
    setSoundEnabled(soundFX.enabled);
  };

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    const updated = updateCustomName(squadState, activeId, nameInput.trim());
    onUpdateSquadState(updated);
    setIsEditingName(false);
    setMessage('Нэр амжилттай хадгалагдлаа! ✅');
    setTimeout(() => setMessage(null), 2500);
  };

  const handleSelectPartner = (friend: FriendCharacter) => {
    soundFX.playTap();
    const updated: SquadState = {
      ...squadState,
      profiles: {
        ...squadState.profiles,
        [activeId]: {
          ...progress,
          partnerName: friend.name,
          partnerAvatar: friend.avatar,
        },
      },
    };
    saveSquadState(updated);
    onUpdateSquadState(updated);
    setIsChoosingFriend(false);
    setMessage(`${friend.name} таны хамтрагч боллоо! 🌟`);
    setTimeout(() => setMessage(null), 2500);
  };

  const handleSelectProfile = (id: ProfileId) => {
    const updated: SquadState = {
      ...squadState,
      activeProfileId: id,
    };
    onUpdateSquadState(updated);
  };

  const handleToggleTestMode = () => {
    const updated: SquadState = {
      ...squadState,
      testModeUnlocked: !squadState.testModeUnlocked,
    };
    onUpdateSquadState(updated);
  };

  const handleTogglePhoneticsArchive = () => {
    soundFX.playTap();
    const nextVal = !isPhoneticsActive;
    const updated: SquadState = {
      ...squadState,
      showPhoneticsArchiveDays1to5: nextVal,
      profiles: {
        ...squadState.profiles,
        [activeId]: {
          ...progress,
          showPhoneticsArchiveDays1to5: nextVal,
        },
      },
    };
    saveSquadState(updated);
    onUpdateSquadState(updated);
    setMessage(
      nextVal
        ? 'Архивт эхний 5 өдрийн дуудлагын галиг нээгдлээ! 📖'
        : 'Дуудлагын галиг хаагдлаа.'
    );
    setTimeout(() => setMessage(null), 2500);
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
    setMessage('Үндсэн загвар амжилттай солигдлоо! ✨');
    setTimeout(() => setMessage(null), 2500);
  };

  const handleResetToday = () => {
    const updated: SquadState = {
      ...squadState,
      profiles: {
        ...squadState.profiles,
        [activeId]: {
          ...progress,
          lastCompletedDate: null,
        },
      },
    };
    onUpdateSquadState(updated);
    setMessage('Өнөөдрийн даалгаврыг дахин эхлүүлэхээр боллоо!');
    setTimeout(() => setMessage(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full max-h-[90vh] overflow-y-auto p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-black text-white">
              Тохиргоо (Einstellungen)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {message && (
          <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-700/60 text-indigo-200 text-xs text-center font-semibold animate-fadeIn">
            {message}
          </div>
        )}

        {/* Profile Card & Name Edit */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{config.userAvatar}</span>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{progress.name || config.name}</span>
                  <span className="text-xs">{progress.partnerAvatar || config.partnerAvatar}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Хамтрагч: {progress.partnerName || config.partnerName}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditingName(!isEditingName)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700"
              title="Нэр өөрчлөх"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Inline Name Edit Input */}
          {isEditingName && (
            <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
              <label className="text-[11px] font-semibold text-slate-300 block">
                Өөрийн нэр / хоч:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  maxLength={20}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                />
                <button
                  onClick={handleSaveName}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Хадгалах
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Change Partner Button */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{progress.partnerAvatar || config.partnerAvatar}</span>
              <div>
                <div className="text-xs font-bold text-white">
                  Хамтрагч: {progress.partnerName || config.partnerName}
                </div>
                <div className="text-[10px] text-slate-400">
                  Германаар ярилцах найз
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsChoosingFriend(!isChoosingFriend)}
              className="px-2.5 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-500/50 text-[11px] font-bold"
            >
              Солих
            </button>
          </div>

          {/* Partner Grid in Settings */}
          {isChoosingFriend && (
            <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto pr-1">
              {friendsList.map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleSelectPartner(f)}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 text-xs transition-all active:scale-95 ${
                    progress.partnerName === f.name
                      ? 'bg-indigo-600/40 border-indigo-400 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-lg">{f.avatar}</span>
                  <div className="truncate">
                    <div className="font-bold truncate">{f.name}</div>
                    <div className="text-[9px] text-slate-400 truncate">{f.role}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* NEW SETTING 1: Phonetics only in Archive for Days 1 to 5          */}
        {/* ================================================================= */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div className="pr-3">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Авиа дуудлагын галиг</span>
              <span className="text-[10px] text-amber-400 bg-amber-950/70 border border-amber-800/60 px-1.5 py-0.2 rounded font-mono">
                Архивт 1-5 өдөр
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Зөвхөн архивын эхний 5 хичээлд герман дуудлагын монгол галиг харуулах
            </div>
          </div>
          <button
            onClick={handleTogglePhoneticsArchive}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shrink-0 ${
              isPhoneticsActive
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm shadow-amber-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {isPhoneticsActive ? 'ИДЭВХТЭЙ' : 'УНТРААЛТТАЙ'}
          </button>
        </div>

        {/* ================================================================= */}
        {/* NEW SETTING 2: Theme Selection List                              */}
        {/* ================================================================= */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-indigo-400" />
              <span>Үндсэн загвар сонгох (Theme)</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Арын дэвсгэрийн хөдөлгөөн ба өнгө төрхийг өөрийн хүссэнээр солих
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            {THEME_OPTIONS.map((t) => {
              const isSelected = effectiveTheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectTheme(t.id)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all active:scale-98 ${
                    isSelected
                      ? `${t.selectedBorderClass} ${t.selectedBgClass} shadow-md`
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{t.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{t.title}</span>
                        {isSelected && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/20 text-white font-mono">
                            Сонгогдсон
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {t.description}
                      </div>
                    </div>
                  </div>
                  <div className={`w-3.5 h-3.5 rounded-full border ${t.dotClass}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Audio / SFX Toggle */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white">Дууны эффект</div>
            <div className="text-[10px] text-slate-400">
              Товчлуур дарах, зөв хариулах чимээ
            </div>
          </div>
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50'
                : 'bg-slate-800 text-slate-500 border-slate-700'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Profile Switcher (Only shown if NOT dedicated device) */}
        {!squadState.dedicatedProfileId && (
          <div className="pt-2 border-t border-slate-800">
            <label className="text-xs font-bold text-slate-300 block mb-2">
              Профайл солих (Туршилтын горим):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['sister', 'brother1', 'brother2'] as ProfileId[]).map((id) => {
                const prof = PROFILES[id];
                const p = squadState.profiles[id];
                const isSelected = squadState.activeProfileId === id;
                return (
                  <button
                    key={id}
                    onClick={() => handleSelectProfile(id)}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-indigo-600/30 border-indigo-500 shadow-md shadow-indigo-500/20'
                        : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-xl mb-0.5">{prof.userAvatar}</div>
                    <div className="text-[11px] font-bold text-white truncate">
                      {p.name || prof.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Admin Tools for Big Brother */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Том ахын тохиргоо (Admin)
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
            <div>
              <div className="text-xs font-semibold text-slate-200">
                ⚡ 24 цагийн түгжээг унтраах
              </div>
            </div>
            <button
              onClick={handleToggleTestMode}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                squadState.testModeUnlocked
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {squadState.testModeUnlocked ? 'ИДЭВХТЭЙ' : 'УНТРААЛТТАЙ'}
            </button>
          </div>

          <button
            onClick={handleResetToday}
            className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-[11px] font-semibold text-slate-300 border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            Өнөөдрийн даалгаврыг дахин эхлүүлэх
          </button>
        </div>
      </div>
    </div>
  );
};
