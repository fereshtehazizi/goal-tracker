import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box, Typography, Card, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

import useGoals from "../hooks/useGoals";
import { updateGoal } from "../hooks/goalsCache";

import FavoriteIcon from "@mui/icons-material/Favorite";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LockIcon from "@mui/icons-material/Lock";

const iconMap = {
  health: FavoriteIcon,
  study: SchoolIcon,
  work: WorkIcon,
  personal: PersonIcon,
  fitness: FitnessCenterIcon,
  finance: AccountBalanceIcon,
  default: LockIcon,
};

export default function GoalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { goals, setGoals } = useGoals();

  const goal = goals.find((g) => g.id === id); 

  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);

  const { t } = useTranslation();

  if (!goal) return <Typography>{t("goalNotFound")}</Typography>;

  const Icon = iconMap[goal.category] || iconMap.default;

  const getTotalDays = () => {
    const start = new Date(goal.startDate);
    const end = new Date(goal.endDate);
    const diff = end - start;
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const totalDays = getTotalDays();

  const getTodayIndex = () => {
    const today = new Date();
    const start = new Date(goal.startDate);

    const diff = Math.floor(
      (today - start) / (1000 * 60 * 60 * 24)
    );

    return diff + 1;
  };

  const todayIndex = getTodayIndex();

  const getDateFromIndex = (index) => {
    const start = new Date(goal.startDate);
    const d = new Date(start);
    d.setDate(start.getDate() + index - 1);
    return d.toISOString().split("T")[0];
  };

  const todayStr = new Date().toISOString().split("T")[0];

  const maxWeeks = Math.ceil(totalDays / 7);
  const startDay = currentWeek * 7;
  const endDay = Math.min(startDay + 7, totalDays);

  const canUnlockToday = () => {
    if (!goal.lastCompletedDate) return true;

    const last = new Date(goal.lastCompletedDate);
    const now = new Date();

    return now - last >= 24 * 60 * 60 * 1000;
  };

  const handleDayClick = (day) => {
    const dateStr = getDateFromIndex(day);
    if (goal.completedDays.includes(dateStr)) return;
    setSelectedDay(day);
  };

  const handleCompleteToday = () => {
    if (selectedDay !== todayIndex) return;
    if (goal.completedDays.includes(todayStr)) return;

    const updatedDays = [...goal.completedDays, todayStr];

    const progress = Math.round(
      (updatedDays.length / totalDays) * 100
    );

    const updatedGoal = {
      ...goal,
      completedDays: updatedDays,
      progress,
      lastCompletedDate: new Date().toISOString(),
    };

    const updated = updateGoal(updatedGoal); 
    setGoals(updated); 

    setSelectedDay(null);
  };

  const isTodayCompleted = goal.completedDays.includes(todayStr);
  const isSelectedToday = selectedDay === todayIndex;

  return (
    <Box>
      <Button
        onClick={() => navigate("/goals")}
        sx={{
          mb: 3,
          p: "8px 20px",
          textTransform: "none",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "10px",
          transition: "0.5s ease",
          "&:hover": {
            bgcolor: "primary.main",
            borderColor: "primary.submain",
            color: "background.paper"
          },
        }}
      >
        {t("backToGoals")}
      </Button>

      <Card
        sx={{
          p: 3.5,
          borderRadius: 1.5,
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          gap: 2.5,
        }}
      >
        <Icon sx={{ fontSize: 40, color: "primary.main" }} />

        <Box>
          <Typography fontSize={26} fontWeight={700}>
            {goal.title}
          </Typography>

          <Typography fontSize={14} color="text.secondary" mt={1}>
            {goal.notes || t("noDescription")}
          </Typography>
        </Box>
      </Card>

      <Card
        sx={{
          mt: 3,
          p: 3.5,
          borderRadius: 1.5,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography fontSize={18} fontWeight={700} mb={3}>
          {t("weeklyCheckin")}
        </Typography>

        <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
          <Button
            onClick={() => setCurrentWeek((w) => Math.max(w - 1, 0))}
            sx={{
              minWidth: 40,
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "primary.main",
              color: "#fff",
            }}
          >
            {t("leftArrow")}
          </Button>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(5, 1fr)",
                lg: "repeat(7, 1fr)",
              },
              gap: 1.5,
              justifyItems: "center",
            }}
          >
            {Array.from({ length: endDay - startDay }, (_, i) => {
              const dayNum = startDay + i + 1;

              const dateStr = getDateFromIndex(dayNum);
              const isCompleted = goal.completedDays.includes(dateStr);

              return (
                <Box key={dayNum}
                  sx={{
                    textAlign: "center",
                    flex: "0 0 auto",
                  }}>
                  <Box
                    onClick={() => handleDayClick(dayNum)}
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      border: "2px solid",

                      borderColor:
                        selectedDay === dayNum
                          ? "primary.main"
                          : isCompleted
                            ? "primary.main"
                            : "divider",

                      bgcolor: isCompleted ? "primary.main" : "transparent",

                      color: isCompleted ? "#fff" : "divider",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      cursor: "pointer",
                    }}
                  >
                    {isCompleted && "✓"}
                  </Box>

                  <Typography fontSize={11} color="text.secondary">
                    {dayNum}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          <Button
            onClick={() =>
              setCurrentWeek((w) => Math.min(w + 1, maxWeeks - 1))
            }
            sx={{
              minWidth: 40,
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "primary.main",
              color: "#fff",
            }}
          >
            {t("rightArrow")}
          </Button>
        </Box>

        <Typography textAlign="center" mt={2} fontSize={13} color="text.secondary">
          {t("week")} {currentWeek + 1} ({t("days")} {startDay + 1} - {endDay})
        </Typography>

        <Box textAlign="center">
          <Button
            onClick={handleCompleteToday}
            disabled={
              isTodayCompleted ||
              !selectedDay ||
              !isSelectedToday ||
              !canUnlockToday()
            }
            sx={{
              mt: 3,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              bgcolor: "primary.main",
              color: "#fff",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            {isTodayCompleted ? t("goalAchievedToday") : t("markComplete")}
          </Button>
        </Box>
      </Card>

      <Box
        sx={{
          mt: 3,
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
          },
        }}
      >
        <Card sx={{ p: 2.5, borderRadius: 1.5, border: "1px solid", borderColor: "divider" }}>
          <Typography fontSize={12} color="text.secondary" mb={1}>
            {t("categoryLabel")}
          </Typography>
          <Typography fontWeight={700}>{t(`${goal.category}`)}</Typography>
        </Card>

        <Card sx={{ p: 2.5, borderRadius: 1.5, border: "1px solid", borderColor: "divider" }}>
          <Typography fontSize={12} color="text.secondary" mb={1}>
            {t("deadline")}
          </Typography>
          <Typography fontWeight={700}>
            {goal.endDate || t("noDeadline")}
          </Typography>
        </Card>

        <Card sx={{ p: 2.5, borderRadius: 1.5, border: "1px solid", borderColor: "divider" }}>
          <Typography fontSize={12} color="text.secondary" mb={1}>
            {t("overallProgress")}
          </Typography>

          <Box sx={{ height: 8, bgcolor: "divider", borderRadius: 10 }}>
            <Box
              sx={{
                width: `${goal.progress || 0}%`,
                height: "100%",
                bgcolor: "primary.main",
                borderRadius: 10,
              }}
            />
          </Box>

          <Typography mt={1} fontWeight={700}>
            {goal.progress || 0}%
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}