import Image from "next/image";
import type { Shot as ShotT } from "@/lib/extensions";

export function Shot({ shot, priority = false, sizes = "(min-width: 900px) 560px, 100vw" }: { shot: ShotT; priority?: boolean; sizes?: string }) {
  return (
    <figure className="shot">
      <Image src={shot.src} alt={shot.alt} width={shot.width ?? 1280} height={shot.height ?? 800} sizes={sizes} priority={priority} />
      <figcaption>{shot.caption}</figcaption>
    </figure>
  );
}
