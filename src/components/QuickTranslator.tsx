import React, { useState, useMemo, useEffect } from 'react';
import { Search, Volume2, PenTool, BookMarked, Trash2, Plus } from 'lucide-react';
import { CURRICULUM } from '../data/curriculum';
import { ProfileId, ThemeId } from '../types';
import { audioPlayer } from '../services/audioPlayer';

interface QuickTranslatorProps {
  profileId: ProfileId;
  theme: ThemeId;
}

interface DictItem {
  de: string;
  mn: string;
  category?: string;
  audioKey?: string;
}

// Built-in everyday vocabulary for teens (School, gaming, food, daily life)
const BASE_DICTIONARY: DictItem[] = [
  // Greetings & Basics
  { de: 'Hallo!', mn: 'Сайн уу!', category: 'Мэндчилгээ' },
  { de: 'Guten Morgen!', mn: 'Өглөөний мэнд!', category: 'Мэндчилгээ' },
  { de: 'Guten Abend!', mn: 'Оройн мэнд!', category: 'Мэндчилгээ' },
  { de: 'Gute Nacht!', mn: 'Сайхан амраарай!', category: 'Мэндчилгээ' },
  { de: 'Tschüss!', mn: 'Баяртай!', category: 'Мэндчилгээ' },
  { de: 'Auf Wiedersehen!', mn: 'Дараа уулзацгаая!', category: 'Мэндчилгээ' },
  { de: 'Danke schön!', mn: 'Маш их баярлалаа!', category: 'Эелдэг үг' },
  { de: 'Bitte schön!', mn: 'Зүгээр дээ / Зүгээр ээ!', category: 'Эелдэг үг' },
  { de: 'Entschuldigung!', mn: 'Уучлаарай!', category: 'Эелдэг үг' },
  { de: 'Ja / Nein', mn: 'Тийм / Үгүй', category: 'Суурь' },

  // Common phrases & questions
  { de: 'Wie geht es dir?', mn: 'Юу байна даа? / Бие сайн уу?', category: 'Асуулт' },
  { de: 'Mir geht es gut.', mn: 'Би сайн байгаа.', category: 'Хариулт' },
  { de: 'Wie heißt du?', mn: 'Чамайг хэн гэдэг вэ?', category: 'Асуулт' },
  { de: 'Ich heiße...', mn: 'Намайг ... гэдэг.', category: 'Танилцах' },
  { de: 'Woher kommst du?', mn: 'Чи хаанаас ирсэн бэ?', category: 'Асуулт' },
  { de: 'Ich komme aus der Mongolei.', mn: 'Би Монголоос ирсэн.', category: 'Улс' },
  { de: 'Ich wohne in...', mn: 'Би ...-д амьдардаг.', category: 'Гэр' },
  { de: 'Was machst du gern?', mn: 'Чи юу хийх дуртай вэ?', category: 'Хобби' },
  { de: 'Ich lerne Deutsch.', mn: 'Би герман хэл сурч байгаа.', category: 'Сургууль' },
  { de: 'Ich verstehe nicht.', mn: 'Би ойлгохгүй байна.', category: 'Харилцаа' },
  { de: 'Kannst du das wiederholen?', mn: 'Дахиад нэг хэлж өгөх үү?', category: 'Харилцаа' },

  // Daily life, Food & Hobbies
  { de: 'das Wasser', mn: 'Ус', category: 'Ундаа' },
  { de: 'der Tee', mn: 'Цай', category: 'Ундаа' },
  { de: 'die Pizza', mn: 'Пицца', category: 'Хоол' },
  { de: 'der Apfel', mn: 'Алим', category: 'Жимс' },
  { de: 'das Brot', mn: 'Талх', category: 'Хоол' },
  { de: 'die Schokolade', mn: 'Шоколад', category: 'Амттан' },
  { de: 'die Schule', mn: 'Сургууль', category: 'Сургууль' },
  { de: 'das Buch', mn: 'Ном', category: 'Сургууль' },
  { de: 'der Freund / die Freundin', mn: 'Найз (эрэгтэй/эмэгтэй)', category: 'Хүмүүс' },
  { de: 'die Musik', mn: 'Хөгжим', category: 'Хобби' },
  { de: 'das Computerspiel', mn: 'Компьютер тоглоом', category: 'Хобби' },
  { de: 'der Fußball', mn: 'Хөл бөмбөг', category: 'Спорт' },
  { de: 'das Handy', mn: 'Гар утас', category: 'Техник' },
  { de: 'das Haus', mn: 'Байшин / Гэр', category: 'Гэр' },
  { de: 'die Katze', mn: 'Муур', category: 'Амьтан' },
  { de: 'der Hund', mn: 'Нохой', category: 'Амьтан' },

  // Common verbs
  { de: 'spielen', mn: 'Тоглох', category: 'Үйл үг' },
  { de: 'lernen', mn: 'Сурах', category: 'Үйл үг' },
  { de: 'hören', mn: 'Сонсох', category: 'Үйл үг' },
  { de: 'sehen', mn: 'Харах', category: 'Үйл үг' },
  { de: 'essen', mn: 'Идэх', category: 'Үйл үг' },
  { de: 'trinken', mn: 'Уух', category: 'Үйл үг' },
  { de: 'schlafen', mn: 'Унтах', category: 'Үйл үг' },
  { de: 'gehen', mn: 'Явах', category: 'Үйл үг' },
  { de: 'sprechen', mn: 'Ярих', category: 'Үйл үг' },
  { de: 'schreiben', mn: 'Бичих', category: 'Үйл үг' },
  { de: 'lieben', mn: 'Хайрлах / Дуртай байх', category: 'Үйл үг' },
];

