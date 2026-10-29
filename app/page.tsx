import Image from "next/image";
import Link from "next/link";
import { extensions, availableExtensions, SITE_NAME } from "@/lib/extensions";
import { DownloadButton } from "@/components/DownloadButton";
import { LiveTimer } from "@/components/LiveTimer";
import { Shot } from "@/components/Shot";

export default function Home() {
  const featured = availableExtensions[0];
  return (
    <>
      <section className="hero">
        <div className="wrap hero-in">
          <Image className="hero-logo" src="/logo.png" alt={`${SITE_NAME} logo: a goat wearing sunglasses`} width={320} height={320} priority />
          <div>
            <p className="eyebrow">Chrome extensions</p>
            <h1>Small tools. Better browsing.</h1>
            <p className="lead">
              {SITE_NAME} makes focused browser tools and games. They run on your device, ask for as little as possible,
              and are free to download.
            </p>
            <div className="row">
              <DownloadButton ext={featured} label="Download my latest extension" />
              <Link className="btn ghost lg" href={`/extensions/${featured.slug}`}>See how it works</Link>
            </div>
          </div>
        </div>
      </section>

      {availableExtensions.map((extension, index) => (
        <section className="wrap feature" aria-labelledby={`feature-${extension.slug}`} key={extension.slug}>
          <div>
            <p className="eyebrow">{index === 0 ? "Latest release" : "Available now"} {extension.slug === "youtube-session-timer" && <LiveTimer />}</p>
            <h2 id={`feature-${extension.slug}`}>{extension.name}</h2>
            <p className="lead">{extension.short}</p>
            <ul className="ticks">{extension.features?.slice(0, 4).map((feature) => <li key={feature}>{feature}</li>)}</ul>
            <div className="row">
              <DownloadButton ext={extension} />
              <Link className="btn ghost lg" href={`/extensions/${extension.slug}`}>Details</Link>
            </div>
          </div>
          {extension.shots && <Shot shot={extension.shots[0]} sizes="(min-width: 900px) 600px, 100vw" />}
        </section>
      ))}

      <section id="extensions" className="wrap" aria-labelledby="c-title">
        <h2 id="c-title">All extensions</h2>
        <ul className="catalog">
          {extensions.map((e) => (
            <li key={e.slug}>
              <div>
                <h3>{e.status === "available" ? <Link href={`/extensions/${e.slug}`}>{e.name}</Link> : e.name}</h3>
                <p>{e.short}</p>
              </div>
              <span className={`tag ${e.status}`}>{e.status === "available" ? `v${e.version}` : "Coming soon"}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap principles" aria-labelledby="p-title">
        <h2 id="p-title">How we build</h2>
        <div className="cols">
          <div><h3>Your data stays yours</h3><p>Scores, stats and settings stay in your browser. Each product page explains its permissions and network activity.</p></div>
          <div><h3>Only what is needed</h3><p>Each extension asks for the few permissions its job requires, and no more.</p></div>
          <div><h3>Free, no account</h3><p>Download the file, load it in Chrome, done. No sign-up and no price.</p></div>
        </div>
      </section>
    </>
  );
}
