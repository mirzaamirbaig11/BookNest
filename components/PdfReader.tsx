'use client';

import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfReader({ bookId, isLoggedIn }: { bookId: string; isLoggedIn: boolean }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.1);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [resumeBanner, setResumeBanner] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Load saved progress once on mount.
  useEffect(() => {
    if (!isLoggedIn) return;
    fetch(`/api/reading-progress/${bookId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.progress?.lastPage > 1) setResumeBanner(data.progress.lastPage);
      });
  }, [bookId, isLoggedIn]);

  function saveProgress(page: number, total: number | null) {
    if (!isLoggedIn) return;
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      fetch('/api/reading-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, lastPage: page, totalPages: total }),
      }).catch(() => {});
    }, 800);
  }

  function goToPage(page: number) {
    if (!numPages) return;
    const clamped = Math.min(Math.max(1, page), numPages);
    setPageNumber(clamped);
    saveProgress(clamped, numPages);
  }

  function toggleFullscreen() {
    if (!containerRef.current) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current.requestFullscreen();
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-3 bg-gray-900 p-3 sm:p-6">
      {resumeBanner && (
        <div className="w-full max-w-2xl rounded-lg bg-brand-50 px-4 py-2 text-sm text-brand-700">
          You left off at page {resumeBanner}.{' '}
          <button className="font-semibold underline" onClick={() => { goToPage(resumeBanner); setResumeBanner(null); }}>
            Continue from page {resumeBanner}
          </button>
        </div>
      )}

      <div className="flex w-full max-w-2xl flex-wrap items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 shadow">
        <div className="flex items-center gap-2">
          <button onClick={() => goToPage(pageNumber - 1)} disabled={pageNumber <= 1} className="btn-secondary !px-2 !py-1 text-xs">◀ Prev</button>
          <input
            type="number"
            value={pageNumber}
            min={1}
            max={numPages ?? 1}
            onChange={(e) => goToPage(Number(e.target.value))}
            className="input-field !w-16 !py-1 text-center text-xs"
          />
          <span className="text-xs text-gray-500">/ {numPages ?? '—'}</span>
          <button onClick={() => goToPage(pageNumber + 1)} disabled={!numPages || pageNumber >= numPages} className="btn-secondary !px-2 !py-1 text-xs">Next ▶</button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setScale((s) => Math.max(0.5, s - 0.1))} className="btn-secondary !px-2 !py-1 text-xs">－</button>
          <span className="text-xs text-gray-500">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale((s) => Math.min(2.5, s + 0.1))} className="btn-secondary !px-2 !py-1 text-xs">＋</button>
          <button onClick={toggleFullscreen} className="btn-secondary !px-2 !py-1 text-xs">⛶ Fullscreen</button>
        </div>
      </div>

      <div className="max-h-[75vh] w-full max-w-2xl overflow-auto rounded-lg bg-white shadow">
        {loadError ? (
          <p className="p-6 text-center text-sm text-red-600">{loadError}</p>
        ) : (
          <Document
            file={`/api/books/${bookId}/pdf`}
            onLoadSuccess={({ numPages: n }) => setNumPages(n)}
            onLoadError={() => setLoadError('This book could not be loaded right now. Please try again later.')}
            loading={<p className="p-6 text-center text-sm text-gray-500">Loading book…</p>}
          >
            <Page pageNumber={pageNumber} scale={scale} renderAnnotationLayer renderTextLayer />
          </Document>
        )}
      </div>

      <p className="max-w-2xl text-center text-xs text-gray-400">
        This viewer is for reading within BookNest and is not a substitute for full copy protection.
      </p>
    </div>
  );
}
