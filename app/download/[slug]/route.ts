import { readFile } from "node:fs/promises";
import path from "node:path";
import { after, NextResponse, type NextRequest } from "next/server";
import { getExtension } from "@/lib/extensions";
import { recordDownload } from "@/lib/store";
import { isBot } from "@/lib/bots";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ONE_HOUR = 60 * 60;

export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const ext = getExtension(slug);
  if (!ext || ext.status !== "available" || !ext.file || !ext.version) {
    return new NextResponse("Not found", { status: 404 });
  }

  let zip: Buffer;
  try {
    // Le dossier private-downloads n'est pas public : le fichier n'est joignable que par cette route.
    zip = await readFile(path.join(process.cwd(), "private-downloads", ext.file));
  } catch {
    return new NextResponse("File unavailable", { status: 404 });
  }

  const cookieName = `dl_${slug}`;
  const alreadyCounted = req.cookies.get(cookieName)?.value === ext.version;
  const countIt = !alreadyCounted && !isBot(req.headers.get("user-agent"));
  const country = (req.headers.get("x-vercel-ip-country") ?? "XX").toUpperCase();
  const version = ext.version;

  if (countIt) {
    // Après l'envoi de la réponse : un souci de stockage ne bloque jamais le téléchargement.
    after(async () => {
      try {
        await recordDownload({ slug, version, country, at: new Date() });
      } catch (err) {
        console.error("download not recorded", err);
      }
    });
  }

  const res = new NextResponse(new Uint8Array(zip), {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Length": String(zip.length),
      "Content-Disposition": `attachment; filename="${ext.downloadName ?? ext.file}"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
  if (countIt) {
    res.cookies.set(cookieName, version, { maxAge: ONE_HOUR, httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" });
  }
  return res;
}
