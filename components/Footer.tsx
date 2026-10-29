import Link from "next/link";
import { SITE_NAME } from "@/lib/extensions";

export function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <p>© {new Date().getFullYear()} {SITE_NAME}. Free to download, nothing to sign up for.</p>
        <p className="fine">
          YouTube, YouTube Music, ChatGPT, Claude, Gemini and Chrome are trademarks of their respective owners.
          These extensions are independent and are not affiliated with or endorsed by them.
        </p>
        <p><Link href="/privacy">Privacy</Link></p>
      </div>
    </footer>
  );
}
