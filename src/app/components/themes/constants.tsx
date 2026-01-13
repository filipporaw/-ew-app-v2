import { ResumePDFDefault } from "./default";
import { ResumePDFMinimal } from "./minimal";
import { ResumePDFRover } from "./rover";
import { ResumePDFRoad } from "./road";
import { ResumePDFElegant } from "./elegant";
import { ThemeComponent } from "./types";

export const THEMES: Record<string, ThemeComponent> = {
  "default": ResumePDFDefault,
  "minimal": ResumePDFMinimal,
  "rover": ResumePDFRover,
  "road": ResumePDFRoad,
  "elegant": ResumePDFElegant,
};
