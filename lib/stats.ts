import { listEvents, dayKey, storageMode, type ParsedEvent } from "./store";

export type DayCount = { day: string; count: number };
export type Summary = {
  slug: string;
  total: number;
  today: number;
  last7: number;
  last30: number;
  /** 30 derniers jours, du plus ancien à aujourd'hui, jours vides inclus. */
  byDay: DayCount[];
  byVersion: { version: string; count: number }[];
  byCountry: { country: string; count: number }[];
};

export type Stats = {
  generatedAt: string;
  storage: "blob" | "local";
  summaries: Summary[];
};

const DAY_MS = 86_400_000;

function lastDays(n: number, now: Date): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) days.push(dayKey(new Date(now.getTime() - i * DAY_MS)));
  return days;
}

function ranked<K extends string>(counts: Map<string, number>, key: K) {
  return Array.from(counts, ([value, count]) => ({ [key]: value, count }) as Record<K, string> & { count: number })
    .sort((a, b) => b.count - a.count || String(a[key]).localeCompare(String(b[key])));
}

/** Calcule les chiffres d'une liste d'événements. Fonction pure : testable sans stockage. */
export function summarize(events: ParsedEvent[], slugs: string[], now: Date = new Date()): Summary[] {
  const days30 = lastDays(30, now);
  const days7 = new Set(days30.slice(-7));
  const today = dayKey(now);

  return slugs.map((slug) => {
    const mine = events.filter((e) => e.slug === slug);
    const perDay = new Map<string, number>();
    const versions = new Map<string, number>();
    const countries = new Map<string, number>();
    for (const e of mine) {
      perDay.set(e.day, (perDay.get(e.day) ?? 0) + 1);
      versions.set(e.version, (versions.get(e.version) ?? 0) + 1);
      countries.set(e.country, (countries.get(e.country) ?? 0) + 1);
    }
    const byDay = days30.map((day) => ({ day, count: perDay.get(day) ?? 0 }));
    return {
      slug,
      total: mine.length,
      today: perDay.get(today) ?? 0,
      last7: byDay.filter((d) => days7.has(d.day)).reduce((a, d) => a + d.count, 0),
      last30: byDay.reduce((a, d) => a + d.count, 0),
      byDay,
      byVersion: ranked(versions, "version"),
      byCountry: ranked(countries, "country"),
    };
  });
}

export async function loadStats(slugs: string[]): Promise<Stats> {
  const events = await listEvents();
  return { generatedAt: new Date().toISOString(), storage: storageMode(), summaries: summarize(events, slugs) };
}
