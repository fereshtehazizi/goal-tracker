export const GOALS_KEY = "goals";
export const XP_PER_DAY = 20;

export const getGoals = () => {
  try {
    return JSON.parse(localStorage.getItem(GOALS_KEY)) || [];
  } catch {
    return [];
  }
};

export const saveGoals = (goals) => {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
};

export const calculateXP = (goals) => {
  return goals.reduce((acc, g) => {
    const completedDays = g.completedDays?.length || 0;

    const daysXP = completedDays * XP_PER_DAY;
    const goalXP = XP_PER_DAY;

    return acc + daysXP + goalXP;
  }, 0);
};


export const calculateStreak = (goals) => {
  const allDates = goals.flatMap((g) => g.completedDays || []);

  if (allDates.length === 0) return 0;

  const uniqueDates = [...new Set(allDates)]
    .map((d) => new Date(d))
    .sort((a, b) => b - a);

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < uniqueDates.length; i++) {
    const diff = Math.floor(
      (today - uniqueDates[i]) / (1000 * 60 * 60 * 24)
    );

    if (diff === i) streak++;
    else break;
  }

  return streak;
};