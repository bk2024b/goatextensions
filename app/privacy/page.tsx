import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/extensions";

export const metadata: Metadata = { title: "Privacy" };

export default function Privacy() {
  const contact = process.env.CONTACT_EMAIL;
  return (
    <article className="wrap prose">
      <h1>Privacy</h1>
      <p className="meta">Last updated 29 October 2026</p>

      <h2>The extensions</h2>
      <p>
        The extensions from {SITE_NAME} keep everything they record, such as watch time, history, settings and
        limits, in your browser using <code>chrome.storage.local</code>. They do not send it anywhere. They have no
        account, no analytics and no remote code. Removing an extension deletes its data, and each one lets you export
        or erase it from its settings page.
      </p>

      <h2>This website</h2>
      <p>
        When you download an extension, we record one anonymous event: which extension, which version, the day, and the
        country your request came from (given by our host, Vercel). We do not store your IP address, your user agent or
        any identifier. We use these events only to count downloads.
      </p>
      <p>
        To avoid counting a repeated click twice, the download sets one cookie that lasts one hour. It holds the version
        you downloaded and nothing else. The site has no advertising and no third-party trackers.
      </p>
      <p>
        The site is hosted on Vercel, which processes standard connection logs to deliver pages. Fonts are served by
        the site itself.
      </p>

      <h2>Your choices</h2>
      <p>You can block the cookie in your browser; the download still works. Because we keep no personal data, there is nothing to look up or delete about you.</p>

      <h2>Contact</h2>
      <p>{contact ? <>Questions: <a href={`mailto:${contact}`}>{contact}</a>.</> : "Questions about this policy can be sent through the contact details published on this site."}</p>
    </article>
  );
}
