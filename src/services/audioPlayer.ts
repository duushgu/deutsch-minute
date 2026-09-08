// Dynamic audio URL resolver for GitHub Pages subpaths and multi-page apps
export function getAudioUrl(audioKey: string): string {
  if (typeof window === 'undefined') return `audio/${audioKey}.mp3`;
  const pathname = window.location.pathname;
  // If hosted on GitHub Pages under /deutsch-minute/
  const ghMatch = pathname.match(/^(.*\/deutsch-minute)\//);
  if (ghMatch) {
    return `${ghMatch[1]}/audio/${audioKey}.mp3`;
  }
  // If on a subpage like /mongonchimeg/, /tomoo/, /jijgee/
  if (pathname.includes('/mongonchimeg') || pathname.includes('/tomoo') || pathname.includes('/jijgee')) {
    return `../audio/${audioKey}.mp3`;
  }
  return `audio/${audioKey}.mp3`;
}

class AudioPlayer {
  private currentAudio: HTMLAudioElement | null = null;

  async play(audioKey: string, fallbackText?: string): Promise<void> {
    this.stop();

    const audioUrl = getAudioUrl(audioKey);
    try {
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;
      await audio.play();
    } catch {
      // Fallback to browser Web Speech API if audio file is inaccessible or offline
      if (fallbackText && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(fallbackText);
        utterance.lang = 'de-DE';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    }
  }

  async speak(text: string, audioKey?: string): Promise<void> {
    this.stop();
    const cleanText = text.replace(/\{.*?\}/g, '').replace(/[\/()]/g, ' ').trim();
    if (!cleanText) return;

    // 1. If audioKey is provided, try playing pre-recorded studio audio first
    if (audioKey) {
      try {
        const audioUrl = getAudioUrl(audioKey);
        const audio = new Audio(audioUrl);
        this.currentAudio = audio;
        await audio.play();
        return;
      } catch {
        // Fallback to online TTS or speech synthesis
      }
    }

    // 2. Stream authentic German pronunciation via Google Translate TTS (HTML5 Audio)
    try {
      const encoded = encodeURIComponent(cleanText.slice(0, 200));
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=de&client=tw-ob&q=${encoded}`;
      const audio = new Audio(ttsUrl);
      this.currentAudio = audio;
      await audio.play();
      return;
    } catch {
      // Fallback to browser Web Speech API
    }

    // 3. Fallback: Browser Web Speech API
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'de-DE';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Ignore fallback errors
      }
    }
  }

  stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }
}

export const audioPlayer = new AudioPlayer();
