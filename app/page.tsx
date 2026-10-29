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
            <h1>Small tools that give you your time back.</h1>
            <p className="lead">
              {SITE_NAME} makes focused browser extensions. They run on your device, ask for as little as possible,
              and are free to download.
            </p>
            <div className="row">
              <DownloadButton ext={featured} label="Download my latest extension" />
              <Link className="btn ghost lg" href={`/extensions/${featured.slug}`}>See how it works</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap feature" aria-labelledby="f-title">
        <div>
          <p className="eyebrow">Available now <LiveTimer /></p>
          <h2 id="f-title">{featured.name}</h2>
          <p className="lead">{featured.short}</p>
          <ul className="ticks">
            <li>Works on YouTube and YouTube Music</li>
            <li>Daily limit with a gentle reminder</li>
            <li>90 days of history, top channels and videos</li>
            <li>Everything stays in your browser</li>
          </ul>
          <div className="row">
            <DownloadButton ext={featured} />
            <Link className="btn ghost lg" href={`/extensions/${featured.slug}`}>Details</Link>
          </div>
        </div>
        {featured.shots && <Shot shot={featured.shots[0]} sizes="(min-width: 900px) 600px, 100vw" />}
      </section>

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
          <div><h3>Your data stays yours</h3><p>Stats and settings live in your browser. Nothing is sent to a server.</p></div>
          <div><h3>Only what is needed</h3><p>Each extension asks for the few permissions its job requires, and no more.</p></div>
          <div><h3>Free, no account</h3><p>Download the file, load it in Chrome, done. No sign-up and no price.</p></div>
        </div>
      </section>
    </>
  );
}
