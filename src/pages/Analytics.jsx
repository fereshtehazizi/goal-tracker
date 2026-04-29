import { useMemo } from "react";
import { Box, Card, Typography, CircularProgress } from "@mui/material";
import { LineChart, BarChart, PieChart } from "@mui/x-charts";
import { useTranslation } from "react-i18next";

import useGoals from "../hooks/useGoals";

export default function AnalyticsPage() {
  const { t } = useTranslation();

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const { goals, loading } = useGoals();
  const totalCompletedGoals = goals.filter((g) => g.progress === 100).length;

  const goalMostProgress = useMemo(() => {
    return goals.reduce(
      (max, g) =>
        (g.progress || 0) > (max?.progress || 0) ? g : max,
      goals[0] || {}
    );
  }, [goals]);

  const goalMostDays = useMemo(() => {
    return goals.reduce(
      (max, g) =>
        (g.completedDays?.length || 0) >
        (max?.completedDays?.length || 0)
          ? g
          : max,
      goals[0] || {}
    );
  }, [goals]);

  const goalMostXP = useMemo(() => {
    return goals.reduce((max, g) => {
      const xp = (g.completedDays?.length || 0) * 20;
      const maxXp = (max?.completedDays?.length || 0) * 20;
      return xp > maxXp ? g : max;
    }, goals[0] || {});
  }, [goals]);

  const xpDailyWeek = useMemo(() => {
    const daysArr = Array(7).fill(0);
    const T = new Date();

    goals.forEach((g) => {
      (g.completedDays || []).forEach((date) => {
        const d = new Date(date);
        const diff = Math.floor((T - d) / (1000 * 60 * 60 * 24));

        if (diff >= 0 && diff < 7) {
          const index = 6 - diff;
          daysArr[index] += 20;
        }
      });
    });

    return daysArr;
  }, [goals]);

  const hasData = goals.length > 0;

  const completed = goals.filter((g) => g.progress === 100).length;
  const inProgress = goals.filter(
    (g) => g.progress > 0 && g.progress < 100
  ).length;
  const inactive = goals.filter(
    (g) => !g.progress || g.progress === 0
  ).length;

  const pieData = hasData
    ? [
        { id: 0, value: completed, label: `${t("completed")} (${completed})` },
        { id: 1, value: inProgress, label: `${t("inProgress")} (${inProgress})` },
        { id: 2, value: inactive, label: `${t("inactive")} (${inactive})` },
      ]
    : [
        { id: 0, value: 1, label: t("completed0") },
        { id: 1, value: 1, label: t("inProg0") },
        { id: 2, value: 1, label: t("inAct0") },
      ];

  const goalsWeekly = days.map((_, i) =>
    goals.filter((g) =>
      (g.completedDays || []).some(
        (d) => new Date(d).getDay() === i
      )
    ).length
  );

  const xpWeekly = days.map((_, i) =>
    goals.reduce((sum, g) => {
      const count = (g.completedDays || []).filter(
        (d) => new Date(d).getDay() === i
      ).length;
      return sum + count * 20;
    }, 0)
  );

  const weeklyActivity = days.map((_, i) =>
    goals.reduce((count, g) => {
      const has = (g.completedDays || []).some(
        (d) => new Date(d).getDay() === i
      );
      return count + (has ? 1 : 0);
    }, 0)
  );

  return (
    <Box className="space-y-6 bg-background.paper min-h-screen">

      {/* ✅ LOADING */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box>
            <Typography variant="h4" mb={2}>
              {t("analytics")}
            </Typography>
            <Typography fontSize={13} color="text.secondary">
              {t("analyticsDesc")}
            </Typography>
          </Box>

          {/* ===== STATS ===== */}
          <Box className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-5">
              <Typography fontSize={12}>{t("mostProgress")}</Typography>
              <Typography fontWeight={600} mt={1}>
                {goalMostProgress?.title || "-"}
              </Typography>
            </Card>

            <Card className="p-5">
              <Typography fontSize={12}>{t("mostXP")}</Typography>
              <Typography fontWeight={600} mt={1}>
                {goalMostXP?.title || "-"}
              </Typography>
            </Card>

            <Card className="p-5">
              <Typography fontSize={12}>{t("mostActiveDays")}</Typography>
              <Typography fontWeight={600} mt={1}>
                {goalMostDays?.title || "-"}
              </Typography>
            </Card>

            <Card className="p-5">
              <Typography fontSize={12}>{t("completed")}</Typography>
              <Typography fontWeight={600} mt={1}>
                {totalCompletedGoals}
              </Typography>
            </Card>
          </Box>

          {/* ===== CHARTS ===== */}
          <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <Card className="lg:col-span-2 p-5">
              <Typography fontWeight={700} mb={2}>
                {t("growth")}
              </Typography>

              <LineChart
                xAxis={[{
                  scaleType: "point",
                  data: ["Sat","Sun","Mon","Tue","Wed","Thu","Fri"],
                }]}
                series={[{
                  data: xpDailyWeek,
                  label: t("last7"),
                  color: "#2F5D78",
                }]}
                height={300}
              />
            </Card>

            <Card className="p-5">
              <Typography fontWeight={700} mb={2}>
                {t("goalStat")}
              </Typography>

              <PieChart
                series={[{
                  innerRadius: 45,
                  outerRadius: 90,
                  data: pieData,
                }]}
                colors={["#D6C89A","#2F5D78","#7A1F1F"]}
                height={300}
              />
            </Card>

          </Box>

          <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <Card className="p-5">
              <Typography fontWeight={700} mb={2}>{t("vs")}</Typography>

              <BarChart
                xAxis={[{ scaleType: "band", data: days }]}
                series={[
                  { data: goalsWeekly, label: "Goals", color: "#C2B280" },
                  { data: xpWeekly, label: "XP", color: "#2F5D78" },
                ]}
                height={250}
              />
            </Card>

            <Card className="p-5">
              <Typography fontWeight={700} mb={2}>
                {t("weeklyAP")}
              </Typography>

              <BarChart
                xAxis={[{ scaleType: "band", data: days }]}
                series={[
                  { data: weeklyActivity, label: "Progress", color: "#7A1F1F" },
                ]}
                height={250}
              />
            </Card>

          </Box>
        </>
      )}
    </Box>
  );
}