import { THEMES } from "./constants";

export const getAllThemesAvailable = () => {
  return Object.keys(THEMES);
};

export const getTheme = (theme: string) => {
  const component = THEMES[theme];
  if (!component) {
    console.warn(`Theme "${theme}" not found, falling back to "default"`);
    return THEMES["default"];
  }
  return component;
};
