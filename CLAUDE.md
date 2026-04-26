# Firmiu — Contexto del proyecto para Claude Code

## Qué es Firmiu

SaaS de firma digital de documentos orientado a Latinoamérica. Dirigido a contadores, abogados, inmobiliarias y pequeños negocios que necesitan firmar PDFs sin impresoras ni escáneres.

**Flujo principal:**
1. El dueño sube un PDF y escribe el nombre + correo del destinatario
2. El destinatario recibe un correo con un enlace único `/firmar/[token]`
3. El destinatario dibuja su firma y escribe un código de verificación de 4 dígitos
4. El PDF queda firmado (firma estampada con pdf-lib) y disponible para descargar

Dominio: **firmiu.com** · Deploy: **Vercel** (pendiente) · Base de datos: **Supabase**

---

## Stack tecnológico

| Capa | Tecnología | Estado |
|---|---|---|
| Framework | Next.js 14 (App Router) | ✅ |
| Estilos | Tailwind CSS | ✅ |
| Auth + DB + Storage | Supabase (`@supabase/ssr` + `@supabase/supabase-js`) | ✅ |
| i18n | next-intl v3 (ES por defecto sin prefijo; EN con `/en`) | ✅ |
| Emails | Resend | ✅ (requiere `RESEND_API_KEY` real en producción) |
| Firma en PDF | pdf-lib | ✅ |
| Canvas de firma | react-signature-canvas | ✅ |
| Toasts | Sistema propio por eventos (`toast.ts` + `Toaster.tsx`) | ✅ |
| Pagos | Paddle | ⏳ No implementado |
| Deploy | Vercel | ⏳ No configurado |
| Lenguaje | TypeScript strict | ✅ |

---

## Variables de entorno

El archivo `.env.local` ya existe con valores reales. `.env.example` es la plantilla.

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://rgjrjlsjnmhjwsmurmyj.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>

# Resend
RESEND_API_KEY=re_...           # ← actualmente placeholder, necesita valor real
RESEND_FROM_EMAIL=noreply@firmiu.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000   # en producción: https://firmiu.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # usado en OAuth redirectTo

