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
| Pagos | Paddle | ✅ Checkout + webhook implementados |
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

# Paddle
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
│   │   ├── layout.tsx        # Root layout (metadataBase → firmiu.com, fallback SEO)
│   │   ├── globals.css       # Tailwind + Inter + keyframes de animaciones de modales
│   │   ├── sitemap.ts        # Sitemap XML (todas las rutas públicas ES+EN)
│   │   ├── robots.ts         # robots.txt (bloquea /dashboard/ y /firmar/)
│   │   ├── actions/
│   │   │   ├── auth.ts       # registerAction, loginAction, logoutAction, googleLoginAction
│   │   │   ├── documents.ts  # uploadDocumentAction, hideDocumentAction
│   │   │   ├── sign.ts       # signDocumentAction → retorna {success, redirectTo} | {errorKey}
│   │   │   ├── contacts.ts   # addContactAction, hideContactAction
│   │   │   └── settings.ts   # updateProfileAction, updatePasswordAction
│   │   ├── api/
│   │   │   ├── cron/reset-docs/route.ts  # Cron mensual que resetea contador de documentos
│   │   │   └── paddle/webhook/route.ts   # Webhook Paddle → actualiza tabla suscripciones
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts  # OAuth callback → lee cookie firmiu_pending_plan → /checkout o /dashboard
│   │   └── [locale]/
│   │       ├── layout.tsx         # Locale layout (html lang + NextIntlClientProvider + Toaster)
│   │       ├── page.tsx           # Landing con generateMetadata + JSON-LD + FAQ
│   │       ├── login/
│   │       │   ├── page.tsx       # generateMetadata completo (canonical, OG, hreflang, keywords)
│   │       │   └── LoginForm.tsx
│   │       ├── register/
│   │       │   ├── page.tsx       # generateMetadata completo; acepta ?plan= para checkout flow
│   │       │   └── RegisterForm.tsx  # hidden input plan para checkout post-registro
│   │       ├── checkout/
│   │       │   ├── page.tsx           # Server: valida ?plan=, requiere sesión, pasa props a client
│   │       │   └── CheckoutClient.tsx # Client: abre Paddle tras 1.5s; redirige tras éxito/cierre
│   │       ├── recuperar/page.tsx       # noindex — reset de contraseña por email
│   │       ├── nueva-contrasena/page.tsx # noindex — formulario nueva contraseña
│   │       ├── nosotros/page.tsx         # generateMetadata completo (canonical, OG, hreflang, keywords)
│   │       ├── contacto/page.tsx         # generateMetadata completo
│   │       ├── terminos/page.tsx         # 13 secciones + generateMetadata completo + link a /reembolsos
│   │       ├── privacidad/page.tsx       # 10 secciones + generateMetadata completo
│   │       ├── reembolsos/page.tsx       # 4 secciones + generateMetadata completo (nueva)
│   │       ├── dashboard/
│   │       │   ├── layout.tsx            # DashboardNav + PendingPlanChecker (limpia cookie si plan activo)
│   │       │   ├── page.tsx              # Estadísticas reales: enviados, pendientes, firmados, sparkline
│   │       │   ├── nuevo/
│   │       │   │   ├── page.tsx          # Acepta searchParams ?nombre= y ?correo=
│   │       │   │   └── NuevoForm.tsx     # Muestra SuccessModal en state.success
│   │       │   ├── documentos/
│   │       │   │   ├── page.tsx          # Query real + paginación (10/pág) + .eq("oculto",false)
│   │       │   │   └── DocumentosClient.tsx  # Tabs estado, hide inline, paginación
│   │       │   ├── contactos/
│   │       │   │   ├── page.tsx          # Query real + paginación + .eq("oculto",false)
│   │       │   │   └── ContactosClient.tsx  # CRUD con toasts, búsqueda, hide, paginación
│   │       │   ├── cuenta/
│   │       │   │   ├── page.tsx          # Server — datos reales del usuario + plan actual
│   │       │   │   └── SettingsClient.tsx   # Perfil, contraseña, planes con toasts
│   │       │   └── firmas/
│   │       │       ├── page.tsx          # Query real + paginación + .eq("oculto",false)
│   │       │       └── FirmasClient.tsx  # Tabla/cards, hide inline, timezone Tegucigalpa
│   │       └── firmar/
│   │           ├── [token]/
│   │           │   ├── page.tsx          # Server wrapper
│   │           │   └── FirmarClient.tsx  # Canvas, OTP, toast errors, SuccessModal
│   │           └── exito/page.tsx        # noindex — confirmación post-firma + descarga
│   ├── components/
│   │   ├── Logo.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx                    # Links: Privacidad · Términos · Reembolsos
│   │   ├── DashboardSidebar.tsx
│   │   ├── DashboardNav.tsx
│   │   ├── GoogleButton.tsx
│   │   ├── SubmitButton.tsx
│   │   ├── DownloadSignedButton.tsx
│   │   ├── PendingPlanChecker.tsx        # Client silent: limpia cookie/localStorage si plan activo
│   │   ├── Toaster.tsx
│   │   ├── SuccessModal.tsx
│   │   └── landing/
│   │       ├── Hero.tsx
│   │       ├── HowItWorks.tsx
│   │       ├── Features.tsx
│   │       ├── InContext.tsx
│   │       ├── Pricing.tsx               # Escribe cookie firmiu_pending_plan antes de /register
│   │       ├── Testimonials.tsx
│   │       ├── FAQ.tsx
│   │       └── CtaBanner.tsx
│   ├── lib/
│   │   ├── toast.ts
│   │   ├── paddle.ts                     # getPaddle(), openCheckout(); dispara firmiu:paddle-success/closed
│   │   ├── security.ts                   # escapeHtml, isValidEmail, isValidUUID, sanitizeText
│   │   └── supabase/
│   │       ├── client.ts
│   │       ├── server.ts
│   │       └── admin.ts
│   ├── i18n.ts
│   └── middleware.ts                     # PROTECTED: /dashboard, /nueva-contrasena, /checkout
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql
│       ├── 003_contacts.sql              # ⚠️ ejecutar en Supabase SQL Editor
│       ├── 005_suscripciones.sql         # tabla suscripciones (plan, estado, paddle_*)
│       └── 006_soft_delete.sql          # ⚠️ ejecutar: columna oculto en documentos/firmas/contactos
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
- `firmiu-overlay-in` — backdrop fade in
- `firmiu-modal-in` — card escala + sube con spring easing
- `firmiu-circle-draw` — círculo SVG (stroke-dashoffset 201→0)
- `firmiu-check-draw` — checkmark SVG (stroke-dashoffset 49→0)
- `firmiu-countdown` — barra de progreso (scaleX 1→0)
- `firmiu-text-in` — texto fade + sube

