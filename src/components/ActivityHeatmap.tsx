import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { SiblingProgress, ThemeId } from '../types';

interface ActivityHeatmapProps {
  progress: SiblingProgress;
  theme: ThemeId;
  className?: string;
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

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  progress,
  theme,
  className = '',
}) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const completedSet = new Set(progress.completedDays || []);
  const completedCount = completedSet.size;
  const percent = Math.round((completedCount / TOTAL_DAYS) * 100);

  // Dynamic Theme Color styles for fulfilled cells (clean GitHub-style squares)
  const getFulfilledClass = () => {
    switch (theme) {
      case 'catppuccin':
        return 'bg-[#c6a0f6] border-[#b7bdf8]/40 shadow-[0_0_6px_rgba(198,160,246,0.6)]';
      case 'gamer':
        return 'bg-cyan-400 border-cyan-200/40 shadow-[0_0_6px_rgba(6,182,212,0.6)]';
      case 'mlbb_jjk':
        return 'bg-purple-500 border-purple-300/40 shadow-[0_0_6px_rgba(168,85,247,0.6)]';
      case 'mlbb_transformers':
        return 'bg-yellow-400 border-amber-200/40 shadow-[0_0_6px_rgba(234,179,8,0.6)]';
      case 'rengoku':
        return 'bg-orange-500 border-amber-200/40 shadow-[0_0_6px_rgba(249,115,22,0.6)]';
      case 'tanjiro':
      case 'cozy':
        return 'bg-emerald-500 border-emerald-300/40 shadow-[0_0_6px_rgba(16,185,129,0.6)]';
      case 'mha_deku':
        return 'bg-teal-400 border-teal-200/40 shadow-[0_0_6px_rgba(20,184,166,0.6)]';
      case 'kdrama':
        return 'bg-pink-500 border-pink-300/40 shadow-[0_0_6px_rgba(236,72,153,0.6)]';
      case 'standard':
      default:
        return 'bg-indigo-500 border-indigo-300/40 shadow-[0_0_6px_rgba(99,102,241,0.6)]';
    }
  };

  const getThemeTextClass = () => {
    switch (theme) {
      case 'catppuccin':
        return 'text-[#c6a0f6]';
      case 'gamer':
        return 'text-cyan-400';
      case 'mlbb_jjk':
        return 'text-purple-400';
      case 'mlbb_transformers':
        return 'text-yellow-400';
      case 'rengoku':
        return 'text-orange-400';
      case 'tanjiro':
      case 'cozy':
        return 'text-emerald-400';
      case 'mha_deku':
        return 'text-teal-400';
      case 'kdrama':
        return 'text-pink-400';
      case 'standard':
      default:
        return 'text-indigo-400';
    }
  };

  const fulfilledClass = getFulfilledClass();
  const themeTextClass = getThemeTextClass();

  const activeDayForInfo = hoveredDay || progress.currentDay;
  const isTargetDone = activeDayForInfo ? completedSet.has(activeDayForInfo) : false;
  const isTargetCurrent = activeDayForInfo === progress.currentDay;
  const weekdayOfActive = activeDayForInfo
    ? WEEKDAYS[(activeDayForInfo - 1) % 7]?.full
    : '';

  return (
    <div className={`p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md shadow-lg space-y-2.5 ${className}`}>
      {/* Header (Minimal like GitHub) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-200">
            60 өдрийн идэвх
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            (GitHub хэв маяг)
          </span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[11px] text-slate-300">
          <Sparkles className={`w-3 h-3 ${themeTextClass}`} />
          <span className="font-bold text-white">{completedCount}</span>
          <span className="text-slate-500">/ {TOTAL_DAYS}</span>
          <span className={`text-[10px] font-semibold ${themeTextClass}`}>({percent}%)</span>
        </div>
      </div>

      {/* GitHub Style Matrix Grid */}
      <div className="flex justify-center pt-1 pb-0.5 overflow-x-auto">
        <div className="flex gap-2 items-start">
          {/* Weekday Labels (Alternating compact like GitHub) */}
          <div className="flex flex-col gap-1 pt-0.5 select-none">
            {WEEKDAYS.map((w, idx) => (
              <div
                key={idx}
                className="h-3.5 w-4 flex items-center justify-end text-[9px] font-mono text-slate-500 font-medium leading-none"
              >
                {idx % 2 === 0 ? w.short : ''}
              </div>
            ))}
          </div>

          {/* 60 Tiny Squircle Tiles (No printed numbers inside - purely visual like GitHub) */}
          <div className="flex gap-1">
            {Array.from({ length: COLS }).map((_, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-1">
                {Array.from({ length: ROWS }).map((_, rowIdx) => {
                  const dayNum = colIdx * ROWS + rowIdx + 1;
                  if (dayNum > TOTAL_DAYS) {
                    return (
                      <div
                        key={rowIdx}
                        className="w-3.5 h-3.5 rounded-[2.5px] opacity-0 pointer-events-none"
                        aria-hidden="true"
                      />
                    );
                  }

                  const isDone = completedSet.has(dayNum);
                  const isCurrent = dayNum === progress.currentDay;
                  const isHovered = hoveredDay === dayNum;

                  return (
                    <button
                      key={rowIdx}
                      type="button"
                      onMouseEnter={() => setHoveredDay(dayNum)}
                      onMouseLeave={() => setHoveredDay(null)}
                      onClick={() => setHoveredDay(dayNum === hoveredDay ? null : dayNum)}
                      title={`${dayNum}-р өдөр (${WEEKDAYS[(dayNum - 1) % 7]?.full}): ${
                        isDone ? 'Биелсэн' : isCurrent ? 'Өнөөдөр' : 'Хүлээгдэж буй'
                      }`}
                      className={`w-3.5 h-3.5 rounded-[2.5px] transition-all duration-150 cursor-pointer ${
                        isDone
                          ? `${fulfilledClass} ${isHovered ? 'scale-125 ring-2 ring-white z-10' : ''}`
                          : isCurrent
                          ? `bg-slate-900 border border-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)] ${
                              isHovered ? 'scale-125 ring-2 ring-amber-300 z-10' : ''
                            }`
                          : `bg-slate-900/80 border border-slate-800 hover:border-slate-600 ${
                              isHovered ? 'scale-125 ring-1 ring-slate-400 z-10' : ''
                            }`
                      }`}
                      aria-label={`${dayNum}-р өдөр`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GitHub Style Micro Tooltip & Legend Bar */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
        {/* Dynamic Micro Status Tooltip */}
        <div className="flex items-center gap-1.5 font-mono">
          {activeDayForInfo ? (
            <>
              <span className="text-white font-bold">{activeDayForInfo}-р өдөр</span>
              <span className="text-slate-500 font-sans">({weekdayOfActive}):</span>
              {isTargetDone ? (
                <span className="text-emerald-400 font-semibold font-sans">Биелсэн ✨</span>
              ) : isTargetCurrent ? (
                <span className="text-amber-300 font-semibold font-sans">Өнөөдөр 🔥</span>
              ) : (
                <span className="text-slate-500 font-sans">Хүлээгдэж буй</span>
              )}
            </>
          ) : (
            <span className="text-slate-500">Дарж өдөр бүрийг харах</span>
          )}
        </div>

        {/* GitHub "Less -> More" (Бага -> Их) Legend */}
        <div className="flex items-center gap-1 select-none font-mono">
          <span className="text-[9px] text-slate-500">Бага</span>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-900 border border-slate-800" title="Түгжигдсэн" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-900 border border-amber-400" title="Өнөөдөр" />
          <div className={`w-2.5 h-2.5 rounded-[2px] ${fulfilledClass}`} title="Биелсэн" />
          <span className="text-[9px] text-slate-500">Их</span>
        </div>
      </div>
    </div>
  );
};
