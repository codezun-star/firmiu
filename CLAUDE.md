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
| Emails | Resend (`noreply@firmiu.com`) | ✅ requiere `RESEND_API_KEY` real |
| Firma en PDF | pdf-lib | ✅ |
| Canvas de firma | react-signature-canvas | ✅ |
| Toasts | Sistema propio por eventos (`toast.ts` + `Toaster.tsx`) | ✅ |
| Pagos | Paddle (`@paddle/paddle-js`) | ✅ Checkout + webhook + límites implementados |
| Deploy | Vercel | ⏳ No configurado |
| Lenguaje | TypeScript strict | ✅ |

---

## Variables de entorno

El archivo `.env.local` ya existe con valores reales. `.env.example` es la plantilla.

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@firmiu.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000   # en producción: https://firmiu.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # usado en OAuth redirectTo

# Paddle
NEXT_PUBLIC_PADDLE_ENV=sandbox              # cambiar a 'production' en Vercel
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=...
NEXT_PUBLIC_PADDLE_PRICE_STARTER=pri_01kq422bt1wz29n1q4vwn1p82m
NEXT_PUBLIC_PADDLE_PRICE_PRO=pri_01kq426n7d2nb2yn1kahrjy99j
NEXT_PUBLIC_PADDLE_PRICE_BUSINESS=pri_01kq42frwhz0kxg9mfs613zhq4
PADDLE_API_KEY=...
PADDLE_WEBHOOK_SECRET=...

