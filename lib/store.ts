// Stockage des téléchargements.
//
// Un téléchargement = un petit fichier (un « événement ») dont le CHEMIN contient tout :
//   events/<slug>/<jour UTC>/<version>/<pays>/<horodatage>.json
// Écrire un nouveau fichier par téléchargement évite toute collision quand deux personnes
// téléchargent en même temps (un compteur unique lu puis réécrit perdrait des comptes).
// On compte ensuite en listant les chemins, sans jamais relire leur contenu.
//
// En production : Vercel Blob (variable BLOB_READ_WRITE_TOKEN).
// En local, sans jeton : fichiers dans .data/ pour pouvoir tout tester.

import { promises as fs } from "node:fs";
import path from "node:path";

export type DownloadEvent = {
  slug: string;
  version: string;
  /** Code pays ISO à deux lettres, ou "XX" si inconnu. */
  country: string;
  at: Date;
};

export type ParsedEvent = { slug: string; day: string; version: string; country: string };

const SAFE = /^[A-Za-z0-9._-]+$/;
const LOCAL_ROOT = path.join(process.cwd(), ".data");

export function storageMode(): "blob" | "local" {
  return process.env.BLOB_READ_WRITE_TOKEN ? "blob" : "local";
}

export function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10); // jour UTC
}

export function eventPathname(e: DownloadEvent): string {
  if (!SAFE.test(e.slug) || !SAFE.test(e.version)) throw new Error("invalid slug or version");
  const country = /^[A-Z]{2}$/.test(e.country) ? e.country : "XX";
  return `events/${e.slug}/${dayKey(e.at)}/${e.version}/${country}/${e.at.getTime()}.json`;
}

/** Retourne null si le chemin n'a pas la forme attendue. */
export function parsePathname(p: string): ParsedEvent | null {
  const parts = p.split("/");
  if (parts.length !== 6 || parts[0] !== "events") return null;
  const [, slug, day, version, country] = parts;
  if (!SAFE.test(slug) || !/^\d{4}-\d{2}-\d{2}$/.test(day) || !SAFE.test(version) || !/^[A-Z]{2}$/.test(country)) return null;
  return { slug, day, version, country };
}

export async function recordDownload(e: DownloadEvent): Promise<void> {
  const pathname = eventPathname(e);
  const body = JSON.stringify({ t: e.at.getTime() });

  if (storageMode() === "blob") {
    const { put } = await import("@vercel/blob");
    await put(pathname, body, {
      access: (process.env.BLOB_ACCESS === "private" ? "private" : "public") as "public",
      addRandomSuffix: true, // deux téléchargements dans la même milliseconde ne s'écrasent pas
      contentType: "application/json",
    });
    return;
  }

  // Hors Vercel seulement : le disque y est en lecture seule.
  const unique = pathname.replace(/\.json$/, `-${Math.random().toString(36).slice(2, 8)}.json`);
  const file = path.join(LOCAL_ROOT, unique);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, body);
}

/** Tous les chemins d'événements, parsés. Les chemins inattendus sont ignorés. */
export async function listEvents(): Promise<ParsedEvent[]> {
  const out: ParsedEvent[] = [];
  const add = (p: string) => {
    const parsed = parsePathname(p);
    if (parsed) out.push(parsed);
  };

  if (storageMode() === "blob") {
    const { list } = await import("@vercel/blob");
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: "events/", cursor, limit: 1000 });
      for (const b of page.blobs) {
        // Avec addRandomSuffix, le nom devient <horodatage>-<suffixe>.json : on le remet au format attendu.
        const segs = b.pathname.split("/");
        if (segs.length === 6) segs[5] = segs[5].replace(/-[^.]*\.json$/, ".json");
        add(segs.join("/"));
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return out;
  }

  const walk = async (dir: string, rel: string[]): Promise<void> => {
    let entries: import("node:fs").Dirent[];
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.isDirectory()) await walk(path.join(dir, entry.name), [...rel, entry.name]);
      else {
        const segs = [...rel, entry.name.replace(/-[^.]*\.json$/, ".json")];
        add(segs.join("/"));
      }
    }
  };
  await walk(path.join(LOCAL_ROOT, "events"), ["events"]);
  return out;
}
