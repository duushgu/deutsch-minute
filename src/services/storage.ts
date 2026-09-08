import { ProfileId, SiblingProgress, SquadState } from '../types';
import { PROFILES } from '../data/profiles';

const STORAGE_KEY = 'deutsch_minute_squad_v2';
const DEDICATED_KEY = 'deutsch_minute_dedicated_profile';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function detectUrlProfile(): ProfileId | null {
  if (typeof window === 'undefined') return null;

  // Check query param: ?p=anu, ?p=temuulen, ?p=batu
  const params = new URLSearchParams(window.location.search);
  const pParam = params.get('p')?.toLowerCase();

  // Check hash: #anu, #temuulen, #batu
  const hash = window.location.hash.replace('#', '').toLowerCase();

  const target = pParam || hash;

  if (target === 'anu' || target === 'sister') return 'sister';
  if (target === 'temuulen' || target === 'temu' || target === 'brother1') return 'brother1';
  if (target === 'batu' || target === 'brother2') return 'brother2';

  return null;
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
    hasCompletedOnboarding: false,
  };
}

export function getDefaultSquadState(dedicatedId: ProfileId | null = null): SquadState {
  const active = dedicatedId || 'brother1';
  return {
    version: 2,
    activeProfileId: active,
    dedicatedProfileId: dedicatedId,
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
    const urlProfile = detectUrlProfile();
    const storedDedicated = localStorage.getItem(DEDICATED_KEY) as ProfileId | null;
    const effectiveDedicated = urlProfile || storedDedicated || null;

    if (effectiveDedicated) {
      localStorage.setItem(DEDICATED_KEY, effectiveDedicated);
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const def = getDefaultSquadState(effectiveDedicated);
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

    if (effectiveDedicated) {
      parsed.dedicatedProfileId = effectiveDedicated;
      parsed.activeProfileId = effectiveDedicated;
    }

    return parsed;
  } catch {
    return getDefaultSquadState();
  }
}

export function saveSquadState(state: SquadState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    // Trigger silent cloud sync in background if online
    silentCloudSync(state).catch(() => {});
  } catch (err) {
    console.error('Error saving squad state:', err);
  }
}

export function updateCustomName(state: SquadState, profileId: ProfileId, newName: string): SquadState {
  const profile = state.profiles[profileId];
  const updated: SquadState = {
    ...state,
    profiles: {
      ...state.profiles,
      [profileId]: {
        ...profile,
        name: newName.trim() || profile.name,
        hasCompletedOnboarding: true,
      },
    },
  };
  saveSquadState(updated);
  return updated;
}

export function isCompletedToday(progress: SiblingProgress, testModeUnlocked: boolean): boolean {
  if (testModeUnlocked) return false;
  if (!progress.lastCompletedDate) return false;
  return progress.lastCompletedDate === getTodayDateString();
}

export function completeDayLesson(state: SquadState, profileId: ProfileId, day: number): SquadState {
  const today = getTodayDateString();
  const profile = state.profiles[profileId];

  let newStreak = profile.streak;
  if (profile.lastCompletedDate) {
    const lastDate = new Date(profile.lastCompletedDate);
    const currentDate = new Date(today);
    const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays === 0) {
      newStreak = Math.max(1, newStreak);
    } else {
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

// Silent cloud sync function:
// Sends payload to cloud endpoint if configured, or fails gracefully without bothering user
export async function silentCloudSync(state: SquadState): Promise<boolean> {
  if (!state.cloudSyncUrl) return false;

  try {
    const active = state.activeProfileId;
    const progress = state.profiles[active];

    await fetch(state.cloudSyncUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profileId: active,
        progress,
        timestamp: Date.now(),
      }),
    });
    return true;
  } catch {
    return false;
  }
}