# Cron
CRON_SECRET=...   # Vercel lo inyecta automáticamente como Authorization: Bearer
```

> **Regla crítica**: la variable es `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, NO `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Supabase la renombró. Nunca usar el nombre viejo.

---

## Estructura de carpetas

```
firmiu/
├── messages/
│   ├── es.json               # Traducciones ES (default) — 550 claves
│   └── en.json               # Traducciones EN — 550 claves (paridad exacta)
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout (metadataBase → firmiu.com, fallback SEO)
│   │   ├── globals.css       # Tailwind + Inter + keyframes de animaciones de modales
│   │   ├── sitemap.ts        # Sitemap XML (todas las rutas públicas ES+EN)
│   │   ├── robots.ts         # robots.txt (bloquea /dashboard/ y /firmar/)
│   │   ├── actions/
│   │   │   ├── auth.ts       # registerAction, loginAction, logoutAction, googleLoginAction, forgotPasswordAction, resetPasswordAction
│   │   │   ├── documents.ts  # uploadDocumentAction (con límites de plan), hideDocumentAction
│   │   │   ├── sign.ts       # signDocumentAction, downloadSignedPdfAction, hideSignatureAction
│   │   │   ├── contacts.ts   # addContactAction, deleteContactAction, hideContactAction
│   │   │   └── settings.ts   # updateProfileAction, updatePasswordAction
│   │   ├── api/
│   │   │   ├── cron/reset-docs/route.ts  # Cron mensual — resetea documentos_mes en suscripciones
│   │   │   └── paddle/webhook/route.ts   # Webhook Paddle → upsert suscripciones + webhook_logs
│   │   ├── auth/
│   │   │   └── callback/route.ts  # OAuth callback → cookie firmiu_pending_plan → /checkout o /dashboard
│   │   └── [locale]/
│   │       ├── layout.tsx         # Locale layout (html lang + NextIntlClientProvider + Toaster)
│   │       ├── page.tsx           # Landing con generateMetadata + JSON-LD + FAQ
│   │       ├── login/
│   │       │   ├── page.tsx
│   │       │   └── LoginForm.tsx
│   │       ├── register/
│   │       │   ├── page.tsx       # acepta ?plan= para checkout flow
│   │       │   └── RegisterForm.tsx  # hidden input plan
│   │       ├── checkout/
│   │       │   ├── page.tsx           # Server: valida ?plan=, requiere sesión
│   │       │   └── CheckoutClient.tsx # Client: abre Paddle tras 1.5s; escucha paddle-success/closed
│   │       ├── recuperar/page.tsx + RecuperarForm.tsx   # noindex
│   │       ├── nueva-contrasena/page.tsx + NuevaContrasenaForm.tsx  # noindex
│   │       ├── nosotros/page.tsx
│   │       ├── contacto/page.tsx
│   │       ├── terminos/page.tsx       # 13 secciones + link a /reembolsos
│   │       ├── privacidad/page.tsx     # 10 secciones
│   │       ├── reembolsos/page.tsx     # 4 secciones
│   │       ├── dashboard/
│   │       │   ├── layout.tsx          # DashboardNav + PendingPlanChecker
│   │       │   ├── page.tsx            # Estadísticas: enviados/pendientes/firmados + sparkline
│   │       │   ├── nuevo/page.tsx + NuevoForm.tsx
│   │       │   ├── documentos/page.tsx + DocumentosClient.tsx   # tabs + paginación + soft delete
│   │       │   ├── contactos/page.tsx + ContactosClient.tsx     # CRUD + búsqueda + paginación
│   │       │   ├── cuenta/page.tsx + SettingsClient.tsx         # perfil + contraseña + plan
│   │       │   └── firmas/page.tsx + FirmasClient.tsx           # historial + paginación
│   │       └── firmar/
│   │           ├── [token]/page.tsx + FirmarClient.tsx  # canvas + OTP + brute-force
│   │           └── exito/page.tsx                       # noindex — descarga PDF firmado
│   ├── components/
│   │   ├── Logo.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx                    # Privacidad · Términos · Reembolsos
│   │   ├── AuthPageShell.tsx             # Wrapper visual para login/register/recuperar
│   │   ├── AuthLanguageSwitcher.tsx      # Selector ES/EN en páginas de auth
│   │   ├── DashboardSidebar.tsx
│   │   ├── DashboardNav.tsx
│   │   ├── GoogleButton.tsx
│   │   ├── SubmitButton.tsx
│   │   ├── DownloadSignedButton.tsx      # Props: token, ctaLabel, loadingLabel, hintLabel?, expiredLabel
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
│   │       ├── FAQ.tsx                   # <details>/<summary> — indexable sin JS
│   │       └── CtaBanner.tsx
│   ├── lib/
│   │   ├── toast.ts
│   │   ├── paddle.ts                     # getPaddle(), openCheckout(); lee NEXT_PUBLIC_PADDLE_ENV
│   │   ├── security.ts                   # escapeHtml, isValidEmail, isValidUUID, isValidPassword, isValidVerificationCode, sanitizeText, sanitizeRedirectPath
│   │   └── supabase/
│   │       ├── client.ts
│   │       ├── server.ts
│   │       └── admin.ts
│   ├── i18n.ts
│   ├── navigation.ts
│   └── middleware.ts                     # PROTECTED: /dashboard, /nueva-contrasena, /checkout
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql        # documentos, firmas, RLS
│       ├── 002_add_vpn_field.sql         # firmas: vpn_detectado, ubicacion_ciudad, ubicacion_pais
│       ├── 003_contacts.sql             # tabla contactos + RLS
│       ├── 004_security.sql             # firmas: intentos_fallidos, bloqueado (brute-force)
│       ├── 005_paddle.sql               # tabla suscripciones + RLS
│       └── 006_soft_delete.sql          # oculto en documentos/firmas/contactos + índices
├── vercel.json                           # Cron job: reset-docs el día 1 de cada mes
├── next.config.js                        # Security headers (HSTS, CSP, X-Frame, etc.)
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
**Nunca** hardcodear textos en componentes. Siempre agregar en `messages/es.json` y `messages/en.json`. Las 550 claves están en paridad exacta.

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
auth.errors.*            → mensajes de error
auth.register.*          → formulario de registro (+ meta_title, meta_description, meta_keywords)
auth.login.*             → formulario de login (+ meta_title, meta_description, meta_keywords)
auth.google_button / auth.or_continue_with / auth.panel.*
auth.forgot_password.*   → recuperar contraseña
dashboard.*              → panel principal
documents.*              → lista de documentos (incluye cancel, hide_confirm, hide)
nuevo.*                  → subir nuevo documento (incluye nuevo.errors.*, modal_title, modal_subtitle)
sign.*                   → página pública de firma (incluye already_signed_*, errors.*, signing, pdf_error)
sign_success.*           → página post-firma (incluye download_loading)
contacts_page.*          → módulo de contactos (incluye hide_confirm, hide, pagination.*)
firmas_page.*            → módulo de firmas (incluye cancel, hide, hide_confirm, pagination.*)
settings.*               → módulo de cuenta/configuración (incluye planes)
pagination.*             → previous, next, page_of, showing
terms.*                  → términos de servicio (s1..s13)
privacy.*                → política de privacidad (s1..s10)
refund.*                 → política de reembolsos (s1..s4)
about.*                  → página nosotros
contact.*                → página contacto
footer.*                 → footer (incluye refunds)
checkout.*               → página checkout (loading, go_dashboard, error)
pending_plan.*           → loader de suscripción pendiente
```

---

## Lo que está implementado y funcionando

### ✅ Infraestructura base
- Next.js 14 App Router con TypeScript strict
- next-intl: español sin prefijo (default), inglés con `/en`, localeDetection: false
- Tres clientes Supabase: browser, server y admin (service role)
- Middleware combinado: refresca sesión + protege rutas + maneja locales + bloquea paths maliciosos (>2048 chars, null bytes, `..`)
- Security headers en next.config.js: HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy

### ✅ Sistema de toasts
- `toast.success()`, `toast.error()`, `toast.warning()`, `toast.info()`
- Dispatcher via `window.dispatchEvent(new CustomEvent("firmiu:toast", {...}))`
- 4 tipos, auto-dismiss diferenciado, máx 3 simultáneos, botón X

### ✅ Modal de éxito (`SuccessModal.tsx`)
- Props: `title`, `subtitle`, `redirectTo`, `delayMs` (default 3200ms)
- SVG animado (círculo + checkmark), barra countdown, auto-redirect

### ✅ Autenticación completa
- Registro email/contraseña + Google OAuth, Login, Recuperar contraseña
- `auth/callback/route.ts` usa `sanitizeRedirectPath` contra open-redirect
- Lee cookie `firmiu_pending_plan` → redirige a `/checkout?plan=...`

### ✅ Checkout / Pagos con Paddle
- `paddle.ts`: lee `NEXT_PUBLIC_PADDLE_ENV` — `=== 'production'` activa producción, cualquier otro valor usa sandbox
- Precio IDs configurados via `NEXT_PUBLIC_PADDLE_PRICE_*` en env vars
- Planes y límites mensuales (webhook los registra en tabla `suscripciones`):
  - Free (sin suscripción): 3 docs/mes
  - Starter (`pri_01kq422bt1wz29n1q4vwn1p82m`): 30 docs/mes
  - Pro (`pri_01kq426n7d2nb2yn1kahrjy99j`): 100 docs/mes
  - Business (`pri_01kq42frwhz0kxg9mfs613zhq4`): ilimitado (999999)
- Webhook verifica firma HMAC-SHA256 con `crypto.timingSafeEqual`
- Intenta log en tabla `webhook_logs` (no-fatal si tabla no existe)
- `PendingPlanChecker.tsx`: limpia cookie/localStorage si el plan ya está activo

### ✅ Límites de plan en upload
- `uploadDocumentAction` consulta `suscripciones` para obtener `limite_documentos` y `documentos_mes`
- Plan activo: bloquea si `documentos_mes >= limite_documentos`
- Plan free: cuenta docs del mes actual desde tabla `documentos` — bloquea si `>= 3`
- Tras upload exitoso: incrementa `documentos_mes` en `suscripciones`
- Error: retorna `errorKey: "plan_limit_reached"`

### ✅ Seguridad en Server Actions
- `uploadDocumentAction`: valida PDF (tipo, 20MB), email, nombre — sanitización con `sanitizeText`/`isValidEmail`
- `signDocumentAction`: UUID del token + código 4 dígitos validados antes de tocar DB
- `downloadSignedPdfAction`: UUID del token validado antes de consultar DB
- Brute-force en firma: 5 intentos fallidos → `bloqueado = true` (migración 004); retorna `errorKey: "code_blocked"`
- `hideDocumentAction` / `hideContactAction`: verifican `owner_id` del usuario autenticado
- `hideSignatureAction`: verifica ownership via join firmas → documentos → owner_id
- Email HTML: usa `escapeHtml()` en todos los datos del usuario

### ✅ Upload de documentos (`/dashboard/nuevo`)
1. Valida PDF + destinatario + límite de plan
2. Sube a `pdfs-originales/{owner_id}/{docId}.pdf` con admin client
3. Inserta en `documentos` con server client (RLS)
4. Genera código 4 dígitos, inserta en `firmas` con admin client
5. Envía email con Resend desde `noreply@firmiu.com` (falla silenciosamente)
6. Incrementa `documentos_mes` en `suscripciones`
7. Retorna `{ success: true }` → `SuccessModal` → `/dashboard/documentos`

### ✅ Firma de documentos (`/firmar/[token]`)
1. Valida UUID del token + código 4 dígitos + brute-force check
2. IP capture + geolocalización (ip-api.com HTTP, timeout 3s, non-fatal)
3. Descarga PDF original, agrega **página nueva** (mismas dimensiones que página 1) con firma + audit trail
4. Sube PDF firmado a `pdfs-firmados`, actualiza `documentos` y `firmas`
5. Enriches `firmas` con browser/OS parseados, geo, VPN detection (non-fatal, por si migración no está)
6. Retorna `{ success: true, redirectTo }` → `SuccessModal` → `/firmar/exito?token=...`

### ✅ Dashboard — módulos con datos reales
**Todos los módulos del dashboard comparten:**
- Paginación server-side: PAGE_SIZE=10, `?page=N`, `.range(from, to)`, `count: 'exact'`
- Soft delete: `.eq("oculto", false)` + botón "Ocultar" con confirmación inline
- `router.refresh()` tras mutaciones (useTransition)
- Queries filtran explícitamente por `owner_id` (defensa en profundidad sobre RLS)

**`/dashboard`** — estadísticas reales: enviados/pendientes/firmados del mes + sparkline + 5 recientes

**`/dashboard/documentos`** — query + tabs por estado (3 queries paralelas para conteos) + signed URLs para preview/descarga

**`/dashboard/contactos`** — CRUD + búsqueda + avatares deterministas + "Enviar documento" → /nuevo?nombre=&correo=

**`/dashboard/firmas`** — historial de firmas con audit trail + timezone `America/Tegucigalda`

**`/dashboard/cuenta`** — datos reales, plan actual desde `suscripciones`, zona de peligro (placeholder)

### ✅ SEO agresivo — todas las páginas públicas
- Landing: JSON-LD (Organization + WebSite + SoftwareApplication + FAQPage), hreflang, OG, Twitter Card
- Todas las páginas públicas: `generateMetadata` con title/description/keywords (i18n), canonical, hreflang, OG, Twitter, robots
- `sitemap.ts`: ES+EN, prioridades correctas (/ → 1.0, /register → 0.9, /login → 0.8…)
- `robots.ts`: bloquea `/dashboard/` y `/firmar/`
- `metadataBase`: `https://firmiu.com`
- `FAQ.tsx`: `<details>/<summary>` — indexable sin JS

