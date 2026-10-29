"use client";

import { useId, useRef, useState, type MouseEvent } from "react";
import type { Extension } from "@/lib/extensions";
import { DONATION_URL } from "@/lib/support";

export function DownloadButton({ ext, size = "lg", label }: { ext: Extension; size?: "md" | "lg"; label?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function download(event: MouseEvent<HTMLAnchorElement>) {
    // Preserve open-in-new-tab, modified clicks, and the native no-JavaScript link.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/download/${ext.slug}`);
      if (!response.ok) throw new Error("Download unavailable");
      const file = await response.blob();
      if (!file.size) throw new Error("Empty download");
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = ext.downloadName ?? ext.file ?? `${ext.slug}.zip`;
      document.body.appendChild(link);
      try {
        link.click();
      } finally {
        link.remove();
        // Allow the browser time to consume the file before releasing its URL.
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      }
      // Ask only after receiving the ZIP and starting its save. Donation is optional.
      if (dialog.current && !dialog.current.open) dialog.current.showModal();
    } catch {
      setError("Your download couldn’t start. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (ext.status !== "available") return <span className="btn ghost" aria-disabled="true">Coming soon</span>;
  return (
    <>
      <a className={`btn primary ${size}`} href={`/download/${ext.slug}`} download onClick={download} aria-disabled={busy || undefined} aria-busy={busy}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3v12m0 0l-5-5m5 5l5-5M4 20h16" />
        </svg>
        {busy ? "Preparing download…" : label ?? `Download v${ext.version}`}
      </a>
      {error && <p className="download-error" role="alert">{error}</p>}
      <dialog ref={dialog} className="support-dialog" aria-labelledby={titleId} aria-describedby={descriptionId}>
        <form method="dialog" className="support-close-form">
          <button className="support-close" aria-label="Close support message" autoFocus>×</button>
        </form>
        <div className="support-heart" aria-hidden="true">♡</div>
        <p className="eyebrow">Your download is ready</p>
        <h2 id={titleId}>Keep great tools free.</h2>
        <p id={descriptionId}>I build GOAT Extensions to make your everyday browsing better. If this tool helps you, a small donation supports updates, fixes and new free extensions.</p>
        <a className="btn primary lg" href={DONATION_URL} target="_blank" rel="noopener noreferrer">Support my work <span aria-hidden="true">↗</span></a>
        <form method="dialog"><button className="support-later">Maybe later</button></form>
        <p className="support-note">Completely optional. Your extension is free either way.</p>
      </dialog>
    </>
  );
}
