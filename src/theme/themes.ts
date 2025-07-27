import { AppSettings } from "../types";

export const applyTheme = (settings: AppSettings) => {
  // Dark mode
  if (settings.darkMode) {
    document.body.classList.add("dark");
    document.body.style.setProperty("color-scheme", "dark");
  } else {
    document.body.classList.remove("dark");
    document.body.style.setProperty("color-scheme", "light");
  }
  
  // Font settings
  document.documentElement.style.setProperty(
    "--ion-font-size", 
    `${settings.fontSize}px`
  );
  document.documentElement.style.setProperty(
    "--ion-font-family", 
    settings.fontFamily
  );
};

export const getDefaultSettings = (): AppSettings => ({
  darkMode: false,
  fontSize: 16,
  fontFamily: "Arial"
});