### ✅ Estado de páginas — Build: 44 páginas, 0 errores

| Ruta | Estado |
|---|---|
| `/` | Landing completa: SEO, FAQ, JSON-LD |
| `/login` | Funcional + SEO |
| `/register` | Funcional + SEO + checkout flow |
| `/checkout` | Funcional — Paddle checkout |
| `/recuperar` | Funcional, noindex |
| `/nueva-contrasena` | Funcional, noindex |
| `/nosotros` | Completo + SEO |
| `/contacto` | Completo + SEO |
| `/terminos` | 13 secciones + SEO |
| `/privacidad` | 10 secciones + SEO |
| `/reembolsos` | 4 secciones + SEO |
| `/dashboard` | Estadísticas reales |
| `/dashboard/nuevo` | Funcional — upload + límites de plan + email + SuccessModal |
| `/dashboard/documentos` | Funcional — paginación + soft delete + signed URLs |
| `/dashboard/contactos` | Funcional — CRUD + paginación + soft delete |
| `/dashboard/cuenta` | Funcional — perfil + contraseña + plan actual |
| `/dashboard/firmas` | Funcional — historial + paginación + soft delete |
| `/firmar/[token]` | Funcional — canvas + OTP + brute-force + pdf-lib |
| `/firmar/exito` | Funcional — descarga PDF firmado, noindex |

