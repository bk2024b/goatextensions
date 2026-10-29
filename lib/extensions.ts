// Catalogue. Pour publier une nouvelle version : déposez le zip dans private-downloads/,
// changez `version` et `file` ci-dessous. Le compteur de téléchargements suit la version.

export type Shot = { src: string; alt: string; caption: string; chrome?: boolean };

export type Extension = {
  slug: string;
  name: string;
  /** Une phrase, utilisée dans le catalogue. */
  short: string;
  status: "available" | "soon";
  version?: string;
  /** Nom du zip dans private-downloads/. */
  file?: string;
  /** Nom proposé au navigateur lors du téléchargement. */
  downloadName?: string;
  released?: string;
  shots?: Shot[];
};

export const extensions: Extension[] = [
  {
    slug: "youtube-session-timer",
    name: "YouTube Session Timer",
    short: "The time you really spend on YouTube and YouTube Music, with limits, history and top lists.",
    status: "available",
    version: "2.0.3",
    file: "yt-session-timer-2.0.3.zip",
    downloadName: "youtube-session-timer-2.0.3.zip",
    released: "2026-10-29",
    shots: [
      { src: "/img/1-today.webp", alt: "YouTube Session Timer open in the YouTube bar, showing 1 hour 13 minutes today split between videos, Shorts, music and browsing, with a daily limit bar and a seven-day chart.", caption: "Today: time by category, daily limit and the last seven days." },
      { src: "/img/2-history.webp", alt: "History tab with stacked bars for 90 days and a dashed average line.", caption: "History: 90 days, stacked by category." },
      { src: "/img/3-top.webp", alt: "Top tab ranking channels and videos by time spent over the last 30 days.", caption: "Top channels, videos and artists." },
      { src: "/img/4-limit-reminder.webp", alt: "A reminder at the bottom left of the page saying the daily limit has been reached.", caption: "The limit reminder, shown inside the page." },
      { src: "/img/5-youtube-music.webp", alt: "The extension panel open on YouTube Music.", caption: "The same panel on YouTube Music." },
      { src: "/img/6-settings.webp", alt: "The settings page with display, tracking, reminder and data options.", caption: "Settings: display, tracking, reminders and data.", chrome: false },
    ],
  },
  {
    slug: "donebell",
    name: "DoneBell",
    short: "Plays a sound when ChatGPT, Claude or Gemini finish answering, so you can leave the tab.",
    status: "soon",
  },
  {
    slug: "ai-usage-tracker",
    name: "AI Usage Tracker",
    short: "Active time and message counts across ChatGPT, Claude, Gemini and Perplexity.",
    status: "soon",
  },
  {
    slug: "random-ask",
    name: "Random Ask for ChatGPT",
    short: "Ask a one-off question in a temporary chat without touching your conversation history.",
    status: "soon",
  },
  {
    slug: "youtube-spaces",
    name: "YouTube Spaces",
    short: "Separate spaces on YouTube, each with its own creators, feed and rules.",
    status: "soon",
  },
  {
    slug: "dino-neo",
    name: "Dino Neo",
    short: "A modern take on the offline dinosaur game, one click from the toolbar.",
    status: "soon",
  },
];

export function getExtension(slug: string): Extension | undefined {
  return extensions.find((e) => e.slug === slug);
}

export const availableExtensions = extensions.filter((e) => e.status === "available");

export const SITE_NAME = "GOAT Extensions";

export function siteUrl(): string {
  const explicit = process.env.SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
