import type { Metadata } from "next";
import { cookies } from "next/headers";
import { COOKIE_NAME, adminConfigured, verifySessionValue } from "@/lib/auth";
import { availableExtensions, getExtension } from "@/lib/extensions";
import { loadStats } from "@/lib/stats";
import { BarChart } from "@/components/BarChart";
import { login, logout } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const nf = new Intl.NumberFormat("en");

export default async function Admin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  if (!adminConfigured()) {
    return (
      <section className="wrap prose">
        <h1>Admin</h1>
        <p>Set an <code>ADMIN_PASSWORD</code> environment variable (at least 8 characters) in Vercel, then redeploy.</p>
      </section>
    );
  }

  const authed = verifySessionValue((await cookies()).get(COOKIE_NAME)?.value);
  if (!authed) {
    return (
      <section className="wrap prose narrow-form">
        <h1>Admin</h1>
        <form action={login} className="login">
          <label htmlFor="pw">Password</label>
          <input id="pw" name="password" type="password" autoComplete="current-password" required autoFocus />
          {error && <p className="err" role="alert">Wrong password.</p>}
          <button className="btn primary" type="submit">Sign in</button>
        </form>
      </section>
    );
  }

  const stats = await loadStats(availableExtensions.map((e) => e.slug));
  return (
    <section className="wrap admin">
      <div className="admin-head">
        <h1>Downloads</h1>
        <form action={logout}><button className="btn ghost" type="submit">Sign out</button></form>
      </div>
      <p className="meta">
        Storage: <span className={`tag ${stats.storage === "blob" ? "available" : "soon"}`}>{stats.storage === "blob" ? "Vercel Blob" : "Local files (not production)"}</span>
        {" "}· Updated {new Date(stats.generatedAt).toUTCString()}
      </p>

      {stats.summaries.map((s) => (
        <div key={s.slug} className="panel">
          <h2>{getExtension(s.slug)?.name ?? s.slug}</h2>
          <div className="kpis">
            <div><b>{nf.format(s.total)}</b><span>All time</span></div>
            <div><b>{nf.format(s.today)}</b><span>Today (UTC)</span></div>
            <div><b>{nf.format(s.last7)}</b><span>Last 7 days</span></div>
            <div><b>{nf.format(s.last30)}</b><span>Last 30 days</span></div>
          </div>
          <BarChart data={s.byDay} />
          <div className="two">
            <table>
              <caption>By version</caption>
              <tbody>{s.byVersion.length ? s.byVersion.map((v) => <tr key={v.version}><th scope="row">v{v.version}</th><td>{nf.format(v.count)}</td></tr>) : <tr><td colSpan={2}>No downloads yet</td></tr>}</tbody>
            </table>
            <table>
              <caption>By country</caption>
              <tbody>{s.byCountry.length ? s.byCountry.slice(0, 15).map((c) => <tr key={c.country}><th scope="row">{c.country === "XX" ? "Unknown" : c.country}</th><td>{nf.format(c.count)}</td></tr>) : <tr><td colSpan={2}>No downloads yet</td></tr>}</tbody>
            </table>
          </div>
        </div>
      ))}
    </section>
  );
}
