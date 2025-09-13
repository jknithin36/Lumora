import React, { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  useEffect(() => {
    const pref = localStorage.getItem("theme");
    if (pref === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
};

export default ThemeToggle;
