// Si publicas en usuario.github.io/NOMBRE-DEL-REPO (sin dominio propio),
// define NEXT_PUBLIC_BASE_PATH=/NOMBRE-DEL-REPO al hacer build.
// Con dominio propio (o un repo <org>.github.io) déjalo vacío.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',           // exporta sitio 100% estático (compatible con GitHub Pages)
  images: { unoptimized: true }, // next/image no puede optimizar en runtime sin servidor
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
};

module.exports = nextConfig;
