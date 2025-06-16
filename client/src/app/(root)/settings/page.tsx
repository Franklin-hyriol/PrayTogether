"use client";
import Accessibility from "@/components/Accessibility/Accessibility";
import DeleteCompte from "@/components/DeleteCompte/DeleteCompte";
import Language from "@/components/Language/Language";
import Theme from "@/components/Theme/Theme";
import { useSettingsContext } from "@/context/SettingsContext";
import { patchUserSettingsEndpoint } from "@/endpoint/Settings";
import usePatch from "@/hook/usePatch";
import { Data } from "@/Interface/Data";
import { IAccessibility, ISettings } from "@/Interface/ISettings";
import { useMutation } from "@tanstack/react-query";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

function Settings() {
  const { settings, updateLocalSettings } = useSettingsContext();

  const { patchData } = usePatch(true);

  const { mutate: patchSettings } = useMutation({
    mutationFn: (newSettings: DeepPartial<ISettings>) =>
      patchData<Data<ISettings>>(patchUserSettingsEndpoint, newSettings),
    onSuccess: (data) => {
      updateLocalSettings(data.data);
    },
    onError: (err) => {
      console.error("Error while updating settings", err);
    },
  });

  // Exemple de gestion d’un changement de thème
  const handleThemeChange = (newTheme: string) => {
    patchSettings({ theme: newTheme });
  };

  // Exemple de gestion d’un changement d’accessibilité
  const handleAccessibilityChange = (
    newAccessibility: Partial<IAccessibility>,
  ) => {
    patchSettings({ accessibility: newAccessibility });
  };

  // Exemple de changement de langue
  const handleLanguageChange = (newLang: string) => {
    patchSettings({ language: newLang });
  };

  return (
    <section className="bg-base-100 mx-auto max-w-[1200px] overflow-hidden rounded-2xl p-4 shadow-md">
      <h1 className="mb-8 text-center text-2xl font-bold">Settings</h1>

      <div className="flex flex-col items-center p-0 sm:p-4">
        <Theme
          theme={settings?.theme as string}
          onThemeChange={handleThemeChange}
        />

        <Accessibility
          accessibility={settings?.accessibility as IAccessibility}
          onAccessibilityChange={handleAccessibilityChange}
        />

        <Language
          language={settings?.language as string}
          onLanguageChange={handleLanguageChange}
        />

        <DeleteCompte />
      </div>
    </section>
  );
}

export default Settings;
