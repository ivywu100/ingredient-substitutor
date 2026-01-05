"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { useEffect, useState } from "react";
import { lightTheme, darkTheme } from "./mui-theme";

export function MuiThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  useEffect(() => {
    const root = document.documentElement;

    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
