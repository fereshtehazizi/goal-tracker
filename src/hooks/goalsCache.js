const CACHE_KEY = "goals_cache";

export const getGoals = () => {
  return JSON.parse(localStorage.getItem(CACHE_KEY)) || [];
};

export const saveGoals = (goals) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(goals));
};

export const addGoal = (goal) => {
  const goals = getGoals();
  const updated = [goal, ...goals];
  saveGoals(updated);
  return updated;
};

export const updateGoal = (updatedGoal) => {
  const goals = getGoals();

  const updated = goals.map((g) =>
    g.id === updatedGoal.id ? { ...g, ...updatedGoal } : g
  );

  saveGoals(updated);
  return updated;
};

export const deleteGoal = (id) => {
  const goals = getGoals();
  const updated = goals.filter((g) => g.id !== id);
  saveGoals(updated);
  return updated;
};