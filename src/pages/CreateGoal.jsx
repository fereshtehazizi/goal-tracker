import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
    Box,
    Card,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    Stack,
    Button,
    Snackbar,
    Alert,
    CircularProgress,
} from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";

import useGoals from "../hooks/useGoals";
import { addGoal, updateGoal } from "../hooks/goalsCache";

import AddIcon from "@mui/icons-material/Add";

const defaults = [
    "health",
    "study",
    "work",
    "personal",
    "fitness",
    "finance",
];

const CATEGORIES_KEY = "categories";

export default function CreateGoal() {
    const { t, i18n } = useTranslation();

    const location = useLocation();
    const navigate = useNavigate();

    const editingGoal = location.state?.goal;
    const isEditMode = Boolean(editingGoal);

    const { setGoals } = useGoals();

    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: "",
        category: "",
        newCategory: "",
        type: "daily",
        targetValue: "",
        targetUnit: "days",
        startDate: "",
        endDate: "",
        notes: "",
    });

    const [categories, setCategories] = useState(defaults);
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(CATEGORIES_KEY));
        if (saved?.length) setCategories(saved);
    }, []);

    useEffect(() => {
        setCategories((prev) => [...prev]);
    }, [i18n.language]);

    useEffect(() => {
        if (editingGoal) {
            setForm({
                title: editingGoal.title || "",
                category: editingGoal.category || "",
                newCategory: "",
                type: editingGoal.type || "daily",
                targetValue: editingGoal.targetValue || "",
                targetUnit: editingGoal.targetUnit || "days",
                startDate: editingGoal.startDate || "",
                endDate: editingGoal.endDate || "",
                notes: editingGoal.notes || "",
            });
        }
    }, [editingGoal]);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setForm({
            title: "",
            category: "",
            newCategory: "",
            type: "daily",
            targetValue: "",
            targetUnit: "days",
            startDate: "",
            endDate: "",
            notes: "",
        });
        setIsCreatingCategory(false);
    };

    const handleSnackbarClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (saving) return;

        setSaving(true);

        let finalCategory = form.category;

        if (isCreatingCategory) {
            finalCategory = form.newCategory.trim();
            if (!finalCategory) {
                setSaving(false);
                return;
            }

            const updatedCategories = [...categories, finalCategory];
            setCategories(updatedCategories);
            localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updatedCategories));
        }

        try {
            if (isEditMode) {
                const updatedGoal = {
                    ...editingGoal,
                    title: form.title,
                    category: finalCategory,
                    type: form.type,
                    targetValue: Number(form.targetValue),
                    targetUnit: form.targetUnit,
                    startDate: form.startDate,
                    endDate: form.endDate,
                    notes: form.notes,
                    updatedAt: new Date().toISOString(),
                };

                const updated = updateGoal(updatedGoal);
                setGoals(updated);

                navigate(`/goal/${editingGoal.id}`);

                setSnackbar({
                    open: true,
                    message: t("goalUpdated"),
                    severity: "success",
                });
            }

            else {
                const newGoal = {
                    id: Date.now().toString(),
                    title: form.title,
                    category: finalCategory,
                    type: form.type,
                    targetValue: Number(form.targetValue),
                    targetUnit: form.targetUnit,
                    startDate: form.startDate,
                    endDate: form.endDate,
                    notes: form.notes,
                    progress: 0,
                    priority: "medium",
                    createdAt: new Date().toISOString(),
                    completedDays: [],
                    favorite: false,
                };

                const updated = addGoal(newGoal);
                setGoals(updated);

                navigate(`/goal/${newGoal.id}`);

                setSnackbar({
                    open: true,
                    message: t("goalCreated"),
                    severity: "success",
                });
            }

            resetForm();
        } catch (err) {
            setSnackbar({
                open: true,
                message: "Error saving goal",
                severity: "error",
            });
        }

        setSaving(false);
    };

    return (
        <Box>
            <Box>
                <Typography variant="h4" mb={2}>
                    {t("createGoal")}
                </Typography>
                <Typography sx={{ color: "text.secondary", mb: 3 }}>
                    {t("createGoalDesc")}
                </Typography>
            </Box>

            <Card
                sx={{
                    p: 3,
                    borderRadius: 1.5,
                    boxShadow: "none",
                    border: "1px solid",
                    borderColor: "divider",
                    maxWidth: 750,
                }}
            >
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2.5}>
                        <Box>
                            <Typography fontSize={14} fontWeight={500} mb={0.5}>
                                {t("title")}
                            </Typography>
                            <TextField
                                required
                                size="small"
                                placeholder={t("titlePlaceholder")}
                                value={form.title}
                                onChange={(e) =>
                                    handleChange("title", e.target.value)
                                }
                                fullWidth
                            />
                        </Box>

                        <Box>
                            <Typography fontSize={14} fontWeight={500} mb={0.5}>
                                {t("category")}
                            </Typography>

                            <FormControl fullWidth size="small">
                                <Select
                                    required
                                    displayEmpty
                                    value={form.category}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        handleChange("category", value);
                                        setIsCreatingCategory(value === "new");
                                    }}
                                    renderValue={(selected) =>
                                        selected ? t(selected) : t("selectCategory")
                                    }
                                >
                                    {categories.map((cat) => (
                                        <MenuItem key={cat} value={cat}>
                                            {t(cat)}
                                        </MenuItem>
                                    ))}

                                    <MenuItem value="new">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <AddIcon fontSize="small" />
                                            {t("createCategory")}
                                        </Box>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {/* NEW CATEGORY */}
                        {isCreatingCategory && (
                            <Box>
                                <Typography fontSize={14} fontWeight={500} mb={0.5}>
                                    {t("newCategoryName")}
                                </Typography>
                                <TextField
                                    required
                                    size="small"
                                    value={form.newCategory}
                                    onChange={(e) =>
                                        handleChange(
                                            "newCategory",
                                            e.target.value
                                        )
                                    }
                                    fullWidth
                                />
                            </Box>
                        )}

                        <Box>
                            <Typography fontSize={14} fontWeight={500} mb={0.5}>
                                {t("goalType")}
                            </Typography>

                            <FormControl fullWidth size="small">
                                <Select
                                    required
                                    value={form.type}
                                    onChange={(e) =>
                                        handleChange("type", e.target.value)
                                    }
                                >
                                    <MenuItem value="daily">{t("daily")}</MenuItem>
                                    <MenuItem value="count">{t("countBased")}</MenuItem>
                                    <MenuItem value="time">{t("timeBased")}</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box>
                            <Typography fontSize={14} fontWeight={500} mb={0.5}>
                                {t("target")}
                            </Typography>

                            <Stack direction="row" gap={2}>
                                <Box flex={2}>
                                    <TextField
                                        required
                                        size="small"
                                        type="number"
                                        inputProps={{ min: 1 }}
                                        placeholder={t("amount")}
                                        value={form.targetValue}
                                        onChange={(e) =>
                                            handleChange(
                                                "targetValue",
                                                e.target.value
                                            )
                                        }
                                        fullWidth
                                    />
                                </Box>

                                <Box flex={1}>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            required
                                            value={form.targetUnit}
                                            onChange={(e) =>
                                                handleChange(
                                                    "targetUnit",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <MenuItem value="days">{t("days")}</MenuItem>
                                            <MenuItem value="mins">{t("mins")}</MenuItem>
                                            <MenuItem value="steps">{t("steps")}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Stack>
                        </Box>

                        <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
                            <Box flex={1}>
                                <Typography fontSize={14} fontWeight={500} mb={0.5}>
                                    {t("startDate")}
                                </Typography>
                                <TextField
                                    required
                                    size="small"
                                    type="date"
                                    value={form.startDate}
                                    onChange={(e) =>
                                        handleChange("startDate", e.target.value)
                                    }
                                    fullWidth
                                />
                            </Box>

                            <Box flex={1}>
                                <Typography fontSize={14} fontWeight={500} mb={0.5}>
                                    {t("endDate")}
                                </Typography>
                                <TextField
                                    required
                                    size="small"
                                    type="date"
                                    value={form.endDate}
                                    onChange={(e) =>
                                        handleChange("endDate", e.target.value)
                                    }
                                    fullWidth
                                />
                            </Box>
                        </Stack>

                        <Box>
                            <Typography fontSize={14} fontWeight={500} mb={0.5}>
                                {t("notes")}
                            </Typography>
                            <TextField
                                size="small"
                                multiline
                                rows={3}
                                value={form.notes}
                                onChange={(e) =>
                                    handleChange("notes", e.target.value)
                                }
                                fullWidth
                            />
                        </Box>

                        <Stack direction="row" gap={2}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={saving}
                                sx={{
                                    flex: 3,
                                    py: 1,
                                    fontWeight: 600,
                                    textTransform: "none",
                                }}
                            >
                                {saving ? (
                                    <CircularProgress size={20} color="inherit" />
                                ) : isEditMode ? t("updateGoalBtn") : t("createGoalBtn")}
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={resetForm}
                                sx={{
                                    flex: 1,
                                    py: 1,
                                    textTransform: "none",
                                }}
                            >
                                {t("cancel")}
                            </Button>
                        </Stack>

                    </Stack>
                </Box>
            </Card>

            <Snackbar
                sx={{ ml: { xs: 10, md: "240px" } }}
                open={snackbar.open}
                autoHideDuration={1500}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ maxWidth: "100%", ml: 12 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}