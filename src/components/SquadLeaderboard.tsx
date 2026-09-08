import React from 'react';
import { Users, Flame, CheckCircle2, Clock, Sparkles, Zap } from 'lucide-react';
import { ProfileId, SquadState } from '../types';
import { PROFILES } from '../data/profiles';
import { isCompletedToday } from '../services/storage';

interface SquadLeaderboardProps {
  squadState: SquadState;
  onSelectProfile: (id: ProfileId) => void;
}

export const SquadLeaderboard: React.FC<SquadLeaderboardProps> = ({
  squadState,
  onSelectProfile,
}) => {
  const profileIds: ProfileId[] = ['sister', 'brother1', 'brother2'];

  const allCompletedToday = profileIds.every((id) =>
    isCompletedToday(squadState.profiles[id], squadState.testModeUnlocked)
  );

  const totalCompletedQuests = profileIds.reduce(
    (acc, id) => acc + squadState.profiles[id].completedDays.length,
    0
  );

  return (
    <div className="max-w-md mx-auto p-4 pb-24 space-y-4">
      {/* Squad Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-indigo-400 font-bold">
              <Users className="w-4 h-4" />
              Familien Squad Progress
            </div>
            <h2 className="text-xl font-black text-white mt-1">
              A1.1 Geschwister-Team
            </h2>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black font-mono text-amber-400">
              {totalCompletedQuests}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Quests gemeistert
            </div>
          </div>
        </div>

        {/* Triple Combo Banner */}
        <div className="mt-4 pt-3 border-t border-indigo-900/50">
          {allCompletedToday ? (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/40 flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400 animate-bounce" />
              <div>
                <div className="text-xs font-black text-amber-300">
                  ⚡ 3/3 TRIPLE COMBO AKTIV! ⚡
                </div>
                <div className="text-[10px] text-slate-300">
                  Alle 3 Geschwister haben heute gelernt! Großartige Disziplin!
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Wenn alle 3 heute 1 Min lernen, leuchtet der Triple-Combo Bonus auf!
            </div>
          )}
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
              className={`p-4 rounded-2xl border transition-all ${
                isCurrentActive
                  ? 'bg-slate-900 border-indigo-500/80 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Avatar & Identity */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shadow">
                    {config.userAvatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">
                        {progress.name || config.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono border border-indigo-800/50">
                        {config.mbti}
                      </span>
                      {isCurrentActive && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800/60">
                          Du
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      {config.title}
                    </div>
                  </div>
                </div>

                {/* Today Status Badge */}
                <div className="text-right">
                  {isDone ? (
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Erledigt
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                      <Clock className="w-3.5 h-3.5" />
                      Wartet
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Row */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800/60">
                  <div className="text-[10px] text-slate-400">Streak</div>
                  <div className="text-sm font-bold text-amber-400 flex items-center justify-center gap-1 font-mono">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {progress.streak} d
                  </div>
                </div>

                <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800/60">
                  <div className="text-[10px] text-slate-400">Fortschritt</div>
                  <div className="text-sm font-bold text-indigo-300 font-mono">
                    Tag {progress.currentDay}/60
                  </div>
                </div>

                <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800/60">
                  <div className="text-[10px] text-slate-400">Gesamt XP</div>
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
                  Zu {progress.name || config.name} wechseln
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