### Regla de i18n
**Nunca** hardcodear textos en componentes. Siempre agregar en `messages/es.json` y `messages/en.json`.

```
nav.*                    → navbar y sidebar
home.hero.*              → hero landing (mock_* para strings decorativas)
home.how_it_works.*      → sección cómo funciona
home.features_section.*  → cards de características
home.testimonials.*      → testimonios
home.in_context.*        → estadísticas
home.cta_banner.*        → banner final
home.features.*          → sección visual upload/sign/download
home.pricing.*           → precios y planes
home.faq.*               → FAQ (title, subtitle, q1-q8, a1-a8)
auth.errors.*            → mensajes de error (8 claves)
auth.register.*          → formulario de registro (+ meta_title, meta_description, meta_keywords)
auth.login.*             → formulario de login (+ meta_title, meta_description, meta_keywords)
auth.google_button / auth.or_continue_with / auth.panel.*
auth.forgot_password.*   → recuperar contraseña
dashboard.*              → panel principal
documents.*              → lista de documentos (incluye cancel, hide_confirm, hide)
nuevo.*                  → subir nuevo documento (incluye nuevo.errors.*, modal_title, modal_subtitle)
sign.*                   → página pública de firma
sign_success.*           → página post-firma
contacts_page.*          → módulo de contactos (incluye hide_confirm, hide, pagination.*)
firmas_page.*            → módulo de firmas (incluye cancel, hide, hide_confirm, pagination.*)
settings.*               → módulo de cuenta/configuración (incluye planes)
pagination.*             → previous, next, page_of, showing (reutilizado en documentos/contactos/firmas)
terms.*                  → términos de servicio (s1..s13 + meta_description, meta_keywords)
privacy.*                → política de privacidad (s1..s10 + meta_description, meta_keywords)
refund.*                 → política de reembolsos (s1..s4 + meta_keywords + contact_label/email)
about.*                  → página nosotros (+ meta_keywords)
contact.*                → página contacto (+ meta_keywords)
footer.*                 → footer (incluye refunds)
checkout.*               → página checkout (loading, go_dashboard, error)
pending_plan.*           → loader de suscripción pendiente
```

