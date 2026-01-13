import type { Settings } from "lib/redux/settingsSlice";
import { PX_PER_PT } from "lib/constants";

const POINTS_PER_INCH = 72;
const CM_PER_INCH = 2.54;
const DEFAULT_A4_MARGIN_CM = 2;
const DEFAULT_LETTER_MARGIN_IN = 0.75;

export type SupportedDocumentSize = "A4" | "LETTER";

export const normalizeDocumentSize = (
  documentSize?: Settings["documentSize"]
): SupportedDocumentSize => {
  const normalized = documentSize?.toString().trim().toUpperCase();
  return normalized === "A4" ? "A4" : "LETTER";
};

const inchesToPoints = (inches: number) => inches * POINTS_PER_INCH;
const cmToPoints = (cm: number) => inchesToPoints(cm / CM_PER_INCH);

export const getPagePadding = (
  documentSize?: Settings["documentSize"]
): number => {
  const size = normalizeDocumentSize(documentSize);
  return size === "A4"
    ? cmToPoints(DEFAULT_A4_MARGIN_CM)
    : inchesToPoints(DEFAULT_LETTER_MARGIN_IN);
};

export const getPageMarginStyle = (
  documentSize?: Settings["documentSize"]
) => {
  const padding = getPagePadding(documentSize);
  const paddingPt = `${padding}pt`;
  return {
    paddingTop: paddingPt,
    paddingRight: paddingPt,
    paddingBottom: paddingPt,
    paddingLeft: paddingPt,
  } as const;
};

export const getPageMarginPx = (
  documentSize?: Settings["documentSize"]
) => getPagePadding(documentSize) * PX_PER_PT;

export const getPageMarginCss = (
  documentSize?: Settings["documentSize"]
) => {
  const size = normalizeDocumentSize(documentSize);
  return size === "A4"
    ? `${DEFAULT_A4_MARGIN_CM}cm`
    : `${DEFAULT_LETTER_MARGIN_IN}in`;
};
