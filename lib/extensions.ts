// Catalogue. Pour publier une nouvelle version : déposez le zip dans private-downloads/,
// changez `version` et `file` ci-dessous. Le compteur de téléchargements suit la version.

export type Shot = { src: string; alt: string; caption: string; chrome?: boolean; width?: number; height?: number };

export type Extension = {
  slug: string;
  name: string;
  icon?: string;
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
  features?: string[];
  launch?: string;
  privacy?: string;
  permissions?: string[];
  faq?: { q: string; a: string }[];
  controls?: { key: string; action: string }[];
  cta?: string;
};

export const extensions: Extension[] = [
  {
    slug: "dino-neo",
    name: "Dino Neo",
    icon: "/img/dino/icon.png",
    short: "Turn a connection break into a quick run. Ten characters, special powers and collectible boosts — online or offline.",
    status: "available",
    version: "0.2.0",
    file: "dino-neo-0.2.0.zip",
    downloadName: "dino-neo-0.2.0.zip",
    released: "2026-10-29",
    features: ["10 characters, each with a special power; 5 unlocked from the start", "10 collectible boosts, including shields, a jetpack and double jump", "Day-to-night scenery, sound effects and a saved personal best", "Play from the toolbar, even without an internet connection", "Choose an offline notification, badge, automatic launch or no action"],
    launch: "Pin Dino Neo from the browser’s puzzle icon, then click its icon to open the game in a tab. Press Space or Up to start. The game interface is currently in French.",
    privacy: "Your best score, selected character and sound preference are saved locally, as is your offline-mode setting. Dino Neo temporarily remembers the address of a failed page so it can help you return when the connection is restored. To confirm connectivity it may contact Cloudflare’s connectivity-check endpoint. Your scores and preferences are not sent to a server. There is no account or analytics.",
    permissions: ["webNavigation", "notifications", "storage"],
    cta: "Ready for one quick run?",
    controls: [
      { key: "Space / Up / W", action: "Start, jump or restart after a run" },
      { key: "Down / S", action: "Duck under obstacles" },
      { key: "X / Shift", action: "Use your character’s power when the gauge is ready" },
      { key: "Left / Right / A / D", action: "Choose an unlocked character before a run" },
      { key: "M", action: "Toggle sound" },
      { key: "Enter", action: "Return to the failed page when the connection-restored prompt appears" },
    ],
    faq: [
      { q: "Do I need to be offline to play?", a: "No. Click Dino Neo’s toolbar icon whenever you want a run. Once installed, the game also works without internet." },
      { q: "Which characters are available?", a: "Start with Rex, Cat, Robot, Ghost and Penguin. Unlock Slime at 500 points, Astronaut at 1,000, Ninja at 1,800, Octopus at 3,000 and Dragon at 5,000. Each character has its own power." },
      { q: "How do offline prompts work?", a: "When a web page fails to load, Dino Neo checks whether the connection is actually down. Its options let you choose a notification and badge, a badge only, automatic opening in the affected tab, or no action. The default is a notification; browser or system notification settings may affect it." },
      { q: "Why does it request these permissions?", a: "webNavigation detects failed page loads, notifications offers a game during a connection break, and storage remembers the offline setting and a temporary failed-page address. Scores and game preferences stay in local storage." },
      { q: "What language is the game in?", a: "The game and its options are currently in French. The controls are listed above in English." },
    ],
    shots: [
      { src: "/img/dino/03-night.webp", alt: "Dino Neo’s night scene with the Ghost character, shield and double-jump boosts, crystals and a flying obstacle.", caption: "Night runs: changing scenery, collectible boosts and a rechargeable power.", width: 1800, height: 600 },
      { src: "/img/dino/01-rex.webp", alt: "Dino Neo start screen showing Rex, jump and duck instructions and character selection.", caption: "Start with Rex. Jump, duck and use your character’s special power.", width: 1800, height: 600 },
      { src: "/img/dino/02-robot.webp", alt: "Robot mid-jump in Dino Neo, with rocks, crystals, score and its power gauge.", caption: "A quick run with Robot: dodge obstacles and recharge your power.", width: 1800, height: 600 },
      { src: "/img/dino/04-characters.webp", alt: "Dino Neo character selection showing Penguin and its Blizzard special power.", caption: "Choose your character. Penguin brings Blizzard; five more characters unlock as you improve.", width: 1800, height: 600 },
    ],
  },
  {
    slug: "youtube-session-timer",
    name: "YouTube Session Timer",
    short: "The time you really spend on YouTube and YouTube Music, with limits, history and top lists.",
    status: "available",
    version: "2.0.3",
    file: "yt-session-timer-2.0.3.zip",
    downloadName: "youtube-session-timer-2.0.3.zip",
    released: "2026-10-29",
    features: ["Works on YouTube and YouTube Music", "Daily limit with a gentle reminder", "90 days of history, top channels and videos", "Everything stays in your browser"],
    launch: "Open YouTube. The timer appears in the top bar, next to your profile picture. Pin it from the puzzle icon if you like.",
    privacy: "Watch time, history, settings and limits stay in your browser. The extension has no account, analytics or remote code.",
    permissions: ["storage", "alarms"],
    cta: "Ready to see your real numbers?",
    faq: [
      { q: "What does it track?", a: "Active browsing and playback time on YouTube and YouTube Music, split between videos, Shorts, music and browsing. When detail tracking is enabled, channel names, video titles and artists help build your Top lists. Everything is stored locally." },
      { q: "Can I delete my data?", a: "Yes. Its settings page has Export and Erase buttons. Removing the extension also removes its data." },
    ],
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
