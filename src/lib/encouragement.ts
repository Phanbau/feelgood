const AFFIRMATIONS = [
  "One step closer!",
  "Consistency wins!",
  "Crushing it!",
  "Progress, not perfection!",
  "Keep this momentum going!",
  "You've got this!",
  "Proud of your effort!",
  "Showing up matters!",
  "Making it look easy!",
  "Every bit counts!",
  "Trust the process!",
  "Keep moving forward!",
  "Focus on the win!",
  "Building better habits!",
  "You're doing great!",
];

export function getEncouragement(goalCount: number) {
  if (goalCount === 0) {
    return "Nice work making space for reflection today — small steps still move you forward.";
  }

  if (goalCount === 1) {
    return "Great job taking action for one goal today — that focus really adds up.";
  }

  return `Awesome! You linked your update to ${goalCount} goals. Keep building that momentum.`;
}

export function getRandomAffirmation(): string {
  return AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
}
