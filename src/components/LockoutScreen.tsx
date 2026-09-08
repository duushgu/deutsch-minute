import React, { useState, useEffect } from 'react';
import { Clock, Volume2, Sparkles, Flame, BookOpen, ShieldCheck, Heart, Zap, Shield, Star } from 'lucide-react';
import { DayLesson, ProfileConfig, SiblingProgress } from '../types';
import { audioPlayer } from '../services/audioPlayer';
import { formatDialogueText } from '../services/storage';
import { getSisterMemory, getIstpRank, getIsfjHeroRank } from '../services/gamification';

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
  partnerAvatar,
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
  const completedCount = progress.completedDays?.length || 0;

  // Gamification data by profile
  const sisterMemory = getSisterMemory(lesson.day, partnerName, userName);
  const istpRank = getIstpRank(completedCount, progress.xp || 0);
  const isfjHeroRank = getIsfjHeroRank(completedCount, partnerName);

  const isKdrama = config.theme === 'kdrama';
  const isCatppuccin = config.theme === 'catppuccin';
  const isGamer = config.theme === 'gamer';
  const isJjk = config.theme === 'mlbb_jjk';
  const isTransformers = config.theme === 'mlbb_transformers';
  const isRengoku = config.theme === 'rengoku';
  const isGreenHero = config.theme === 'cozy' || config.theme === 'tanjiro' || config.theme === 'mha_deku';

  const lockoutHeaderClass = isKdrama
    ? 'bg-gradient-to-b from-[#1c0d2e]/90 to-[#2f1345]/70 border-pink-500/40 shadow-pink-950/30'
    : isCatppuccin
    ? 'bg-gradient-to-b from-[#1e2030]/90 to-[#24273a]/80 border-[#c6a0f6]/40 shadow-purple-950/30'
    : isGamer
    ? 'bg-gradient-to-b from-[#051329]/90 to-[#022a45]/70 border-cyan-500/40 shadow-cyan-950/30'
    : isJjk
    ? 'bg-gradient-to-b from-[#0e061c]/90 to-[#240a45]/70 border-purple-500/40 shadow-purple-950/30'
    : isTransformers
    ? 'bg-gradient-to-b from-[#0b1220]/90 to-[#1e2c45]/70 border-yellow-500/40 shadow-yellow-950/30'
    : isRengoku
    ? 'bg-gradient-to-b from-[#210703]/90 to-[#3b1206]/70 border-orange-500/40 shadow-orange-950/30'
    : isGreenHero
    ? 'bg-gradient-to-b from-[#04241b]/90 to-[#033b28]/70 border-emerald-500/40 shadow-emerald-950/30'
    : 'bg-gradient-to-b from-slate-900/90 to-slate-950/70 border-slate-700/60 shadow-slate-950/30';

  const cardBaseClass = isKdrama
    ? 'bg-[#150924]/80 border-pink-900/40 shadow-pink-950/20'
    : isCatppuccin
    ? 'bg-[#24273a]/80 border-[#494d64]/60 shadow-purple-950/20'
    : isGamer
    ? 'bg-[#030e1f]/80 border-cyan-900/40 shadow-cyan-950/20'
    : isJjk
    ? 'bg-[#120824]/80 border-purple-900/40 shadow-purple-950/20'
    : isTransformers
    ? 'bg-[#0a1222]/80 border-yellow-900/40 shadow-yellow-950/20'
    : isRengoku
    ? 'bg-[#1f0904]/80 border-orange-900/40 shadow-orange-950/20'
    : isGreenHero
    ? 'bg-[#021812]/80 border-emerald-900/40 shadow-emerald-950/20'
    : 'bg-slate-900/80 border-slate-800 shadow-slate-950/20';

  const rowBaseClass = isKdrama
    ? 'bg-[#220d36]/70 border-pink-950/60'
    : isCatppuccin
    ? 'bg-[#363a4f]/70 border-[#494d64]/60'
    : isGamer
    ? 'bg-[#061830]/70 border-cyan-950/60'
    : isJjk
    ? 'bg-[#1b0c36]/70 border-purple-950/60'
    : isTransformers
    ? 'bg-[#121c32]/70 border-yellow-950/60'
    : isRengoku
    ? 'bg-[#2d0f07]/70 border-orange-950/60'
    : isGreenHero
    ? 'bg-[#04291f]/70 border-emerald-950/60'
    : 'bg-slate-900/70 border-slate-800';

  return (
    <div className="max-w-md mx-auto p-4 pb-24 space-y-4">
      {/* Lockout Header Card */}
      <div className={`border rounded-3xl p-5 text-center shadow-xl relative overflow-hidden backdrop-blur-md transition-all ${lockoutHeaderClass}`}>
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 border border-white/20 text-2xl mb-3 shadow-inner">
          🌟
        </div>

        <h2 className="text-xl font-black text-white tracking-wide">
          Өнөөдрийн 1 минут дууслаа! 🌟
        </h2>
        <p className="text-xs text-slate-200 font-medium mt-1">
          Гайхалтай! Маргааш дараагийн даалгавар нээгдэнэ.
        </p>

        {/* Streak & XP Stats */}
        <div className="flex justify-center gap-3 mt-3.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/10">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-amber-300 font-mono">
              {progress.streak} өдөр дараалан
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/10">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-xs font-bold text-white font-mono">
              {progress.xp} XP
            </span>
          </div>
        </div>

        {/* 24-Hour Countdown Timer */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <div className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold mb-1 flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-200" />
            Дараагийн даалгавар нээгдэх хугацаа:
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-wider">
            {String(timeLeft.hours).padStart(2, '0')}:
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* PERSONALIZED GAMIFICATION CARD FOR PROFILE */}
      {/* ============================================================ */}

      {/* 1. SISTER (INFJ) - K-Drama Aesthetic Daily Polaroid Memory Card */}
      {config.id === 'sister' && (
        <div className="bg-gradient-to-br from-pink-950/40 via-purple-950/30 to-slate-900 border border-pink-500/30 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-pink-300 uppercase tracking-wider">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400/50" />
              {sisterMemory.tag}
            </div>
            <span className="text-[11px] text-pink-300/80 font-mono">
              📖 {completedCount}/10 дурсамж
            </span>
          </div>

          {/* Polaroid Frame */}
          <div className="bg-slate-950/80 border border-pink-500/20 rounded-2xl p-4 text-center shadow-lg relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-400/30 flex items-center justify-center text-3xl mx-auto mb-2 shadow-inner">
              {partnerAvatar}
            </div>
            <div className="text-xs font-bold text-pink-200 mb-1">
              {partnerName} & {userName}
            </div>
            <p className="text-xs text-slate-300 italic px-2 py-1 leading-relaxed">
              "{sisterMemory.quoteMn}"
            </p>
            <div className="mt-2.5 pt-2.5 border-t border-pink-900/40 flex items-center justify-between text-[11px] text-pink-300">
              <span className="font-mono">🇩🇪 {sisterMemory.quoteDe}</span>
              <button
                onClick={() => playAudio(lesson.dialogue[0]?.audioKey, lesson.dialogue[0]?.textDe)}
                className="p-1.5 rounded-full bg-pink-950 hover:bg-pink-900 text-pink-300 border border-pink-800 transition-all active:scale-95"
                title="Сонсох"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. BROTHER 1 (ISTP) - Mobile Legends Combat HUD & Rank Badge */}
      {config.id === 'brother1' && (
        <div className="bg-gradient-to-br from-cyan-950/60 via-slate-900 to-emerald-950/40 border border-cyan-500/40 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              Mobile Legends • Тулааны цол & Зэрэг
            </div>
            <span className="text-[10px] text-cyan-400 font-mono font-bold bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800">
              {istpRank.combatRole}
            </span>
          </div>

          <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-400/50 flex items-center justify-center text-3xl shadow-inner">
                {istpRank.tierBadge}
              </div>
              <div>
                <div className="text-sm font-black text-white tracking-wide">
                  {istpRank.tierName}
                </div>
                <div className="flex items-center gap-1 text-amber-400 mt-1">
                  {Array.from({ length: istpRank.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Дараагийн цол: {istpRank.nextTier}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono font-bold text-cyan-300">
                {istpRank.progressPercent}%
              </div>
              <div className="text-[10px] text-slate-400">Цолны ахиц</div>
            </div>
          </div>

          {progress.badges?.includes('Lightning Speed ⚡') && (
            <div className="mt-2.5 flex items-center justify-between p-2 rounded-xl bg-cyan-950/50 border border-cyan-800/60 text-xs">
              <span className="text-cyan-300 font-semibold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ⚡ Аянгын хурд рефлекс идэвхтэй
              </span>
              <span className="text-[10px] text-amber-400 font-bold font-mono">+50 XP Бонус</span>
            </div>
          )}
        </div>
      )}

      {/* 3. BROTHER 2 (ISFJ) - Demon Slayer & My Hero Academia Hero Rank & Buddy Bond */}
      {config.id === 'brother2' && (
        <div className="bg-gradient-to-br from-emerald-950/70 via-slate-900 to-teal-950/60 border border-emerald-500/40 rounded-3xl p-5 shadow-xl relative overflow-hidden animate-hero-spark">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider">
              <Shield className="w-4 h-4 text-emerald-400" />
              {isfjHeroRank.universe} • Баатрын зэрэг
            </div>
            <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-700 font-mono">
              Plus Ultra! ⭐
            </span>
          </div>

          {/* Hero Rank Card */}
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-400/50 flex items-center justify-center text-3xl shadow-inner">
                {isfjHeroRank.rankBadge}
              </div>
              <div className="flex-1">
                <div className="text-sm font-black text-white">
                  {isfjHeroRank.rankTitle}
                </div>
                <div className="text-xs font-semibold text-emerald-400 mt-0.5">
                  {isfjHeroRank.breathingStyle}
                </div>
              </div>
            </div>

            {/* Buddy Bond with chosen hero */}
            <div className="pt-2 border-t border-emerald-900/50">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  <span>{partnerAvatar}</span>
                  <span>{partnerName}-тэй нөхөрлөлийн холбоо:</span>
                </span>
                <span className="text-emerald-300 font-bold font-mono">
                  {isfjHeroRank.buddyBondPercent}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${isfjHeroRank.buddyBondPercent}%` }}
                />
              </div>
            </div>

            {/* Hero Quote & Shield */}
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-200 italic flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>"{isfjHeroRank.heroQuote}"</span>
            </div>

            {/* Streak Shield Indicator */}
            <div className="text-[11px] text-amber-300/90 font-medium flex items-center justify-between">
              <span>{isfjHeroRank.shieldStatus}</span>
              <span className="font-mono font-bold">🛡️ {progress.streak} өдөр</span>
            </div>
          </div>
        </div>
      )}

      {/* Recap: Dialog of the day */}
      <div className={`border rounded-2xl p-4 shadow-md backdrop-blur-md transition-all ${cardBaseClass}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {lesson.day}-р өдөр • Яриаг давтах
          </h3>
          <span className="text-[10px] text-slate-400">Сонсох 🔊</span>
        </div>

        <div className="space-y-2.5">
          {lesson.dialogue.map((turn) => (
            <div
              key={turn.id}
              className={`p-2.5 rounded-xl border flex items-start justify-between gap-2 backdrop-blur-sm ${rowBaseClass}`}
            >
              <div>
                <div className="text-[11px] font-bold text-slate-300 mb-0.5">
                  {turn.speaker === 'partner' ? partnerName : userName}
                </div>
                <div className="text-sm font-semibold text-white">
                  {formatDialogueText(turn.textDe, config.name, userName, config.partnerName, partnerName)}
                </div>
                <div className="text-[10px] text-slate-300/80 mt-0.5">
                  {formatDialogueText(turn.textMn, config.name, userName, config.partnerName, partnerName)}
                </div>
              </div>

              <button
                onClick={() => playAudio(turn.audioKey, turn.textDe)}
                className="p-2 rounded-xl bg-black/40 hover:bg-black/60 text-slate-200 border border-white/10 shrink-0 transition-all active:scale-95"
                title="Сонсох"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Key Vocabulary of the Day */}
      <div className={`border rounded-2xl p-4 shadow-md backdrop-blur-md transition-all ${cardBaseClass}`}>
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-amber-400" />
          Өнөөдрийн чухал үгс (3 үг)
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {lesson.keyVocab.map((vocab, i) => (
            <div
              key={i}
              className={`p-2.5 rounded-xl border flex items-center justify-between backdrop-blur-sm ${rowBaseClass}`}
            >
              <span className="text-xs font-bold text-amber-300 mr-2">
                {formatDialogueText(vocab.de, config.name, userName, config.partnerName, partnerName)}
              </span>
              <span className="text-xs text-slate-200">
                {formatDialogueText(vocab.mn, config.name, userName, config.partnerName, partnerName)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
