"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { CoverLetterPDF } from "components/CoverLetter/CoverLetterPDF";
import {
  CoverLetterControlBarBorder,
} from "components/CoverLetter/CoverLetterControlBar";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { useAppSelector } from "lib/redux/hooks";
import { selectCoverLetter } from "lib/redux/coverLetterSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import { DEBUG_RESUME_PDF_FLAG } from "lib/constants";
import { NonEnglishFontsCSSLazyLoader } from "components/fonts/NonEnglishFontsCSSLoader";
import { usePDF } from "@react-pdf/renderer";
import { PDFDocument } from "pdf-lib";
import { loadStateFromLocalStorage } from "lib/redux/local-storage";
import { CoverLetterPdfPreview } from "components/CoverLetter/CoverLetterPdfPreview";

const CoverLetterControlBarCSR = dynamic(
  () => import("components/CoverLetter/CoverLetterControlBar"),
  { ssr: false }
);

export const CoverLetter = () => {
  const [scale, setScale] = useState(0.8);
  const coverLetter = useAppSelector(selectCoverLetter);
  const settings = useAppSelector(selectSettings);
  const document = useMemo(
    () => <CoverLetterPDF coverLetter={coverLetter} settings={settings} isPDF={true} />,
    [coverLetter, settings]
  );

  const [instance, update] = usePDF({ document });
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const lastGeneratedUrlRef = useRef<string | null>(null);
  const [isPostProcessing, setIsPostProcessing] = useState(false);

  useEffect(() => {
    // Clear stale URL so preview doesn’t look “stuck” while generating
    setDownloadUrl(null);
    update(document);
  }, [update, document]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!instance.url) return;
      setIsPostProcessing(true);

      try {
        const res = await fetch(instance.url);
        const bytes = await res.arrayBuffer();
        const pdfDoc = await PDFDocument.load(bytes);

        const stateData = loadStateFromLocalStorage();
        if (!stateData) {
          if (!cancelled) setDownloadUrl(instance.url);
          return;
        }

        const json = JSON.stringify(stateData);
        const attachmentName = "cv-maker-state.json";
        const subject =
          json.length <= 50000
            ? json
            : JSON.stringify({
                cvMaker: true,
                version: 1,
                attachment: attachmentName,
              });

        pdfDoc.setSubject(subject);
        pdfDoc.setCreator("cv---maker");
        pdfDoc.setKeywords(["resume", "cv", "cv---maker", "json-data", "cover-letter"]);

        if (typeof (pdfDoc as any).attach === "function") {
          const jsonBytes = new TextEncoder().encode(json);
          (pdfDoc as any).attach(jsonBytes, attachmentName, {
            mimeType: "application/json",
            description: "cv---maker state",
          });
        }

        const out = await pdfDoc.save();
        const blob = new Blob([out], { type: "application/pdf" });
        const objectUrl = URL.createObjectURL(blob);

        if (!cancelled) {
          const prev = lastGeneratedUrlRef.current;
          if (prev && prev.startsWith("blob:") && prev !== instance.url) {
            URL.revokeObjectURL(prev);
          }
          lastGeneratedUrlRef.current = objectUrl;
          setDownloadUrl(objectUrl);
        }
      } catch {
        if (!cancelled) setDownloadUrl(instance.url);
      } finally {
        if (!cancelled) setIsPostProcessing(false);
      }
    };

    run();

    return () => {
      cancelled = true;
      const prev = lastGeneratedUrlRef.current;
      if (prev && prev.startsWith("blob:") && prev !== instance.url) {
        URL.revokeObjectURL(prev);
      }
      lastGeneratedUrlRef.current = null;
      setIsPostProcessing(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance.url]);

  const isGenerating = instance.loading || isPostProcessing || !downloadUrl;

  return (
    <>
      <NonEnglishFontsCSSLazyLoader />
      <div className="relative flex justify-center md:justify-start">
        <FlexboxSpacer maxWidth={50} className="hidden md:block" />
        <div className="relative">
          <section className="h-[calc(100vh-var(--top-nav-bar-height)-var(--resume-control-bar-height))] overflow-auto md:p-[var(--resume-padding)]">
            {/* 1:1 preview based on generated PDF */}
            <CoverLetterPdfPreview pdfUrl={downloadUrl || instance.url || null} scale={scale} />
          </section>
          <CoverLetterControlBarCSR
            key={settings.coverLetterTheme}
            scale={scale}
            setScale={setScale}
            documentSize={settings.documentSize}
            downloadUrl={downloadUrl || instance.url || null}
            isGenerating={isGenerating}
            fileName={coverLetter.profile.name + " - Cover Letter"}
          />
        </div>
        <CoverLetterControlBarBorder />
      </div>
    </>
  );
};
