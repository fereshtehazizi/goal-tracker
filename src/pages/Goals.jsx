import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Stack,
  IconButton,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useGoals from "../hooks/useGoals";
import { updateGoal, deleteGoal } from "../hooks/goalsCache";

import StarBorderIcon from "@mui/icons-material/StarBorder";
import { SquarePen } from "lucide-react";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Goals() {
  const { t } = useTranslation();
  const { goals, setGoals } = useGoals();
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");
  const isFavorite = queryParams.get("favorite");

  const filteredGoals = goals.filter((g) => {
    if (isFavorite) return g.favorite;
    if (category) return g.category === category;
    return true;
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, [location.search]);

  const getTitle = () => {
    if (isFavorite) return t("favoriteGoals");
    if (category) return `${category} ${t("goalsCount")}`;
    return t("allGoals");
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleFavorite = (id) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;

    const updated = updateGoal({
      ...goal,
      favorite: !goal.favorite,
    });

    setGoals(updated);
  };

  const deleteSelected = () => {
    setDeleting(true);

    let updated = [...goals];

    selected.forEach((id) => {
      updated = deleteGoal(id);
    });

    setGoals(updated);
    setSelected([]);
    setDeleting(false);
  };

  if (loading && goals.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Typography variant="h4">
          {getTitle()}
        </Typography>

        <Stack direction="row" spacing={1}>
          {selected.length > 0 && (
            <IconButton onClick={() => setOpenDeleteDialog(true)}>
              <DeleteIcon color="error" />
            </IconButton>
          )}

          <Button
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
            onClick={() => navigate("/create-goal")}
          >
            {t("addGoal")}
          </Button>
        </Stack>
      </Box>

      {filteredGoals.length === 0 ? (
        <Typography color="text.secondary">
          {t("noGoals")}
        </Typography>
      ) : (
        <Stack spacing={2}>
          {filteredGoals.map((g) => (
            <Card
              onClick={() => navigate(`/goal/${g.id}`)}
              key={g.id}
              sx={{
                p: 2,
                border: "1px solid",
                borderRadius: 1,
                borderColor: "divider",
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <Box display="flex" gap={2}>
                <Checkbox
                  checked={selected.includes(g.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleSelect(g.id)}
                />

                <Box>
                  <Typography fontWeight={600}>
                    {g.title}
                  </Typography>

                  <Typography fontSize={13} color="text.secondary">
                    {t(`${g.category}`)}
                  </Typography>

                  <Box
                    sx={{
                      height: 6,
                      bgcolor: "divider",
                      borderRadius: 10,
                      mt: 1,
                      minWidth: 130,
                    }}
                  >
                    <Box
                      sx={{
                        width: `${g.progress || 0}%`,
                        height: "100%",
                        bgcolor: "primary.main",
                        borderRadius: 10,
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              <Stack direction="row">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(g.id);
                  }}
                >
                  {g.favorite ? (
                    <StarBorderIcon sx={{ color: "#facc15" }} />
                  ) : (
                    <StarBorderIcon />
                  )}
                </IconButton>

                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/create-goal", { state: { goal: g } });
                  }}
                >
                  <SquarePen size={21} />
                </IconButton>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>
          <Typography fontWeight={700} color="error">
            {t("deleteGoals")}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Typography fontSize={13} color="text.secondary">
            {t("deleteGoalsDesc")}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            {t("cancel")}
          </Button>

          <Button
            color="error"
            onClick={() => {
              deleteSelected();
              setOpenDeleteDialog(false);
            }}
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={20} /> : t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}