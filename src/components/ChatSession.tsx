import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, ArrowRight, Sparkles, Zap, Shield, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DayLesson, ProfileConfig } from '../types';
import { audioPlayer } from '../services/audioPlayer';
import { soundFX } from '../services/soundEffects';
import { formatDialogueText } from '../services/storage';

interface ChatSessionProps {
  lesson: DayLesson;
  config: ProfileConfig;
  userName: string;
  partnerName: string;
  partnerAvatar: string;
  onComplete: (day: number, bonusXp?: number) => void;
}

export const ChatSession: React.FC<ChatSessionProps> = ({
  lesson,
  config,
  userName,
  partnerName,
  partnerAvatar,
  onComplete,
}) => {
  // Stage in the 1-minute flow:
  // 0: Partner introduces / asks
  // 1: User solves challenge
  // 2: Challenge solved (user audio played, feedback shown)
  // 3: Partner replies with closing
  // 4: Complete / Final victory
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isPartnerTyping, setIsPartnerTyping] = useState<boolean>(false);

  const turn1 = lesson.dialogue[0]; // Partner
  const turn2 = lesson.dialogue[1]; // User challenge
  const turn3 = lesson.dialogue[2]; // Partner close

  const formatText = (text: string) => {
    return formatDialogueText(text, config.name, userName, config.partnerName, partnerName);
  };

  // Reset state and timer when lesson changes
  useEffect(() => {
    setCurrentStep(0);
    setSelectedWords([]);
    setHasError(false);
    setElapsedSeconds(0);
    setIsPartnerTyping(false);
  }, [lesson.day]);

  // Timer: counts up to 60 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => Math.min(60, prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize words for word-order challenge
  useEffect(() => {
    if (turn2?.challenge?.type === 'word_order' && turn2.challenge.scrambledWords) {
      const formattedWords = turn2.challenge.scrambledWords.map((w) =>
        formatDialogueText(w, config.name, userName, config.partnerName, partnerName)
      );
      setAvailableWords([...formattedWords]);
      setSelectedWords([]);
    }
  }, [turn2, userName, partnerName, config.name, config.partnerName]);

  // Autoplay partner message on first load
  useEffect(() => {
    if (turn1) {
      playAudio(turn1.audioKey, turn1.textDe);
    }
  }, [lesson.day]);

  const playAudio = async (audioKey: string, textDe: string) => {
    await audioPlayer.play(audioKey, textDe);
  };

  const handleWordSelect = (word: string, index: number) => {
    soundFX.playTap();
    const newAvail = [...availableWords];
    newAvail.splice(index, 1);
    setAvailableWords(newAvail);
    setSelectedWords([...selectedWords, word]);
    setHasError(false);
  };

  const handleWordDeselect = (word: string, index: number) => {
    soundFX.playTap();
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    setAvailableWords([...availableWords, word]);
    setHasError(false);
  };

  const handleCheckWordOrder = () => {
    const targetOrder = (turn2.challenge?.correctOrder || []).map((w) =>
      formatDialogueText(w, config.name, userName, config.partnerName, partnerName)
    );
    const isMatch =
      selectedWords.length === targetOrder.length &&
      selectedWords.every((w, i) => w === targetOrder[i]);

    if (isMatch) {
      soundFX.playCorrect();
      setCurrentStep(2);
      // User audio does not autoplay (on-demand only via speaker icon per user preference)

      // Show typing indicator after brief pause
      setTimeout(() => {
        setIsPartnerTyping(true);
      }, 400);

      // Advance to partner reply after natural delay
      setTimeout(() => {
        setIsPartnerTyping(false);
        setCurrentStep(3);
        playAudio(turn3.audioKey, turn3.textDe);
      }, 2200);
    } else {
      soundFX.playError();
      setHasError(true);
    }
  };

  const handleChoiceSelect = (isCorrect: boolean) => {
    if (isCorrect) {
      soundFX.playCorrect();
      setCurrentStep(2);
      // User audio does not autoplay (on-demand only via speaker icon per user preference)

      setTimeout(() => {
        setIsPartnerTyping(true);
      }, 400);

      setTimeout(() => {
        setIsPartnerTyping(false);
        setCurrentStep(3);
        playAudio(turn3.audioKey, turn3.textDe);
      }, 2200);
    } else {
      soundFX.playError();
      setHasError(true);
    }
  };

  const isSpeedBonus = config.id === 'brother1' && elapsedSeconds <= 25;
  const bonusXp = isSpeedBonus ? 50 : 0;

  const handleFinishQuest = () => {
    soundFX.playVictory();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    onComplete(lesson.day, bonusXp);
  };

  const isKdrama = config.theme === 'kdrama';
  const isGamer = config.theme === 'gamer';
  const isCozy = config.theme === 'cozy';

  const avatarBorderClass = isKdrama
    ? 'bg-pink-950/80 border-pink-500/40'
    : isGamer
    ? 'bg-cyan-950/80 border-cyan-500/40'
    : isCozy
    ? 'bg-emerald-950/80 border-emerald-500/40'
    : 'bg-slate-900 border-slate-700';

  const timerCardClass = isKdrama
    ? 'bg-[#180b26]/80 border-pink-900/50 shadow-pink-950/20'
    : isGamer
    ? 'bg-[#040c1b]/85 border-cyan-900/50 shadow-cyan-950/20'
    : isCozy
    ? 'bg-[#031d15]/85 border-emerald-900/50 shadow-emerald-950/20'
    : 'bg-slate-900/85 border-slate-800 shadow-slate-950/20';

  const partnerBubbleClass = isKdrama
    ? 'bg-[#1e0d2e]/85 border-pink-500/30 shadow-pink-950/20'
    : isGamer
    ? 'bg-[#06172a]/85 border-cyan-500/30 shadow-cyan-950/20'
    : isCozy
    ? 'bg-[#05281e]/85 border-emerald-500/40 shadow-emerald-950/20'
    : 'bg-slate-800/85 border-slate-700/60 shadow-slate-950/20';

  const userBubbleClass = isKdrama
    ? 'bg-[#29103c]/90 border-pink-500/40 shadow-pink-500/10'
    : isGamer
    ? 'bg-[#08223d]/90 border-cyan-500/50 shadow-cyan-500/15'
    : isCozy
    ? 'bg-[#063828]/90 border-emerald-400/50 shadow-emerald-500/15'
    : 'bg-indigo-950/90 border-indigo-500/40 shadow-indigo-500/10';

  const actionBtnClass = isKdrama
    ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-pink-500/30'
    : isGamer
    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-500/30'
    : isCozy
    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/30'
    : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-indigo-500/30';

  return (
    <div className="max-w-md mx-auto p-4 pb-20 flex flex-col min-h-[calc(100vh-110px)]">
      {/* 60s Micro-Timer Header */}
      <div className={`border rounded-2xl p-3 mb-4 shadow-lg backdrop-blur-md transition-all ${timerCardClass}`}>
        <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
          <span className="text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            {lesson.day}-р өдөр • {lesson.topic}
          </span>
          <div className="flex items-center gap-2">
            {config.id === 'brother1' && elapsedSeconds <= 25 && (
              <span className="text-[10px] text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800 animate-pulse flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                Хурдны бонус (&lt;25с)
              </span>
            )}
            <span className="font-bold text-amber-400">
              {elapsedSeconds}s / 60s
            </span>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 transition-all duration-300"
            style={{ width: `${Math.min(100, (elapsedSeconds / 60) * 100)}%` }}
          />
        </div>
        <div className="text-[11px] text-slate-500 mt-1 text-center font-sans">
          {lesson.topicMn}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="space-y-4 flex-1">
        {/* Turn 1: Partner Bubble */}
        <div className="flex items-start gap-2.5">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg shadow shrink-0 border ${avatarBorderClass}`}>
            {partnerAvatar}
          </div>
          <div className={`flex-1 rounded-2xl rounded-tl-sm p-3.5 shadow-md backdrop-blur-md transition-all ${partnerBubbleClass}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-200">
                {partnerName}
              </span>
              <button
                onClick={() => playAudio(turn1.audioKey, turn1.textDe)}
                className="p-1 rounded-full bg-slate-900/60 text-slate-300 hover:text-white border border-slate-700/60 transition-all"
                title="Сонсох"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            {/* German Text */}
            <p className="text-base font-semibold text-white tracking-wide">
              {formatText(turn1.textDe)}
            </p>
            {/* Mongolian Translation */}
            <p className="mt-1.5 text-xs text-slate-300/90">
              {formatText(turn1.textMn)}
            </p>
          </div>
        </div>

        {/* Turn 2: User Response / Challenge */}
        {currentStep >= 0 && (
          <div className="flex items-start gap-2.5 flex-row-reverse">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg shadow shrink-0 border ${
              isKdrama ? 'bg-purple-950/80 border-pink-400/50' : isGamer ? 'bg-cyan-950/80 border-cyan-400/50' : 'bg-emerald-950/80 border-emerald-400/50'
            }`}>
              {config.userAvatar}
            </div>
            <div className={`flex-1 rounded-2xl rounded-tr-sm p-3.5 shadow-md backdrop-blur-md transition-all ${userBubbleClass}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white/90">
                  Чи ({userName})
                </span>
                {currentStep >= 2 && (
                  <button
                    onClick={() => playAudio(turn2.audioKey, turn2.textDe)}
                    className="px-2 py-1 rounded-full bg-slate-900/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all flex items-center gap-1 text-[11px] font-semibold active:scale-95 shadow-sm"
                    title="Өөрийн хариултыг сонсох"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-indigo-300" />
                    <span>Сонсох</span>
                  </button>
                )}
              </div>

              {/* Solved state: show finalized text */}
              {currentStep >= 2 ? (
                <div>
                  <p className="text-base font-semibold text-emerald-400 tracking-wide flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    {formatText(turn2.textDe)}
                  </p>
                  <p className="mt-1.5 text-xs text-slate-400">
                    {formatText(turn2.textMn)}
                  </p>
                </div>
              ) : (
                /* Unsolved Challenge */
                <div>
                  <div className="text-xs font-medium text-slate-300 mb-2">
                    Зөв хариултыг эвлүүлнэ үү:
                  </div>

                  {/* Word-Order Challenge Type */}
                  {turn2.challenge?.type === 'word_order' && (
                    <div className="space-y-3">
                      {/* Target Slot */}
                      <div
                        className={`min-h-12 p-2.5 rounded-xl border border-dashed flex flex-wrap gap-1.5 items-center transition-all ${
                          hasError
                            ? 'border-rose-500 bg-rose-950/20'
                            : 'border-slate-700 bg-slate-950/60'
                        }`}
                      >
                        {selectedWords.length === 0 ? (
                          <span className="text-xs text-slate-500 italic">
                            Доорх үгсээс дарж сонгоно уу...
                          </span>
                        ) : (
                          selectedWords.map((word, idx) => (
                            <button
                              key={`sel_${idx}_${word}`}
                              onClick={() => handleWordDeselect(word, idx)}
                              className={`px-2.5 py-1 rounded-lg text-white text-xs font-semibold shadow transition-all active:scale-95 ${actionBtnClass}`}
                            >
                              {word}
                            </button>
                          ))
                        )}
                      </div>

                      {/* Scrambled Word Pool */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {availableWords.map((word, idx) => (
                          <button
                            key={`avail_${idx}_${word}`}
                            onClick={() => handleWordSelect(word, idx)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold shadow transition-all active:scale-95"
                          >
                            {word}
                          </button>
                        ))}
                      </div>

                      {hasError && (
                        <div className="text-[11px] text-rose-400 font-medium">
                          Дараалал нь арай буруу байна. Дахин оролдоод үзээрэй! 🔄
                        </div>
                      )}

                      {/* Action Button */}
                      <button
                        onClick={handleCheckWordOrder}
                        disabled={selectedWords.length === 0}
                        className={`w-full mt-2 py-2.5 disabled:bg-slate-800 disabled:text-slate-600 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all active:scale-98 ${actionBtnClass}`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Шалгах
                      </button>
                    </div>
                  )}

                  {/* Choice Challenge Type */}
                  {turn2.challenge?.type === 'choice' && (
                    <div className="space-y-2">
                      {turn2.challenge.choices?.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleChoiceSelect(c.isCorrect)}
                          className="w-full text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/80 hover:border-slate-500 backdrop-blur transition-all active:scale-98"
                        >
                          <div className="text-xs font-bold text-white">
                            {formatText(c.textDe)}
                          </div>
                          <div className="text-[10px] text-slate-300/90 mt-0.5">
                            {formatText(c.textMn)}
                          </div>
                        </button>
                      ))}

                      {hasError && (
                        <div className="text-[11px] text-rose-400 font-medium pt-1">
                          Энэ арай тохирохгүй байна. Өөр хариулт сонгоод үзээрэй! 💡
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Partner Typing Indicator */}
        {isPartnerTyping && currentStep === 2 && (
          <div className="flex items-center gap-2.5 animate-pulse">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg shadow shrink-0 border ${avatarBorderClass}`}>
              {partnerAvatar}
            </div>
            <div className={`rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-md flex items-center gap-2 backdrop-blur-md transition-all ${partnerBubbleClass}`}>
              <span className="text-xs text-slate-300 font-medium">
                {partnerName} бичиж байна...
              </span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Turn 3: Partner Closing Reply */}
        {currentStep >= 3 && (
          <div className="flex items-start gap-2.5 animate-fadeIn">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg shadow shrink-0 border ${avatarBorderClass}`}>
              {partnerAvatar}
            </div>
            <div className={`flex-1 rounded-2xl rounded-tl-sm p-3.5 shadow-md backdrop-blur-md transition-all ${partnerBubbleClass}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200">
                  {partnerName}
                </span>
                <button
                  onClick={() => playAudio(turn3.audioKey, turn3.textDe)}
                  className="p-1 rounded-full bg-slate-900/60 text-slate-300 hover:text-white border border-slate-700/60 transition-all"
                  title="Сонсох"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-base font-semibold text-white tracking-wide">
                {formatText(turn3.textDe)}
              </p>
              <p className="mt-1.5 text-xs text-slate-400">
                {formatText(turn3.textMn)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Completion Button Bar */}
      {currentStep >= 3 && (
        <div className="mt-6 pt-3 border-t border-slate-800 space-y-2">
          {config.id === 'brother1' && isSpeedBonus && (
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-center text-xs font-bold text-cyan-300 flex items-center justify-center gap-1.5 animate-pulse">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              ⚡ АЯНГЫН РЕФЛЕКС! ({elapsedSeconds}с) +50 Speed XP бонус олгогдоно!
            </div>
          )}

          {config.id === 'brother2' && (
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-center text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              Plus Ultra! 🌟 {partnerName}-тэй хамт өнөөдрийн бэлтгэл амжилттай боллоо!
            </div>
          )}

          {config.id === 'sister' && (
            <div className="p-2.5 rounded-xl bg-pink-950/80 border border-pink-500/50 text-center text-xs font-bold text-pink-300 flex items-center justify-center gap-1.5">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
              🌸 {partnerName}-тэй хамт өдрийн нандин яриагаа амжилттай бүтээлээ!
            </div>
          )}

          <button
            onClick={handleFinishQuest}
            className={`w-full py-3.5 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all animate-pulse-glow ${
              config.id === 'brother1'
                ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 shadow-cyan-500/20'
                : config.id === 'brother2'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20'
                : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-pink-500/20'
            }`}
          >
            {config.id === 'brother1' ? (
              <Zap className="w-5 h-5 text-amber-300" />
            ) : config.id === 'brother2' ? (
              <Shield className="w-5 h-5 text-amber-300" />
            ) : (
              <Sparkles className="w-5 h-5 text-amber-300" />
            )}
            {config.id === 'brother2'
              ? `Бэлтгэл дуусгах! (+${100 + bonusXp} XP)`
              : `1 минутын даалгавар дуусгах! (+${100 + bonusXp} XP)`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
