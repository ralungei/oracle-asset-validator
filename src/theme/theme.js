"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#007AFF" }, // iOS Blue
    secondary: { main: "#34C759" }, // iOS Green
    error: { main: "#FF3B30" }, // iOS Red
    warning: { main: "#FF9500" }, // iOS Orange
    info: { main: "#5AC8FA" }, // iOS Light Blue
    success: { main: "#30D158" }, // iOS Bright Green
    background: {
      default: "#FFFFFF", // System background
      paper: "#F2F2F7", // Secondary background
    },
    text: {
      primary: "#000000", // Standard text
      secondary: "#3C3C4399", // Secondary text
      disabled: "#3C3C434D", // Disabled text
    },
    divider: "#3C3C434A",
  },
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20, // You can adjust this value for more or less rounding
        },
      },
    },
  },
});

export default theme;
