import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  // Les zips servis par /download/[slug] vivent dans private-downloads/ (hors de public/, donc
  // impossibles à télécharger sans passer par la route qui compte). On les inclut dans la fonction.
  outputFileTracingIncludes: {
    "/download/[slug]": ["./private-downloads/**/*"],
  },
};

export default config;
