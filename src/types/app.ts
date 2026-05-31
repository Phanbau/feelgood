export type Goal = {
  id: string;
  title: string;
  description?: string;
  targetDate?: string;
  createdAt: string;
};

export type DiaryEntry = {
  id: string;
  date: string;
  text: string;
  goalIds: string[];
  points: number;
  encouragement: string;
  createdAt: string;
};

export type Profile = {
  name: string;
  bio?: string;
  points: number;
  createdAt: string;
};

export type AppData = {
  profile: Profile | null;
  goals: Goal[];
  diaryEntries: DiaryEntry[];
};

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
