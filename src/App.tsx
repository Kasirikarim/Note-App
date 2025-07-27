import React, { useEffect } from "react";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import NotesPage from "./pages/Home";
import SettingsPage from "./pages/Settings";
import NewNotePage from "./pages/NewNotePage";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

// Types and constants
type AppSettings = {
  darkMode: boolean;
  fontSize: number;
  fontFamily: string;
  accentColor?: string;
};

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  fontSize: 16,
  fontFamily: "Arial",
  accentColor: "#3880ff" // Ionic default blue
};

const FONT_FAMILIES = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Verdana",
  "system-ui"
];

// Theme utilities
const applyTheme = (settings: AppSettings) => {
  // Apply dark mode
  if (settings.darkMode) {
    document.body.classList.add("dark");
    document.body.style.setProperty("color-scheme", "dark");
  } else {
    document.body.classList.remove("dark");
    document.body.style.setProperty("color-scheme", "light");
  }

  // Apply font settings
  document.documentElement.style.setProperty(
    "--ion-font-size", 
    `${settings.fontSize}px`
  );
  document.documentElement.style.setProperty(
    "--ion-font-family", 
    settings.fontFamily
  );
  
  // Apply accent color if specified
  if (settings.accentColor) {
    document.documentElement.style.setProperty(
      "--ion-color-primary",
      settings.accentColor
    );
  }
};

setupIonicReact({
  mode: 'md' // Optional: Force material design on all platforms
});

const App: React.FC = () => {
  useEffect(() => {
    const loadSettings = (): AppSettings => {
      try {
        const saved = localStorage.getItem("appSettings");
        return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
      } catch {
        return DEFAULT_SETTINGS;
      }
    };

    // Initialize settings
    const settings = loadSettings();
    applyTheme(settings);

    // Sync settings across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "appSettings") {
        applyTheme(loadSettings());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/notes" component={NotesPage} />
          <Route exact path="/new" component={NewNotePage} />
          <Route exact path="/settings" component={SettingsPage} />
          <Route exact path="/edit/:id" component={NewNotePage} />
          <Redirect exact from="/" to="/notes" />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export { DEFAULT_SETTINGS, FONT_FAMILIES, type AppSettings };
export default App;