# Paddle (no implementado aún)
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=...
PADDLE_API_KEY=...
PADDLE_WEBHOOK_SECRET=...
```

> **Regla crítica**: la variable es `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, NO `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Supabase la renombró. Nunca usar el nombre viejo.

---

## Estructura de carpetas

```
firmiu/
├── messages/
│   ├── es.json               # Traducciones ES (default)
│   └── en.json               # Traducciones EN
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout (metadataBase → firmiu.com)
│   │   ├── globals.css       # Tailwind + Inter + keyframes de animaciones de modales
│   │   ├── sitemap.ts        # Sitemap XML (todas las rutas públicas ES+EN)
│   │   ├── robots.ts         # robots.txt (bloquea /dashboard/ y /firmar/)
│   │   ├── actions/
│   │   │   ├── auth.ts       # registerAction, loginAction, logoutAction, googleLoginAction
│   │   │   ├── documents.ts  # uploadDocumentAction → retorna {success, destinatario, titulo}
│   │   │   ├── sign.ts       # signDocumentAction → retorna {success, redirectTo} | {errorKey}
│   │   │   ├── contacts.ts   # addContactAction, deleteContactAction
│   │   │   └── settings.ts   # updateProfileAction, updatePasswordAction
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts  # OAuth callback → exchangeCodeForSession → /dashboard
│   │   └── [locale]/
│   │       ├── layout.tsx         # Locale layout (html lang + NextIntlClientProvider + Toaster)
│   │       ├── page.tsx           # Landing con generateMetadata + JSON-LD + FAQ
│   │       ├── login/
│   │       │   ├── page.tsx
│   │       │   └── LoginForm.tsx
│   │       ├── register/
│   │       │   ├── page.tsx
│   │       │   └── RegisterForm.tsx
│   │       ├── recuperar/page.tsx       # Solicitar reset de contraseña por email
│   │       ├── nueva-contrasena/page.tsx # Formulario para ingresar nueva contraseña
│   │       ├── terminos/page.tsx         # Términos de servicio (12 secciones, i18n ES+EN)
│   │       ├── privacidad/page.tsx       # Política de privacidad (10 secciones, i18n ES+EN)
│   │       ├── dashboard/
│   │       │   ├── layout.tsx            # Layout con DashboardSidebar
│   │       │   ├── page.tsx              # Panel con empty state (pendiente real)
│   │       │   ├── nuevo/
│   │       │   │   ├── page.tsx          # Acepta searchParams ?nombre= y ?correo=
│   │       │   │   └── NuevoForm.tsx     # Muestra SuccessModal en state.success
│   │       │   ├── documentos/page.tsx   # ⚠️ UI con mock data (sin query real)
│   │       │   ├── contactos/
│   │       │   │   ├── page.tsx          # Server component — query a tabla contactos
│   │       │   │   └── ContactosClient.tsx  # CRUD con toasts, búsqueda, avatares
│   │       │   ├── cuenta/
│   │       │   │   ├── page.tsx          # Server — datos reales del usuario
│   │       │   │   └── SettingsClient.tsx   # Perfil, contraseña, planes con toasts
│   │       │   └── firmas/page.tsx       # Placeholder vacío (pendiente)
│   │       └── firmar/
│   │           ├── [token]/
│   │           │   ├── page.tsx          # Server wrapper
│   │           │   └── FirmarClient.tsx  # Canvas, OTP, toast errors, SuccessModal
│   │           └── exito/page.tsx        # Confirmación post-firma (destino del modal)
│   ├── components/
│   │   ├── Logo.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── DashboardSidebar.tsx
│   │   ├── DashboardNav.tsx
│   │   ├── GoogleButton.tsx
│   │   ├── SubmitButton.tsx
│   │   ├── DownloadSignedButton.tsx
│   │   ├── Toaster.tsx           # Contenedor de toasts (bottom-right, 4 tipos, auto-dismiss)
│   │   ├── SuccessModal.tsx      # Modal animado de éxito con countdown y auto-redirect
│   │   └── landing/
│   │       ├── Hero.tsx          # Strings decorativas del mockup usan t(mock_*)
│   │       ├── HowItWorks.tsx
│   │       ├── Features.tsx
│   │       ├── InContext.tsx
│   │       ├── Pricing.tsx
│   │       ├── Testimonials.tsx
│   │       ├── FAQ.tsx           # Acordeón <details>/<summary> (crawlable sin JS)
│   │       └── CtaBanner.tsx
│   ├── lib/
│   │   ├── toast.ts              # Dispatcher de toasts por window.CustomEvent
│   │   └── supabase/
│   │       ├── client.ts         # createBrowserClient → Client Components
│   │       ├── server.ts         # createServerClient → Server Components, Actions, Handlers
│   │       └── admin.ts          # createClient con service role → bypasea RLS
│   ├── i18n.ts
│   └── middleware.ts
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql  # Schema principal (ejecutado)
│       └── 003_contacts.sql        # Tabla contactos + RLS (⚠️ ejecutar en Supabase)
├── next.config.js
├── tailwind.config.ts
├── .env.example
├── .env.local
└── CLAUDE.md
```

---

## Diseño y estilos

- **Color principal**: `#1a3c5e` (azul marino) y `#F97316` (naranja de acción)
- **Color éxito**: `#10B981` (verde — toasts de éxito, checkmark del modal)
- **Fuente**: Inter (Google Fonts, cargada en globals.css)
- **Mobile first**, diseño limpio y minimalista
- **Componentes**: bordes redondeados (`rounded-[9px]`, `rounded-[14px]`), sombras sutiles
- **Sin librerías UI** — todo Tailwind puro

### Keyframes en globals.css
Animaciones del `SuccessModal` y `Toaster` definidas en `src/app/globals.css`:
- `firmiu-overlay-in` — backdrop fade in
- `firmiu-modal-in` — card escala + sube con spring easing
- `firmiu-circle-draw` — círculo SVG se dibuja (stroke-dashoffset 201→0)
- `firmiu-check-draw` — checkmark SVG se dibuja (stroke-dashoffset 49→0)
- `firmiu-countdown` — barra de progreso inferior (scaleX 1→0)
- `firmiu-text-in` — texto fade + sube

