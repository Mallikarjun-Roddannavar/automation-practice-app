import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";

import { AppLayout } from "../components/AppLayout";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export function PreferencesPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const profileIconKey = `playwright_profile_icon_${user?.username ?? "guest"}`;
  const [profileIcon, setProfileIcon] = useState<string>(() => localStorage.getItem(profileIconKey) ?? "");

  useEffect(() => {
    setProfileIcon(localStorage.getItem(profileIconKey) ?? "");
  }, [profileIconKey]);

  function onProfileIconChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!dataUrl) return;
      localStorage.setItem(profileIconKey, dataUrl);
      setProfileIcon(dataUrl);
      window.dispatchEvent(new Event("profile-icon-updated"));
    };
    reader.readAsDataURL(file);
  }

  function removeProfileIcon() {
    localStorage.removeItem(profileIconKey);
    setProfileIcon("");
    window.dispatchEvent(new Event("profile-icon-updated"));
  }

  return (
    <AppLayout>
      <h2 className="text-2xl font-semibold" data-testid="preferences-title">
        Preferences
      </h2>
      <div className="app-card mt-4 max-w-xl p-5" data-testid="preferences-card">
        <p className="text-muted text-sm dark:text-gray-400">Theme Preference</p>
        <p className="mt-1 text-sm" data-testid="preferences-theme-current">
          Current theme: {theme === "dark" ? "Black" : "White"}
        </p>
        <ThemeToggle />
        <div
          className="mt-4 rounded-md bg-white p-3 text-black dark:bg-black dark:text-white"
          data-testid="theme-dark-utility-example"
        >
          Tailwind dark utility example block
        </div>
      </div>
      <div className="app-card mt-4 max-w-xl p-5" data-testid="preferences-profile-card">
        <p className="text-muted text-sm">Profile Icon</p>
        <input
          type="file"
          accept="image/*"
          className="app-input mt-3 block"
          onChange={onProfileIconChange}
          data-testid="preferences-profile-upload-input"
        />
        {profileIcon && (
          <img
            src={profileIcon}
            alt="Profile preview"
            className="mt-4 h-16 w-16 rounded-full object-cover border"
            data-testid="preferences-profile-preview"
          />
        )}
        {profileIcon && (
          <button
            type="button"
            className="btn-danger mt-3 px-3 py-1 text-sm"
            onClick={removeProfileIcon}
            data-testid="preferences-profile-remove-btn"
          >
            Remove Icon
          </button>
        )}
      </div>
    </AppLayout>
  );
}
