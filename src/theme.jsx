import { createTheme } from "@mui/material/styles";

export default function getTheme(mode = "light", lang = "en") {

  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "light" ? "#4F6B86" : "#809eb9",
        submain: mode === "light" ? "#e7e7e7" : "#1a1a1a",
      },
      background: {
        default: mode === "light" ? "#F5F7FB" : "#040405",
        paper: mode === "light" ? "#fcf9f6" : "#0e0f11",
      },
    },

    typography: {
      fontFamily: ["Vazirmatn", "sans-serif"].join(","),
      h4: { fontWeight: 700 },
    },

    shape: { borderRadius: 12 },

    components: {
      MuiPaper: {
        styleOverrides: { root: { borderRadius: 8 } },
      },
      MuiCard: {
        styleOverrides: { root: { borderRadius: 8 } },
      },
    },
  });
}