### Regla de i18n
**Nunca** hardcodear textos en componentes. Siempre agregar en `messages/es.json` y `messages/en.json`. Claves actuales:

```
nav.*                  → navbar y sidebar
home.hero.*            → hero landing (incluye mock_* para strings decorativas)
home.how_it_works.*    → sección cómo funciona
home.features_section.*→ cards de características
home.testimonials.*    → testimonios
home.in_context.*      → estadísticas
home.cta_banner.*      → banner final
home.features.*        → sección visual upload/sign/download
home.pricing.*         → precios y planes
home.faq.*             → FAQ (title, subtitle, q1-q8, a1-a8)
auth.errors.*          → mensajes de error (8 claves)
auth.register.*        → formulario de registro
auth.login.*           → formulario de login
auth.google_button / auth.or_continue_with / auth.panel.*
dashboard.*            → panel principal
documents.*            → lista de documentos
nuevo.*                → subir nuevo documento (incluye nuevo.errors.*, modal_title, modal_subtitle)
sign.*                 → página pública de firma (incluye sign.modal_title, sign.modal_subtitle)
sign_success.*         → página post-firma
contacts_page.*        → módulo de contactos (incluye toast_added, toast_deleted)
settings.*             → módulo de cuenta/configuración (incluye planes)
terms.*                → términos de servicio (s1_title..s12_title, s1_body..s12_body)
privacy.*              → política de privacidad (s1..s10, security_badge, security_desc)
footer.*
```

---

## Lo que ya está implementado y funcionando

### ✅ Infraestructura base
- Next.js 14 App Router con TypeScript strict
- Tailwind CSS con colores custom
- next-intl: español sin prefijo (default), inglés con `/en`
- Tres clientes Supabase: browser, server y admin (service role)
- Middleware combinado: refresca sesión + protege rutas + maneja locales

### ✅ Sistema de toasts (`src/lib/toast.ts` + `src/components/Toaster.tsx`)
- `toast.success()`, `toast.error()`, `toast.warning()`, `toast.info()` — disponibles en cualquier Client Component sin Provider
- Dispatcher via `window.dispatchEvent(new CustomEvent("firmiu:toast", {...}))`
- `Toaster` montado en el layout del locale — bottom-right, siempre visible sin scroll
- 4 tipos con colores distintos, auto-dismiss diferenciado (error=5s, warning=4.5s, success/info=3.5-4s)
- Máximo 3 toasts simultáneos, botón X para cerrar manualmente
- Usado en: `FirmarClient`, `ContactosClient`, `SettingsClient`

### ✅ Modal de éxito (`src/components/SuccessModal.tsx`)
- Props: `title`, `subtitle`, `redirectTo`, `delayMs` (default 3200ms)
- Backdrop con `backdrop-blur-[3px]` + card animada con spring easing
- SVG: círculo verde animado (r=32, dashoffset 201→0) seguido del checkmark (dashoffset 49→0)
- Barra de progreso inferior (countdown) que lleva a cero y navega automáticamente
- Montado en `NuevoForm` (tras enviar documento) y `FirmarClient` (tras firmar)

### ✅ Autenticación completa
- Registro email/contraseña via `registerAction`
- Login email/contraseña via `loginAction`
- Login con Google OAuth via `googleLoginAction` → callback en `/auth/callback/route.ts`
- Logout via `logoutAction`
- Recuperar contraseña: `/recuperar` + `/nueva-contrasena`
- Protección de rutas: `/dashboard` requiere sesión activa
- 8 claves de error mapeadas en ES+EN

### ✅ Base de datos
- Tabla `documentos` con RLS (owners ven sus filas; lectura pública por token)
- Tabla `firmas` (solo service role escribe)
- Enum `estado_documento` ('pendiente' | 'visto' | 'firmado')
- Storage buckets: `pdfs-originales` y `pdfs-firmados` (privados)
- Tabla `contactos` con RLS — **⚠️ requiere ejecutar `003_contacts.sql` en Supabase SQL Editor**

