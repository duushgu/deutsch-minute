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

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioPlayer = new AudioPlayer();
