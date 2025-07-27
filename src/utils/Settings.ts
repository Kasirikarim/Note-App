export const loadSettings = () => {
  const defaultSettings = {
    darkMode: false,
    fontSize: 16,
    fontFamily: "Arial"
  };
  
  const saved = localStorage.getItem("appSettings");
  return saved ? JSON.parse(saved) : defaultSettings;
};

export const applySettings = (settings: {
  darkMode: boolean;
  fontSize: number;
  fontFamily: string;
}) => {
  document.body.classList.toggle("dark", settings.darkMode);
  document.documentElement.style.setProperty("--ion-font-size", `${settings.fontSize}px`);
  document.documentElement.style.setProperty("--ion-font-family", settings.fontFamily);
};