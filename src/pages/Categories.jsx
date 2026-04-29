import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Paper } from "@mui/material";

import useGoals from "../hooks/useGoals";

import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LockIcon from "@mui/icons-material/Lock";

import { t } from "i18next";

const DEFAULT_CATEGORIES = [
  "health",
  "study",
  "work",
  "personal",
  "fitness",
  "finance",
];

const CATEGORIES_KEY = "categories";

const iconMap = {
  health: FavoriteIcon,
  study: SchoolIcon,
  work: WorkIcon,
  personal: PersonIcon,
  fitness: FitnessCenterIcon,
  finance: AccountBalanceIcon,
  default: LockIcon,
};

export default function CategoriesPage() {
  const { goals } = useGoals();

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem(CATEGORIES_KEY)) || [];

    const allCategories = [
      ...new Set([...DEFAULT_CATEGORIES, ...stored]),
    ];

    const data = allCategories.map((cat) => {
      const count = goals.filter((g) => g.category === cat).length;

      return {
        name: cat,
        count,
        Icon: iconMap[cat] || iconMap.default,
        isFavorite: false,
      };
    });

    const favoriteGoals = goals.filter((g) => g.favorite);

    if (favoriteGoals.length > 0) {
      data.unshift({
        name: "favorites",
        count: favoriteGoals.length,
        Icon: StarIcon,
        isFavorite: true,
      });
    }

    setCategories(data);
  }, [goals]);

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        {t("categories")}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
            xl: "repeat(5, 1fr)",
          },
        }}
      >
        {categories.map((c, i) => {
          const Icon = c.Icon;

          return (
            <Box key={i}>
              <Paper
                onClick={() =>
                  navigate(
                    c.isFavorite
                      ? `/goals?favorite=true`
                      : `/goals?category=${c.name}`
                  )
                }
                elevation={0}
                sx={{
                  p: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1.5,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  height: "100%",
                  "&:hover": {
                    boxShadow: 3,
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Icon
                  sx={{
                    fontSize: 36,
                    color: c.isFavorite ? "#facc15" : "primary.main",
                    mb: 1.5,
                  }}
                />

                <Typography fontWeight={700} fontSize={17}>
                  {t(c.name)}
                </Typography>

                <Typography fontSize={13} color="text.secondary">
                  {c.count > 0
                    ? `${c.count} ${t("goalsCount")}`
                    : t("noGoalsText")}
                </Typography>

                <Box
                  sx={{
                    height: 6,
                    bgcolor: "divider",
                    borderRadius: 10,
                    mt: 2,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: c.count ? "60%" : "0%",
                      height: "100%",
                      bgcolor: c.isFavorite ? "#facc15" : "primary.main",
                    }}
                  />
                </Box>
              </Paper>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}