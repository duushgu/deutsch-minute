import React from 'react';
import { Users, Flame, CheckCircle2, Clock } from 'lucide-react';
import { ProfileId, SquadState } from '../types';
import { PROFILES } from '../data/profiles';
import { isCompletedToday } from '../services/storage';
import { getIstpRank, getIsfjHeroRank } from '../services/gamification';

interface SquadLeaderboardProps {
  squadState: SquadState;
  onSelectProfile: (id: ProfileId) => void;
}

export const SquadLeaderboard: React.FC<SquadLeaderboardProps> = ({
  squadState,
  onSelectProfile,
}) => {
  const profileIds: ProfileId[] = ['sister', 'brother1', 'brother2'];

  const totalCompletedQuests = profileIds.reduce(
    (acc, id) => acc + (squadState.profiles[id]?.completedDays?.length || 0),
    0
  );

  return (
    <div className="max-w-md mx-auto p-4 pb-24 space-y-4">
      {/* Squad Header Banner */}
      <div className="bg-gradient-to-r from-[#07172e] via-[#041d33] to-[#082b3d] border border-cyan-500/40 rounded-3xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-cyan-400 font-bold">
              <Users className="w-4 h-4" />
              Гэр бүлийн баг (Squad)
            </div>
            <h2 className="text-xl font-black text-white mt-1">
              Герман хэлний баг
            </h2>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black font-mono text-amber-400">
              {totalCompletedQuests}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Дууссан хичээл
            </div>
          </div>
        </div>
      </div>

      {/* Sibling Cards */}
      <div className="space-y-3">
        {profileIds.map((id) => {
          const config = PROFILES[id];
          const progress = squadState.profiles[id];
          const isDone = isCompletedToday(progress, squadState.testModeUnlocked);
          const isCurrentActive = squadState.activeProfileId === id;

          return (
            <div
              key={id}
              className={`p-4 rounded-2xl border transition-all backdrop-blur-md ${
                isCurrentActive
                  ? 'bg-[#061b34]/90 border-cyan-500/80 shadow-lg shadow-cyan-500/20'
                  : 'bg-[#040e1f]/75 border-cyan-900/40 hover:border-cyan-700/60'
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Avatar & Identity */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-2xl shadow">
                    {config.userAvatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">
                        {progress.name || config.name}
                      </span>
                      {isCurrentActive && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold border border-cyan-800/60">
                          Чи
                        </span>
                      )}
                    </div>
                    {/* Personalized Gamification Subtitle */}
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {id === 'brother1' && (
                        <span className="text-cyan-400 font-medium flex items-center gap-1">
                          <span>{getIstpRank(progress.completedDays?.length || 0, progress.xp || 0).tierBadge}</span>
                          <span>{getIstpRank(progress.completedDays?.length || 0, progress.xp || 0).tierName}</span>
                        </span>
                      )}
                      {id === 'brother2' && (
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <span>{getIsfjHeroRank(progress.completedDays?.length || 0, progress.partnerName).rankBadge}</span>
                          <span>{getIsfjHeroRank(progress.completedDays?.length || 0, progress.partnerName).rankTitle.split('•')[0]}</span>
                        </span>
                      )}
                      {id === 'sister' && (
                        <span className="text-pink-400 font-medium flex items-center gap-1">
                          <span>🌸</span>
                          <span>{progress.completedDays?.length || 0}/10 дурсамж</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Today Status Badge */}
                <div className="text-right">
                  {isDone ? (
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Дууссан
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
                      <Clock className="w-3.5 h-3.5" />
                      Хүлээгдэж байна
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Row */}
              <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
                <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                  <div className="text-[10px] text-slate-400">Цуврал</div>
                  <div className="text-sm font-bold text-amber-400 flex items-center justify-center gap-1 font-mono">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {progress.streak} өдөр
                  </div>
                </div>

                <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                  <div className="text-[10px] text-slate-400">Өдөр</div>
                  <div className="text-sm font-bold text-cyan-300 font-mono">
                    {progress.currentDay}/60
                  </div>
                </div>

                <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                  <div className="text-[10px] text-slate-400">Нийт оноо</div>
                  <div className="text-sm font-bold text-purple-300 font-mono">
                    {progress.xp} XP
                  </div>
                </div>
              </div>

              {/* Switch Profile Button (Only shown if shared multi-profile device) */}
              {!isCurrentActive && !squadState.dedicatedProfileId && (
                <button
                  onClick={() => onSelectProfile(id)}
                  className="w-full mt-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all active:scale-98"
                >
                  {progress.name || config.name} рүү шилжих
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
