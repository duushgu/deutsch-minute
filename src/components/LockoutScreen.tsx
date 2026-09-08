import React, { useState, useEffect } from 'react';
import { Clock, Volume2, Sparkles, Flame, BookOpen, ShieldCheck } from 'lucide-react';
import { DayLesson, ProfileConfig, SiblingProgress } from '../types';
import { audioPlayer } from '../services/audioPlayer';
import { formatDialogueText } from '../services/storage';

interface LockoutScreenProps {
  lesson: DayLesson;
  config: ProfileConfig;
  progress: SiblingProgress;
  partnerName: string;
  partnerAvatar: string;
  onNavigateToSquad?: () => void;
  onNavigateToArchive?: () => void;
}

export const LockoutScreen: React.FC<LockoutScreenProps> = ({
  lesson,
  config,
  progress,
  partnerName,
  partnerAvatar: _partnerAvatar,
}) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Calculate time remaining until midnight
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diffMs = Math.max(0, tomorrow.getTime() - now.getTime());

      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / 1000 / 60) % 60);
      const seconds = Math.floor((diffMs / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  const playAudio = (audioKey: string, textDe: string) => {
    audioPlayer.play(audioKey, textDe);
  };

  const userName = progress.name || config.name;

  return (
    <div className="max-w-md mx-auto p-4 pb-24 space-y-4">
      {/* Lockout Header Card */}
      <div className="bg-gradient-to-b from-slate-900 to-indigo-950/60 border border-indigo-500/30 rounded-3xl p-5 text-center shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl" />
        <div className="absolute -left-8 -bottom-8 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl" />

        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-2xl mb-3 shadow-inner">
          🌟
        </div>

        <h2 className="text-xl font-black text-white tracking-wide">
          Өнөөдрийн 1 минут дууслаа! 🌟
        </h2>
        <p className="text-xs text-indigo-300 font-medium mt-1">
          Гайхалтай! Маргааш дараагийн даалгавар нээгдэнэ.
        </p>

        {/* Streak & XP Stats */}
        <div className="flex justify-center gap-3 mt-3.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-amber-300 font-mono">
              {progress.streak} өдөр дараалан
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-300 font-mono">
              {progress.xp} XP
            </span>
          </div>
        </div>

        {/* 24-Hour Countdown Timer */}
        <div className="mt-5 pt-4 border-t border-indigo-900/40">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1 flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            Дараагийн даалгавар нээгдэх хугацаа:
          </div>
          <div className="text-2xl font-black font-mono text-indigo-200 tracking-wider">
            {String(timeLeft.hours).padStart(2, '0')}:
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Recap: Dialog of the day */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {lesson.day}-р өдөр • Яриаг давтах
          </h3>
          <span className="text-[10px] text-slate-500">Сонсох 🔊</span>
        </div>

        <div className="space-y-2.5">
          {lesson.dialogue.map((turn) => (
            <div
              key={turn.id}
              className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-2"
            >
              <div>
                <div className="text-[11px] font-bold text-indigo-300 mb-0.5">
                  {turn.speaker === 'partner' ? partnerName : userName}
                </div>
                <div className="text-sm font-semibold text-white">
                  {formatDialogueText(turn.textDe, config.name, userName, config.partnerName, partnerName)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {formatDialogueText(turn.textMn, config.name, userName, config.partnerName, partnerName)}
                </div>
              </div>

              <button
                onClick={() => playAudio(turn.audioKey, turn.textDe)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 shrink-0 transition-all active:scale-95"
                title="Сонсох"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Key Vocabulary of the Day */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-amber-400" />
          Өнөөдрийн чухал үгс (3 үг)
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {lesson.keyVocab.map((vocab, i) => (
            <div
              key={i}
              className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between"
            >
              <span className="text-xs font-bold text-amber-300 mr-2">
                {formatDialogueText(vocab.de, config.name, userName, config.partnerName, partnerName)}
              </span>
              <span className="text-xs text-slate-300">
                {formatDialogueText(vocab.mn, config.name, userName, config.partnerName, partnerName)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
