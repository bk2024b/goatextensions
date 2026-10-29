import Image from "next/image";
import Link from "next/link";
import { DONATION_URL } from "@/lib/support";
import { SITE_NAME } from "@/lib/extensions";

export function Header() {
  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <Link href="/" className="brand" aria-label={`${SITE_NAME} home`}>
          <Image src="/logo-sm.png" alt="" width={36} height={36} priority />
          <span>{SITE_NAME}</span>
        </Link>
        <nav aria-label="Main">
          <Link href="/#extensions">Extensions</Link>
          <Link href="/privacy">Privacy</Link>
          <a className="nav-donate" href={DONATION_URL} target="_blank" rel="noopener noreferrer"><span aria-hidden="true">♡</span> Donate</a>
        </nav>
      </div>
    </header>
  );
}