---

## Esquema de base de datos

```sql
-- ENUM
create type estado_documento as enum ('pendiente', 'visto', 'firmado');

-- documentos (migración 001 + 006)
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
  oculto               boolean not null default false,
  creado_en            timestamptz not null default now()
);

-- firmas (migraciones 001 + 002 + 004 + 006)
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
  oculto               boolean not null default false,
  -- migración 002:
  vpn_detectado        boolean default false,
  ubicacion_ciudad     text,
  ubicacion_pais       text,
  -- migración 004 (brute-force):
  intentos_fallidos    integer not null default 0,
  bloqueado            boolean not null default false
);

-- contactos (migración 003 + 006)
create table contactos (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null references auth.users(id) on delete cascade,
  nombre     text not null,
  correo     text not null,
  empresa    text,
  oculto     boolean not null default false,
  creado_en  timestamptz not null default now(),
  unique (owner_id, correo)
);
-- RLS: auth.uid() = owner_id (all operations)

-- suscripciones (migración 005)
create table suscripciones (
  id                     uuid primary key default gen_random_uuid(),
  owner_id               uuid not null references auth.users(id) on delete cascade,
  paddle_subscription_id text unique,
  paddle_customer_id     text,
  plan                   text not null default 'free',
  estado                 text not null default 'active',
  documentos_mes         integer not null default 0,       -- contador mensual (cron lo resetea)
  limite_documentos      integer not null default 3,       -- Free=3, Starter=30, Pro=100, Business=999999
  periodo_inicio         timestamptz,
  periodo_fin            timestamptz,
  creado_en              timestamptz not null default now(),
  actualizado_en         timestamptz not null default now()
);
-- RLS: auth.uid() = owner_id (select only; webhook usa admin client)

-- webhook_logs (sin migración aún — tabla opcional)
-- El webhook intenta insertar aquí; falla silenciosamente si no existe.
-- Crear manualmente si se necesita auditar eventos de Paddle:
create table if not exists webhook_logs (
  id          uuid primary key default gen_random_uuid(),
  evento      text,
  custom_data text,
  owner_id    uuid,
  resultado   text,
  creado_en   timestamptz not null default now()
);
```

