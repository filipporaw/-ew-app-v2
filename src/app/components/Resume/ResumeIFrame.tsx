"use client";
import { useMemo, useState, useRef, useEffect } from "react";
import Frame from "react-frame-component";
import {
  A4_HEIGHT_PX,
  A4_WIDTH_PX,
  A4_WIDTH_PT,
  A4_HEIGHT_PT,
  LETTER_HEIGHT_PX,
  LETTER_WIDTH_PX,
  LETTER_WIDTH_PT,
  LETTER_HEIGHT_PT,
  PX_PER_PT,
} from "lib/constants";
import dynamic from "next/dynamic";
import { getAllFontFamiliesToLoad } from "components/fonts/lib";

const getIframeInitialContent = (isA4: boolean) => {
  const width = isA4 ? A4_WIDTH_PT : LETTER_WIDTH_PT;
  const height = isA4 ? A4_HEIGHT_PT : LETTER_HEIGHT_PT;
  const allFontFamilies = getAllFontFamiliesToLoad();

  const allFontFamiliesPreloadLinks = allFontFamilies
    .map(
      (
        font
      ) => `<link rel="preload" as="font" href="/fonts/${font}-Regular.ttf" type="font/ttf" crossorigin="anonymous">
<link rel="preload" as="font" href="/fonts/${font}-Bold.ttf" type="font/ttf" crossorigin="anonymous">`
    )
    .join("");

  const allFontFamiliesFontFaces = allFontFamilies
    .map(
      (
        font
      ) => `@font-face {font-family: "${font}"; src: url("/fonts/${font}-Regular.ttf");}
@font-face {font-family: "${font}"; src: url("/fonts/${font}-Bold.ttf"); font-weight: bold;}`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
  <head>
    ${allFontFamiliesPreloadLinks}
    <style>
      ${allFontFamiliesFontFaces}
      body {
        background-color: #f3f4f6;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-bottom: 40px; /* Space at the bottom */
      }
      /* This simulates the pages in HTML */
      .page-container {
        background-color: white;
        width: ${width}pt;
        min-height: ${height}pt;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        position: relative;
        margin-bottom: 20px;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
      }
      /* Ensure all content respects word wrapping */
      .page-container * {
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        max-width: 100%;
      }
      /* Visual guide for where the page ends */
      .page-break-guide {
        position: absolute;
        left: 0;
        right: 0;
        height: 2px;
        background-color: #e5e7eb;
        border-top: 1px dashed #d1d5db;
        z-index: 10;
        pointer-events: none;
      }
    </style>
  </head>
  <body style='width: 100%; -webkit-text-size-adjust:none;'>
    <div id="mount-point"></div>
  </body>
</html>`;
};

/**
 * Iframe is used here for style isolation, since react pdf uses pt unit.
 * It creates a sandbox document body that uses letter/A4 pt size as width.
 */
const ResumeIframe = ({
  documentSize,
  scale,
  children,
  enablePDFViewer = false,
}: {
  documentSize: string;
  scale: number;
  children: React.ReactNode;
  enablePDFViewer?: boolean;
}) => {
  const isA4 = documentSize === "A4";
  const iframeInitialContent = useMemo(
    () => getIframeInitialContent(isA4),
    [isA4]
  );
  const [iframeHeight, setIframeHeight] = useState(isA4 ? A4_HEIGHT_PX : LETTER_HEIGHT_PX);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const body = iframeRef.current.contentWindow.document.body;
        if (body) {
          // Remove the padding-bottom from the calculation to get pure content height
          const contentHeightPt = (body.scrollHeight - 40) / PX_PER_PT;
          const pageHeightPt = isA4 ? A4_HEIGHT_PT : LETTER_HEIGHT_PT;
          
          // Calculate how many pages we need to fit the content
          const numPagesNeeded = Math.max(1, Math.ceil(contentHeightPt / pageHeightPt));
          const totalHeightPx = numPagesNeeded * pageHeightPt * PX_PER_PT;
          
          if (Math.abs(totalHeightPx - iframeHeight) > 1) {
            setIframeHeight(totalHeightPx);
          }
        }
      }
    };

    const interval = setInterval(handleResize, 1000); // Polling as fallback
    return () => clearInterval(interval);
  }, [isA4, children]);

  if (enablePDFViewer) {
    return (
      <DynamicPDFViewer className="h-full w-full">
        {children as any}
      </DynamicPDFViewer>
    );
  }
  const width = isA4 ? A4_WIDTH_PX : LETTER_WIDTH_PX;
  const pageHeightPt = isA4 ? A4_HEIGHT_PT : LETTER_HEIGHT_PT;

  const numPages = Math.ceil((iframeHeight / PX_PER_PT) / pageHeightPt);
  const pageBreakLines = Array.from({ length: numPages - 1 }).map((_, i) => (
    <div
      key={i}
      style={{
        position: 'absolute',
        top: `${(i + 1) * pageHeightPt}pt`,
        left: '-50px', // slightly wider than the page
        right: '-50px',
        height: '30pt', // Gap between pages in PT to match document units
        backgroundColor: '#f3f4f6', // Grey background for the gap
        borderTop: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        color: '#9ca3af',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      <div style={{ backgroundColor: '#f3f4f6', padding: '0 10px' }}>
        PAGE BREAK
      </div>
    </div>
  ));

  return (
    <div
      style={{
        maxWidth: `${width * scale}px`,
        height: `${iframeHeight * scale}px`,
      }}
    >
      <div
        style={{
          width: `${width}px`,
          height: `${iframeHeight}px`,
          transform: `scale(${scale})`,
        }}
        className={`origin-top-left shadow-2xl`}
      >
        <Frame
          style={{ width: "100%", height: "100%", border: 'none' }}
          initialContent={iframeInitialContent}
          key={isA4 ? "A4" : "LETTER"}
          ref={iframeRef}
        >
          <div style={{ 
            position: 'relative', 
            backgroundColor: 'white', 
            minHeight: isA4 ? '842pt' : '792pt',
            margin: '0 auto',
            width: isA4 ? '595pt' : '612pt',
          }}>
            {children}
            {pageBreakLines}
          </div>
        </Frame>
      </div>
    </div>
  );
};

/**
 * Load iframe client side since iframe can't be SSR
 */
export default ResumeIframe;

// PDFViewer is only used for debugging. Its size is quite large, so we make it dynamic import
const DynamicPDFViewer = dynamic(
  () => Promise.resolve(({ children, className }: { children: any; className?: string }) => <div className={className || "h-full w-full"}>{children}</div>),
  {
    ssr: false,
  }
);
