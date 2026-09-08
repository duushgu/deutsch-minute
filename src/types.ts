export type ProfileId = 'sister' | 'brother1' | 'brother2';

export interface ProfileConfig {
  id: ProfileId;
  name: string;
  age: number;
  title: string;
  theme: 'kdrama' | 'gamer' | 'cozy';
  partnerName: string;
  partnerRole: string;
  partnerAvatar: string;
  userAvatar: string;
  tagline: string;
  interests: string[];
}

export interface ChoiceOption {
  id: string;
  textDe: string;
  textMn: string;
  phoneticMn: string;
  isCorrect: boolean;
}

export interface DialogueChallenge {
  type: 'word_order' | 'choice';
  promptDe?: string;
  promptMn?: string;
  scrambledWords?: string[];
  correctOrder?: string[];
  choices?: ChoiceOption[];
}

export interface DialogueTurn {
  id: string;
  speaker: 'partner' | 'user';
  textDe: string;
  textMn: string;
  phoneticMn: string;
  audioKey: string;
  challenge?: DialogueChallenge;
}

export interface KeyVocab {
  de: string;
  mn: string;
  ph: string;
}

export interface DayLesson {
  day: number;
  phase: number;
  topic: string;
  topicMn: string;
  grammarFocus: string;
  dialogue: DialogueTurn[];
  keyVocab: KeyVocab[];
}

export type ThemeId = 'kdrama' | 'gamer' | 'cozy';

export interface SiblingProgress {
  profileId: ProfileId;
  name: string; // User-customized display name
  partnerName: string; // Chosen hero/friend name
  partnerAvatar: string; // Chosen hero avatar
  currentDay: number;
  completedDays: number[];
  streak: number;
  lastCompletedDate: string | null; // 'YYYY-MM-DD'
  xp: number;
  badges: string[];
  lastActiveTimestamp: number;
  hasCompletedOnboarding: boolean;
  customTheme?: ThemeId; // user-selected theme
  showPhoneticsArchiveDays1to5?: boolean; // phonetics setting (only days 1-5 in archive)
}

export interface SquadState {
  version: number;
  profiles: Record<ProfileId, SiblingProgress>;
  activeProfileId: ProfileId;
  dedicatedProfileId: ProfileId | null; // locked if opened via dedicated app
  testModeUnlocked: boolean; // admin toggle for testing
  showPhoneticsArchiveDays1to5?: boolean; // global fallback setting
  cloudSyncUrl?: string;
  lastSyncTimestamp?: number;
}
