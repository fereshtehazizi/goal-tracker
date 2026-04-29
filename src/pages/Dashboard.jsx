import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  IconButton,
  CircularProgress,
} from "@mui/material";

import {
  Whatshot,
  FlashOn,
  GpsFixed,
  Favorite,
  School,
  Work,
  Person,
  FitnessCenter,
  AccountBalance,
  Lock,
} from "@mui/icons-material";

import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Star, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import useGoals from "../hooks/useGoals";

const iconMap = {
  health: Favorite,
  study: School,
  work: Work,
  personal: Person,
  fitness: FitnessCenter,
  finance: AccountBalance,
  default: Lock,
};

const weeks = ["W1", "W2", "W3", "W4"];
const COLORS = ["#D6C89A", "#7A1F1F", "#2F5D78"];

const getStatus = (g, t) => {
  if (g.progress === 100) return { label: t("completed"), color: "#22c55e" };
  if (g.progress > 0) return { label: t("inProgress"), color: "#6366f1" };
  return { label: t("inactive"), color: "#9ca3af" };
};

export default function DashboardPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [animateIn, setAnimateIn] = useState(false);
  const { t } = useTranslation();

  const { goals } = useGoals();

  const [sortOrder, setSortOrder] = useState("desc");

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const totalXP = goals.reduce(
    (acc, g) => acc + (g.completedDays?.length || 0) * 20,
    0
  );

  const pieData = useMemo(() => {
    const counts = {
      Active: 0,
      Inactive: 0,
      Completed: 0,
    };

    goals.forEach((g) => {
      const progress = g.progress || 0;
      const completedDays = g.completedDays || [];

      const completed = progress === 100;
      const inactive = progress === 0 && completedDays.length === 0;
      const active =
        progress > 0 &&
        progress < 100 &&
        completedDays.length > 0;

      if (completed) counts.Completed++;
      else if (active) counts.Active++;
      else if (inactive) counts.Inactive++;
    });

    const isEmpty = goals.length === 0;
    const fallback = goals.length || 4;

    return Object.entries(counts).map(([key, value], i) => {
      let translatedLabel = key;

      if (key === "Active") translatedLabel = t("active");
      if (key === "Inactive") translatedLabel = t("inactive");
      if (key === "Completed") translatedLabel = t("completed");

      return {
        id: key,
        label: translatedLabel,
        value: isEmpty ? fallback / 4 : value || 0,
        color: COLORS[i],
      };
    });
  }, [goals]);

  const streak = useMemo(() => {
    const allDates = goals.flatMap((g) => g.completedDays || []);
    const unique = [...new Set(allDates)]
      .map((d) => new Date(d))
      .sort((a, b) => b - a);

    let count = 0;
    const today = new Date();

    for (let i = 0; i < unique.length; i++) {
      const diff = Math.floor(
        (today - unique[i]) / (1000 * 60 * 60 * 24)
      );
      if (diff === i) count++;
      else break;
    }

    return count;
  }, [goals]);

  const overall = goals.length
    ? Math.round(
      goals.reduce((a, g) => a + (g.progress || 0), 0) / goals.length
    )
    : 0;

  const maxProgress = useMemo(() => {
    return Math.max(...goals.map((g) => g.progress || 0), 0);
  }, [goals]);

  const recentGoals = useMemo(() => {
    return [...goals]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);
  }, [goals]);

  const inProgressGoals = useMemo(() => {
    return [...goals]
      .filter((g) => g.progress > 0 && g.progress < 100)
      .sort((a, b) =>
        sortOrder === "desc"
          ? b.progress - a.progress
          : a.progress - b.progress
      );
  }, [goals, sortOrder]);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const weeklyGoals = [0, 0, 0, 0];
  const weeklyXP = [0, 0, 0, 0];
  const weeklyStreak = [0, 0, 0, 0];

  const getWeekIndex = (date) => {
    const day = date.getDate();
    return Math.min(3, Math.floor((day - 1) / 7));
  };

  goals.forEach((g) => {
    const created = new Date(g.createdAt);

    if (
      created.getMonth() === currentMonth &&
      created.getFullYear() === currentYear
    ) {
      const w = getWeekIndex(created);
      weeklyGoals[w] += 1;
    }

    (g.completedDays || []).forEach((d) => {
      const date = new Date(d);

      if (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      ) {
        const w = getWeekIndex(date);

        weeklyXP[w] += 20;
        weeklyStreak[w] += 1;
      }
    });
  });

  const isEmpty =
    weeklyGoals.every((v) => v === 0) &&
    weeklyXP.every((v) => v === 0) &&
    weeklyStreak.every((v) => v === 0);

  const safeFill = (arr) => arr.map((v) => (v === 0 ? 1 : v));

  const goalsData = isEmpty ? [1, 1, 1, 1] : safeFill(weeklyGoals);
  const xpData = isEmpty ? [1, 1, 1, 1] : safeFill(weeklyXP);
  const streakData = isEmpty ? [1, 1, 1, 1] : safeFill(weeklyStreak);


  return (
    <Box className="space-y-6 bg-background.paper min-h-screen" sx={{
      opacity: animateIn ? 1 : 0,
      transform: animateIn ? "translateY(0px)" : "translateY(30px)",
      transition: "all 0.8s ease",
    }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <Box>
              <Typography variant="h4" mb={2}>
                {t("dashboardTitle")}
              </Typography>
              <Typography fontSize={14} color="text.secondary">
                {t("dashboardDesc")}
              </Typography>
            </Box>

            <Button
              onClick={() => navigate("/create-goal")}
              sx={{
                mb: 4,
                p: "8px 20px",
                textTransform: "none",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "10px",
                transition: "0.5s ease",
                "&:hover": {
                  bgcolor: "primary.main",
                  borderColor: "primary.submain",
                  color: "background.paper",
                },
              }}
            >
              {t("addGoal")}
            </Button>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 2fr",
                lg: "1fr 1fr 1fr 2fr",
              },
              gap: 2,
              mb: 3,
            }}
          >
            <Card sx={{ p: 4, borderRadius: 1 }}>
              <Stat
                label={t("activeGoals")}
                value={goals.length}
                icon={<GpsFixed sx={{ fontSize: 28, color: "#025c0e" }} />}
              />
            </Card>

            <Card sx={{ p: 4, borderRadius: 1 }}>
              <Stat
                label={t("streakDays")}
                value={`${streak}`}
                icon={<Whatshot sx={{ fontSize: 28, color: "#be1d00" }} />}
                sub={streak > 0 ? t("keepItGoing") : null}
              />
            </Card>

            <Card sx={{ p: 4, borderRadius: 1 }}>
              <Stat
                label={t("totalXP")}
                value={totalXP}
                icon={<FlashOn sx={{ fontSize: 28, color: "#E0A800" }} />}
                sub={
                  totalXP > 0
                    ? maxProgress >= 80
                      ? t("newPersonalRecord")
                      : t("momentumBuilding")
                    : null
                }
              />
            </Card>

            <Card sx={{ p: 4, borderRadius: 1 }}>
              <Typography fontSize={13} color="text.secondary">
                {t("overallP")}
              </Typography>

              <Box sx={{ position: "relative", display: "flex", justifyContent: "center", mt: 2 }}>
                <svg width="200" height="110">
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#2F5D78" />
                      <stop offset="100%" stopColor="#809eb9" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M 15 100 A 85 85 0 0 1 185 100"
                    fill="none"
                    stroke="#cfcfcf"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />

                  <path
                    d="M 15 100 A 85 85 0 0 1 185 100"
                    fill="none"
                    stroke="url(#grad)"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray="267"
                    strokeDashoffset={267 - (overall / 100) * 267}
                    style={{
                      transition: "stroke-dashoffset 0.8s ease",
                    }}
                  />
                </svg>

                <Box sx={{ position: "absolute", bottom: 10, textAlign: "center" }}>
                  <Typography fontWeight={800} fontSize={22}>
                    {overall}%
                  </Typography>
                  <Typography fontSize={12} color="text.secondary">
                    {t("completed")}
                  </Typography>

                </Box>
              </Box>
            </Card>
          </Box>

          <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            <Card sx={{ borderRadius: 1 }} className="lg:col-span-2 shadow-md">
              <CardContent>
                <Typography fontWeight={600}>{t("weeklyAnalytics")}</Typography>
                <Typography sx={{ fontSize: 13 }} className="text-gray-500 mb-3">
                  {t("weeklyAnalyticsDesc")}
                </Typography>

                <BarChart
                  xAxis={[{ scaleType: "band", data: weeks }]}
                  series={[
                    { data: goalsData, label: t("goals"), color: "#D6C89A" },
                    { data: xpData, label: "XP", color: "#2F5D78" },
                    { data: streakData, label: t("streakDays"), color: "#7A1F1F" },
                  ]}
                  height={260}
                />
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 1 }} className="rounded-2xl shadow-md">
              <CardContent>
                <Typography fontWeight={600}>{t("goalsB")}</Typography>
                <Typography fontSize={13} color="text.secondary" mb={2}>
                  {t("goalsBDesc")}
                </Typography>

                <PieChart
                  series={[
                    {
                      innerRadius: 45,
                      outerRadius: 90,
                      data: pieData,
                    },
                  ]}
                  colors={["#D6C89A", "#2F5D78", "#7A1F1F"]}
                  height={260}
                  slotProps={{
                    legend: {
                      direction: isMobile ? "row" : "column",
                      position: isMobile
                        ? { vertical: "bottom", horizontal: "middle" }
                        : { vertical: "middle", horizontal: "right" },
                      itemMarkWidth: 10,
                      itemMarkHeight: 10,
                      labelStyle: {
                        fontSize: 12,
                      },
                    },
                  }}
                />

                <div className="mt-4 space-y-2">
                  {goals.map((g, i) => (
                    <div key={g.id} className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: COLORS[i % COLORS.length] }}
                        />
                        {g.title}
                      </div>
                      <span>{g.progress || 0}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
              gap: 2,
            }}
          >

            <Card sx={{ p: 4, borderRadius: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography fontWeight={700}>
                  {t("recentG")}
                </Typography>

                <Typography
                  onClick={() => navigate("/goals")}
                  sx={{
                    fontSize: 13,
                    color: "primary.main",
                    cursor: "pointer",
                    fontWeight: 600,
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  {t("viewAll")}
                </Typography>
              </Box>
              {recentGoals.map((g) => {
                const Icon = iconMap[g.category] || iconMap.default;
                const status = getStatus(g, t);

                return (
                  <Box
                    key={g.id}
                    onClick={() => navigate(`/goal/${g.id}`)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mt: 2,
                      p: 1.5,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1.5,
                      cursor: "pointer",
                      transition: "0.2s",
                      "&:hover": {
                        bgcolor: "primary.submain",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <Icon />

                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight={600}>{g.title}</Typography>
                      <Typography fontSize={12} color="text.secondary">
                        {t(`${g.category}`)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        fontSize: 11,
                        px: 1.2,
                        py: 0.4,
                        borderRadius: 20,
                        bgcolor: `${status.color}15`,
                        color: status.color,
                      }}
                    >
                      {status.label}
                    </Box>

                    {g.favorite && (
                      <Box
                        sx={{
                          fontSize: 11,
                          px: 1.2,
                          py: 0.4,
                          borderRadius: 20,
                          bgcolor: "#facc1520",
                          color: "#facc15",
                        }}
                      >
                        <Star size={12} /> Star
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Card>

            <Card sx={{ p: 4, borderRadius: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography fontWeight={700}>{t("inProgress")}</Typography>

                <Box>
                  <Typography
                    component="span"
                    fontSize={14}
                    color="primary.main"
                  >
                    {t("sort")}
                  </Typography>
                  <IconButton
                    sx={{ color: "primary.main" }}
                    onClick={() =>
                      setSortOrder((p) => (p === "desc" ? "asc" : "desc"))
                    }
                  >
                    <ArrowUpDown size={16} />
                  </IconButton>
                </Box>
              </Box>

              {inProgressGoals.map((g) => (
                <Box key={g.id} sx={{ mt: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography fontSize={13}>{g.title}</Typography>
                    <Typography color="primary.main">{g.progress}%</Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={g.progress}
                    sx={{
                      mt: 1,
                      height: 6,
                      borderRadius: 5,
                    }}
                  />
                </Box>
              ))}
            </Card>

          </Box>
        </>
      )}
    </Box>
  );
}

function Stat({ label, value, icon, sub }) {
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography fontSize={12} color="text.secondary">
          {label}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", fontSize: 28 }}>
          {icon}
        </Box>
      </Box>

      <Typography fontSize={24} mt={1} mb={6}>
        {value}
      </Typography>

      {sub && (
        <Typography fontSize={12} color="text.secondary">
          {sub}
        </Typography>
      )}
    </Box>
  );
}
