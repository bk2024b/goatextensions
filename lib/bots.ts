// Robots et outils qui ne comptent pas comme un téléchargement.
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|curl|wget|python-requests|httpclient|headless|lighthouse|uptime|monitor/i;

export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return true; // pas d'agent utilisateur : ce n'est pas un navigateur
  return BOT.test(userAgent);
}