**Migraciones — ejecutar todas en orden en Supabase SQL Editor si no se han aplicado:**
```
001_initial_schema.sql  → documentos, firmas, RLS base
002_add_vpn_field.sql   → firmas: vpn_detectado, ubicacion_ciudad, ubicacion_pais
003_contacts.sql        → tabla contactos + RLS
004_security.sql        → firmas: intentos_fallidos, bloqueado
005_paddle.sql          → tabla suscripciones + RLS
006_soft_delete.sql     → oculto en documentos/firmas/contactos + índices
```

**Buckets de Storage (crear en Supabase si no existen):**
- `pdfs-originales` — privado, acceso solo via admin client
- `pdfs-firmados` — privado, admin client, URLs firmadas (1h en dashboard, 24h en /firmar/exito)

---

## Lo que falta antes de lanzar a producción

### 1. Configurar Resend con dominio propio
- Verificar dominio `firmiu.com` en el panel de Resend
- Agregar `RESEND_API_KEY` real en Vercel

### 2. Deploy en Vercel
- Variables de entorno en Vercel dashboard (todas las de `.env.example`)
- `NEXT_PUBLIC_APP_URL=https://firmiu.com`
- `NEXT_PUBLIC_SITE_URL=https://firmiu.com`
- `NEXT_PUBLIC_PADDLE_ENV=production`
- `CRON_SECRET=<valor seguro>` — Vercel lo inyecta en el header del cron
- Verificar redirect autorizado en Google OAuth: `https://firmiu.com/auth/callback`
- Configurar Paddle webhook URL: `https://firmiu.com/api/paddle/webhook`