---

## Lo que ya está implementado y funcionando

### ✅ Infraestructura base
- Next.js 14 App Router con TypeScript strict
- Tailwind CSS con colores custom
- next-intl: español sin prefijo (default), inglés con `/en`
- Tres clientes Supabase: browser, server y admin (service role)
- Middleware combinado: refresca sesión + protege rutas + maneja locales
- Rutas protegidas: `/dashboard`, `/nueva-contrasena`, `/checkout`

### ✅ Sistema de toasts
- `toast.success()`, `toast.error()`, `toast.warning()`, `toast.info()`
- Dispatcher via `window.dispatchEvent(new CustomEvent("firmiu:toast", {...}))`
- 4 tipos, auto-dismiss diferenciado, máx 3 simultáneos, botón X

### ✅ Modal de éxito (`SuccessModal.tsx`)
- Props: `title`, `subtitle`, `redirectTo`, `delayMs` (default 3200ms)
- SVG animado (círculo + checkmark), barra countdown, auto-redirect

### ✅ Autenticación completa
- Registro email/contraseña, Login email/contraseña, Google OAuth
- Recuperar contraseña: `/recuperar` + `/nueva-contrasena`
- Protección de rutas con middleware
- `auth/callback/route.ts` lee cookie `firmiu_pending_plan` → redirige a `/checkout?plan=...`

### ✅ Checkout / Pagos con Paddle
- `Pricing.tsx`: escribe `firmiu_pending_plan` en cookie + localStorage antes de ir a `/register`
- `registerAction`: si hay sesión + plan → redirect a `/checkout?plan=...`
- `auth/callback`: si hay cookie pending_plan → redirect a `/checkout?plan=...`
- `/checkout/page.tsx`: valida plan, requiere sesión, pasa priceId/email/userId
- `CheckoutClient.tsx`: spinner + abre Paddle tras 1.5s; escucha `firmiu:paddle-success` y `firmiu:paddle-closed` → redirect a /dashboard; fallback link a 8s
- `PendingPlanChecker.tsx`: limpia cookie/localStorage si el plan ya está activo
- `paddle/webhook/route.ts`: verifica firma Paddle, actualiza tabla `suscripciones` (activated/cancelled/past_due)
- Tabla `suscripciones`: `owner_id`, `plan`, `estado`, `paddle_subscription_id`, `paddle_customer_id`, `current_period_end`

### ✅ Base de datos
- Tabla `documentos` con RLS + columna `oculto boolean default false`
- Tabla `firmas` + columna `oculto boolean default false`
- Tabla `contactos` + columna `oculto boolean default false`
- Tabla `suscripciones` con datos Paddle
- **⚠️ Pendiente ejecutar en Supabase**: `003_contacts.sql` y `006_soft_delete.sql`

### ✅ Upload de documentos (`/dashboard/nuevo`)
1. Valida PDF (max 20 MB) + destinatario
2. Sube a `pdfs-originales/{owner_id}/{docId}.pdf`
3. Inserta en `documentos`
4. Genera código 4 dígitos, inserta en `firmas`
5. Envía email con Resend (falla silenciosamente si key no es válida)
6. Retorna `{ success: true }` → `SuccessModal` → `/dashboard/documentos`

### ✅ Firma de documentos (`/firmar/[token]`)
1. Busca por token (público), verifica no firmado, valida código
2. IP capture + geolocalización (ip-api.com, timeout 3s)
3. Descarga PDF original, estampa firma con pdf-lib en **página nueva con dimensiones del original**
4. Sube PDF firmado, actualiza `documentos` y `firmas`
5. Retorna `{ success: true, redirectTo }` → `SuccessModal` → `/firmar/exito?token=...`

### ✅ Dashboard — módulos con datos reales
**Todos los módulos del dashboard comparten:**
- Paginación server-side: PAGE_SIZE=10, `?page=N`, `.range(from, to)`, `count: 'exact'`
- Soft delete: `.eq("oculto", false)` + botón "Ocultar" con confirmación inline
- `router.refresh()` tras mutaciones (useTransition)

**`/dashboard`** — estadísticas reales: enviados/pendientes/firmados del mes + sparkline + 5 recientes

**`/dashboard/documentos`** — query real + tabs por estado (conteos exactos con 3 queries paralelas) + hide inline

**`/dashboard/contactos`** — CRUD + búsqueda + avatares deterministas + "Enviar documento" → /nuevo?nombre=&correo=

