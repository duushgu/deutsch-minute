// Native MP3 Player with Web Speech fallback

class AudioPlayer {
  private currentAudio: HTMLAudioElement | null = null;

  async play(audioKey: string, fallbackText?: string): Promise<void> {
    this.stop();

    const audioUrl = `audio/${audioKey}.mp3`;
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
