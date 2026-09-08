import React, { useState } from 'react';
import { X, Volume2, VolumeX, Shield, RefreshCw, Cloud, Edit2, Check } from 'lucide-react';
import { ProfileId, SquadState } from '../types';
import { PROFILES } from '../data/profiles';
import { soundFX } from '../services/soundEffects';
import { updateCustomName } from '../services/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  squadState: SquadState;
  onUpdateSquadState: (newState: SquadState) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  squadState,
  onUpdateSquadState,
}) => {
  const activeId = squadState.activeProfileId;
  const config = PROFILES[activeId];
  const progress = squadState.profiles[activeId];

  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(progress.name || config.name);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundFX.enabled);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleSound = () => {
    soundFX.enabled = !soundFX.enabled;
    setSoundEnabled(soundFX.enabled);
  };

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    const updated = updateCustomName(squadState, activeId, nameInput.trim());
    onUpdateSquadState(updated);
    setIsEditingName(false);
    setMessage('Name erfolgreich geändert! ✅');
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
    setMessage('Heutige Mission für ' + (progress.name || config.name) + ' zurückgesetzt!');
    setTimeout(() => setMessage(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-black text-white">
              Einstellungen
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
                  {progress.name || config.name}
                  <span className="text-[10px] px-1.5 py-0.2 bg-indigo-950 text-indigo-300 rounded font-mono border border-indigo-800/50">
                    {config.mbti}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {config.title}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditingName(!isEditingName)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700"
              title="Name anpassen"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Inline Name Edit Input */}
          {isEditingName && (
            <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
              <label className="text-[11px] font-semibold text-slate-300 block">
                Dein Name / Spitzname:
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
                  Speichern
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Switcher (Only shown if NOT dedicated device) */}
        {!squadState.dedicatedProfileId && (
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              Profil wechseln (Gemeinsamer Test-Modus):
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
                    <div className="text-[9px] text-slate-400 font-mono">
                      {prof.mbti}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Silent Cloud-Sync Card */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-950/60 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                Automatischer Cloud-Sync
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[10px] text-slate-400">
                Fortschritt wird lautlos im Hintergrund gesichert
              </div>
            </div>
          </div>
        </div>

        {/* Audio / SFX Toggle */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white">Soundeffekte</div>
            <div className="text-[10px] text-slate-400">
              Töne beim Tippen und Lösen
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

        {/* Admin Tools for Big Brother */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Admin-Optionen (Für den großen Bruder)
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
            <div>
              <div className="text-xs font-semibold text-slate-200">
                ⚡ Schnelltest (24h-Sperre aus)
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
              {squadState.testModeUnlocked ? 'AKTIV' : 'AUS'}
            </button>
          </div>

          <button
            onClick={handleResetToday}
            className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-[11px] font-semibold text-slate-300 border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            Heutigen Tag zurücksetzen
          </button>
        </div>
      </div>
    </div>
  );
};