export const QuickTranslator: React.FC<QuickTranslatorProps> = ({ profileId }) => {
  const [activeTab, setActiveTab] = useState<'translate' | 'notes'>('translate');
  const [searchTerm, setSearchTerm] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const [savedNotes, setSavedNotes] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(`dm_notes_${profileId}`);
      return stored ? JSON.parse(stored) : [
        'Hallo! Ich lerne heute Deutsch.',
        'Musik hören macht viel Spaß.',
      ];
    } catch {
      return ['Hallo! Ich lerne heute Deutsch.'];
    }
  });

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      audioPlayer.stop();
    };
  }, []);

  // Combine curriculum vocab & dialogue with base dictionary
  const fullDictionary = useMemo(() => {
    const map = new Map<string, DictItem>();

    // Add all curriculum key vocab
    const lessons = CURRICULUM[profileId] || [];
    lessons.forEach((l) => {
      l.keyVocab?.forEach((kv) => {
        const cleanDe = kv.de.replace(/\{.*?\}/g, '').trim();
        const cleanMn = kv.mn.replace(/\{.*?\}/g, '').trim();
        if (cleanDe && !map.has(cleanDe.toLowerCase())) {
          map.set(cleanDe.toLowerCase(), {
            de: cleanDe,
            mn: cleanMn,
            category: `${l.day}-р өдөр`,
          });
        }
      });

      // Add key dialogue sentences with pre-recorded audioKey
      l.dialogue?.forEach((d) => {
        const cleanDe = d.textDe.replace(/\{.*?\}/g, '').trim();
        const cleanMn = d.textMn.replace(/\{.*?\}/g, '').trim();
        if (cleanDe && !map.has(cleanDe.toLowerCase()) && cleanDe.length < 50) {
          map.set(cleanDe.toLowerCase(), {
            de: cleanDe,
            mn: cleanMn,
            category: `${l.day}-р өдөр`,
            audioKey: d.audioKey,
          });
        }
      });
    });

    // Add base dictionary
    BASE_DICTIONARY.forEach((w) => {
      const key = w.de.toLowerCase();
      if (!map.has(key)) {
        map.set(key, w);
      }
    });

    return Array.from(map.values());
  }, [profileId]);

  // Filtered dictionary based on search
  const filteredWords = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) {
      // Return 8 diverse popular everyday starter words
      return fullDictionary.slice(0, 8);
    }
    return fullDictionary
      .filter((item) => item.de.toLowerCase().includes(q) || item.mn.toLowerCase().includes(q))
      .slice(0, 15);
  }, [searchTerm, fullDictionary]);

  // Universal German audio player (Local Studio MP3 -> Google TTS -> Web Speech)
  const speakGerman = async (text: string, audioKey?: string) => {
    if (!text.trim()) return;
    setPlayingWord(text);
    try {
      await audioPlayer.speak(text, audioKey);
    } finally {
      setTimeout(() => {
        setPlayingWord((curr) => (curr === text ? null : curr));
      }, 1200);
    }
  };

  // Add custom note
  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    const newNotes = [noteInput.trim(), ...savedNotes];
    setSavedNotes(newNotes);
    localStorage.setItem(`dm_notes_${profileId}`, JSON.stringify(newNotes));
    setNoteInput('');
  };

  // Delete note
  const handleDeleteNote = (index: number) => {
    const newNotes = savedNotes.filter((_, i) => i !== index);
    setSavedNotes(newNotes);
    localStorage.setItem(`dm_notes_${profileId}`, JSON.stringify(newNotes));
  };

  const tabBtnClass = (active: boolean) =>
    active
      ? `font-bold text-white bg-slate-800 border border-slate-700 shadow-sm`
      : `text-slate-400 hover:text-slate-200 border border-transparent`;

  return (
    <div className="p-4 rounded-3xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md shadow-xl space-y-3">
      {/* Tool Header & Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-1.5 p-0.5 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('translate')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs transition-all ${tabBtnClass(
              activeTab === 'translate'
            )}`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Толь / Орчуулагч</span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs transition-all ${tabBtnClass(
              activeTab === 'notes'
            )}`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Чөлөөт бичих</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-500">A1 Практик</span>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: QUICK TRANSLATOR & SEARCH                             */}
      {/* ============================================================ */}
      {activeTab === 'translate' && (
        <div className="space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Герман эсвэл Монгол үг хайх..."
              className="w-full pl-9 pr-24 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {searchTerm.trim() && (
              <button
                onClick={() => speakGerman(searchTerm)}
                className={`absolute right-2 top-1.5 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition-all ${
                  playingWord === searchTerm
                    ? 'bg-amber-500/30 text-amber-300 border-amber-500/50 ring-1 ring-amber-400'
                    : 'bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border-indigo-500/40'
                }`}
                title="Энэ үгийг германаар унших"
              >
                <Volume2 className={`w-3 h-3 ${playingWord === searchTerm ? 'animate-pulse text-amber-300' : ''}`} />
                Сонсох
              </button>
            )}
          </div>

          {/* Results List */}
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {filteredWords.length > 0 ? (
              filteredWords.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between transition-all"
                >
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{item.de}</span>
                      {item.category && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-normal">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5">{item.mn}</div>
                  </div>

                  <button
                    onClick={() => speakGerman(item.de, item.audioKey)}
                    className={`p-2 rounded-xl border transition-all active:scale-95 shrink-0 ${
                      playingWord === item.de
                        ? 'bg-amber-500/30 border-amber-500 text-amber-300 ring-2 ring-amber-400/50'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                    }`}
                    title="Дуудлага сонсох"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${playingWord === item.de ? 'text-amber-300 animate-pulse' : 'text-amber-400'}`} />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
                <p className="text-xs text-slate-400">"{searchTerm}" олдсонгүй.</p>
                <button
                  onClick={() => speakGerman(searchTerm)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                    playingWord === searchTerm
                      ? 'bg-amber-500/30 text-amber-300 border-amber-500/50 ring-1 ring-amber-400'
                      : 'bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border-indigo-500/40'
                  }`}
                >
                  <Volume2 className={`w-3.5 h-3.5 ${playingWord === searchTerm ? 'animate-pulse text-amber-300' : ''}`} />
                  Германаар яаж уншихыг сонсох
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: FREE WRITING SANDBOX & GERMAN NOTES                   */}
      {/* ============================================================ */}
      {activeTab === 'notes' && (
        <div className="space-y-3">
          {/* Writing Input */}
          <div className="space-y-2">
            <label className="text-[11px] text-slate-400 font-medium block">
              ✍️ Өөрийн хүссэн өгүүлбэрээ бичээрэй:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                placeholder="Жишээ: Ich trinke gern Tee..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleAddNote}
                disabled={!noteInput.trim()}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                Нэмэх
              </button>
            </div>
            {noteInput.trim() && (
              <button
                onClick={() => speakGerman(noteInput)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-all"
              >
                <Volume2 className={`w-3.5 h-3.5 ${playingWord === noteInput ? 'animate-pulse text-amber-300' : ''}`} />
                Бичсэн өгүүлбэрээ дуудуулж сонсох 🔊
              </button>
            )}
          </div>

          {/* Saved Notes List */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1">
              <BookMarked className="w-3 h-3" />
              <span>Миний тэмдэглэсэн өгүүлбэрүүд ({savedNotes.length})</span>
            </div>

            {savedNotes.map((note, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-2"
              >
                <span className="text-xs text-white font-medium break-all">{note}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => speakGerman(note)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      playingWord === note
                        ? 'bg-amber-500/30 border-amber-500 text-amber-300 ring-1 ring-amber-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700'
                    }`}
                    title="Сонсох"
                  >
                    <Volume2 className={`w-3 h-3 ${playingWord === note ? 'animate-pulse text-amber-300' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(idx)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700"
                    title="Устгах"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