**`/dashboard/firmas`** — historial de firmas con auditoría + timezone `America/Tegucigalpa`

**`/dashboard/cuenta`** — datos reales, plan actual desde tabla `suscripciones`, toasts

### ✅ Páginas legales y públicas
- `/terminos` — 13 secciones + link a /reembolsos en s13
- `/privacidad` — 10 secciones con íconos únicos
- `/reembolsos` — 4 secciones (nueva) — política de reembolsos y cancelaciones
- `/nosotros` — misión, para quién, valores
- `/contacto` — email directo

### ✅ SEO agresivo — todas las páginas públicas
**Landing** (`/`): title, description, keywords, canonical, hreflang (es/en/x-default), OG (es_419/en_US), Twitter Card, JSON-LD (Organization + WebSite + SoftwareApplication + FAQPage), robots: index

**Páginas indexables** (login, register, terminos, privacidad, reembolsos, nosotros, contacto): `generateMetadata` completo con title, description, keywords i18n, canonical, hreflang alternates, OG (title/description/url/siteName/locale/type), Twitter Card, robots: index

**Páginas noindex** (recuperar, nueva-contrasena, firmar/exito): `robots: { index: false, follow: false }`

**Infraestructura SEO:**
- `sitemap.ts` — ES+EN para todas las rutas públicas con prioridades (/ → 1.0, /register → 0.9, /login → 0.8, /nosotros → 0.6, /contacto → 0.6, /reembolsos → 0.5, /terminos → 0.4, /privacidad → 0.4)
- `robots.ts` — bloquea `/dashboard/` y `/firmar/`
- `metadataBase` en root layout → `https://firmiu.com`
- `FAQ.tsx` — acordeón `<details>/<summary>` (indexable sin JS)

### ✅ Estado de páginas
| Ruta | Estado |
|---|---|
| `/` | Landing completa: SEO, FAQ, JSON-LD |
| `/login` | Funcional + SEO completo |
| `/register` | Funcional + SEO completo + checkout flow |
| `/checkout` | Funcional — Paddle checkout |
| `/recuperar` | Funcional, noindex |
| `/nueva-contrasena` | Funcional, noindex |
| `/nosotros` | Completo + SEO |
| `/contacto` | Completo + SEO |
| `/terminos` | 13 secciones + SEO + link a /reembolsos |
| `/privacidad` | 10 secciones + SEO |
| `/reembolsos` | 4 secciones + SEO |
| `/dashboard` | Estadísticas reales |
| `/dashboard/nuevo` | Funcional — upload, email, SuccessModal |
| `/dashboard/documentos` | Funcional — query real + paginación + soft delete |
| `/dashboard/contactos` | Funcional — CRUD + paginación + soft delete |
| `/dashboard/cuenta` | Funcional — datos reales + plan Paddle |
| `/dashboard/firmas` | Funcional — historial + paginación + soft delete |
| `/firmar/[token]` | Funcional — canvas, OTP, pdf-lib, SuccessModal |
| `/firmar/exito` | Funcional — descarga PDF firmado, noindex |

**Build actual: 44 páginas, 0 errores.**

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
  url_pdf_original     text,
  url_pdf_firmado      text,
  token                uuid not null unique default gen_random_uuid(),
  oculto               boolean not null default false,  -- soft delete (migración 006)
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
  verificado           boolean not null default false,
  oculto               boolean not null default false   -- soft delete (migración 006)
);

-- CONTACTOS (migración 003)
create table if not exists contactos (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null references auth.users(id) on delete cascade,
  nombre     text not null,
  correo     text not null,
  empresa    text,
  oculto     boolean not null default false,            -- soft delete (migración 006)
  creado_en  timestamptz not null default now(),
  unique (owner_id, correo)
);

