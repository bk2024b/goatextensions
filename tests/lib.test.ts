import { test, before } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import os from "node:os";
import path from "node:path";

type Mods = {
  store: typeof import("../lib/store");
  stats: typeof import("../lib/stats");
  auth: typeof import("../lib/auth");
  bots: typeof import("../lib/bots");
};
let store: Mods["store"], stats: Mods["stats"], auth: Mods["auth"], bots: Mods["bots"];

before(async () => {
  // Le stockage local écrit dans <cwd>/.data : on travaille dans un dossier temporaire.
  process.chdir(mkdtempSync(path.join(os.tmpdir(), "ge-")));
  delete process.env.BLOB_READ_WRITE_TOKEN;
  process.env.ADMIN_PASSWORD = "correct horse battery";
  store = await import("../lib/store");
  stats = await import("../lib/stats");
  auth = await import("../lib/auth");
  bots = await import("../lib/bots");
});

test("pathname round trip", () => {
  const at = new Date("2026-10-29T12:00:00Z");
  const p = store.eventPathname({ slug: "youtube-session-timer", version: "2.0.2", country: "FR", at });
  assert.equal(p, `events/youtube-session-timer/2026-10-29/2.0.2/FR/${at.getTime()}.json`);
  assert.deepEqual(store.parsePathname(p), { slug: "youtube-session-timer", day: "2026-10-29", version: "2.0.2", country: "FR" });
});

test("pathname refuses unsafe input and bad shapes", () => {
  const at = new Date();
  assert.throws(() => store.eventPathname({ slug: "../x", version: "1", country: "FR", at }));
  assert.throws(() => store.eventPathname({ slug: "a", version: "1/2", country: "FR", at }));
  assert.equal(store.eventPathname({ slug: "a", version: "1", country: "fr", at }).includes("/XX/"), true);
  assert.equal(store.parsePathname("events/a/2026-01-01/1/FR"), null);
  assert.equal(store.parsePathname("other/a/2026-01-01/1/FR/1.json"), null);
});

test("local store counts concurrent downloads without losing any", async () => {
  const at = new Date();
  await Promise.all(
    Array.from({ length: 40 }, (_, i) =>
      store.recordDownload({ slug: "youtube-session-timer", version: i % 4 === 0 ? "2.0.1" : "2.0.2", country: i % 2 ? "FR" : "BJ", at }),
    ),
  );
  const events = await store.listEvents();
  assert.equal(events.length, 40);
  const [s] = stats.summarize(events, ["youtube-session-timer"], at);
  assert.equal(s.total, 40);
  assert.equal(s.today, 40);
  assert.equal(s.last7, 40);
  assert.equal(s.byDay.length, 30);
  assert.equal(s.byDay[29].count, 40);
  assert.deepEqual(s.byVersion, [{ version: "2.0.2", count: 30 }, { version: "2.0.1", count: 10 }]);
  assert.deepEqual(s.byCountry.map((c) => c.count), [20, 20]);
});

test("summaries split by day and ignore other slugs", () => {
  const now = new Date("2026-10-29T10:00:00Z");
  const ev = (slug: string, day: string) => ({ slug, day, version: "1.0.0", country: "FR" });
  const [a, b] = stats.summarize(
    [ev("a", "2026-10-29"), ev("a", "2026-10-28"), ev("a", "2026-10-28"), ev("a", "2026-09-01"), ev("b", "2026-10-29")],
    ["a", "b"],
    now,
  );
  assert.equal(a.total, 4);
  assert.equal(a.today, 1);
  assert.equal(a.last7, 3);
  assert.equal(a.last30, 3);
  assert.equal(a.byDay[28].count, 2);
  assert.equal(b.total, 1);
});

test("session cookie: valid, tampered, expired, wrong password", () => {
  const now = Date.now();
  const v = auth.createSessionValue(now);
  assert.equal(auth.verifySessionValue(v, now), true);
  assert.equal(auth.verifySessionValue(v, now + (auth.SESSION_SECONDS + 5) * 1000), false);
  assert.equal(auth.verifySessionValue(v.replace(/.$/, (c) => (c === "a" ? "b" : "a")), now), false);
  assert.equal(auth.verifySessionValue(undefined, now), false);
  assert.equal(auth.verifySessionValue("123.abc", now), false);
  assert.equal(auth.passwordMatches("correct horse battery"), true);
  assert.equal(auth.passwordMatches("nope"), false);
  const old = process.env.ADMIN_PASSWORD;
  process.env.ADMIN_PASSWORD = "short";
  assert.equal(auth.adminConfigured(), false);
  assert.equal(auth.passwordMatches("short"), false);
  process.env.ADMIN_PASSWORD = old;
});

test("bot detection", () => {
  assert.equal(bots.isBot("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36"), false);
  assert.equal(bots.isBot("Googlebot/2.1"), true);
  assert.equal(bots.isBot("curl/8.4.0"), true);
  assert.equal(bots.isBot(null), true);
});
