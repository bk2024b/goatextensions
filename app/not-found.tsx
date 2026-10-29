import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap prose center">
      <h1>Page not found</h1>
      <p>This page does not exist, or has moved.</p>
      <p><Link className="btn primary" href="/">Back home</Link></p>
    </section>
  );
}
