"use client";

import { useEffect, useMemo, useRef } from "react";
import * as pdfjs from "pdfjs-dist";
// @ts-ignore
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { PX_PER_PT } from "lib/constants";

(pdfjs as any).GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const ResumePdfPreview = ({
  pdfUrl,
  scale,
  error,
}: {
  pdfUrl: string | null;
  scale: number;
  error?: string | null;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const baseScale = useMemo(() => scale * PX_PER_PT, [scale]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const el = containerRef.current;
      if (!el) return;
      el.innerHTML = "";

      if (error) {
        el.innerHTML = `<div style='padding:24px;color:#b91c1c;font-size:14px'>${error}</div>`;
        return;
      }

      if (!pdfUrl) {
        el.innerHTML =
          "<div style='padding:24px;color:#6b7280;font-size:14px'>Generating preview…</div>";
        return;
      }

      try {
        const loadingTask = (pdfjs as any).getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          if (cancelled) return;

          const viewport = page.getViewport({ scale: baseScale });

          const pageWrapper = document.createElement("div");
          pageWrapper.style.background = "white";
          pageWrapper.style.margin = "0 auto 24px auto";
          pageWrapper.style.boxShadow =
            "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)";
          pageWrapper.style.width = `${viewport.width}px`;
          pageWrapper.style.height = `${viewport.height}px`;

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Canvas 2D context not available");

          // Render at devicePixelRatio for crisp text
          const dpr = window.devicePixelRatio || 1;
          canvas.width = Math.floor(viewport.width * dpr);
          canvas.height = Math.floor(viewport.height * dpr);
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;

          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

          pageWrapper.appendChild(canvas);
          el.appendChild(pageWrapper);

          const renderTask = page.render({
            canvasContext: ctx,
            viewport,
          });
          await renderTask.promise;
          if (cancelled) return;
        }
      } catch (e) {
        if (cancelled) return;
        el.innerHTML =
          "<div style='padding:24px;color:#b91c1c;font-size:14px'>Failed to render PDF preview.</div>";
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [pdfUrl, baseScale, error]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        padding: "16px 0",
        backgroundColor: "#f3f4f6",
      }}
    />
  );
};

