"use client";

import useFetch from "@/hook/useFetch";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { ISettings } from "@/Interface/ISettings";
import { getUserSettingsEndpoint } from "@/endpoint/Settings";
import { Data } from "@/Interface/Data";


const defaultSettings = {
  theme: "light",
  accessibility: {
    textSize: "medium",
    highContrast: false,
    notificationSound: false,
    dyslexicFont: false,
  },
  language: "en",
};

interface SettingsContextType {
  settings: ISettings | null;
  updateLocalSettings: (newSettings: Partial<ISettings>) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  updateLocalSettings: () => {},
});

export const useSettingsContext = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const { fetchData } = useFetch(true);
  const { accessToken } = useAuth();
  const [settings, setSettings] = useState<ISettings | null>(null);

  // Récupérer les settings depuis le localStorage
  const getLocalSettings = (): ISettings | null => {
    const stored = localStorage.getItem('user-settings');
    return stored ? JSON.parse(stored) : null;
  };

  // Mettre à jour les settings (localStorage et state local)
  const updateLocalSettings = (newSettings: Partial<ISettings>) => {
    setSettings((prev) => {
      if (!prev) return null;

      const updated = { ...prev, ...newSettings };
      localStorage.setItem('user-settings', JSON.stringify(updated));
      return updated;
    });
  };

  // Récupérer les settings serveur si connecté
  useEffect(() => {
    const loadSettings = async () => {
      if (accessToken) {
        try {
          const serverSettings = await fetchData<Data<ISettings>>(getUserSettingsEndpoint);
          setSettings(serverSettings.data);
          localStorage.setItem('user-settings', JSON.stringify(serverSettings.data));
        } catch (error) {
          console.error('Erreur lors de la récupération des settings:', error);
        }
      } else {
        const local = getLocalSettings();
        if (local) {
          setSettings(local);
        }else{
          localStorage.setItem('user-settings', JSON.stringify(defaultSettings));
        }
      }
    };

    loadSettings();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return (
    <SettingsContext.Provider value={{ settings, updateLocalSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
