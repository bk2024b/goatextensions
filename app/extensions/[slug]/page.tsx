import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { availableExtensions, getExtension } from "@/lib/extensions";
import { DownloadButton } from "@/components/DownloadButton";
import { Shot } from "@/components/Shot";

export const dynamicParams = false;

export function generateStaticParams() {
  return availableExtensions.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ext = getExtension(slug);
  if (!ext) return {};
  return { title: ext.name, description: ext.short, openGraph: { title: ext.name, description: ext.short } };
}

const faq = [
  { q: "Is it really free?", a: "Yes. Download the file and use it. There is no account, no trial and no price." },
  { q: "Why not install it from the Chrome Web Store?", a: "It is not published there yet. Until it is, you load it yourself in a minute with the steps above. Chrome may show a reminder about developer-mode extensions at startup; that is normal for this kind of install." },
  { q: "What does it track?", a: "The time the YouTube or YouTube Music tab is visible and playing, and the title and channel of what you watch, so it can build the Top lists. All of it is stored in your browser." },
  { q: "Can I delete my data?", a: "Yes. The settings page has Export and Erase buttons. Removing the extension also removes everything." },
  { q: "How do I update?", a: "Download the new version, replace the folder you unzipped, then press the reload icon on the extension in chrome://extensions. Your stats are kept." },
  { q: "Which browsers work?", a: "Chrome and other Chromium browsers such as Edge, Brave and Opera." },
];

export default async function ExtensionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ext = getExtension(slug);
  if (!ext || ext.status !== "available" || !ext.shots) notFound();
  const [hero, ...rest] = ext.shots;

  return (
    <>
      <section className="wrap product-hero">
        <div>
          <p className="eyebrow"><Link href="/#extensions">Extensions</Link> / {ext.name}</p>
          <h1>{ext.name}</h1>
          <p className="lead">{ext.short}</p>
          <div className="row">
            <DownloadButton ext={ext} />
          </div>
          <p className="meta">Version {ext.version} · Released {ext.released} · Free · Chrome and Chromium browsers</p>
        </div>
        <Shot shot={hero} priority />
      </section>

      <section className="wrap" aria-labelledby="install">
        <h2 id="install">Install in one minute</h2>
        <ol className="steps">
          <li><b>Download</b> the zip with the button above, then unzip it. You get a folder named <code>youtube-session-timer</code>.</li>
          <li>Open <code>chrome://extensions</code> in Chrome and switch on <b>Developer mode</b> (top right).</li>
          <li>Click <b>Load unpacked</b> and choose the <code>youtube-session-timer</code> folder.</li>
          <li>Open YouTube. The timer appears in the top bar, next to your profile picture. Pin it from the puzzle icon if you like.</li>
        </ol>
        <p className="note">Keep the folder where it is: Chrome reads the extension from it.</p>
      </section>

      <section className="wrap" aria-labelledby="features">
        <h2 id="features">What you get</h2>
        <div className="shots">
          {rest.map((s) => <Shot key={s.src} shot={s} />)}
        </div>
      </section>

      <section className="wrap" aria-labelledby="privacy-h">
        <h2 id="privacy-h">Privacy</h2>
        <p className="lead narrow">
          Everything the extension records stays in your browser. It has no server, no account and no analytics.
          The only permissions are <code>storage</code> and <code>alarms</code>, plus access to YouTube and YouTube Music pages.
          Read the <Link href="/privacy">full policy</Link>.
        </p>
      </section>

      <section className="wrap" aria-labelledby="faq">
        <h2 id="faq">Questions</h2>
        <div className="faq">
          {faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="wrap cta">
        <h2>Ready to see your real numbers?</h2>
        <DownloadButton ext={ext} />
      </section>
    </>
  );
}
