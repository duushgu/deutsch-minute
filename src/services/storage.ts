import { ProfileId, SiblingProgress, SquadState } from '../types';
import { PROFILES } from '../data/profiles';

const STORAGE_KEY = 'deutsch_minute_squad_v1';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function createDefaultSiblingProgress(id: ProfileId): SiblingProgress {
  const config = PROFILES[id];
  return {
    profileId: id,
    name: config.name,
    mbti: config.mbti,
    currentDay: 1,
    completedDays: [],
    streak: 0,
    lastCompletedDate: null,
    xp: 0,
    badges: [],
    lastActiveTimestamp: Date.now(),
  };
}

export function getDefaultSquadState(): SquadState {
  return {
    version: 1,
    activeProfileId: 'brother1',
    testModeUnlocked: false,
    profiles: {
      sister: createDefaultSiblingProgress('sister'),
      brother1: createDefaultSiblingProgress('brother1'),
      brother2: createDefaultSiblingProgress('brother2'),
    },
  };
}

export function loadSquadState(): SquadState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const def = getDefaultSquadState();
      saveSquadState(def);
      return def;
    }
    const parsed = JSON.parse(raw) as SquadState;
    // Ensure all profiles exist
    (['sister', 'brother1', 'brother2'] as ProfileId[]).forEach((id) => {
      if (!parsed.profiles[id]) {
        parsed.profiles[id] = createDefaultSiblingProgress(id);
      }
    });
    return parsed;
  } catch {
    return getDefaultSquadState();
  }
}

export function saveSquadState(state: SquadState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Error saving squad state:', err);
  }
}

export function isCompletedToday(progress: SiblingProgress, testModeUnlocked: boolean): boolean {
  if (testModeUnlocked) return false; // In test mode, always unlocked!
  if (!progress.lastCompletedDate) return false;
  return progress.lastCompletedDate === getTodayDateString();
}

export function completeDayLesson(state: SquadState, profileId: ProfileId, day: number): SquadState {
  const today = getTodayDateString();
  const profile = state.profiles[profileId];

  // Calculate streak
  let newStreak = profile.streak;
  if (profile.lastCompletedDate) {
    const lastDate = new Date(profile.lastCompletedDate);
    const currentDate = new Date(today);
    const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays === 0) {
      // Already completed today
      newStreak = Math.max(1, newStreak);
    } else {
      // Streak broke, reset to 1
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }

  const completedDays = Array.from(new Set([...profile.completedDays, day]));
  const xp = profile.xp + 100;
  const badges = [...profile.badges];
  if (day === 10 && !badges.includes('Phase 1 Champion')) {
    badges.push('Phase 1 Champion');
  }

  const updatedProfile: SiblingProgress = {
    ...profile,
    currentDay: Math.min(60, Math.max(profile.currentDay, day + 1)),
    completedDays,
    streak: newStreak,
    lastCompletedDate: today,
    xp,
    badges,
    lastActiveTimestamp: Date.now(),
  };

  const updatedState: SquadState = {
    ...state,
    profiles: {
      ...state.profiles,
      [profileId]: updatedProfile,
    },
  };

  saveSquadState(updatedState);
  return updatedState;
}

// Export state as base64 string (for easy copy-paste)
export function exportStateString(state: SquadState): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(state))));
}

// Import state from base64 string
export function importStateString(encoded: string): SquadState | null {
  try {
    const jsonStr = decodeURIComponent(escape(atob(encoded)));
    const parsed = JSON.parse(jsonStr) as SquadState;
    if (parsed.version && parsed.profiles) {
      saveSquadState(parsed);
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}
