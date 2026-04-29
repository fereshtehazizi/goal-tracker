import { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  TextField,
  Checkbox,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

import { db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";

const DEFAULT_AVATAR =
  "https://i.pinimg.com/736x/d2/de/10/d2de10032597dc38ac19a57031a3fa47.jpg";

export default function Settings({ setMode }) {
  const { t, i18n } = useTranslation();
  const { user, userData, loading, logout } = useAuth();

  const [settings, setSettings] = useState({
    avatar: "",
    cover: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    emailNotif: false,
    theme: "light",
    language: "en",
  });

  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  const [showPw, setShowPw] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwords, setPasswords] = useState({
    currentPw: "",
    newPw: "",
    confirmPw: "",
  });

  const saveTimeout = useRef(null);

  useEffect(() => {
    if (!userData) return;

    setSettings((prev) => ({ ...prev, ...userData }));

    if (userData.language) {
      i18n.changeLanguage(userData.language);
    }

    if (userData.theme) {
      const mode = userData.theme === "auto" ? "light" : userData.theme;
      setMode(mode);
    }
  }, [userData, i18n, setMode]);

  const syncSettings = async (data) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), data, { merge: true });
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (key, value) => {
    const updated = { ...settings, [key]: value };

    setSettings(updated);
    localStorage.setItem("userData", JSON.stringify(updated));

    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    setSaving(true);

    saveTimeout.current = setTimeout(async () => {
      await syncSettings(updated);
      setSaving(false);
    }, 600);
  };

  const uploadImage = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      handleChange(type, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const showToast = (msg) => setToast(msg);

  const getInitials = () =>
    (settings.firstName?.[0] || "") + (settings.lastName?.[0] || "");

  const handlePasswordChange = () => {
    if (!passwords.currentPw || !passwords.newPw || !passwords.confirmPw)
      return showToast(t("fillAllFields"));

    if (passwords.newPw !== passwords.confirmPw)
      return showToast(t("passwordsDisMatch"));

    showToast(t("passwordUpdated"));

    setPasswords({
      currentPw: "",
      newPw: "",
      confirmPw: "",
    });
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("goals_cache");
      localStorage.removeItem("categories");
      localStorage.removeItem("userData");

      await logout();
      showToast("Logged out");
    } catch (err) {
      console.error(err);
    }
  };

  const resetSettings = async () => {
    const clean = {
      avatar: "",
      cover: "",
      firstName: "",
      lastName: "",
      phone: "",
      bio: "",
      emailNotif: false,
      theme: "light",
      language: "en",
    };

    if (user) {
      await setDoc(doc(db, "users", user.uid), clean, { merge: true });
    }

    localStorage.removeItem("goals_cache");
    localStorage.removeItem("categories");

    localStorage.setItem("userData", JSON.stringify(clean));

    setSettings(clean);
    setDeleteInput("");
  };
  
  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="bg-background.paper min-h-screen ">
      <Snackbar
        sx={{ ml: { xs: 10, md: "240px" } }}
        open={!!toast}
        autoHideDuration={2500}
        onClose={() => setToast("")}
        message={toast}
      />
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} PaperProps={{ sx: { borderRadius: 1, p: 1, maxWidth: 420, ml: 12, }, }}>
              <DialogTitle>
                <Box className="flex items-center gap-2">
                  <i className="bx bx-error-circle text-red-600 text-2xl" />
                  <Typography fontWeight={700} color="error"> {t("deleteAccount")}
                  </Typography>
                </Box>
              </DialogTitle>
      
              <DialogContent>
                <Typography fontSize={13} color="text.secondary" mb={2}> {t("deleteAccountDesc")} </Typography>
                <Typography fontSize={12} mb={1}> {t("type")}{" "} <span className="px-2 py-1 rounded text-red-600 font-semibold"> {t("deleteConfirm")} </span>{" "} {t("toConfirm")} </Typography>
                <TextField
                  fullWidth
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder={t("typeDeleteConfirm")}
                  size="small"
                />
              </DialogContent>
      
              <DialogActions>
                <Button onClick={() => setDeleteOpen(false)}>
                  {t("cancel")}
                </Button>
      
                <Button
                  disabled={deleteInput !== t("deleteConfirm")}
                  color="error"
                  variant="contained"
                  onClick={() => {
                    resetSettings();
                    setDeleteOpen(false);
                    showToast("Account deleted");
                  }}
                >
                  {t("deleteAccount")}
                </Button>
              </DialogActions>
            </Dialog>

      <Box sx={{ maxWidth: 900 }}>
        <Typography variant="h4" fontWeight="bold" mb={4}>
          {t("accountSettings")}
        </Typography>
        <Card sx={{ mb: 3, overflow: "hidden", borderRadius: 1.5 }}>
          <Box
            sx={{
              height: 160,
              background: settings.cover
                ? `url(${settings.cover}) center/cover`
                : "linear-gradient(135deg,#708090,#FAF3E0)",
              position: "relative",
              cursor: "pointer",
            }}
            onClick={() => document.getElementById("coverUpload").click()}
          >
            <input
              id="coverUpload"
              hidden
              type="file"
              onChange={(e) => uploadImage(e, "cover")}
            />

            <Button
              size="small"
              sx={{ position: "absolute", top: 10, right: 10, border: "1px solid", borderColor: "primary.main" }}
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById("coverUpload").click();
              }}
            >
              {t("changeCover")}
            </Button>
          </Box>

          <Box sx={{ textAlign: "center", mt: -6, pb: 3 }}>
            <Box
              sx={{ display: "inline-block", cursor: "pointer" }}
              onClick={() => document.getElementById("avatarUpload").click()}
            >
              <Avatar
                src={settings.avatar || DEFAULT_AVATAR}
                sx={{
                  width: 100,
                  height: 100,
                  mx: "auto",
                  border: "4px solid",
                  borderColor: "background.paper",
                }}
              >
                {getInitials()}
              </Avatar>

              <input
                id="avatarUpload"
                hidden
                type="file"
                onChange={(e) => uploadImage(e, "avatar")}
              />
            </Box>

            <Button
              size="small"
              sx={{ mb: 5 }}
              onClick={() => document.getElementById("avatarUpload").click()}
            >
              {t("changePhoto")}
            </Button>

            <Typography fontWeight="bold" mt={1} ml={-8}>
              {settings.firstName} {settings.lastName}
            </Typography>
          </Box>
        </Card>

        <Card sx={{ p: 3, mb: 3, borderRadius: 1.5 }}>
          <Typography fontWeight="bold" mb={2}>
            {t("basicInfo")}
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label={t("firstName")}
              InputLabelProps={{
                style: { fontSize: 14 }
              }}
              value={settings.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
            <TextField
              label={t("lastName")}
              InputLabelProps={{
                style: { fontSize: 14 }
              }}
              value={settings.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </Box>

          <TextField
            fullWidth
            label={t("email")}
            InputLabelProps={{
              style: { fontSize: 14 }
            }}
            sx={{ mt: 2 }}
            value={settings.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <TextField
            fullWidth
            label={t("phone")}
            InputLabelProps={{
              style: { fontSize: 14 }
            }}
            sx={{ mt: 2 }}
            value={settings.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />

          <TextField
            fullWidth
            InputLabelProps={{
              style: { fontSize: 14 }
            }}
            multiline
            rows={3}
            label={t("bio")}
            sx={{ mt: 2 }}
            value={settings.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
          />
        </Card>

        <div id="preferences">
          <Card sx={{ p: 3, mb: 3, borderRadius: 1.5, boxShadow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                {t("preferences")}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  borderRadius: 1.2,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "primary.submain",
                }}
              >
                <Box>
                  <Typography fontSize={14} fontWeight={600}>
                    {t("emailNotifications")}
                  </Typography>
                  <Typography fontSize={12} color="text.secondary">
                    {t("emailNotificationsDesc")}
                  </Typography>
                </Box>

                <Checkbox
                  checked={settings.emailNotif || false}
                  onChange={(e) => handleChange("emailNotif", e.target.checked)}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  borderRadius: 1.2,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "primary.submain",
                }}
              >
                <Box>
                  <Typography fontSize={14} fontWeight={600}>
                    {t("themePreference")}
                  </Typography>
                  <Typography fontSize={12} color="text.secondary">
                    {t("themePreferenceDesc")}
                  </Typography>
                </Box>

                <select
                  value={settings.theme || "light"}
                  onChange={(e) => {
                    const value = e.target.value;

                    handleChange("theme", value);

                    const newMode = value === "auto" ? "light" : value;
                    setMode(newMode);
                  }}
                  className="px-3 py-2 rounded-lg text-sm dark:bg-gray-600 cursor-pointer"

                >
                  <option value="light">{t("light")}</option>
                  <option value="dark">{t("dark")}</option>
                  <option value="auto">{t("auto")}</option>
                </select>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  borderRadius: 1.2,
                  bgcolor: "primary.submain",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box>
                  <Typography fontWeight={600}>
                    {t("language")}
                  </Typography>
                  <Typography fontSize={12} color="text.secondary">
                    {t("languageDesc")}
                  </Typography>
                </Box>

                <select
                  value={settings.language || "en"} 
                  onChange={(e) => {
                    const lang = e.target.value;

                    handleChange("language", lang); 
                    i18n.changeLanguage(lang);    
                  }}
                  className="px-3 py-2 rounded-lg text-sm bg-gray-600 cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="fa">فارسی</option>
                  <option value="ar">العربية</option>
                </select>
              </Box>

            </Box>
          </Card>
        </div>

        <Card sx={{ p: 3, mb: 3, borderRadius: 1.5 }}>
          <Typography fontWeight="bold" mb={2}>
            {t("changePassword")}
          </Typography>

          <TextField
            fullWidth
            label={t("currentPassword")}
            InputLabelProps={{
              style: { fontSize: 14 }
            }}
            type={showPw.current ? "text" : "password"}
            sx={{ mb: 2 }}
            value={settings.currentPw}
            onChange={(e) => handleChange("currentPw", e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPw((p) => ({ ...p, current: !p.current }))
                    }
                  >
                    {showPw.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label={t("newPassword")}
            InputLabelProps={{
              style: { fontSize: 14 }
            }}
            type={showPw.new ? "text" : "password"}
            sx={{ mb: 2 }}
            value={settings.newPw}
            onChange={(e) => handleChange("newPw", e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPw((p) => ({ ...p, new: !p.new }))}
                  >
                    {showPw.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label={t("confirmPassword")}
            InputLabelProps={{
              style: { fontSize: 14 }
            }}
            type={showPw.confirm ? "text" : "password"}
            value={settings.confirmPw}
            onChange={(e) => handleChange("confirmPw", e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPw((p) => ({ ...p, confirm: !p.confirm }))
                    }
                  >
                    {showPw.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            sx={{ mt: 2, textTransform: "none" }}
            onClick={handlePasswordChange}
          >
            {t("updatePassword")}
          </Button>
        </Card>

        <Card
          sx={{ p: 3, borderRadius: 1.5 }}
        >
          <Box className="flex items-center gap-2 mb-2">
            <i className="bx bx-trash text-red-600 text-xl" />
            <Typography fontWeight="bold" color="error">
              {t("deleteAccount")}
            </Typography>
          </Box>

          <Typography fontSize={13} color="error" mb={2}>
            {t("deleteAccountDesc")}
          </Typography>

          <Button
            color="error"
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: 1,
            }}
            onClick={() => setDeleteOpen(true)}
          >
            {t("deleteAccountButton")}
          </Button>
        </Card>
      </Box>
    </Box>
  );
}