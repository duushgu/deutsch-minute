import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DayLesson, ProfileConfig } from '../types';
import { audioPlayer } from '../services/audioPlayer';
import { soundFX } from '../services/soundEffects';

interface ChatSessionProps {
  lesson: DayLesson;
  config: ProfileConfig;
  userName: string;
  onComplete: (day: number) => void;
}

export const ChatSession: React.FC<ChatSessionProps> = ({
  lesson,
  config,
  userName,
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

  const turn1 = lesson.dialogue[0]; // Partner
  const turn2 = lesson.dialogue[1]; // User challenge
  const turn3 = lesson.dialogue[2]; // Partner close

  const formatText = (text: string) => {
    if (!text) return text;
    return text.replace(new RegExp(config.name, 'g'), userName);
  };

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
        w.replace(config.name, userName)
      );
      setAvailableWords([...formattedWords]);
      setSelectedWords([]);
    }
  }, [turn2, userName, config.name]);

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
      w.replace(config.name, userName)
    );
    const isMatch =
      selectedWords.length === targetOrder.length &&
      selectedWords.every((w, i) => w === targetOrder[i]);

    if (isMatch) {
      soundFX.playCorrect();
      setCurrentStep(2);
      // Play user's sentence in native voice
      playAudio(turn2.audioKey, turn2.textDe);
      // Advance to partner reply after short delay
      setTimeout(() => {
        setCurrentStep(3);
        playAudio(turn3.audioKey, turn3.textDe);
      }, 1500);
    } else {
      soundFX.playError();
      setHasError(true);
    }
  };

  const handleChoiceSelect = (isCorrect: boolean) => {
    if (isCorrect) {
      soundFX.playCorrect();
      setCurrentStep(2);
      playAudio(turn2.audioKey, turn2.textDe);
      setTimeout(() => {
        setCurrentStep(3);
        playAudio(turn3.audioKey, turn3.textDe);
      }, 1500);
    } else {
      soundFX.playError();
      setHasError(true);
    }
  };

  const handleFinishQuest = () => {
    soundFX.playVictory();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    onComplete(lesson.day);
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-20 flex flex-col min-h-[calc(100vh-110px)]">
      {/* 60s Micro-Timer Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 mb-4 shadow-lg">
        <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
          <span className="text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Tag {lesson.day} • {lesson.topic}
          </span>
          <span className="font-bold text-amber-400">
            {elapsedSeconds}s / 60s
          </span>
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
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shadow shrink-0">
            {config.partnerAvatar}
          </div>
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm p-3.5 shadow-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-300">
                {config.partnerName}
              </span>
              <button
                onClick={() => playAudio(turn1.audioKey, turn1.textDe)}
                className="p-1 rounded-full bg-indigo-950/80 text-indigo-400 hover:bg-indigo-900 border border-indigo-800/60 transition-all"
                title="Audio abspielen"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            {/* German Text */}
            <p className="text-base font-semibold text-white tracking-wide">
              {formatText(turn1.textDe)}
            </p>
            {/* Mongolian Cyrillic Phonetics */}
            <div className="mt-1.5 inline-block px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/40 text-indigo-200 text-xs font-mono">
              {formatText(turn1.phoneticMn)}
            </div>
            {/* Mongolian Translation */}
            <p className="mt-1.5 text-xs text-slate-400">
              {formatText(turn1.textMn)}
            </p>
          </div>
        </div>

        {/* Turn 2: User Response / Challenge */}
        {currentStep >= 0 && (
          <div className="flex items-start gap-2.5 flex-row-reverse">
            <div className="w-9 h-9 rounded-full bg-indigo-950 border border-indigo-700 flex items-center justify-center text-lg shadow shrink-0">
              {config.userAvatar}
            </div>
            <div className="flex-1 bg-slate-900/90 border border-indigo-900/50 rounded-2xl rounded-tr-sm p-3.5 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-300">
                  Du ({userName})
                </span>
                {currentStep >= 2 && (
                  <button
                    onClick={() => playAudio(turn2.audioKey, turn2.textDe)}
                    className="p-1 rounded-full bg-indigo-950/80 text-indigo-400 hover:bg-indigo-900 border border-indigo-800/60 transition-all"
                  >
                    <Volume2 className="w-4 h-4" />
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
                  <div className="mt-1.5 inline-block px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-emerald-300 text-xs font-mono">
                    {formatText(turn2.phoneticMn)}
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatText(turn2.textMn)}
                  </p>
                </div>
              ) : (
                /* Unsolved Challenge */
                <div>
                  <div className="text-xs font-medium text-slate-300 mb-2">
                    Setze die richtige Antwort zusammen:
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
                            Tippe die Wörter unten an...
                          </span>
                        ) : (
                          selectedWords.map((word, idx) => (
                            <button
                              key={`sel_${idx}_${word}`}
                              onClick={() => handleWordDeselect(word, idx)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-all active:scale-95"
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
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold shadow transition-all active:scale-95"
                          >
                            {word}
                          </button>
                        ))}
                      </div>

                      {hasError && (
                        <div className="text-[11px] text-rose-400 font-medium">
                          Noch nicht ganz! Probiere die Reihenfolge noch einmal.
                        </div>
                      )}

                      {/* Action Button */}
                      <button
                        onClick={handleCheckWordOrder}
                        disabled={selectedWords.length === 0}
                        className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all active:scale-98"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Prüfen / Шалгах
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
                          className="w-full text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 hover:border-indigo-500 transition-all active:scale-98"
                        >
                          <div className="text-xs font-bold text-white">
                            {c.textDe}
                          </div>
                          <div className="text-[10px] text-indigo-300 font-mono mt-0.5">
                            {c.phoneticMn}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {c.textMn}
                          </div>
                        </button>
                      ))}

                      {hasError && (
                        <div className="text-[11px] text-rose-400 font-medium pt-1">
                          Das passt inhaltlich nicht ganz. Wähle die passende Antwort!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Turn 3: Partner Closing Reply */}
        {currentStep >= 3 && (
          <div className="flex items-start gap-2.5 animate-fadeIn">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shadow shrink-0">
              {config.partnerAvatar}
            </div>
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm p-3.5 shadow-md">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-300">
                  {config.partnerName}
                </span>
                <button
                  onClick={() => playAudio(turn3.audioKey, turn3.textDe)}
                  className="p-1 rounded-full bg-indigo-950/80 text-indigo-400 hover:bg-indigo-900 border border-indigo-800/60 transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-base font-semibold text-white tracking-wide">
                {formatText(turn3.textDe)}
              </p>
              <div className="mt-1.5 inline-block px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/40 text-indigo-200 text-xs font-mono">
                {formatText(turn3.phoneticMn)}
              </div>
              <p className="mt-1.5 text-xs text-slate-400">
                {formatText(turn3.textMn)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Completion Button Bar */}
      {currentStep >= 3 && (
        <div className="mt-6 pt-3 border-t border-slate-800">
          <button
            onClick={handleFinishQuest}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all animate-pulse-glow"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            1-Minuten Quest abschließen! (+100 XP)
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
