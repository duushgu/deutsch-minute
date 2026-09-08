import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { ProfileConfig } from '../types';
import { FRIENDS_BY_PROFILE, FriendCharacter } from '../data/friends';
import { soundFX } from '../services/soundEffects';

interface OnboardingModalProps {
  config: ProfileConfig;
  defaultPartnerName: string;
  defaultPartnerAvatar: string;
  onComplete: (customName: string, partnerName: string, partnerAvatar: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  config,
  defaultPartnerName,
  defaultPartnerAvatar,
  onComplete,
}) => {
  const friendsList = FRIENDS_BY_PROFILE[config.id] || [];

  // Name input starts EMPTY as requested!
  const [nameInput, setNameInput] = useState<string>('');
  const [selectedFriend, setSelectedFriend] = useState<FriendCharacter>(
    () => friendsList[0] || {
      id: 'default',
      name: defaultPartnerName,
      role: 'Найз',
      avatar: defaultPartnerAvatar,
      series: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = nameInput.trim() || config.name;
    soundFX.playCorrect();
    onComplete(finalName, selectedFriend.name, selectedFriend.avatar);
  };

  const handleSelectFriend = (friend: FriendCharacter) => {
    soundFX.playTap();
    setSelectedFriend(friend);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl max-w-md w-full p-5 shadow-2xl relative text-center space-y-4 my-auto">
        {/* Top Badge */}
        <div className="text-center">
          <div className="text-3xl mb-1">{selectedFriend.avatar}</div>
          <h2 className="text-lg font-black text-white">
            Герман хэлний 1 минут
          </h2>
          <p className="text-xs text-slate-400">
            Өдөрт 1-хэн минут суралцаж, багийн хамт хүчирхэгжээрэй!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Step 1: Empty Name Input */}
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <label className="text-xs font-bold text-white block mb-1">
              1. Чиний нэр хэн бэ? (Wie heißt du?)
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              Өөрийн нэр эсвэл дуртай хочоо бичээрэй:
            </p>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Нэрээ энд бичнэ үү..."
              maxLength={20}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold text-white focus:outline-none focus:border-indigo-500 shadow-inner"
              autoFocus
            />
          </div>

          {/* Step 2: Friend / Hero Selection */}
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-white block">
                2. Хамтрагч баатраа сонгоно уу:
              </label>
              <span className="text-[10px] text-indigo-300 font-mono">
                {selectedFriend.name}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2.5">
              Энэ баатар чамтай өдөр бүр германаар чатлах болно!
            </p>

            {/* Character Cards Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {friendsList.map((friend) => {
                const isChosen = selectedFriend.id === friend.id;
                return (
                  <button
                    type="button"
                    key={friend.id}
                    onClick={() => handleSelectFriend(friend)}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all active:scale-95 ${
                      isChosen
                        ? 'bg-indigo-600/30 border-indigo-400 shadow-sm shadow-indigo-500/30'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xl shrink-0">{friend.avatar}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate flex items-center justify-between">
                        <span>{friend.name}</span>
                        {isChosen && <Check className="w-3 h-3 text-indigo-300" />}
                      </div>
                      <div className="text-[9px] text-slate-400 truncate">
                        {friend.role}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-98 transition-all"
          >
            <span>Хамтдаа эхлэх! / Los geht's!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
