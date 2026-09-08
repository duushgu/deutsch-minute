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
        lastActiveTimestamp: Date.now(),
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
        lastActiveTimestamp: Date.now(),
      },
    },
  };
  saveSquadState(updated);
  return updated;
}

export function getCalendarDayDifference(dateStr1: string, dateStr2: string): number {
  try {
    const [y1, m1, d1] = dateStr1.split('-').map(Number);
    const [y2, m2, d2] = dateStr2.split('-').map(Number);
    // Use UTC to prevent any daylight saving time / timezone shifts
    const utc1 = Date.UTC(y1, m1 - 1, d1);
    const utc2 = Date.UTC(y2, m2 - 1, d2);
    return Math.round(Math.abs(utc2 - utc1) / (1000 * 60 * 60 * 24));
  } catch {
    return 1;
  }
}

export function formatDialogueText(
  text: string,
  defaultUserName: string,
  currentUserName: string,
  defaultPartnerName: string,
  currentPartnerName: string
): string {
  if (!text) return text;
  const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const actualUser = currentUserName?.trim() || defaultUserName;
  const actualPartner = currentPartnerName?.trim() || defaultPartnerName;

  let res = text;
  res = res.replace(/\{userName\}/g, actualUser);
  res = res.replace(/\{partnerName\}/g, actualPartner);

  if (defaultUserName) {
    res = res.replace(new RegExp(escapeRegex(defaultUserName), 'g'), actualUser);
  }
  if (defaultPartnerName) {
    res = res.replace(new RegExp(escapeRegex(defaultPartnerName), 'g'), actualPartner);
  }

  // Also replace any legacy names from earlier drafts
  const legacyUserNames = ['Anu', 'Ану', 'Temuulen', 'Тэмүүлэн', 'Batu', 'Бату'];
  for (const legacy of legacyUserNames) {
    res = res.replace(new RegExp(escapeRegex(legacy), 'g'), actualUser);
  }

  const legacyPartnerNames = ['Min-jun', 'Мин-жүн', 'Saber', 'Сабер', 'Tanjiro', 'Танжиро'];
  for (const legacy of legacyPartnerNames) {
    res = res.replace(new RegExp(escapeRegex(legacy), 'g'), actualPartner);
  }

  return res;
}

export function isCompletedToday(progress: SiblingProgress, testModeUnlocked: boolean): boolean {
  if (testModeUnlocked) return false;
  if (!progress.lastCompletedDate) return false;
  return progress.lastCompletedDate === getTodayDateString();
}

export function completeDayLesson(
  state: SquadState,
  profileId: ProfileId,
  day: number,
  bonusXp: number = 0
): SquadState {
  const today = getTodayDateString();
  const profile = state.profiles[profileId];

  let newStreak = profile.streak || 0;
  if (profile.lastCompletedDate) {
    const diffDays = getCalendarDayDifference(profile.lastCompletedDate, today);

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

  const existingCompleted = Array.isArray(profile.completedDays) ? profile.completedDays : [];
  const completedDays = Array.from(new Set([...existingCompleted, day]));
  const xp = (profile.xp || 0) + 100 + bonusXp;
  const existingBadges = Array.isArray(profile.badges) ? profile.badges : [];
  const badges = [...existingBadges];
  if (day === 10 && !badges.includes('Phase 1 Champion')) {
    badges.push('Phase 1 Champion');
  }
  if (bonusXp > 0 && !badges.includes('Lightning Speed ⚡')) {
    badges.push('Lightning Speed ⚡');
  }

  const updatedProfile: SiblingProgress = {
    ...profile,
    currentDay: Math.min(60, Math.max(profile.currentDay || 1, day + 1)),
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

export const FIREBASE_RTDB_BASE = 'https://deutsch-minute-default-rtdb.firebaseio.com';
export const FIREBASE_SQUAD_URL = `${FIREBASE_RTDB_BASE}/squad`;

// Background silent push to Firebase Realtime Database
export async function silentCloudSync(state: SquadState): Promise<boolean> {
  const active = state.activeProfileId;
  const activeProgress = state.profiles[active];
  if (!activeProgress) return false;

  const url = `${FIREBASE_SQUAD_URL}/${active}.json`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const resp = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activeProgress),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    // Also update ultra2 local fallback daemon if reachable
    fetch('http://192.168.1.169:8767/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profileId: active,
        progress: activeProgress,
        allProfiles: state.profiles,
        timestamp: Date.now(),
      }),
    }).catch(() => {});

    return resp.ok;
  } catch {
    // Ignore network errors silently (offline first)
    return false;
  }
}