### 3. Ejecutar migraciones en Supabase
- Aplicar 001 → 006 en orden en el SQL Editor si no se han ejecutado

### 4. Eliminar cuenta (zona de peligro)
- `deleteAccountAction` en `settings.ts` — aún es placeholder
- Debe: cancelar suscripción en Paddle API + eliminar usuario en Supabase Auth

### 5. tabla webhook_logs (opcional pero recomendado)
- Crear la tabla manualmente en Supabase para auditar eventos de Paddle

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
| Bypasear RLS (storage, tabla firmas, sign, webhook) | `src/lib/supabase/admin.ts` | `createAdminClient()` |

### Reglas de desarrollo
- **Textos**: SIEMPRE en `messages/es.json` y `messages/en.json`. Nunca hardcodear. Incluye placeholders, labels, meta_title, meta_description, meta_keywords.
- **Server Actions**: `"use server"` en la primera línea. Las nuevas acciones van en `src/app/actions/`.
- **Formularios con errores**: `useFormState` (React 18, de `react-dom`). Submit usa `<SubmitButton>` con `useFormStatus`.
- **Mutaciones sin formulario**: `useTransition` + `router.refresh()` — NO `useFormState`.
- **Toasts**: importar `toast` desde `@/lib/toast`. Nunca crear estados de error inline en Client Components.
- **Modales de éxito**: el Server Action retorna `{ success: true, ... }`. El cliente detecta `state.success` en un `useEffect` y muestra `<SuccessModal>`. No usar `redirect()` desde el action cuando se necesita modal.
- **setRequestLocale**: todas las páginas bajo `[locale]` deben llamarlo al inicio.
- **getTranslations vs useTranslations**: `getTranslations` (async) en Server Components; `useTranslations` en Client Components.
- **Middleware**: combina Supabase + protección de rutas + next-intl en un solo archivo. No separar.
- **Variable de entorno Supabase**: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (nunca `ANON_KEY`).
- **Prefijo de locale**: español sin prefijo; inglés con `/en`. Helper: `const prefix = locale === "es" ? "" : "/en"`.
- **`addSignaturePage()`** en `sign.ts`: agrega página nueva con las mismas dimensiones que la primera página del PDF original. NUNCA dibujar sobre páginas existentes.
- **`signDocumentAction`**: retorna `SignResult { errorKey, success?, redirectTo? }`. NO llama a `redirect()` directamente.
- **Soft delete**: SIEMPRE filtrar con `.eq("oculto", false)` en queries del dashboard. Las acciones hide* usan `update({ oculto: true })` + `revalidatePath`.
- **Paginación**: PAGE_SIZE = 10. Parámetro URL `?page=N`. Query con `.range(from, to)` y `{ count: 'exact' }`. Server component lee `searchParams.page`.
- **Paddle environment**: `paddle.ts` lee `NEXT_PUBLIC_PADDLE_ENV`. Comparación estricta `=== 'production'` — cualquier otro valor activa sandbox. Cambiar a `'production'` en Vercel para producción.
- **Checkout Paddle flow**: Pricing → cookie `firmiu_pending_plan` + `/register?plan=` → registerAction → `/checkout?plan=` (o auth/callback → `/checkout?plan=`). `CheckoutClient` escucha `firmiu:paddle-success` y `firmiu:paddle-closed`.
- **Límites de plan**: consultados en `uploadDocumentAction` desde tabla `suscripciones`. Cron job resetea `documentos_mes` el día 1 de cada mes. Asegurarse que `CRON_SECRET` está en Vercel.
- **`DownloadSignedButton`**: requiere prop `loadingLabel` (obligatoria). Pasarla desde el componente padre usando `t("sign_success.download_loading")` o `t("already_signed_loading")` según contexto.
- **SEO en páginas nuevas**: toda página pública debe tener `generateMetadata` con title, description, keywords (desde i18n), canonical, hreflang languages (es/en), OG, Twitter, robots.
- **Build**: `npm run build` debe pasar sin errores. Build actual genera 44 páginas.
- **`NEXT_PUBLIC_APP_URL`**: usado en metadata SEO (canonical, OG, sitemap, links de email). En producción: `https://firmiu.com`.
