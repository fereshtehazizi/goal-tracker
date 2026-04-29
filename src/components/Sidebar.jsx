import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";

import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import CategoryIcon from "@mui/icons-material/Category";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";

import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

const navItems = [
  { key: "dashboard", icon: <DashboardIcon />, path: "/" },
  { key: "analytics", icon: <BarChartIcon />, path: "/analytics" },
  { key: "categories", icon: <CategoryIcon />, path: "/categories" },
  { key: "goals", icon: <TrackChangesIcon />, path: "/goals" },
  { key: "createGoal", icon: <AddCircleOutlineIcon />, path: "/create-goal" },
  { key: "calendar", icon: <CalendarMonthIcon />, path: "/calendar" },
  { key: "settings", icon: <SettingsIcon />, path: "/settings" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isMobile = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [isMobile]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("goals_cache");
      localStorage.removeItem("userData");

      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <Box
      sx={{
        width: collapsed ? 80 : 240,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 2000,
        borderRight: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
        p: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          mb: 2,
        }}
      >
        {!collapsed && (
          <Typography variant="h6" fontWeight="bold">
            {t("goalTracker")}
          </Typography>
        )}

        <IconButton onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
        </IconButton>
      </Box>

      <List sx={{ flex: 1 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.path}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {({ isActive }) => (
              <ListItemButton
                sx={{
                  justifyContent: collapsed ? "center" : "flex-start",
                  px: collapsed ? 1 : 2,
                  borderRadius: 1,
                  backgroundColor: isActive
                    ? "rgba(124, 58, 237, 0.15)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(124, 58, 237, 0.1)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 0 : 2,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                {!collapsed && <ListItemText primary={t(item.key)} />}
              </ListItemButton>
            )}
          </NavLink>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />

      <List>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            justifyContent: collapsed ? "center" : "flex-start",
            px: collapsed ? 1 : 2,
            color: "error.main",
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: collapsed ? 0 : 2,
              justifyContent: "center",
              color: "error.main",
            }}
          >
            <LogoutIcon />
          </ListItemIcon>

          {!collapsed && <ListItemText primary={t("logout")} />}
        </ListItemButton>
      </List>
    </Box>
  );
}