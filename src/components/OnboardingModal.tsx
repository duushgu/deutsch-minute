import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ProfileConfig } from '../types';
import { soundFX } from '../services/soundEffects';

interface OnboardingModalProps {
  config: ProfileConfig;
  currentName: string;
  onSaveName: (name: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  config,
  currentName,
  onSaveName,
}) => {
  const [nameInput, setNameInput] = useState<string>(currentName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = nameInput.trim() || currentName;
    soundFX.playCorrect();
    onSaveName(finalName);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative overflow-hidden text-center space-y-5">
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl" />
        <div className="absolute -left-8 -bottom-8 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl" />

        {/* Character Avatar */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-950/80 border border-indigo-500/50 text-4xl shadow-inner mx-auto animate-bounce">
          {config.userAvatar}
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 text-indigo-300 text-xs font-mono border border-indigo-800/60 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            {config.title}
          </div>
          <h2 className="text-xl font-black text-white">
            Willkommen bei Deutsch Minute!
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Герман хэлний өдөр тутмын 1 минутын аялалд тавтай морил!
          </p>
        </div>

        {/* Name Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="text-left">
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Wie möchtest du genannt werden?
            </label>
            <div className="text-[11px] text-slate-400 mb-2">
              (Чамайг хэн гэж дуудах вэ? Өөрийн нэр эсвэл хочоо оруулна уу)
            </div>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Dein Name..."
              maxLength={20}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-sm font-bold text-white text-center focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-98 transition-all"
          >
            <span>Los geht's! / Эхлэх</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
