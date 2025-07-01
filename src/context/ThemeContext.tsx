// import { createContext, useContext, useEffect, useState } from 'react';

// type Theme = 'dark' | 'light';

// interface ThemeContextType {
//   theme: Theme;
//   toggleTheme: () => void;
// }

// export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// export function ThemeProvider({ children }: { children: React.ReactNode }) {
//   const [theme, setTheme] = useState<Theme>('dark');

//   const toggleTheme = () => {
//     setTheme((prevTheme) => {
//       const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
//       localStorage.setItem('theme', newTheme);
//       return newTheme;
//     });
//   };

  // useEffect(() => {
  //   const savedTheme = localStorage.getItem('theme') as Theme;
  //   if (savedTheme) {
  //     setTheme(savedTheme);
  //   }
  //   document.documentElement.classList.toggle('dark', theme === 'dark');
  // }, [theme]);

  // return (
  //   <ThemeContext.Provider value={{ theme, toggleTheme }}>
  //     {children}
  //   </ThemeContext.Provider>
  // );
//}

// useTheme hook moved to ThemeContext.hook.ts for Fast Refresh compatibility
import React, { createContext, useContext, useState, ReactNode } from "react";

type Theme = "light" | "dark";
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("dark");
  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Add and export this hook:
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}