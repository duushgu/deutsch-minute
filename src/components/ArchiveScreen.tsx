import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Lock, Volume2, ChevronDown, ChevronUp } from 'lucide-react';
import { DayLesson, ProfileConfig, SiblingProgress } from '../types';
import { CURRICULUM } from '../data/curriculum';
import { audioPlayer } from '../services/audioPlayer';
import { formatDialogueText } from '../services/storage';

interface ArchiveScreenProps {
  config: ProfileConfig;
  progress: SiblingProgress;
  showPhoneticsArchiveDays1to5?: boolean;
}

export const ArchiveScreen: React.FC<ArchiveScreenProps> = ({
  config,
  progress,
  showPhoneticsArchiveDays1to5 = false,
}) => {
  const lessons: DayLesson[] = CURRICULUM[config.id] || [];
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const toggleExpand = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const playAudio = (audioKey: string, textDe: string) => {
    audioPlayer.play(audioKey, textDe);
  };

  const userName = progress.name || config.name;
  const partnerName = progress.partnerName || config.partnerName;

  const isKdrama = config.theme === 'kdrama';
  const isGamer = config.theme === 'gamer';

  const headerClass = isKdrama
    ? 'bg-[#180b26]/85 border-pink-900/40 shadow-pink-950/20'
    : isGamer
    ? 'bg-[#040e1f]/85 border-cyan-900/40 shadow-cyan-950/20'
    : 'bg-[#021812]/85 border-emerald-900/40 shadow-emerald-950/20';

  const completedCardClass = isKdrama
    ? 'bg-[#1b0d2d]/80 border-pink-900/50'
    : isGamer
    ? 'bg-[#051428]/80 border-cyan-900/50'
    : 'bg-[#032017]/80 border-emerald-900/50';

  const currentCardClass = isKdrama
    ? 'bg-[#260f3a]/90 border-pink-500/60 shadow-md shadow-pink-500/20'
    : isGamer
    ? 'bg-[#061b34]/90 border-cyan-500/60 shadow-md shadow-cyan-500/20'
    : 'bg-[#04291f]/90 border-emerald-500/60 shadow-md shadow-emerald-500/20';

  return (
    <div className="max-w-md mx-auto p-4 pb-24 space-y-4">
      {/* Header */}
      <div className={`border rounded-3xl p-5 shadow-lg backdrop-blur-md transition-all ${headerClass}`}>
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          Ярианы сан (Архив)
        </div>
        <h2 className="text-xl font-black text-white">
          Өмнөх өдрүүдийн яриаг давтах
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Өмнө нь сурсан бүх яриагаа хүссэн үедээ дахин сонсож, давтаж болно. 🎧
        </p>
      </div>

      {/* Lesson List */}
      <div className="space-y-2.5">
        {lessons.map((lesson) => {
          const completedDays = Array.isArray(progress.completedDays) ? progress.completedDays : [];
          const isCompleted = completedDays.includes(lesson.day);
          const isCurrent = (progress.currentDay || 1) === lesson.day;
          const isLocked = !isCompleted && !isCurrent;
          const isExpanded = expandedDay === lesson.day;

          return (
            <div
              key={lesson.day}
              className={`rounded-2xl border transition-all overflow-hidden backdrop-blur-sm ${
                isCompleted
                  ? completedCardClass
                  : isCurrent
                  ? currentCardClass
                  : 'bg-slate-950/40 border-white/5 opacity-60'
              }`}
            >
              {/* Day Header Row */}
              <button
                onClick={() => !isLocked && toggleExpand(lesson.day)}
                disabled={isLocked}
                className="w-full p-3.5 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                      isCompleted
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : isCurrent
                        ? 'bg-indigo-950 text-indigo-300 border border-indigo-700 animate-pulse'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      `Т${lesson.day}`
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      {lesson.day}-р өдөр: {lesson.topic}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {lesson.topicMn}
                    </div>
                  </div>
                </div>

                <div>
                  {!isLocked && (
                    <span className="p-1 rounded-lg bg-slate-800 text-slate-400">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </div>
              </button>

              {/* Expanded Dialogue View */}
              {isExpanded && !isLocked && (
                <div className="p-4 pt-1 bg-slate-950/70 border-t border-slate-800 space-y-3">
                  <div className="text-[11px] font-mono text-indigo-300 font-semibold">
                    Гол сэдэв: {lesson.grammarFocus}
                  </div>

                  <div className="space-y-2">
                    {lesson.dialogue.map((turn) => {
                      const shouldShowPhonetics =
                        Boolean(showPhoneticsArchiveDays1to5 || progress.showPhoneticsArchiveDays1to5) &&
                        lesson.day <= 5;

                      return (
                        <div
                          key={turn.id}
                          className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-2"
                        >
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 mb-0.5">
                              {turn.speaker === 'partner' ? partnerName : userName}
                            </div>
                            <div className="text-xs font-semibold text-white">
                              {formatDialogueText(turn.textDe, config.name, userName, config.partnerName, partnerName)}
                            </div>
                            {shouldShowPhonetics && turn.phoneticMn && (
                              <div className="text-[10px] text-amber-300 font-mono bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40 inline-block mt-0.5">
                                [{formatDialogueText(turn.phoneticMn, config.name, userName, config.partnerName, partnerName)}]
                              </div>
                            )}
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {formatDialogueText(turn.textMn, config.name, userName, config.partnerName, partnerName)}
                            </div>
                          </div>

                          <button
                            onClick={() => playAudio(turn.audioKey, turn.textDe)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 shrink-0 active:scale-95"
                            title="Сонсох"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
