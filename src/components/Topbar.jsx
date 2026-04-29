import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import TranslateIcon from "@mui/icons-material/Translate";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import { auth, db } from "../firebase/config";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const DEFAULT_AVATAR =
  "https://i.pinimg.com/736x/d2/de/10/d2de10032597dc38ac19a57031a3fa47.jpg";

export default function Topbar({
  mode,
  onToggleMode,
  mobileOpen,
  setMobileOpen,
}) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const currentLang = i18n.language;

  const [profileAnchor, setProfileAnchor] = useState(null);
  const [langAnchor, setLangAnchor] = useState(null);
  const [openSearch, setOpenSearch] = useState(false);

  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [email, setEmail] = useState("");

  const changeLanguage = async (lng) => {
    i18n.changeLanguage(lng);
    setLangAnchor(null);

    const user = auth.currentUser;
    if (!user) return;

    const updated = { language: lng };

    try {
      await setDoc(doc(db, "users", user.uid), updated, { merge: true });

      const cached = JSON.parse(localStorage.getItem("userData")) || {};
      localStorage.setItem(
        "userData",
        JSON.stringify({ ...cached, ...updated })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleThemeToggle = async () => {
    const newMode = mode === "dark" ? "light" : "dark";
    onToggleMode();

    const user = auth.currentUser;
    if (!user) return;

    const updated = { theme: newMode };

    try {
      await setDoc(doc(db, "users", user.uid), updated, { merge: true });

      const cached = JSON.parse(localStorage.getItem("userData")) || {};
      localStorage.setItem(
        "userData",
        JSON.stringify({ ...cached, ...updated })
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const cached = JSON.parse(localStorage.getItem("userData"));
    if (cached) {
      setAvatar(cached.avatar || DEFAULT_AVATAR);
      setEmail(cached.email || "");
    }

    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid);

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setAvatar(data.avatar || DEFAULT_AVATAR);
        setEmail(data.email || "");
        localStorage.setItem("userData", JSON.stringify(data));
      }
    });

    return () => unsub();
  }, []);

  const goToSection = (sectionId) => {
    navigate("/settings");

    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
  };

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("userData");
      localStorage.removeItem("goals_cache");
      localStorage.removeItem("categories");

      await signOut(auth);
      setProfileAnchor(null);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppBar
      key={currentLang}
      position={isMobile ? "static" : "fixed"}
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: isMobile
          ? "100%"
          : { md: "calc(100% - 240px)", xs: "calc(100% - 40px)" },
        backgroundColor: "background.default",
        color: "text.primary",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center",
          justifyContent: "space-between",
          gap: 1.5,
          px: 3,
          py: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              borderRadius: "17px",
              width: isMobile ? "auto" : openSearch ? 450 : 42,
              overflow: "hidden",
              border: "1px solid transparent",
              transition: "all 0.25s ease",
              padding: openSearch && !isMobile ? "4px 6px" : 0,
              "&:focus-within": { borderColor: "primary.main" },
            }}
          >
            <IconButton
              onClick={() =>
                isMobile
                  ? setMobileOpen(!mobileOpen)
                  : setOpenSearch(!openSearch)
              }
            >
              {isMobile ? <MenuIcon /> : <SearchIcon />}
            </IconButton>

            {!isMobile && openSearch && (
              <InputBase
                placeholder={t("searchPlaceholder")}
                sx={{ ml: 1, flex: 1, fontSize: "14px" }}
              />
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={handleThemeToggle}>
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            <IconButton onClick={(e) => setLangAnchor(e.currentTarget)}>
              <TranslateIcon />
            </IconButton>

            <IconButton>
              <NotificationsIcon />
            </IconButton>

            <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)}>
              <Avatar
                src={avatar || DEFAULT_AVATAR}
                sx={{ width: 48, height: 48 }}
              />
            </IconButton>
          </Box>
        </Box>

        {isMobile && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              borderRadius: "14px",
              border: "1px solid",
              borderColor: "primary.submain",
              padding: "4px 8px",
            }}
          >
            <SearchIcon />
            <InputBase
              placeholder={t("searchPlaceholder")}
              sx={{ ml: 1, flex: 1, fontSize: "14px" }}
            />
          </Box>
        )}
      </Toolbar>

      <Menu anchorEl={langAnchor} open={Boolean(langAnchor)} onClose={() => setLangAnchor(null)} PaperProps={{ sx: { minWidth: 160, borderRadius: 0 } }}>
        <MenuItem onClick={() => changeLanguage("en")}>{t("en")}</MenuItem>
        <MenuItem onClick={() => changeLanguage("fa")}>{t("fa")}</MenuItem>
        <MenuItem onClick={() => changeLanguage("ar")}>{t("ar")}</MenuItem>
      </Menu>

      <Menu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={() => setProfileAnchor(null)} PaperProps={{ sx: { minWidth: 200, borderRadius: 0 } }} >
        <Box className="py-2 px-2 text-center">
          <Typography variant="body2" color="text.secondary"> {t("signedInAs")}: </Typography>
          <Typography variant="body2" color="text.secondary"> {email || t("noEmailSet")} </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => { goToSection("profile"); setProfileAnchor(null); }} sx={{ gap: 1 }} >
          <PersonIcon fontSize="small" /> {t("profile")} </MenuItem>
        <MenuItem onClick={() => { goToSection("preferences"); setProfileAnchor(null); }} sx={{ gap: 1 }} >
          <SettingsIcon fontSize="small" /> {t("settings")} </MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut} sx={{ gap: 1 }}>
          <LogoutIcon fontSize="small" /> {t("signOut")} </MenuItem>
      </Menu>
    </AppBar>
  );
}
