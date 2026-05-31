export function getEncouragement(goalCount: number) {
  if (goalCount === 0) {
    return "Nice work making space for reflection today — small steps still move you forward.";
  }

  if (goalCount === 1) {
    return "Great job taking action for one goal today — that focus really adds up.";
  }

  return `Awesome! You linked your update to ${goalCount} goals. Keep building that momentum.`;
}
