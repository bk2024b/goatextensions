import type { Extension } from "@/lib/extensions";

export function DownloadButton({ ext, size = "lg", label }: { ext: Extension; size?: "md" | "lg"; label?: string }) {
  if (ext.status !== "available") return <span className="btn ghost" aria-disabled="true">Coming soon</span>;
  return (
    <a className={`btn primary ${size}`} href={`/download/${ext.slug}`} download>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3v12m0 0l-5-5m5 5l5-5M4 20h16" />
      </svg>
      {label ?? `Download v${ext.version}`}
    </a>
  );
}
