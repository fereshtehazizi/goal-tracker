import { useEffect, useState } from "react";

const CACHE_KEY = "goals_cache";

export default function useGoals() {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const loadGoals = () => {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "[]");
      setGoals(cached);
    };

    loadGoals();

    window.addEventListener("storage", loadGoals);
    window.addEventListener("focus", loadGoals);

    return () => {
      window.removeEventListener("storage", loadGoals);
      window.removeEventListener("focus", loadGoals);
    };
  }, []);

  return { goals, setGoals };
}