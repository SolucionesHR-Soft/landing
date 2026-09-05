# HRD Soluciones HR — Landing

Next.js estático + Supabase. Diseño "plano técnico": fondo grafito, secciones
en papel claro, tipografía Newsreader (títulos) + IBM Plex Mono (etiquetas) +
IBM Plex Sans (cuerpo).

## Estructura
```
pages/            index.js, _app.js, _document.js
components/       Header, Hero, SolucionesSection, ProductosSection,
                   ReposSection, ContactForm, Footer
lib/               cliente de Supabase
styles/            globals.css (sistema de diseño)
supabase/
  schema.sql                       tablas + RLS
  functions/notify-telegram/       Edge Function (avisa por Telegram)
```

## 1. Supabase

1. Crear proyecto en supabase.com (plan free).
2. SQL Editor -> pegar y ejecutar `supabase/schema.sql`.
3. Project Settings > API -> copiar `Project URL` y `anon public key`.
4. Crear un bot de Telegram con **@BotFather**, guardar el token.
   Obtener el `chat_id` del canal/chat donde quieres los avisos
   (por ejemplo escribiéndole al bot y consultando
   `https://api.telegram.org/bot<token>/getUpdates`).
5. Instalar Supabase CLI y desplegar la función:
   ```
   supabase login
   supabase link --project-ref TU_PROJECT_REF
   supabase secrets set TELEGRAM_BOT_TOKEN=xxxx TELEGRAM_CHAT_ID=xxxx
   supabase functions deploy notify-telegram
   ```
6. Dashboard > Database > Webhooks > **Create a new webhook**:
   - Table: `contactos`
   - Events: `INSERT`
   - Type: `Supabase Edge Functions` -> `notify-telegram`

Desde ahora, cada mensaje del formulario dispara un aviso a Telegram.

## 2. Cargar contenido inicial

Puedes insertar tus primeras soluciones/productos directo desde el
**Table Editor** de Supabase (sin necesidad de escribir SQL), o con inserts:
```sql
insert into soluciones (nombre, descripcion, imagen_url, url, orden)
values ('PosCaja Móvil', 'POS offline para el mercado cubano.', 'https://.../poscaja.png', 'https://github.com/HRDTech/poscaja', 1);
```

## 3. Variables de entorno

Copiar `.env.local.example` a `.env.local` y completar con los datos de Supabase.

## 4. Desarrollo local
```
npm install
npm run dev
```

## 5. Despliegue en GitHub Pages (sitio público de la empresa)

Este repo ya incluye `.github/workflows/deploy.yml`, así que basta con:

1. Subir el proyecto a un repositorio de GitHub (por ejemplo `HRDTech/landing`).
2. Repo > **Settings > Pages** > en "Build and deployment", **Source**:
   `GitHub Actions` (no "Deploy from a branch").
3. Repo > **Settings > Secrets and variables > Actions**:
   - En **Secrets**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - En **Variables** (solo si NO vas a usar dominio propio y el repo no se
     llama `HRDTech.github.io`): `NEXT_PUBLIC_BASE_PATH` = `/nombre-del-repo`.
4. Hacer push a `main` — el workflow construye el export estático y lo publica.
   El sitio queda en `https://HRDTech.github.io/nombre-del-repo/`.
5. **Dominio propio (recomendado para la empresa)**: Settings > Pages >
   Custom domain > escribir `www.hrdsoluciones.com` (o el que sea). GitHub
   pide un registro CNAME hacia `HRDTech.github.io` en tu proveedor de DNS
   (puede ser el propio Cloudflare DNS, gratis, con proxy activado para SSL
   automático). Con dominio propio no hace falta `NEXT_PUBLIC_BASE_PATH`.

## 6. El panel de administración vive aparte, en Cloudflare Pages

Siguiendo lo pedido: **GitHub sirve la landing pública** (arriba) y
**Cloudflare aloja el panel privado** donde el equipo edita soluciones,
productos y revisa los leads — son dos proyectos distintos que comparten
la misma base de Supabase. El panel (`hrd-admin`) y sus pasos de deploy
están en su propia carpeta/repositorio — ver su `README.md`.

Plan free de Cloudflare Pages: 500 builds/mes, ancho de banda y requests
ilimitados, sin tarjeta de crédito.

## Mejoras y buenas prácticas ya incluidas

- **RLS estricta**: el navegador solo puede leer catálogos `publicado = true`
  e insertar en `contactos`; nunca leer leads ajenos.
- **Honeypot anti-spam** en el formulario (campo oculto; si un bot lo llena,
  se descarta el envío en silencio, sin fricción para personas reales).
- **`prefers-reduced-motion` respetado** y foco de teclado visible en todos
  los controles interactivos.
- **`next/image` desactivado** intencionalmente (`unoptimized: true`) porque
  el export estático no tiene servidor de optimización; las imágenes de
  Supabase Storage ya pueden servirse redimensionadas desde ahí.

## Próximas mejoras recomendadas

1. **Cachear los repos de GitHub en una tabla de Supabase** actualizada por
   un cron (Edge Function programada) en vez de consultar la API de GitHub
   directo desde cada visitante — evita el límite de 60 req/hora por IP y
   hace la sección más rápida.
2. **Cloudflare Turnstile** (gratis) en el formulario, además del honeypot,
   si empieza a llegar spam real.
3. **Sitemap.xml y robots.txt** para SEO, y metadatos Open Graph con una
   imagen de portada propia para que el link se vea bien al compartirlo.
4. **Cloudflare Access delante del panel** (`hrd-admin`): capa extra gratis
   de autenticación por correo antes de que cargue siquiera la pantalla de
   login del equipo.
5. **Tests de Lighthouse** antes de cada deploy grande (performance,
   accesibilidad) — Cloudflare Pages permite previews por cada PR para
   revisar esto sin tocar producción.
