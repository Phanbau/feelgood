import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppData, DiaryEntry, Goal, Profile } from "../types/app";

const STORAGE_KEY = "feelgood:app-data";

const DEFAULT_APP_DATA: AppData = {
  profile: null,
  goals: [],
  diaryEntries: [],
};

export async function loadAppData(): Promise<AppData> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_APP_DATA;
    }
    const parsed = JSON.parse(stored) as AppData;
    return {
      profile: parsed.profile ?? null,
      goals: parsed.goals ?? [],
      diaryEntries: parsed.diaryEntries ?? [],
    };
  } catch (error) {
    console.warn("Failed to load app data", error);
    return DEFAULT_APP_DATA;
  }
}

export async function saveAppData(data: AppData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to save app data", error);
  }
}

export async function saveProfile(profile: Profile): Promise<AppData> {
  const appData = await loadAppData();
  const next: AppData = {
    ...appData,
    profile,
  };
  await saveAppData(next);
  return next;
}

export async function addGoal(goal: Goal): Promise<AppData> {
  const appData = await loadAppData();
  const next: AppData = {
    ...appData,
    goals: [...appData.goals, goal],
  };
  await saveAppData(next);
  return next;
}

export async function updateGoal(goal: Goal): Promise<AppData> {
  const appData = await loadAppData();
  const next: AppData = {
    ...appData,
    goals: appData.goals.map((existing) =>
      existing.id === goal.id ? goal : existing
    ),
  };
  await saveAppData(next);
  return next;
}

export async function addDiaryEntry(entry: DiaryEntry): Promise<AppData> {
  const appData = await loadAppData();
  const next: AppData = {
    ...appData,
    diaryEntries: [entry, ...appData.diaryEntries],
    profile: appData.profile
      ? { ...appData.profile, points: appData.profile.points + entry.points }
      : null,
  };
  await saveAppData(next);
  return next;
}

export async function updateDiaryEntry(entry: DiaryEntry): Promise<AppData> {
  const appData = await loadAppData();
  const existingEntry = appData.diaryEntries.find((item) => item.id === entry.id);
  const updatedPoints = calculateEntryPoints(entry.goalIds.length);
  const next: AppData = {
    ...appData,
    diaryEntries: appData.diaryEntries.map((item) =>
      item.id === entry.id
        ? { ...item, text: entry.text, goalIds: entry.goalIds, points: updatedPoints }
        : item
    ),
    profile: appData.profile
      ? { ...appData.profile, points: appData.profile.points + (updatedPoints - (existingEntry?.points ?? 0)) }
      : null,
  };
  await saveAppData(next);
  return next;
}

export function calculateEntryPoints(goalCount: number) {
  const basePoints = 10;
  const bonusPerGoal = 5;
  return basePoints + goalCount * bonusPerGoal;
}

export function countGoalActions(appData: AppData, goalId: string) {
  return appData.diaryEntries.filter((entry) => entry.goalIds.includes(goalId))
    .length;
}
