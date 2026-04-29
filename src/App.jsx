import { useMemo, useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Routes, Route, Navigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { ltrCache, rtlCache } from "./rtlCache";
import { CacheProvider } from "@emotion/react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import getTheme from "./theme";

import Navbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";

import DashboardPage from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Categories from "./pages/Categories";
import Goals from "./pages/Goals";
import GoalDetails from "./components/GoalsDetails";
import CreateGoal from "./pages/CreateGoal";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";

import AuthPage from "./pages/Auth";

import { useAuth } from "./context/AuthContext";

export default function App() {
  const { i18n } = useTranslation();
  const isRTL = ["fa", "ar"].includes(i18n.language);

  const { user, loading } = useAuth();

  const [mode, setMode] = useState("light");
  const [lang, setLang] = useState(i18n.language);

  const [showTransition, setShowTransition] = useState(false);
  const [prevUser, setPrevUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);


  useEffect(() => {
    if (!prevUser && user) {
      setShowTransition(true);
      setTimeout(() => setShowTransition(false), 1000);
    }
    setPrevUser(user);
  }, [user]);

  useEffect(() => {
    const handleChange = (lng) => setLang(lng);
    i18n.on("languageChanged", handleChange);
    return () => i18n.off("languageChanged", handleChange);
  }, [i18n]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("settings"));
    if (saved?.theme) {
      setMode(saved.theme === "auto" ? "light" : saved.theme);
    }
  }, []);

  const theme = useMemo(() => getTheme(mode), [mode, lang]);

  const toggleMode = () => {
    setMode((prev) => {
      const newMode = prev === "light" ? "dark" : "light";

      const saved = JSON.parse(localStorage.getItem("settings")) || {};
      localStorage.setItem(
        "settings",
        JSON.stringify({ ...saved, theme: newMode })
      );

      return newMode;
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <CacheProvider value={isRTL ? rtlCache : ltrCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            key={lang}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <Routes>
              <Route
                path="/auth"
                element={user ? <Navigate to="/" /> : <AuthPage />}
              />
              <Route
                path="/*"
                element={
                  user ? (
                    <>
                      <Navbar mode={mode}
                        onToggleMode={toggleMode}
                        mobileOpen={mobileOpen}
                        setMobileOpen={setMobileOpen} />

                      <Box sx={{ display: "flex" }}>
                        <Sidebar mobileOpen={mobileOpen}
                          setMobileOpen={setMobileOpen} />

                        <Box
                          sx={{
                            flex: 1,
                            py: { md: 16, xs: 3 },
                            ml: { xs: 0, md: "240px" },
                          }}
                        >
                          <Container maxWidth="lg">
                            <Routes>
                              <Route path="/" element={<DashboardPage />} />
                              <Route path="/analytics" element={<Analytics />} />
                              <Route path="/categories" element={<Categories />} />
                              <Route path="/goals" element={<Goals />} />
                              <Route path="/create-goal" element={<CreateGoal />} />
                              <Route path="/goal/:id" element={<GoalDetails />} />
                              <Route path="/calendar" element={<Calendar />} />
                              <Route
                                path="/settings"
                                element={<Settings setMode={setMode} />}
                              />
                            </Routes>
                          </Container>
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <Navigate to="/auth" />
                  )
                }
              />
            </Routes>
          </Box>
        </LocalizationProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
