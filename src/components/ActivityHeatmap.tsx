import React, { useState } from 'react';
import { Calendar, Flame, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { SiblingProgress, ThemeId } from '../types';

interface ActivityHeatmapProps {
  progress: SiblingProgress;
  theme: ThemeId;
}

const WEEKDAYS = [
  { short: 'Да', full: 'Даваа' },
  { short: 'Мя', full: 'Мягмар' },
  { short: 'Лх', full: 'Лхагва' },
  { short: 'Пү', full: 'Пүрэв' },
  { short: 'Ба', full: 'Баасан' },
  { short: 'Бя', full: 'Бямба' },
  { short: 'Ня', full: 'Ням' },
];

const TOTAL_DAYS = 60;
const ROWS = 7;
const COLS = Math.ceil(TOTAL_DAYS / ROWS); // 9 columns

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ progress, theme }) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(progress.currentDay);

  const completedSet = new Set(progress.completedDays || []);
  const completedCount = completedSet.size;
  const percent = Math.round((completedCount / TOTAL_DAYS) * 100);

  // Dynamic Theme Color styles for fulfilled cells
  const getFulfilledClass = () => {
    switch (theme) {
      case 'catppuccin':
        return 'bg-[#c6a0f6] border-[#b7bdf8] text-[#181926] shadow-[0_0_10px_rgba(198,160,246,0.7)]';
      case 'gamer':
        return 'bg-cyan-400 border-cyan-200 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.7)]';
      case 'mlbb_jjk':
        return 'bg-purple-500 border-purple-300 text-white shadow-[0_0_10px_rgba(168,85,247,0.7)]';
      case 'mlbb_transformers':
        return 'bg-yellow-400 border-amber-200 text-slate-950 shadow-[0_0_10px_rgba(234,179,8,0.7)]';
      case 'rengoku':
        return 'bg-orange-500 border-amber-200 text-white shadow-[0_0_10px_rgba(249,115,22,0.7)]';
      case 'tanjiro':
      case 'cozy':
        return 'bg-emerald-500 border-emerald-300 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.7)]';
      case 'mha_deku':
        return 'bg-teal-400 border-teal-200 text-slate-950 shadow-[0_0_10px_rgba(20,184,166,0.7)]';
      case 'kdrama':
        return 'bg-pink-500 border-pink-300 text-white shadow-[0_0_10px_rgba(236,72,153,0.7)]';
      case 'standard':
      default:
        return 'bg-indigo-500 border-indigo-300 text-white shadow-[0_0_10px_rgba(99,102,241,0.7)]';
    }
  };

  const getCurrentBorderClass = () => {
    switch (theme) {
      case 'catppuccin':
        return 'border-[#c6a0f6] text-[#c6a0f6]';
      case 'gamer':
        return 'border-cyan-400 text-cyan-400';
      case 'mlbb_jjk':
        return 'border-purple-400 text-purple-400';
      case 'mlbb_transformers':
        return 'border-yellow-400 text-yellow-400';
      case 'rengoku':
        return 'border-orange-500 text-orange-400';
      case 'tanjiro':
      case 'cozy':
        return 'border-emerald-400 text-emerald-400';
      case 'mha_deku':
        return 'border-teal-400 text-teal-400';
      case 'kdrama':
        return 'border-pink-400 text-pink-400';
      case 'standard':
      default:
        return 'border-indigo-400 text-indigo-400';
    }
  };

  const fulfilledClass = getFulfilledClass();
  const currentBorderClass = getCurrentBorderClass();

  return (
    <div className="p-4 rounded-3xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md shadow-xl space-y-3">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-bold text-white tracking-wide">
            60 өдрийн зуршил (Habit Matrix)
          </h4>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700/60 font-mono text-[11px] text-slate-300">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span className="font-bold text-white">{completedCount}</span>
          <span className="text-slate-500">/ {TOTAL_DAYS} өдөр</span>
          <span className="text-[10px] text-indigo-400 font-semibold">({percent}%)</span>
        </div>
      </div>

      {/* GitHub / Monkeytype Style Matrix */}
      <div className="flex justify-center pt-1 overflow-x-auto pb-1">
        <div className="flex gap-2 items-start">
          {/* Weekday Row Labels (Mon - Sun) */}
          <div className="flex flex-col gap-1.5 pt-0.5">
            {WEEKDAYS.map((w, idx) => (
              <div
                key={idx}
                className="h-6 w-5 flex items-center justify-end text-[10px] font-mono text-slate-400 font-semibold select-none"
              >
                {w.short}
              </div>
            ))}
          </div>

          {/* 60 Cells Grid (9 columns x 7 rows, capped at 60) */}
          <div className="flex gap-1.5">
            {Array.from({ length: COLS }).map((_, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-1.5">
                {Array.from({ length: ROWS }).map((_, rowIdx) => {
                  const dayNum = colIdx * ROWS + rowIdx + 1;
                  if (dayNum > TOTAL_DAYS) {
                    return (
                      <div
                        key={rowIdx}
                        className="w-6 h-6 rounded-[6px] opacity-0 pointer-events-none"
                        aria-hidden="true"
                      />
                    );
                  }

                  const isDone = completedSet.has(dayNum);
                  const isCurrent = dayNum === progress.currentDay;
                  const isSelected = selectedDay === dayNum;

                  return (
                    <button
                      key={rowIdx}
                      onClick={() => setSelectedDay(dayNum)}
                      title={`${dayNum}-р өдөр: ${isDone ? 'Биелсэн' : isCurrent ? 'Өнөөдөр' : 'Түгжигдсэн'}`}
                      className={`w-6 h-6 rounded-[6px] text-[10px] font-mono font-bold flex items-center justify-center transition-all active:scale-90 ${
                        isDone
                          ? `${fulfilledClass} ${isSelected ? 'ring-2 ring-white scale-105 z-10' : ''}`
                          : isCurrent
                          ? `bg-slate-900/80 border-2 border-dashed ${currentBorderClass} animate-pulse ${
                              isSelected ? 'ring-2 ring-white scale-105 z-10' : ''
                            }`
                          : `bg-slate-900/70 border border-slate-800/80 text-slate-400 hover:border-slate-600 ${
                              isSelected ? 'ring-1 ring-slate-400 scale-105 z-10' : ''
                            }`
                      }`}
                    >
                      {isDone ? '✓' : dayNum}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Day Info Card & Legend */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
        {selectedDay ? (
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-mono">
              {selectedDay}-р өдөр:
            </span>
            {completedSet.has(selectedDay) ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Биелсэн (+100 XP)
              </span>
            ) : selectedDay === progress.currentDay ? (
              <span className="text-amber-300 font-semibold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                Өнөөдрийн хичээл
              </span>
            ) : selectedDay < progress.currentDay ? (
              <span className="text-slate-400">Өнжсөн</span>
            ) : (
              <span className="text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Удахгүй нээгдэнэ
              </span>
            )}
          </div>
        ) : (
          <div className="text-slate-500 text-[10px]">
            Нүдэн дээр дарж өдрийн мэдээлэл харах
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-2.5 text-[10px] text-slate-400 font-mono">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-[3px] bg-slate-900 border border-slate-800" />
            <span>Хүлээгдэж буй</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2.5 h-2.5 rounded-[3px] border border-dashed ${currentBorderClass}`} />
            <span>Өнөөдөр</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2.5 h-2.5 rounded-[3px] ${fulfilledClass}`} />
            <span>Биелсэн</span>
          </div>
        </div>
      </div>
    </div>
  );
};
