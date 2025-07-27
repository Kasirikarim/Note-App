import React, { useState, useEffect } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonToggle, IonItem, IonLabel, IonSelect, IonSelectOption,
  IonRange, IonBackButton, IonButtons, IonList, IonListHeader,
  IonNote, IonButton, IonIcon
} from "@ionic/react";
import { arrowBack, moon, sunny, text, contrast } from "ionicons/icons";
import { useHistory } from "react-router-dom";


// Define types for better type safety
type AppSettings = {
  darkMode: boolean;
  fontSize: number;
  fontFamily: string;
  highContrast: boolean;
};

// Font options with display names
const fontOptions = [
  { value: "Arial", display: "Arial" },
  { value: "Georgia", display: "Georgia" },
  { value: "Courier New", display: "Courier New" },
  { value: "Times New Roman", display: "Times New Roman" },
  { value: "Verdana", display: "Verdana" },
  { value: "Helvetica", display: "Helvetica" },
  { value: "'Comic Sans MS', cursive", display: "Comic Sans" },
  { value: "'Courier Prime', monospace", display: "Courier Prime" }
];

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: false,
    fontSize: 16,
    fontFamily: "Arial",
    highContrast: false
  });
  const history = useHistory();

  // Load saved settings
  useEffect(() => {
    const savedSettings = localStorage.getItem("appSettings");
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(prev => ({
        ...prev,
        ...parsedSettings
      }));
      applySettings(parsedSettings);
    }
  }, []);

  // Apply settings to the app
  const applySettings = (newSettings: AppSettings) => {
    // Apply dark mode
    document.body.classList.toggle("dark", newSettings.darkMode);
    
    // Apply high contrast
    document.body.classList.toggle("high-contrast", newSettings.highContrast);
    
    // Apply font size
    document.documentElement.style.setProperty("--ion-font-size", `${newSettings.fontSize}px`);
    
    // Apply font family
    document.documentElement.style.setProperty("--ion-font-family", newSettings.fontFamily);
  };

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    
    // Update state
    setSettings(newSettings);
    
    // Apply immediately
    applySettings(newSettings);
    
    // Save to localStorage
    localStorage.setItem("appSettings", JSON.stringify(newSettings));
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      darkMode: false,
      fontSize: 16,
      fontFamily: "Arial",
      highContrast: false
    };
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    localStorage.setItem("appSettings", JSON.stringify(defaultSettings));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" icon={arrowBack} text="Back" />
          </IonButtons>
          <IonTitle>App Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <IonList>
          {/* Appearance Section */}
          <IonListHeader>
            <IonLabel>Appearance</IonLabel>
          </IonListHeader>
          
          <IonItem>
            <IonLabel>
              <IonNote color="medium" slot="start">
                <IonIcon icon={moon} />
              </IonNote>
              Dark Mode
            </IonLabel>
            <IonToggle
              checked={settings.darkMode}
              onIonChange={e => handleSettingChange("darkMode", e.detail.checked)}
            />
          </IonItem>

          <IonItem>
            <IonLabel>
              <IonNote color="medium" slot="start">
                <IonIcon icon={contrast} />
              </IonNote>
              High Contrast
            </IonLabel>
            <IonToggle
              checked={settings.highContrast}
              onIonChange={e => handleSettingChange("highContrast", e.detail.checked)}
            />
          </IonItem>

          {/* Text Settings Section */}
          <IonListHeader>
            <IonLabel>Text Settings</IonLabel>
          </IonListHeader>
          
          <IonItem>
            <IonLabel>
              <IonNote color="medium" slot="start">
                <IonIcon icon={text} />
              </IonNote>
              Font Size: {settings.fontSize}px
            </IonLabel>
            <IonRange
              min={12}
              max={24}
              step={1}
              value={settings.fontSize}
              onIonChange={e => handleSettingChange("fontSize", e.detail.value)}
            >
              <IonLabel slot="start">A</IonLabel>
              <IonLabel slot="end">A</IonLabel>
            </IonRange>
          </IonItem>

          <IonItem>
            <IonLabel>
              <IonNote color="medium" slot="start">
                <IonIcon icon={text} />
              </IonNote>
              Font Family
            </IonLabel>
            <IonSelect
              value={settings.fontFamily}
              onIonChange={e => handleSettingChange("fontFamily", e.detail.value)}
              interface="popover"
            >
              {fontOptions.map((font) => (
                <IonSelectOption 
                  key={font.value} 
                  value={font.value}
                  style={{ fontFamily: font.value }}
                >
                  {font.display}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          {/* Reset Section */}
          <IonItem lines="none">
            <IonButton 
              expand="block" 
              color="medium" 
              fill="outline"
              onClick={resetToDefaults}
            >
              Reset to Defaults
            </IonButton>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;