// Background smart fetch and merge with Firebase Realtime Database
export async function syncWithCloud(currentState: SquadState): Promise<SquadState> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const resp = await fetch(`${FIREBASE_SQUAD_URL}.json`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!resp.ok) return currentState;
    const remoteData = (await resp.json()) as Record<string, Partial<SiblingProgress>> | null;

    if (!remoteData || typeof remoteData !== 'object') {
      // Remote is empty, push current active profile to seed Firebase
      silentCloudSync(currentState).catch(() => {});
      return currentState;
    }

    let hasChanges = false;
    const mergedProfiles = { ...currentState.profiles };
    const siblingIds: ProfileId[] = ['sister', 'brother1', 'brother2'];

    for (const id of siblingIds) {
      const remote = remoteData[id];
      const local = currentState.profiles[id];

      if (!remote) {
        if (id === currentState.activeProfileId) {
          silentCloudSync(currentState).catch(() => {});
        }
        continue;
      }

      const defaultProf = createDefaultSiblingProgress(id);

      if (id !== currentState.activeProfileId) {
        // For other siblings: remote is source of truth because they use their own phone
        const updatedOther: SiblingProgress = {
          ...defaultProf,
          ...local,
          ...remote,
          profileId: id,
          completedDays: Array.isArray(remote.completedDays) ? remote.completedDays : (local?.completedDays || []),
          badges: Array.isArray(remote.badges) ? remote.badges : (local?.badges || []),
        };

        if (!local || JSON.stringify(local) !== JSON.stringify(updatedOther)) {
          mergedProfiles[id] = updatedOther;
          hasChanges = true;
        }
      } else {
        // For current active child on this phone:
        const localDays = local?.completedDays?.length || 0;
        const remoteDays = remote?.completedDays?.length || 0;
        const localTime = local?.lastActiveTimestamp || 0;
        const remoteTime = remote?.lastActiveTimestamp || 0;

        // Remote has completed onboarding while local has not: restore remote profile
        const shouldRestoreOnboarding = !local?.hasCompletedOnboarding && remote.hasCompletedOnboarding;

        if (
          shouldRestoreOnboarding ||
          remoteDays > localDays ||
          (remoteDays === localDays && remoteTime > localTime)
        ) {
          const mergedActive: SiblingProgress = {
            ...defaultProf,
            ...local,
            ...remote,
            profileId: id,
            name: remote.name || local?.name || defaultProf.name,
            partnerName: remote.partnerName || local?.partnerName || defaultProf.partnerName,
            partnerAvatar: remote.partnerAvatar || local?.partnerAvatar || defaultProf.partnerAvatar,
            completedDays: Array.isArray(remote.completedDays) ? remote.completedDays : (local?.completedDays || []),
            badges: Array.isArray(remote.badges) ? remote.badges : (local?.badges || []),
          };
          mergedProfiles[id] = mergedActive;
          hasChanges = true;
        } else if (localDays > remoteDays || localTime > remoteTime || (!remote && local)) {
          // Local is ahead, push local to Firebase
          silentCloudSync(currentState).catch(() => {});
        }
      }
    }

    if (hasChanges) {
      const newState: SquadState = {
        ...currentState,
        profiles: mergedProfiles,
        lastSyncTimestamp: Date.now(),
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      } catch (e) {
        console.error(e);
      }
      return newState;
    }

    return currentState;
  } catch {
    // Offline or network error: gracefully keep current state
    return currentState;
  }
}
