import { ProfileId, SiblingProgress, SquadState } from '../types';
import { PROFILES } from '../data/profiles';

const STORAGE_KEY = 'deutsch_minute_squad_v3';
const DEDICATED_KEY = 'deutsch_minute_dedicated_profile_v3';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function detectUrlProfile(): ProfileId | null {
  if (typeof window === 'undefined') return null;

  const preset = (window as unknown as { __PRESET_PROFILE__?: ProfileId }).__PRESET_PROFILE__;
  if (preset) return preset;

  const path = window.location.pathname.toLowerCase();
  if (path.includes('mongonchimeg')) return 'sister';
  if (path.includes('tomoo')) return 'brother1';
  if (path.includes('jijgee')) return 'brother2';

  // Check query param: ?p=mongonchimeg, ?p=tomoo, ?p=jijgee, or ?p=anu etc.
  const params = new URLSearchParams(window.location.search);
  const pParam = params.get('p')?.toLowerCase();
  const hash = window.location.hash.replace('#', '').toLowerCase();
  const target = pParam || hash;

  if (target === 'mongonchimeg' || target === 'chimeg' || target === 'anu' || target === 'sister') return 'sister';
  if (target === 'tomoo' || target === 'temuulen' || target === 'temu' || target === 'brother1') return 'brother1';
  if (target === 'jijgee' || target === 'batu' || target === 'brother2') return 'brother2';

  return null;
}

function createDefaultSiblingProgress(id: ProfileId): SiblingProgress {
  const config = PROFILES[id];
  return {
    profileId: id,
    name: config.name,
    partnerName: config.partnerName,
    partnerAvatar: config.partnerAvatar,
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
    version: 3,
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
    // Silent background sync
    silentCloudSync(state).catch(() => {});
  } catch (err) {
    console.error('Error saving squad state:', err);
  }
}

export function updateOnboarding(
  state: SquadState,
  profileId: ProfileId,
  customName: string,
  partnerName: string,
  partnerAvatar: string
): SquadState {
  const profile = state.profiles[profileId];
  const updated: SquadState = {
    ...state,
    profiles: {
      ...state.profiles,
      [profileId]: {
        ...profile,
        name: customName.trim() || profile.name,
        partnerName: partnerName || profile.partnerName,
        partnerAvatar: partnerAvatar || profile.partnerAvatar,
        hasCompletedOnboarding: true,
      },
    },
  };
  saveSquadState(updated);
  return updated;
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

// Background silent sync
export async function silentCloudSync(state: SquadState): Promise<boolean> {
  const syncEndpoints = [
    state.cloudSyncUrl,
    'http://192.168.1.169:8767/api/sync', // Local ultra2 sync daemon fallback
  ].filter(Boolean) as string[];

  if (syncEndpoints.length === 0) return false;

  const active = state.activeProfileId;
  const payload = {
    profileId: active,
    progress: state.profiles[active],
    allProfiles: state.profiles,
    timestamp: Date.now(),
  };

  for (const endpoint of syncEndpoints) {
    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (resp.ok) return true;
    } catch {
      // Ignore network errors silently
    }
  }

  return false;
}