### ✅ Upload de documentos (`/dashboard/nuevo`)
`uploadDocumentAction` en orden:
1. Valida PDF (requerido, tipo .pdf, max 20 MB) y destinatario (nombre + email)
2. Sube PDF a `pdfs-originales/{owner_id}/{docId}.pdf` → admin client
3. Inserta fila en `documentos` → server client con sesión (respeta RLS)
4. Genera código 4 dígitos e inserta en `firmas` → admin client
5. Envía email al destinatario con Resend (enlace `/firmar/[token]` + código visual)
6. Retorna `{ success: true, destinatario, titulo }` → cliente muestra `SuccessModal`
7. `SuccessModal` redirige a `/dashboard/documentos` tras 3.2 s

La página `/dashboard/nuevo` acepta `?nombre=` y `?correo=` en la URL (prellenado desde contactos).
El email falla silenciosamente si `RESEND_API_KEY` no es válida — el documento se crea igualmente.
En desarrollo, los datos de firma se loguean en la terminal (URL, token, código).

### ✅ Firma de documentos (`/firmar/[token]`)
`signDocumentAction` en orden:
1. Busca documento por token (query pública, sin sesión)
2. Verifica que no esté ya firmado
3. Valida código de 4 dígitos contra `firmas.codigo_verificacion`
4. Captura IP del request headers (IPs privadas/loopback → `null`)
5. Fetch de geolocalización a ip-api.com (ciudad, región, país, timezone, VPN/proxy) con timeout 3s
6. Descarga PDF original desde Storage → admin client
7. Estampa firma PNG con pdf-lib via `addSignaturePage()`:
   - **La página nueva usa las mismas dimensiones que la primera página del PDF original** (no A4 fijo)
   - Contiene: firma centrada en cuadro naranja, tabla de auditoría con firmante, correo, fecha/hora (en timezone del firmante), IP (o "No disponible"), dispositivo, ubicación, nombre del documento
8. Sube PDF firmado a `pdfs-firmados/{owner_id}/{docId}.pdf` → admin client (upsert)
9. Actualiza `documentos.estado = 'firmado'` y `url_pdf_firmado`
10. Actualiza `firmas.verificado = true`, ip, user_agent, navegador, OS, ubicación, VPN
11. Retorna `{ success: true, redirectTo }` → cliente muestra `SuccessModal`
12. `SuccessModal` redirige a `/firmar/exito?token=...` tras 3.2 s

El timezone lo aporta el navegador del firmante (`Intl.DateTimeFormat().resolvedOptions().timeZone`) y se pasa al server action. El geo.timezone tiene prioridad si la IP es pública.

### ✅ Módulo de contactos (`/dashboard/contactos`)
- Tabla `contactos` en Supabase con RLS (cada user ve solo los suyos)
- CRUD: agregar (modal), eliminar (confirmación inline)
- Búsqueda en tiempo real por nombre o correo
- Avatares con colores deterministas (hash del nombre → 8 colores)
- Botón "Enviar documento" → `/dashboard/nuevo?nombre=X&correo=Y`
- Toasts de éxito/error en add y delete
- Si la migración 003 no está aplicada, muestra empty state sin crashear

### ✅ Módulo de cuenta (`/dashboard/cuenta`)
- Lee datos reales: `nombre` (`user_metadata`), `email`, `isGoogle` (`app_metadata.provider`)
- Contador de documentos del mes actual (query real a Supabase)
- Editar nombre via `updateProfileAction` → `supabase.auth.updateUser`
- Cambio de contraseña via `updatePasswordAction` (min 6 chars, confirmación)
- Usuarios Google OAuth ven mensaje info en lugar del form de contraseña
- Display de planes (Free/Starter/Pro/Business) con barra de progreso
- Toasts de éxito/error en todas las operaciones
- Zona de peligro: eliminar cuenta (placeholder, sin lógica real)

### ✅ Páginas legales
- `/terminos` — 12 secciones, i18n completo ES+EN
- `/privacidad` — 10 secciones con íconos únicos, i18n completo ES+EN
- Links desde `/register` con `target="_blank"`

