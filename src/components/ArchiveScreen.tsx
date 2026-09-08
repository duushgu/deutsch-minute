import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Lock, Volume2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { DayLesson, ProfileConfig, SiblingProgress } from '../types';
import { CURRICULUM } from '../data/curriculum';
import { audioPlayer } from '../services/audioPlayer';
import { formatDialogueText } from '../services/storage';

interface ArchiveScreenProps {
  config: ProfileConfig;
  progress: SiblingProgress;
  showPhoneticsArchiveDays1to5?: boolean;
}

interface PhaseMetadata {
  phase: number;
  titleDe: string;
  titleMn: string;
  range: string;
}

const PHASES: PhaseMetadata[] = [
  {
    phase: 1,
    titleDe: 'Phase 1: Grundlagen & Kennenlernen',
    titleMn: '1-р шат: Үндэс суурь & Танилцах',
    range: 'Өдөр 1–10',
  },
  {
    phase: 2,
    titleDe: 'Phase 2: Essen, Trinken & Vorlieben',
    titleMn: '2-р шат: Хоол, ундаа & дуртай зүйлс',
    range: 'Өдөр 11–20',
  },
  {
    phase: 3,
    titleDe: 'Phase 3: Mein Tag, Uhrzeit & Wochentage',
    titleMn: '3-р шат: Өдөр тутмын амьдрал & Цаг хугацаа',
    range: 'Өдөр 21–30',
  },
  {
    phase: 4,
    titleDe: 'Phase 4: Schule, mein Zimmer & Schulsachen',
    titleMn: '4-р шат: Сургууль, миний өрөө & эд зүйлс',
    range: 'Өдөр 31–40',
  },
  {
    phase: 5,
    titleDe: 'Phase 5: Familie, Tiere & Beschreibungen',
    titleMn: '5-р шат: Гэр бүл, найзууд & байгаль',
    range: 'Өдөр 41–50',
  },
  {
    phase: 6,
    titleDe: 'Phase 6: Hobbys, Freizeit & Großes Finale',
    titleMn: '6-р шат: Чөлөөт цаг & Их финал',
    range: 'Өдөр 51–60',
  },
];

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
  const isCatppuccin = config.theme === 'catppuccin';
  const isGamer = config.theme === 'gamer';
  const isJjk = config.theme === 'mlbb_jjk';
  const isTransformers = config.theme === 'mlbb_transformers';
  const isRengoku = config.theme === 'rengoku';
  const isGreenHero = config.theme === 'cozy' || config.theme === 'tanjiro' || config.theme === 'mha_deku';

  const headerClass = isKdrama
    ? 'bg-[#180b26]/85 border-pink-900/40 shadow-pink-950/20'
    : isCatppuccin
    ? 'bg-[#1e2030]/85 border-[#c6a0f6]/30 shadow-purple-950/20'
    : isGamer
    ? 'bg-[#040e1f]/85 border-cyan-900/40 shadow-cyan-950/20'
    : isJjk
    ? 'bg-[#0f071e]/85 border-purple-900/40 shadow-purple-950/20'
    : isTransformers
    ? 'bg-[#0a1222]/85 border-yellow-900/40 shadow-yellow-950/20'
    : isRengoku
    ? 'bg-[#1e0703]/85 border-orange-900/40 shadow-orange-950/20'
    : isGreenHero
    ? 'bg-[#021812]/85 border-emerald-900/40 shadow-emerald-950/20'
    : 'bg-slate-900/85 border-slate-800 shadow-slate-950/20';

  const completedCardClass = isKdrama
    ? 'bg-[#1b0d2d]/80 border-pink-900/50'
    : isCatppuccin
    ? 'bg-[#24273a]/80 border-[#494d64]'
    : isGamer
    ? 'bg-[#051428]/80 border-cyan-900/50'
    : isJjk
    ? 'bg-[#140a28]/80 border-purple-900/50'
    : isTransformers
    ? 'bg-[#0d162a]/80 border-yellow-900/50'
    : isRengoku
    ? 'bg-[#240a05]/80 border-orange-900/50'
    : isGreenHero
    ? 'bg-[#032017]/80 border-emerald-900/50'
    : 'bg-slate-900/80 border-slate-800';

  const currentCardClass = isKdrama
    ? 'bg-[#260f3a]/90 border-pink-500/60 shadow-md shadow-pink-500/20'
    : isCatppuccin
    ? 'bg-[#363a4f]/90 border-[#c6a0f6]/60 shadow-md shadow-[#c6a0f6]/20'
    : isGamer
    ? 'bg-[#061b34]/90 border-cyan-500/60 shadow-md shadow-cyan-500/20'
    : isJjk
    ? 'bg-[#1c0e36]/90 border-purple-500/60 shadow-md shadow-purple-500/20'
    : isTransformers
    ? 'bg-[#111e38]/90 border-yellow-500/60 shadow-md shadow-yellow-500/20'
    : isRengoku
    ? 'bg-[#330f07]/90 border-orange-500/60 shadow-md shadow-orange-500/20'
    : isGreenHero
    ? 'bg-[#04291f]/90 border-emerald-500/60 shadow-md shadow-emerald-500/20'
    : 'bg-slate-900/90 border-indigo-500/60 shadow-md shadow-indigo-500/20';

  // Calculate current active phase
  const completedDays = Array.isArray(progress.completedDays) ? progress.completedDays : [];
  const currentDay = progress.currentDay || 1;
  const maxCompletedDay = completedDays.length > 0 ? Math.max(...completedDays) : 0;
  const highestReachedDay = Math.max(currentDay, maxCompletedDay + 1);
  const activePhase = Math.min(6, Math.max(1, Math.ceil(highestReachedDay / 10)));

  const unlockedPhases = PHASES.filter((p) => p.phase <= activePhase);
  const nextLockedPhase = activePhase < 6 ? PHASES.find((p) => p.phase === activePhase + 1) : null;

  return (
    <div className="max-w-md mx-auto p-4 pb-24 space-y-5">
      {/* Header */}
      <div className={`border rounded-3xl p-5 shadow-lg backdrop-blur-md transition-all ${headerClass}`}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            Ярианы сан (Архив)
          </div>
          <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/15">
            {activePhase}/6 шат нээлттэй
          </span>
        </div>
        <h2 className="text-xl font-black text-white">
          Өмнөх өдрүүдийн яриаг давтах
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Нээгдсэн бүх яриагаа хүссэн үедээ дахин сонсож, давтаж болно. 🎧
        </p>
      </div>

      {/* Phases and Lessons */}
      <div className="space-y-6">
        {unlockedPhases.map((phaseMeta) => {
          const phaseLessons = lessons.filter((l) => l.phase === phaseMeta.phase);
          const completedInPhase = phaseLessons.filter((l) => completedDays.includes(l.day)).length;
          const isPhaseComplete = completedInPhase === phaseLessons.length && phaseLessons.length > 0;

          return (
            <div key={phaseMeta.phase} className="space-y-2.5">
              {/* Phase Section Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isPhaseComplete ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-indigo-400 animate-pulse'
                    }`}
                  />
                  <h3 className="text-xs font-black tracking-wide text-slate-200">
                    {phaseMeta.titleMn}
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/50 flex items-center gap-1">
                  {isPhaseComplete ? (
                    <>
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      10/10 дууссан
                    </>
                  ) : (
                    `${completedInPhase}/10 өдөр`
                  )}
                </span>
              </div>

              {/* Lesson Cards of this Phase */}
              <div className="space-y-2.5">
                {phaseLessons.map((lesson) => {
                  const isCompleted = completedDays.includes(lesson.day);
                  const isCurrent = currentDay === lesson.day;
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
        })}

        {/* Next Locked Phase Teaser Card */}
        {nextLockedPhase && (
          <div className="mt-6 rounded-3xl border border-dashed border-white/10 bg-slate-950/40 p-5 text-center backdrop-blur-sm">
            <div className="mx-auto w-11 h-11 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center justify-center text-slate-500 mb-2.5 shadow-inner">
              <Lock className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-300">
              {nextLockedPhase.titleMn} ({nextLockedPhase.range})
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {activePhase * 10}-р өдрийн даалгаврыг дуусгаснаар энэ шат автоматаар нээгдэнэ! 🚀
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