-- SUSCRIPCIONES Paddle (migración 005)
create table suscripciones (
  id                       uuid primary key default gen_random_uuid(),
  owner_id                 uuid not null references auth.users(id) on delete cascade,
  plan                     text not null,               -- 'starter' | 'pro' | 'business'
  estado                   text not null default 'pending', -- 'active' | 'cancelled' | 'past_due' | 'pending'
  paddle_subscription_id   text unique,
  paddle_customer_id       text,
  current_period_end       timestamptz,
  creado_en                timestamptz not null default now(),
  unique (owner_id)
);
```

**Migraciones pendientes de ejecutar en Supabase SQL Editor:**
- `003_contacts.sql` — tabla contactos + RLS
- `006_soft_delete.sql` — columna `oculto` en documentos, firmas, contactos

**Buckets de Storage:**
- `pdfs-originales` — privado, admin client
- `pdfs-firmados` — privado, admin client, URL firmada 24h

---

## Lo que falta antes de producción

### 1. Email con dominio propio
- Configurar dominio `firmiu.com` en Resend
- Cambiar `from: "onboarding@resend.dev"` → `from: "noreply@firmiu.com"` en `documents.ts`
- Agregar `RESEND_API_KEY` real en `.env.local` y en Vercel

### 2. Límites de plan en upload
- Validar en `uploadDocumentAction`: Free = 3 docs/mes, Starter = 50, Pro = 200, Business = ilimitado
- Consultar tabla `suscripciones` + contador mensual en `documentos`
- Mostrar error con CTA a upgrade si se excede el límite

### 3. Eliminar cuenta real
- `deleteAccountAction` en `settings.ts` — eliminar user de Supabase Auth + cancelar suscripción Paddle
- Zona de peligro en `/dashboard/cuenta` actualmente es placeholder

### 4. Deploy en Vercel
- Configurar variables de entorno en Vercel dashboard
- Cambiar `NEXT_PUBLIC_APP_URL` y `NEXT_PUBLIC_SITE_URL` a `https://firmiu.com`
- Verificar que OAuth de Google tenga `https://firmiu.com/auth/callback` como redirect autorizado
- Agregar `RESEND_API_KEY`, `PADDLE_API_KEY`, `PADDLE_WEBHOOK_SECRET` reales

### 5. Ejecutar migraciones pendientes en Supabase
- `003_contacts.sql`
- `006_soft_delete.sql`

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
- **Textos**: SIEMPRE en `messages/es.json` y `messages/en.json`. Nunca hardcodear. Esto incluye meta_title, meta_description y meta_keywords de SEO.
- **Server Actions**: `"use server"` en la primera línea. Las nuevas acciones van en `src/app/actions/`.
- **Formularios con errores**: `useFormState` (React 18, de `react-dom`). Submit usa `<SubmitButton>` con `useFormStatus`.
- **Mutaciones sin formulario**: `useTransition` + `router.refresh()` — NO `useFormState`.
- **Toasts**: importar `toast` desde `@/lib/toast`. Nunca crear estados de error inline en Client Components nuevos.
- **Modales de éxito**: el Server Action retorna `{ success: true, ... }`. El cliente detecta `state.success` en un `useEffect` y muestra `<SuccessModal>`. No usar `redirect()` desde el action cuando se necesita modal.
- **setRequestLocale**: todas las páginas bajo `[locale]` deben llamarlo al inicio.
- **getTranslations vs useTranslations**: `getTranslations` (async) en Server Components; `useTranslations` en Client Components.
- **Middleware**: combina Supabase + protección de rutas + next-intl en un solo archivo. No separar.
- **Variable de entorno**: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (nunca `ANON_KEY`).
- **Prefijo de locale**: español sin prefijo; inglés con `/en`. El helper `const prefix = locale === "es" ? "" : "/en"` se usa en todos los generateMetadata y redirects.
- **`addSignaturePage()`** en `sign.ts`: agrega página nueva con las mismas dimensiones que la primera página del PDF original. NUNCA dibujar sobre páginas existentes.
- **`signDocumentAction`**: retorna `SignResult { errorKey, success?, redirectTo? }`. NO llama a `redirect()` directamente.
- **Soft delete**: SIEMPRE filtrar con `.eq("oculto", false)` en queries del dashboard. Las acciones hide* usan `update({ oculto: true })` + `revalidatePath`.
- **Paginación**: PAGE_SIZE = 10. Parámetro URL `?page=N`. Query con `.range(from, to)` y `{ count: 'exact' }`. Server component lee `searchParams.page`.
- **Checkout Paddle**: el flow es Pricing → cookie + /register?plan= → registerAction → /checkout?plan= (o auth/callback → /checkout?plan=). `CheckoutClient` escucha `firmiu:paddle-success` y `firmiu:paddle-closed`.
- **SEO en páginas nuevas**: toda página pública debe tener `generateMetadata` con title, description, keywords (desde i18n), canonical, hreflang languages (es/en), OG, Twitter, robots.
- **Build**: `npm run build` debe pasar sin errores. Build actual genera 44 páginas.
- **`NEXT_PUBLIC_APP_URL`**: usado en metadata SEO (canonical, OG, sitemap, links de email). En producción debe ser `https://firmiu.com`.
