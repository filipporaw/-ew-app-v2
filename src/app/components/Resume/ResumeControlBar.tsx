"use client";
import { useSetDefaultScale } from "components/Resume/hooks";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { Font } from "@react-pdf/renderer";
import { getAllFontFamiliesToLoad } from "components/fonts/lib";

// Register fonts synchronously when this module loads (client-side only)
const allFontFamilies = getAllFontFamiliesToLoad();
allFontFamilies.forEach((fontFamily) => {
  Font.register({
    family: fontFamily,
    fonts: [
      {
        src: `/fonts/${fontFamily}-Regular.ttf`,
      },
      {
        src: `/fonts/${fontFamily}-Bold.ttf`,
        fontWeight: "bold",
      },
    ],
  });
});

// Register hyphenation callback
Font.registerHyphenationCallback((word) => [word]);

const ResumeControlBar = ({
  scale,
  setScale,
  documentSize,
  downloadUrl,
  isGenerating,
  fileName,
}: {
  scale: number;
  setScale: (scale: number) => void;
  documentSize: string;
  downloadUrl: string | null;
  isGenerating: boolean;
  fileName: string;
}) => {
  const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
    setScale,
    documentSize,
  });

  return (
    <div className="sticky bottom-0 left-0 right-0 flex h-[var(--resume-control-bar-height)] items-center justify-between px-[var(--resume-padding)] text-gray-600 bg-white border-t border-gray-200 shadow-sm overflow-hidden z-10">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <MagnifyingGlassIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
        <input
          type="range"
          min={0.5}
          max={1.5}
          step={0.01}
          value={scale}
          onChange={(e) => {
            setScaleOnResize(false);
            setScale(Number(e.target.value));
          }}
          className="w-20 sm:w-24 flex-shrink"
        />
        <div className="w-10 text-sm font-medium flex-shrink-0">{`${Math.round(scale * 100)}%`}</div>
        <label className="flex items-center gap-1.5 flex-shrink-0 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={scaleOnResize}
            onChange={() => setScaleOnResize((prev) => !prev)}
          />
          <span className="select-none text-sm whitespace-nowrap hidden sm:inline">Autoscale</span>
        </label>
      </div>
      <div className="flex items-center flex-shrink-0 ml-4">
        {downloadUrl && !isGenerating ? (
          <a
            className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 bg-white shadow-sm"
            href={downloadUrl}
            download={fileName}
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span className="whitespace-nowrap text-sm font-medium">Download Resume</span>
          </a>
        ) : (
          <div className="flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 bg-gray-100 text-gray-400 cursor-wait">
            <ArrowDownTrayIcon className="h-4 w-4 animate-pulse" />
            <span className="whitespace-nowrap text-sm font-medium">
              {isGenerating ? "Generating..." : "Processing..."}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Load ResumeControlBar client side (client-only)
 */
export default ResumeControlBar;

export const ResumeControlBarBorder = () => (
  <div className="absolute bottom-[var(--resume-control-bar-height)] w-full border-t-2 bg-gray-50" />
);
