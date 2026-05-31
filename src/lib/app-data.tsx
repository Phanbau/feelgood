import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AppData, DiaryEntry, Goal, Profile } from "../types/app";
import {
    loadAppData,
    addDiaryEntry as storageAddDiaryEntry,
    addGoal as storageAddGoal,
    saveProfile as storageSaveProfile,
    updateGoal as storageUpdateGoal,
} from "./storage";

const AppDataContext = createContext<{
  appData: AppData;
  isReady: boolean;
  refreshAppData: () => Promise<void>;
  saveProfile: (profile: Profile) => Promise<void>;
  addGoal: (goal: Goal) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  addDiaryEntry: (entry: DiaryEntry) => Promise<void>;
} | null>(null);

const DEFAULT_APP_DATA: AppData = {
  profile: null,
  goals: [],
  diaryEntries: [],
};

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [appData, setAppData] = useState<AppData>(DEFAULT_APP_DATA);
  const [isReady, setIsReady] = useState(false);

  const refreshAppData = useCallback(async () => {
    const data = await loadAppData();
    setAppData(data);
    setIsReady(true);
  }, []);

  useEffect(() => {
    refreshAppData();
  }, [refreshAppData]);

  const saveProfile = useCallback(async (profile: Profile) => {
    const next = await storageSaveProfile(profile);
    setAppData(next);
  }, []);

  const addGoal = useCallback(async (goal: Goal) => {
    const next = await storageAddGoal(goal);
    setAppData(next);
  }, []);

  const updateGoal = useCallback(async (goal: Goal) => {
    const next = await storageUpdateGoal(goal);
    setAppData(next);
  }, []);

  const addDiaryEntry = useCallback(async (entry: DiaryEntry) => {
    const next = await storageAddDiaryEntry(entry);
    setAppData(next);
  }, []);

  const value = useMemo(
    () => ({ appData, isReady, refreshAppData, saveProfile, addGoal, updateGoal, addDiaryEntry }),
    [appData, isReady, refreshAppData, saveProfile, addGoal, updateGoal, addDiaryEntry]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider");
  }
  return context;
}
