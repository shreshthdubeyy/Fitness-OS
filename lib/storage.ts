import { FitnessInput } from './types';

export interface UserProfile {
  id: string;
  name: string;
  pin?: string;
  createdAt: string;
}

export interface WeightEntry {
  id: string;
  date: string;
  weightKg: number;
}

const PROFILES_LIST_KEY = 'fitness_os_profiles_list';
const ACTIVE_PROFILE_KEY = 'fitness_os_active_profile_id';

const DEFAULT_PROFILE: UserProfile = {
  id: 'user-default',
  name: 'Default User',
  createdAt: new Date().toISOString(),
};

export function getProfilesList(): UserProfile[] {
  if (typeof window === 'undefined') return [DEFAULT_PROFILE];
  try {
    const raw = localStorage.getItem(PROFILES_LIST_KEY);
    if (!raw) {
      localStorage.setItem(PROFILES_LIST_KEY, JSON.stringify([DEFAULT_PROFILE]));
      return [DEFAULT_PROFILE];
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to get profiles list:', err);
    return [DEFAULT_PROFILE];
  }
}

export function getActiveProfileId(): string {
  if (typeof window === 'undefined') return DEFAULT_PROFILE.id;
  try {
    const active = localStorage.getItem(ACTIVE_PROFILE_KEY);
    if (!active) {
      localStorage.setItem(ACTIVE_PROFILE_KEY, DEFAULT_PROFILE.id);
      return DEFAULT_PROFILE.id;
    }
    return active;
  } catch (err) {
    console.error('Failed to get active profile ID:', err);
    return DEFAULT_PROFILE.id;
  }
}

export function setActiveProfileId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACTIVE_PROFILE_KEY, id);
  } catch (err) {
    console.error('Failed to set active profile ID:', err);
  }
}

export function createProfile(name: string, pin?: string): UserProfile {
  const profiles = getProfilesList();
  const newProfile: UserProfile = {
    id: `user-${Date.now()}`,
    name: name.trim() || 'New User',
    pin: pin ? pin.trim() : undefined,
    createdAt: new Date().toISOString(),
  };

  const updated = [...profiles, newProfile];
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROFILES_LIST_KEY, JSON.stringify(updated));
    localStorage.setItem(ACTIVE_PROFILE_KEY, newProfile.id);
  }
  return newProfile;
}

export function deleteProfile(id: string): void {
  if (id === DEFAULT_PROFILE.id) return;
  const profiles = getProfilesList().filter((p) => p.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROFILES_LIST_KEY, JSON.stringify(profiles));
    const active = getActiveProfileId();
    if (active === id) {
      localStorage.setItem(ACTIVE_PROFILE_KEY, DEFAULT_PROFILE.id);
    }
  }
}

// User-partitioned storage helpers
export function saveInputToStorage(profileId: string, input: FitnessInput): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`fitness_os_input_${profileId}`, JSON.stringify(input));
  } catch (err) {
    console.error('Failed to save input to storage:', err);
  }
}

export function loadInputFromStorage(profileId: string): FitnessInput | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`fitness_os_input_${profileId}`);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Failed to load input from storage:', err);
    return null;
  }
}

export function saveWeightLogsToStorage(profileId: string, logs: WeightEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`fitness_os_weight_${profileId}`, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to save weight logs to storage:', err);
  }
}

export function loadWeightLogsFromStorage(profileId: string): WeightEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`fitness_os_weight_${profileId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load weight logs from storage:', err);
    return [];
  }
}

// Onboarding Status Storage
export function isOnboardedFromStorage(profileId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(`fitness_os_onboarded_${profileId}`) === 'true';
  } catch (err) {
    return false;
  }
}

export function setOnboardedToStorage(profileId: string, value: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`fitness_os_onboarded_${profileId}`, value ? 'true' : 'false');
  } catch (err) {
    console.error('Failed to set onboarded status:', err);
  }
}
