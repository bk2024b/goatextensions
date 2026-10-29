# GOAT Extensions

Site Next.js 15 (App Router) pour présenter et distribuer les extensions Chrome, avec un compteur de téléchargements stocké dans Vercel Blob.

## Déployer sur Vercel

1. Poussez ce dossier sur GitHub, puis **Add New → Project** sur Vercel et importez le dépôt.
2. Dans le projet : **Storage → Create → Blob**, puis connectez le store au projet. Vercel ajoute `BLOB_READ_WRITE_TOKEN` tout seul.
   - Si Vercel vous propose un store *privé*, ajoutez aussi la variable `BLOB_ACCESS=private`.
3. **Settings → Environment Variables** : ajoutez `ADMIN_PASSWORD` (8 caractères minimum). Optionnel : `SITE_URL` (domaine final) et `CONTACT_EMAIL` (affiché dans la page Privacy).
4. Déployez. Les chiffres sont sur `/admin`.

## Comment les téléchargements sont comptés

- Le zip n'est **pas** dans `public/` : il est dans `private-downloads/` et servi par `/download/<extension>`. Chaque téléchargement passe donc par le compteur.
- Un téléchargement = un petit fichier Blob `events/<extension>/<jour UTC>/<version>/<pays>/<horodatage>.json`. On compte en listant les chemins : deux téléchargements simultanés ne s'écrasent jamais.
- Non comptés : les robots (User-Agent), les requêtes HEAD et un nouveau clic dans l'heure (cookie `dl_<extension>`).
- Rien de personnel n'est stocké : ni IP, ni User-Agent. Le pays vient de l'en-tête `x-vercel-ip-country`.

## Publier une nouvelle version

1. Déposez `youtube-session-timer-2.1.0.zip` dans `private-downloads/` (dossier racine du zip : `youtube-session-timer/`).
2. Dans `lib/extensions.ts`, changez `version`, `file` et `downloadName`.
3. Redéployez. L'historique reste, ventilé par version.

## Local

```bash
npm install
cp .env.example .env.local   # ADMIN_PASSWORD=...
npm run dev                  # sans jeton Blob, les événements vont dans .data/
npm test                     # tests du compteur, des statistiques et de la connexion
```

Remarque : un projet Vercel gratuit limite la taille des fonctions ; le zip (quelques centaines de Ko) est inclus via `outputFileTracingIncludes` dans `next.config.ts`.
