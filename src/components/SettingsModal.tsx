import React, { useState } from 'react';
import { X, Volume2, VolumeX, Shield, Upload, Copy, Check, RefreshCw } from 'lucide-react';
import { ProfileId, SquadState } from '../types';
import { PROFILES } from '../data/profiles';
import { exportStateString, importStateString } from '../services/storage';
import { soundFX } from '../services/soundEffects';

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
  const [importCode, setImportCode] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundFX.enabled);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleSound = () => {
    soundFX.enabled = !soundFX.enabled;
    setSoundEnabled(soundFX.enabled);
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
    const active = squadState.activeProfileId;
    const currentProfile = squadState.profiles[active];
    const updated: SquadState = {
      ...squadState,
      profiles: {
        ...squadState.profiles,
        [active]: {
          ...currentProfile,
          lastCompletedDate: null,
        },
      },
    };
    onUpdateSquadState(updated);
    setMessage('Heutiger Status für ' + PROFILES[active].name + ' zurückgesetzt!');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCopyBackup = () => {
    const encoded = exportStateString(squadState);
    navigator.clipboard.writeText(encoded);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleImportBackup = () => {
    if (!importCode.trim()) return;
    const restored = importStateString(importCode.trim());
    if (restored) {
      onUpdateSquadState(restored);
      setMessage('Fortschritt erfolgreich wiederhergestellt! ✅');
      setImportCode('');
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage('Fehler: Ungültiger Wiederherstellungscode! ❌');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-5 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-black text-white">
              Einstellungen & Geschwister-Sync
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
          <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-700/60 text-indigo-200 text-xs text-center font-semibold animate-fadeIn">
            {message}
          </div>
        )}

        {/* Profile Switcher */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">
            Aktives Geschwister-Profil wählen:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['sister', 'brother1', 'brother2'] as ProfileId[]).map((id) => {
              const prof = PROFILES[id];
              const isSelected = squadState.activeProfileId === id;
              return (
                <button
                  key={id}
                  onClick={() => handleSelectProfile(id)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'bg-indigo-600/30 border-indigo-500 shadow-md shadow-indigo-500/20'
                      : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-2xl mb-1">{prof.userAvatar}</div>
                  <div className="text-xs font-bold text-white">{prof.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {prof.mbti}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Audio / SFX Toggle */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white">Soundeffekte</div>
            <div className="text-[11px] text-slate-400">
              Interaktive Töne beim Tippen & Lösen
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

        {/* Admin Section for Big Brother */}
        <div className="pt-3 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            Admin-Bereich (Für den großen Bruder)
          </div>

          {/* Test Mode Toggle */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-200">
                ⚡ Schnelltest-Modus (24h-Sperre aus)
              </div>
              <div className="text-[10px] text-slate-400">
                Ermöglicht sofortiges Durchtesten aller Tage
              </div>
            </div>
            <button
              onClick={handleToggleTestMode}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                squadState.testModeUnlocked
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {squadState.testModeUnlocked ? 'AKTIV' : 'AUS'}
            </button>
          </div>

          {/* Reset Today's mission for current user */}
          <button
            onClick={handleResetToday}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-300 border border-slate-700 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Heutige Mission zurücksetzen (für erneuten Durchlauf)
          </button>
        </div>

        {/* Backup & Restore (Zero-Login Cloud/Code Sync) */}
        <div className="pt-3 border-t border-slate-800 space-y-3">
          <div className="text-xs font-bold text-slate-300">
            Geschwister-Fortschritt sichern (Backup / Handy-Wechsel)
          </div>
          <p className="text-[11px] text-slate-400">
            Wenn ein Geschwisterkind das Handy wechselt: Code hier kopieren und auf dem neuen Handy einfügen.
          </p>

          <div className="flex gap-2">
            <button
              onClick={handleCopyBackup}
              className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow active:scale-98"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  Kopiert!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Backup-Code kopieren
                </>
              )}
            </button>
          </div>

          <div className="space-y-1.5 pt-1">
            <input
              type="text"
              placeholder="Backup-Code hier einfügen..."
              value={importCode}
              onChange={(e) => setImportCode(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <button
              onClick={handleImportBackup}
              disabled={!importCode.trim()}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 active:scale-98"
            >
              <Upload className="w-3.5 h-3.5" />
              Fortschritt wiederherstellen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