### ✅ SEO completo
- `generateMetadata` en `page.tsx`: title, description, keywords, canonical, hreflang (`es`, `en`, `x-default`), Open Graph (`es_419`/`en_US`), Twitter Card
- JSON-LD: `Organization`, `WebSite`, `SoftwareApplication`, `FAQPage` (8 preguntas — rich snippets)
- `sitemap.ts` — todas las rutas públicas en ES+EN con prioridades
- `robots.ts` — bloquea `/dashboard/` y `/firmar/`
- `FAQ.tsx` — acordeón `<details>/<summary>` (indexable sin JS)

### ✅ Estado de páginas
| Ruta | Estado |
|---|---|
| `/` | Landing completa: SEO, FAQ, JSON-LD |
| `/login` | Funcional (email + Google) |
| `/register` | Funcional (email + Google + links legales) |
| `/recuperar` | Funcional |
| `/nueva-contrasena` | Funcional |
| `/terminos` | Completo i18n ES+EN |
| `/privacidad` | Completo i18n ES+EN |
| `/dashboard` | Empty state (sin datos reales) |
| `/dashboard/nuevo` | **Funcional** — upload, email, SuccessModal |
| `/dashboard/documentos` | ⚠️ Mock data — sin query real |
| `/dashboard/contactos` | **Funcional** — CRUD + toasts |
| `/dashboard/cuenta` | **Funcional** — datos reales, toasts |
| `/dashboard/firmas` | Placeholder vacío |
| `/firmar/[token]` | **Funcional** — canvas, OTP, pdf-lib, SuccessModal |
| `/firmar/exito` | UI estática |

**Build actual: 34 páginas sin errores.**

---

## Esquema de base de datos

```sql
-- ENUM
create type estado_documento as enum ('pendiente', 'visto', 'firmado');

-- TABLA PRINCIPAL
create table documentos (
  id                   uuid primary key default gen_random_uuid(),
  owner_id             uuid not null references auth.users(id) on delete cascade,
  titulo               text not null,
  nombre_destinatario  text not null,
  correo_destinatario  text not null,
  estado               estado_documento not null default 'pendiente',
  url_pdf_original     text,           -- path: pdfs-originales/{owner_id}/{id}.pdf
  url_pdf_firmado      text,           -- path: pdfs-firmados/{owner_id}/{id}.pdf
  token                uuid not null unique default gen_random_uuid(),
  creado_en            timestamptz not null default now()
);

-- AUDITORÍA DE FIRMA
create table firmas (
  id                   uuid primary key default gen_random_uuid(),
  documento_id         uuid not null references documentos(id) on delete cascade,
  firmado_en           timestamptz not null default now(),
  ip                   text,
  user_agent           text,
  navegador            text,
  sistema_operativo    text,
  ubicacion            text,
  codigo_verificacion  text,
  verificado           boolean not null default false
);

-- CONTACTOS (migración 003 — ejecutar manualmente en Supabase SQL Editor)
create table if not exists contactos (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null references auth.users(id) on delete cascade,
  nombre     text not null,
  correo     text not null,
  empresa    text,
  creado_en  timestamptz not null default now(),
  unique (owner_id, correo)
);
alter table contactos enable row level security;
create policy "users manage their own contacts" on contactos for all
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
```

**Buckets de Storage:**
- `pdfs-originales` — privado, upload con admin client
- `pdfs-firmados` — privado, upload con admin client, lectura con URL firmada (24h)

**RLS:**
- `documentos`: owners leen/escriben sus filas; lectura pública filtrada por token
- `firmas`: deny-all para clientes normales; solo service role opera
- `contactos`: cada usuario gestiona solo los suyos

---

## Lo que falta antes de producción

### 1. Lista de documentos real — `/dashboard/documentos` ← PRÓXIMO PASO
- Query real a Supabase: `documentos` filtrado por `owner_id` del usuario autenticado
- Badge de estado con color (pendiente=gris, visto=azul, firmado=verde)
- Botón "Ver" → URL firmada del PDF original (admin client, 1h)
- Botón "Descargar" → URL firmada del PDF firmado (solo si `estado === 'firmado'`)

