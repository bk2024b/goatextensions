import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/extensions";

export const metadata: Metadata = { title: "Privacy" };

export default function Privacy() {
  const contact = process.env.CONTACT_EMAIL;
  return (
    <article className="wrap prose">
      <h1>Privacy</h1>
      <p className="meta">Last updated 29 October 2026</p>

      <h2>YouTube Session Timer</h2>
      <p>Watch time, history, details, limits and settings stay in your browser using <code>chrome.storage.local</code>. There is no account, analytics or remote code. Its settings let you export or erase your data.</p>

      <h2>Dino Neo</h2>
      <p>Your best score, character choice and sound preference stay in the game’s local storage. The offline-mode preference is saved with <code>chrome.storage.local</code>. When a page fails to load, the extension temporarily stores its URL in session storage so it can help you return after a connection break.</p>
      <p>The <code>webNavigation</code> permission detects failed navigation, <code>notifications</code> provides optional offline game prompts, and <code>storage</code> saves preferences and the temporary page address. You can select notification, badge, automatic launch or no action in the extension’s options.</p>
      <p>To check connectivity, Dino Neo may request <code>https://cp.cloudflare.com/generate_204</code>. This is a network check, not game analytics; it does not include your score, preferences or failed-page address. The endpoint receives the usual network connection information needed to answer the request.</p>
      <p>Neither extension requires an account. Removing an extension removes its locally stored data.</p>

      <h2>This website</h2>
      <p>
        When you download an extension, we record one anonymous event: which extension, which version, the day, and the
        country your request came from (given by our host, Vercel). We do not store your IP address, your user agent or
        any identifier. We use these events only to count downloads.
      </p>
      <p>
        To avoid counting a repeated click twice, the download sets one cookie that lasts one hour. It holds the version
        you downloaded and nothing else. The site has no advertising.
      </p>
      <p>We use Vercel Web Analytics to measure website visits, page views, referral sources and general device and country information. It does not use cookies for analytics or track visitors across websites. This applies to this website only; the extensions do not include analytics.</p>
      <p>
        The site is hosted on Vercel, which processes standard connection logs to deliver pages. Fonts are served by
        the site itself.
      </p>

      <h2>Optional donations</h2>
      <p>Support links open a separate Chariow page. Donations are optional and do not unlock or restrict an extension. Chariow and its payment providers handle any information you enter there under their own policies; this website does not process your payment details.</p>

      <h2>Your choices</h2>
      <p>You can block the cookie in your browser; the download still works. Because we keep no personal data, there is nothing to look up or delete about you.</p>

      <h2>Contact</h2>
      <p>{contact ? <>Questions: <a href={`mailto:${contact}`}>{contact}</a>.</> : "Questions about this policy can be sent through the contact details published on this site."}</p>
    </article>
  );
}
