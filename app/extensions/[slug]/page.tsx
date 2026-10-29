import type { Metadata } from "next";
import Image from "next/image";
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
  { q: "How do I update?", a: "Download the new version, replace the folder you unzipped, then press the reload icon on the extension in chrome://extensions. Keep the same folder path to retain locally saved data." },
  { q: "Which browsers work?", a: "Chrome and other Chromium browsers such as Edge, Brave and Opera." },
];

export default async function ExtensionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ext = getExtension(slug);
  if (!ext || ext.status !== "available" || !ext.shots) notFound();
  const [hero, ...rest] = ext.shots;
  const productFaq = [...faq, ...(ext.faq ?? [])];

  return (
    <>
      <section className="wrap product-hero">
        <div>
          <p className="eyebrow"><Link href="/#extensions">Extensions</Link> / {ext.name}</p>
          <div className="product-title">{ext.icon && <Image src={ext.icon} alt="" width={64} height={64} />}<h1>{ext.name}</h1></div>
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
          <li><b>Download</b> the zip with the button above, then unzip it into a permanent folder.</li>
          <li>Open <code>chrome://extensions</code> in Chrome and switch on <b>Developer mode</b> (top right).</li>
          <li>Click <b>Load unpacked</b> and choose the extracted folder containing <code>manifest.json</code>.</li>
          <li>{ext.launch}</li>
        </ol>
        <p className="note">Keep the folder where it is: Chrome reads the extension from it.</p>
      </section>

      <section className="wrap" aria-labelledby="features">
        <h2 id="features">What you get</h2>
        <ul className="ticks">{ext.features?.map((feature) => <li key={feature}>{feature}</li>)}</ul>
        <div className="shots">
          {rest.map((s) => <Shot key={s.src} shot={s} />)}
        </div>
      </section>

      <section className="wrap" aria-labelledby="privacy-h">
        <h2 id="privacy-h">Privacy</h2>
        <p className="lead narrow">
          {ext.privacy} Read the <Link href="/privacy">full policy</Link>.
        </p>
      </section>

      {ext.controls && (
        <section className="wrap" aria-labelledby="controls">
          <h2 id="controls">How to play</h2>
          <div className="controls-table"><table>
            <caption>Dino Neo keyboard controls. The in-game interface is in French.</caption>
            <thead><tr><th scope="col">Key</th><th scope="col">Action</th></tr></thead>
            <tbody>{ext.controls.map((control) => <tr key={control.key}><th scope="row"><kbd>{control.key}</kbd></th><td>{control.action}</td></tr>)}</tbody>
          </table></div>
        </section>
      )}

      <section className="wrap" aria-labelledby="faq">
        <h2 id="faq">Questions</h2>
        <div className="faq">
          {productFaq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="wrap cta">
        <h2>{ext.cta ?? "Ready to get started?"}</h2>
        <DownloadButton ext={ext} />
      </section>
    </>
  );
}