### 2. Panel principal — `/dashboard`
- Estadísticas reales: total enviados, pendientes, firmados
- Documentos recientes (últimos 5) con estado y acciones rápidas

### 3. Módulo de firmas — `/dashboard/firmas`
- Historial de documentos firmados con datos de auditoría
- Actualmente placeholder vacío

### 4. Email con dominio propio
- Configurar dominio `firmiu.com` en Resend
- Cambiar `from: "onboarding@resend.dev"` → `from: "noreply@firmiu.com"` en `documents.ts`
- Agregar `RESEND_API_KEY` real en `.env.local` y en Vercel

### 5. Pagos con Paddle
- Checkout para planes Starter ($9), Pro ($19), Business ($39)
- Webhook para activar/desactivar suscripción en Supabase
- Limitar documentos por plan (Free: 3/mes) — validar en `uploadDocumentAction`
- Eliminar cuenta real en zona de peligro (`/dashboard/cuenta`)

### 6. Deploy en Vercel
- Configurar variables de entorno en Vercel dashboard
- Cambiar `NEXT_PUBLIC_APP_URL` y `NEXT_PUBLIC_SITE_URL` a `https://firmiu.com`
- Verificar que OAuth de Google tenga `https://firmiu.com/auth/callback` como redirect autorizado

---

## Comandos útiles

```bash
npm run dev      # Servidor de desarrollo en http://localhost:3000
npm run build    # Build de producción (verifica TypeScript + genera páginas)
npm run lint     # ESLint
```

---

## Notas críticas para Claude

### Clientes de Supabase — cuándo usar cuál
| Situación | Archivo | Función |
|---|---|---|
| Client Component | `src/lib/supabase/client.ts` | `createClient()` |
| Server Component / Action / Route Handler | `src/lib/supabase/server.ts` | `createClient()` |
| Bypasear RLS (storage, tabla firmas, sign) | `src/lib/supabase/admin.ts` | `createAdminClient()` |

### Reglas de desarrollo
- **Textos**: SIEMPRE en `messages/es.json` y `messages/en.json`. Nunca hardcodear.
- **Server Actions**: `"use server"` en la primera línea. Las nuevas acciones van en `src/app/actions/`.
- **Formularios con errores**: `useFormState` (React 18, de `react-dom`). Submit usa `<SubmitButton>` con `useFormStatus`.
- **Mutaciones sin formulario**: `useTransition` + `router.refresh()` — NO `useFormState`.
- **Toasts**: importar `toast` desde `@/lib/toast`. Nunca crear estados de error inline en Client Components nuevos.
- **Modales de éxito**: el Server Action retorna `{ success: true, ... }`. El cliente detecta `state.success` en un `useEffect` y muestra `<SuccessModal>`. No usar `redirect()` desde el action cuando se necesita modal.
- **setRequestLocale**: todas las páginas bajo `[locale]` deben llamarlo al inicio.
- **getTranslations vs useTranslations**: `getTranslations` (async) en Server Components; `useTranslations` en Client Components.
- **Middleware**: combina Supabase + protección de rutas + next-intl en un solo archivo. No separar.
- **Variable de entorno**: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (nunca `ANON_KEY`).
- **Prefijo de locale**: español sin prefijo; inglés con `/en`. El helper `getPrefix(locale)` retorna `""` para ES y `"/en"` para EN.
- **`addSignaturePage()`** en `sign.ts`: agrega una página nueva con las **mismas dimensiones que la primera página del PDF original** (`pdfDoc.getPages()[0].getSize()`). NUNCA dibujar sobre páginas existentes.
- **`signDocumentAction`**: retorna `SignResult { errorKey, success?, redirectTo? }`. Ya NO llama a `redirect()` directamente.
- **Build**: `npm run build` debe pasar sin errores. Build actual genera 34 páginas.
- **`NEXT_PUBLIC_APP_URL`**: usado en metadata SEO (canonical, OG, sitemap, links de email). En producción debe ser `https://firmiu.com`.
