-- =========================================================
-- HRD Soluciones HR — esquema de Supabase para la landing
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =========================================================

-- 1. SOLUCIONES (catálogo de soluciones ya creadas/en uso) -------------
create table if not exists soluciones (
  id           uuid primary key default gen_random_uuid(),
  nombre       text not null,
  descripcion  text not null,
  imagen_url   text,
  url          text,
  orden        int default 0,
  publicado    boolean not null default true,
  creado_en    timestamptz not null default now()
);

-- 2. PRODUCTOS EN DESARROLLO --------------------------------------------
create table if not exists productos_desarrollo (
  id           uuid primary key default gen_random_uuid(),
  nombre       text not null,
  descripcion  text not null,
  imagen_url   text,
  orden        int default 0,
  publicado    boolean not null default true,
  creado_en    timestamptz not null default now()
);

-- 3. CONTACTOS (leads del formulario) -----------------------------------
create table if not exists contactos (
  id           uuid primary key default gen_random_uuid(),
  nombre       text not null,
  email        text not null,
  empresa      text,
  mensaje      text not null,
  notificado   boolean not null default false,
  creado_en    timestamptz not null default now()
);

-- =========================================================
-- ROW LEVEL SECURITY
-- El sitio usa la anon key desde el navegador: RLS es lo único
-- que impide que cualquiera lea/edite lo que no debe.
-- =========================================================

alter table soluciones enable row level security;
alter table productos_desarrollo enable row level security;
alter table contactos enable row level security;

-- Lectura pública SOLO de lo publicado
create policy "Lectura pública de soluciones publicadas"
  on soluciones for select
  using (publicado = true);

create policy "Lectura pública de productos publicados"
  on productos_desarrollo for select
  using (publicado = true);

-- Contactos: el público solo puede INSERTAR (nunca leer ni editar leads ajenos)
create policy "Cualquiera puede enviar un contacto"
  on contactos for insert
  with check (true);

-- (La lectura de contactos vía anon queda cerrada a propósito:
--  solo el equipo autenticado, desde el panel, puede verlos — políticas abajo)

-- =========================================================
-- ACCESO DEL EQUIPO (panel de administración en Cloudflare)
-- Cualquier usuario autenticado en Supabase Auth (creado a mano
-- para el equipo, no hay registro público) puede gestionar el
-- catálogo y ver/gestionar los leads.
-- =========================================================

create policy "El equipo gestiona soluciones"
  on soluciones for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "El equipo gestiona productos en desarrollo"
  on productos_desarrollo for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "El equipo lee y gestiona los contactos"
  on contactos for select
  using (auth.role() = 'authenticated');

create policy "El equipo puede marcar/editar contactos"
  on contactos for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- =========================================================
-- NOTIFICACIÓN A TELEGRAM CUANDO ENTRA UN CONTACTO
-- Vía Database Webhook (Supabase) -> Edge Function `notify-telegram`
-- Configurar el webhook desde el Dashboard:
--   Database > Webhooks > Create a new webhook
--   Table: contactos | Events: INSERT
--   Type: Supabase Edge Function -> notify-telegram
-- (ver supabase/functions/notify-telegram/index.ts)
-- =========================================================

-- Índice útil para el panel de leads
create index if not exists contactos_creado_en_idx on contactos (creado_en desc);
