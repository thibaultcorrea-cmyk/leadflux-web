import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sortie standalone : necessaire pour l'image Docker (Dockerfile a la
  // racine), qui ne copie que .next/standalone plutot que node_modules
  // en entier.
  reactStrictMode: false,
  output: "standalone",
};

export default nextConfig;
