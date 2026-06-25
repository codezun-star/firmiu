# Firmiu — Contexto del proyecto para Claude Code

## Qué es Firmiu

SaaS de firma digital de documentos orientado a Latinoamérica. Dirigido a contadores, abogados, inmobiliarias y pequeños negocios que necesitan firmar PDFs sin impresoras ni escáneres.

**Flujo principal (multi-firmante):**
1. El dueño sube un PDF y coloca **uno o varios firmantes** (hasta 5), posicionando el área de firma de cada uno sobre el documento (preview con pdf.js)
2. Cada firmante recibe un correo con un enlace único `/firmar/[token]` (token propio por firmante)
3. El firmante **dibuja su firma O sube una imagen** de su firma + escribe un código de verificación de 4 dígitos
4. Su firma se estampa en la posición asignada (pdf-lib). Cuando **todos** firman, se agrega una página final de **Certificado de firma digital** (firmantes en orden + huella SHA-256 del documento + folio) y el PDF queda disponible para descargar con su título original

> El flujo de **un solo firmante** original sigue vivo como *legacy* (tabla `firmas`, página de constancia individual) para documentos antiguos. Los documentos **nuevos** siempre usan la tabla `firmantes` (multi-firmante), incluso con un solo firmante.

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
| Preview de PDF (posicionar firmas) | **pdfjs-dist `4.7.76` (FIJADA — no subir a v5)** | ✅ ver sección "⚠️ PDF preview" |
| Canvas de firma | react-signature-canvas | ✅ |
| Toasts | Sistema propio por eventos (`toast.ts` + `Toaster.tsx`) | ✅ |
| Pagos | Paddle (`@paddle/paddle-js`) | ✅ Checkout + webhook + cancelación implementados |
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
# ⚠️ Price IDs: sandbox y producción tienen IDs DISTINTOS. El webhook
# (api/paddle/webhook) los lee de estas MISMAS vars (buildPricePlan), así que
# deben coincidir con los precios reales de tu cuenta Paddle del entorno activo.
NEXT_PUBLIC_PADDLE_PRICE_STARTER=pri_...
NEXT_PUBLIC_PADDLE_PRICE_PRO=pri_...
NEXT_PUBLIC_PADDLE_PRICE_BUSINESS=pri_...
PADDLE_API_KEY=...
PADDLE_WEBHOOK_SECRET=...   # OBLIGATORIO en producción (el webhook rechaza si falta)

# Cron
CRON_SECRET=...   # Vercel lo inyecta automáticamente como Authorization: Bearer
```

> **Regla crítica**: la variable es `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, NO `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Supabase la renombró. Nunca usar el nombre viejo.

---

## Estructura de carpetas

```
firmiu/
├── messages/
│   ├── es.json               # Traducciones ES (default) — ~620 claves
│   └── en.json               # Traducciones EN — ~620 claves (paridad exacta)
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout (metadataBase → firmiu.com, fallback SEO)
│   │   ├── globals.css       # Tailwind + Inter + keyframes de animaciones de modales
│   │   ├── sitemap.ts        # Sitemap XML (todas las rutas públicas ES+EN)
│   │   ├── robots.ts         # robots.txt (bloquea /dashboard/ y /firmar/)
│   │   ├── actions/
│   │   │   ├── auth.ts       # registerAction, loginAction, logoutAction, googleLoginAction, forgotPasswordAction, resetPasswordAction
│   │   │   ├── documents.ts  # uploadDocumentAction (legacy 1 firmante) + uploadDocumentMultiAction (multi-firmante con posición), resend/update por firmante, hideDocumentAction
│   │   │   ├── sign.ts       # signDocumentAction (firmantes + legacy), drawSignatureOnPage, addCertificatePage, downloadSignedPdfAction, hideSignatureAction
│   │   │   ├── contacts.ts   # addContactAction, deleteContactAction, hideContactAction
│   │   │   └── settings.ts   # updateProfileAction, updatePasswordAction, deleteAccountAction, cancelSubscriptionAction
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
│   │       │   ├── cuenta/page.tsx + SettingsClient.tsx         # perfil + contraseña + plan + cancelar + eliminar cuenta
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
│       ├── 006_soft_delete.sql          # oculto en documentos/firmas/contactos + índices
│       ├── 007_recordatorios.sql        # cron de recordatorios automáticos (48h)
│       ├── 008_firmantes.sql            # tabla firmantes (multi-firmante, hasta 5, posición + audit por firmante)
│       ├── 009_webhook_logs.sql         # tabla webhook_logs (auditoría de eventos Paddle)
│       ├── 010_atomic_counter.sql       # RPC increment_documentos_mes (contador atómico, sin lost-update)
│       └── 011_firma_imagen.sql         # firmantes: firma_imagen + firma_timezone (para el certificado)
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
**Nunca** hardcodear textos en componentes. Siempre agregar en `messages/es.json` y `messages/en.json`. Paridad exacta entre ambos archivos.

```
nav.*                    → navbar y sidebar
home.hero.*              → hero landing (mock_* para strings decorativas)
home.how_it_works.*      → sección cómo funciona
home.features_section.*  → cards de características
home.testimonials.*      → testimonios
home.in_context.*        → estadísticas
home.cta_banner.*        → banner final
home.features.*          → sección visual upload/sign/download
home.pricing.*           → precios y planes (incluye features arrays de cada plan)
home.faq.*               → FAQ (title, subtitle, q1-q8, a1-a8)
auth.errors.*            → mensajes de error
auth.register.*          → formulario de registro (+ meta, placeholders)
auth.login.*             → formulario de login (+ meta, placeholders)
auth.google_button / auth.or_continue_with / auth.panel.*
auth.forgot_password.*   → recuperar contraseña
dashboard.*              → panel principal
documents.*              → lista de documentos (incluye cancel, hide_confirm, hide)
nuevo.*                  → subir nuevo documento (incluye nuevo.errors.*, modal_title, modal_subtitle, placeholders)
sign.*                   → página pública de firma (incluye already_signed_*, errors.*, signing, pdf_error)
sign_success.*           → página post-firma (incluye download_loading)
contacts_page.*          → módulo de contactos (incluye hide_confirm, hide, pagination.*, placeholders)
firmas_page.*            → módulo de firmas (incluye cancel, hide, hide_confirm, pagination.*)
settings.*               → módulo de cuenta/configuración (incluye planes, cancel_sub_*, delete_*)
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
- Precio IDs configurados via `NEXT_PUBLIC_PADDLE_PRICE_*` en env vars. El webhook
  arma su mapeo price→plan desde esas MISMAS vars (`buildPricePlan`), NO hardcodea
  IDs — antes los tenía hardcodeados y NO coincidían con el checkout, registrando
  todo como "starter". Si un price ID no se reconoce, loguea un error.
- Planes y límites mensuales (webhook los registra en tabla `suscripciones`):
  - Free (sin suscripción): 3 docs/mes
  - Starter: 30 docs/mes · Pro: 100 docs/mes · Business: ilimitado (999999)
- Webhook: verifica firma HMAC-SHA256 (`crypto.timingSafeEqual`). En producción
  **falla cerrado** si falta `PADDLE_WEBHOOK_SECRET` (no procesa sin firma).
- Intenta log en tabla `webhook_logs` (no-fatal si tabla no existe)
- `PendingPlanChecker.tsx`: limpia cookie/localStorage si el plan ya está activo

### ✅ Cancelar suscripción (`cancelSubscriptionAction`)
- Llama `POST /subscriptions/{id}/cancel` en Paddle API con `effective_from: 'next_billing_period'`
- El usuario mantiene acceso hasta fin del período pagado
- Marca `estado = 'canceling'` en DB; el webhook `subscription.canceled` cambia el plan a free cuando llega
- `cuenta/page.tsx` trata `estado === 'canceling'` igual que `active` para mostrar plan y límite correctos
- UI en `/dashboard/cuenta`: botón inline para planes de pago, confirmación en 2 pasos, badge naranja si ya está cancelando

### ✅ Eliminar cuenta (`deleteAccountAction`)
- Cancela suscripción Paddle (non-fatal), soft-delete documentos, hard-delete contactos y suscripción
- Elimina usuario de Supabase Auth (cascade limpia el resto)
- UI: flujo 2 pasos con input de confirmación (escribe "ELIMINAR"/"DELETE"), spinner
- Después del éxito: `supabase.auth.signOut()` + `router.push('/')`

### ✅ Límites de plan en upload
- `uploadDocumentAction` consulta `suscripciones` para obtener `limite_documentos` y `documentos_mes`
- Plan activo o cancelando: bloquea si `documentos_mes >= limite_documentos`
- Plan free: cuenta docs del mes actual desde tabla `documentos` — bloquea si `>= 3`
- Tras upload exitoso: incrementa `documentos_mes` en `suscripciones`
- Error: retorna `errorKey: "plan_limit_reached"`

### ✅ Seguridad en Server Actions
- `uploadDocumentAction`: valida PDF (tipo, 20MB), email, nombre — sanitización con `sanitizeText`/`isValidEmail`
- `signDocumentAction`: UUID del token + código 4 dígitos validados antes de tocar DB
- `downloadSignedPdfAction`: UUID del token validado antes de consultar DB
- Brute-force en firma: 5 intentos fallidos → `bloqueado = true` (migración 004); retorna `errorKey: "code_blocked"`
- `hideDocumentAction` / `hideContactAction`: verifican `owner_id` del usuario autenticado
- `hideSignatureAction`: maneja `firmantes` Y `firmas` (legacy); verifica ownership via join → documentos → owner_id
- Email HTML: usa `escapeHtml()` en todos los datos del usuario

### ✅ Upload de documentos (`/dashboard/nuevo`) — flujo MULTI-FIRMANTE
Wizard de 3 pasos (Documento → Posicionar → Firmantes). Usa `uploadDocumentMultiAction`:
1. Valida PDF (incl. **magic bytes** `%PDF-`), 1–5 firmantes (nombre+correo+posición), límite de plan
2. Sube a `pdfs-originales/{owner_id}/{docId}.pdf` con admin client
3. Inserta `documentos` (server, RLS) + N filas en `firmantes` (admin), cada una con su token, código y posición
4. Envía N emails con Resend (uno por firmante, falla silenciosamente)
5. Incrementa `documentos_mes` vía `rpc("increment_documentos_mes")` (atómico)
6. Retorna `{ success: true }` → `SuccessModal` → `/dashboard/documentos`

> `uploadDocumentAction` (legacy, 1 firmante, inserta en `firmas`) sigue existiendo pero el wizard nuevo siempre usa el flujo multi-firmante.

### ✅ Firma de documentos (`/firmar/[token]`) — multi-firmante + legacy
`signDocumentAction` busca el token primero en `firmantes` (flujo nuevo); si no, cae a `documentos`+`firmas` (legacy).
1. Valida UUID del token + código 4 dígitos + brute-force check (5 intentos → `bloqueado`)
2. El firmante **dibuja su firma O sube una imagen** (tabs "Dibujar / Subir imagen"). La imagen se procesa en cliente: escala + fondo blanco→transparente → PNG data URL
3. IP capture + geolocalización (ip-api.com HTTP, timeout 3s, non-fatal)
4. Descarga el PDF actual (firmado acumulado o el original) y **estampa la firma en la posición del firmante** (`drawSignatureOnPage`) — solo la imagen, SIN caja de color
5. Guarda audit del firmante (incl. `firma_imagen` + `firma_timezone`)
6. Cuando **TODOS** firman (`allSigned`): agrega UNA página de **Certificado** (`addCertificatePage`) con los firmantes en orden + mini-firma + datos + **huella SHA-256 del PDF original** + folio (= `documento.id`). Notifica al dueño por email
7. `documento.estado` = `firmado` (todos) o `visto` (parcial). Retorna `{ success, redirectTo }` → `/firmar/exito?token=...`

### ✅ Multi-firmante, certificado y subir firma (lo más nuevo)
- **Subida multi-firmante** (`uploadDocumentMultiAction`): hasta 5 firmantes, cada uno con nombre, correo y **posición** del campo de firma elegida en el preview ([`PdfPosicionador.tsx`](src/app/[locale]/dashboard/nuevo/PdfPosicionador.tsx)). Crea N filas en `firmantes`, envía N emails.
- **Certificado consolidado** (`addCertificatePage` en `sign.ts`): UNA página final, firmantes en **orden** (`orden`), tarjeta por firmante con mini-firma + nombre + correo + fecha/hora (en su zona horaria) + IP + dispositivo + ubicación, recuadro de **integridad** (SHA-256 + folio) y resumen "Completado el …". Nombres con `titleCase`. Reemplaza la antigua página-por-firmante. El **legacy** (`addSignaturePage`) sigue para docs de un solo firmante de la tabla `firmas`.
- **Estampado limpio** (`drawSignatureOnPage`): solo la imagen de la firma, sin recuadro de color ni tinte. Tamaño de campo reducido (FIELD_W=0.30, FIELD_H=0.06) para que quepa sobre la línea. Los colores por firmante viven solo en el preview y en el certificado.
- **Panel — detalle por firmante** ([`DocumentosClient.tsx`](src/app/[locale]/dashboard/documentos/DocumentosClient.tsx)): "Ver detalle del envío" despliega nombre + correo + estado de cada firmante, con **corregir correo** (`updateFirmanteEmailAction` → guarda y reenvía) y **reenviar** por firmante (`resendFirmanteEmailAction`). Equivalente legacy: `updateDocumentEmailAction` + `resendSigningEmailAction`.
- **Descarga con nombre real**: las URLs firmadas usan `{ download: \`${safeFilename(titulo)}.pdf\` }` (helper en `lib/utils.ts`) — no el UUID.
- **Dashboard / actividad**: el feed fusiona `firmantes` (firmado) + `firmas` (legacy), ordenado por fecha.

### ✅ Robustez (fixes recientes)
- **Contador de plan atómico**: `uploadDocument*Action` usa `admin.rpc("increment_documentos_mes", { p_sub_id })` (migración 010) en vez de read-then-write.
- **Limpieza de storage**: `deleteAccountAction` borra los PDFs de `pdfs-originales` y `pdfs-firmados` del usuario antes de eliminarlo (el cascade de DB no toca Storage).
- **Validación de PDF por magic bytes** (`%PDF-`) además de extensión/MIME, en ambas subidas.
- **Reenvío resetea bloqueo** brute-force del firmante/firma.
- **Webhook Paddle**: paginación al buscar usuario por email; logs sin PII; `mapStatus` falla cerrado en estados desconocidos.
- **Audit trail / certificado bilingües** (ES/EN) según el locale del firmante.
- **Emails**: helpers compartidos en `lib/email.ts` (`emailShell`, `codeBox`, `ctaButton`).

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

**`/dashboard/cuenta`** — perfil, contraseña, plan actual, cancelar suscripción (2 pasos), eliminar cuenta (2 pasos + confirmación escrita)

### ✅ SEO agresivo — todas las páginas públicas
- Landing: JSON-LD (Organization + WebSite + SoftwareApplication + FAQPage), hreflang, OG, Twitter Card
- Todas las páginas públicas: `generateMetadata` con title/description/keywords (i18n), canonical, hreflang, OG, Twitter, robots
- `sitemap.ts`: ES+EN, prioridades correctas (/ → 1.0, /register → 0.9, /login → 0.8…)
- `robots.ts`: bloquea `/dashboard/` y `/firmar/`
- `metadataBase`: `https://firmiu.com`
- `FAQ.tsx`: `<details>/<summary>` — indexable sin JS

### ✅ Estado de páginas — Build: 321 páginas, 0 errores
(El salto de páginas viene del SEO programático: ~44 países + ~62 profesiones + ~34 artículos de blog × ES/EN. Ver `lib/countries.ts`, `lib/usecases.ts`, `lib/blog.ts`.)

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
| `/dashboard/cuenta` | Funcional — perfil + contraseña + plan + cancelar suscripción + eliminar cuenta |
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

-- firmantes (migración 008 + 011) — modelo MULTI-FIRMANTE (reemplaza firmas para docs nuevos)
-- Cada documento puede tener hasta 5 firmantes; cada uno con su token, posición y audit propio.
create table firmantes (
  id                   uuid primary key default gen_random_uuid(),
  documento_id         uuid not null references documentos(id) on delete cascade,
  nombre               text not null,
  correo               text not null,
  orden                integer not null default 1,             -- 1..5 (define el orden en el certificado)
  token                uuid not null unique default gen_random_uuid(),  -- enlace público /firmar/[token]
  codigo_verificacion  text,
  estado               text not null default 'pendiente',      -- pendiente | visto | firmado
  -- posición del campo de firma (coords relativas 0–1, origen top-left)
  pagina               integer not null default 1,
  campo_x              float not null default 0.05,
  campo_y              float not null default 0.70,
  campo_ancho          float not null default 0.40,
  campo_alto           float not null default 0.12,
  -- brute-force
  intentos_fallidos    integer not null default 0,
  bloqueado            boolean not null default false,
  -- audit (se rellena al firmar)
  firmado_en           timestamptz,
  ip                   text,
  user_agent           text,
  navegador            text,
  sistema_operativo    text,
  ubicacion            text,
  ubicacion_ciudad     text,
  ubicacion_pais       text,
  vpn_detectado        boolean default false,
  -- migración 011 (para el certificado consolidado):
  firma_imagen         text,        -- data URL PNG de la firma (miniatura del certificado)
  firma_timezone       text,        -- zona horaria del firmante (para fechas del certificado)
  oculto               boolean not null default false,
  creado_en            timestamptz not null default now()
);
-- RLS: solo service role (admin client). El dueño consulta vía join documentos.owner_id.

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
  -- estado values: 'active' | 'canceling' | 'canceled'
  -- 'canceling': cancelSubscriptionAction lo setea; el usuario mantiene acceso hasta fin de período
  -- 'canceled': webhook subscription.canceled de Paddle lo setea; baja a free
  -- cuenta/page.tsx trata 'active' y 'canceling' igual (muestra plan y límite pagados)
  documentos_mes         integer not null default 0,       -- contador mensual (cron lo resetea)
  limite_documentos      integer not null default 3,       -- Free=3, Starter=30, Pro=100, Business=999999
  periodo_inicio         timestamptz,
  periodo_fin            timestamptz,
  creado_en              timestamptz not null default now(),
  actualizado_en         timestamptz not null default now()
);
-- RLS: auth.uid() = owner_id (select only; webhook y acciones admin usan admin client)

-- webhook_logs (migración 009) — auditoría de eventos Paddle
-- El webhook intenta insertar aquí; falla silenciosamente si no existe.
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
007_recordatorios.sql   → soporte de recordatorios automáticos (48h)
008_firmantes.sql       → tabla firmantes (multi-firmante) — CRÍTICA para el flujo nuevo
009_webhook_logs.sql    → tabla webhook_logs
010_atomic_counter.sql  → RPC increment_documentos_mes (sin esto el contador de plan no sube)
011_firma_imagen.sql    → firmantes: firma_imagen + firma_timezone (sin esto la firma multi-firmante FALLA)
```

> ⚠️ **008, 010 y 011 son obligatorias** para el sistema actual. Si faltan: 008 → el flujo multi-firmante no existe; 010 → el contador de plan no incrementa (no-fatal); 011 → `signFirmante` falla de forma explícita (lo protegimos con un guard).

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
- Aplicar **001 → 011** en orden en el SQL Editor si no se han ejecutado
- **Críticas para el sistema actual**: 008 (firmantes), 010 (contador atómico), 011 (firma_imagen/timezone)
- `webhook_logs` ya es migración formal (009), no tabla manual

### 4. Business plan — funciones futuras (Próximamente en UI)
- **Multi-usuario (hasta 5)**: requiere modelo de equipos/invitaciones, roles, nueva tabla `team_members`
- **API pública + webhooks**: requiere generación de API keys, rate limiting, endpoints públicos documentados

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
| Bypasear RLS (storage, tabla firmas, sign, webhook, admin ops) | `src/lib/supabase/admin.ts` | `createAdminClient()` |

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
- **Estado suscripción**: `suscripciones.estado` puede ser `'active'`, `'canceling'` o `'canceled'`. El código trata `active` y `canceling` igual (acceso pagado). Solo `canceled` o ausencia de fila = free.
- **cancelSubscriptionAction**: usa `POST /subscriptions/{id}/cancel` con `effective_from: 'next_billing_period'`. El webhook de Paddle (`subscription.canceled`) cambia el plan a free cuando llega — no modificar el plan manualmente.
- **deleteAccountAction**: usa `admin.auth.admin.deleteUser(user.id)` que hace cascade en toda la DB. El soft-delete previo de documentos es intencional (señala intención de preservar) pero el cascade los elimina igualmente.
- **`DownloadSignedButton`**: requiere prop `loadingLabel` (obligatoria). Pasarla desde el componente padre usando `t("sign_success.download_loading")` o `t("already_signed_loading")` según contexto.
- **SEO en páginas nuevas**: toda página pública debe tener `generateMetadata` con title, description, keywords (desde i18n), canonical, hreflang languages (es/en), OG, Twitter, robots.
- **Build**: `npm run build` debe pasar sin errores. Build actual genera 321 páginas.
- **`NEXT_PUBLIC_APP_URL`**: usado en metadata SEO (canonical, OG, sitemap, links de email). En producción: `https://firmiu.com`.
- **Business plan features próximamente**: "API pública + webhooks" y "Hasta 5 usuarios" están marcadas como "(Próximamente)" en `home.pricing.business.features` y `settings.business_f2/f4`. No implementar sin antes acordar el diseño.
- **Multi-firmante vs legacy**: `signDocumentAction` resuelve el token contra `firmantes` primero y `documentos`/`firmas` después. Cualquier acción que toque firmas debe contemplar AMBAS tablas (ver `hideSignatureAction`, panel de detalle, feed de actividad del dashboard).
- **Certificado**: se agrega **una sola vez**, cuando firma el último (`allSigned`). Construir la lista de firmantes con los `others` (BD) + el actual (en memoria) y ordenar por `orden`. La huella SHA-256 se calcula del **PDF original** (`pdfs-originales`), el folio es `documento.id`. No dibujar página de constancia por firmante en el flujo `firmantes`.
- **`drawSignatureOnPage`**: en el documento va SOLO la imagen de la firma (transparente), sin caja ni borde de color. Los colores por firmante son solo del preview y del certificado. No reintroducir el `drawRectangle` de fondo.
- **Subir firma**: el `signaturePng` que llega a `signDocumentAction` debe ser `data:image/png;base64,…` ≤ 2MB. La opción "Subir imagen" en `FirmarClient.tsx` ya normaliza a PNG (canvas) y hace fondo transparente; no romper ese pipeline.
- **Contador de plan**: usar SIEMPRE `admin.rpc("increment_documentos_mes", …)` (migración 010). Nunca volver al patrón read-then-write.
- **deleteAccountAction**: además del cascade de DB, borra los PDFs de Storage. Mantener esa limpieza (privacidad/GDPR).
- **Migración 011 obligatoria**: `signFirmante` selecciona/escribe `firma_imagen` y `firma_timezone`. Si faltan, el guard `othersErr` aborta la firma. Aplicar 011 antes de desplegar.
- **Concurrencia multi-firmante (pendiente)**: dos firmantes simultáneos descargan el mismo PDF base y suben al mismo path con `upsert:true` → puede perderse una firma. No resuelto; si se promueve multi-firmante en serio, añadir lock optimista por documento.

---

## ⚠️ PDF preview (posicionador de firmas) — NO ROMPER

El preview del PDF en `/dashboard/nuevo` (componente [`PdfPosicionador.tsx`](src/app/[locale]/dashboard/nuevo/PdfPosicionador.tsx)) usa **pdfjs-dist** para renderizar el PDF a un `<canvas>` y dejar posicionar el área de firma de cada firmante. Tuvo un historial largo de fallos en producción ("Vista previa no disponible"). Quedó estable con **dos arreglos que NO se deben revertir**:

### 1. pdfjs-dist FIJADO en `4.7.76` — NUNCA subir a v5+
- En `package.json` está como **versión exacta** `"pdfjs-dist": "4.7.76"` (sin `^`). **No poner caret ni actualizar a v5.**
- **Por qué**: pdfjs-dist **v5** usa APIs de navegador muy nuevas **sin guard** — `Uint8Array.prototype.toHex()` (Chrome/Edge 140+, Safari 18.4+) y `Promise.try()`. En navegadores no-tan-nuevos (PC con Chrome desactualizado) revienta con `n.toHex is not a function` → preview roto. El móvil (Chrome reciente) funcionaba y el PC no: ese es el síntoma.
- `4.7.76` es la v4 más alta que **no** usa `toHex`/`Promise.try`/`toBase64` nativos → compatible con navegadores antiguos. La API que usamos (`getDocument`, `getPage`, `getViewport`, `render`) es idéntica entre v4 y v5, así que no hay razón funcional para subir.
- **Si algún día hay que cambiar la versión de pdfjs**: hay que **regenerar `public/pdf.worker.min.mjs`** desde el paquete instalado (`cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/`). La versión del worker en `public/` **debe coincidir exactamente** con la de `node_modules` o pdf.js falla con "API version does not match Worker version".

### 2. Worker servido a pdf.js como `blob:` (no como path estático)
- En `PdfPosicionador.tsx` el worker se carga así: `fetch("/pdf.worker.min.mjs")` → `URL.createObjectURL(new Blob([code], { type: "text/javascript" }))` → `GlobalWorkerOptions.workerSrc = blobUrl`.
- **Por qué**: el header global `X-Content-Type-Options: nosniff` (en `next.config.js`) hace que el navegador **rechace** el `.mjs` como *module worker* si el host (Vercel) lo sirve con un Content-Type que no sea JS exacto. Eso rompe **a la vez** el worker real y el fallback "fake worker" (que importa el mismo `.mjs`). Envolver el worker en un blob con MIME `text/javascript` explícito pone el MIME nosotros y sortea el host. La CSP ya lo permite (`worker-src 'self' blob:`).
- **No revertir** a `workerSrc = "/pdf.worker.min.mjs"` directo.

### 3. Polyfill de `Promise.try` debe reenviar argumentos
- El polyfill en `PdfPosicionador.tsx` **debe** reenviar args y convertir throws síncronos en rejects (`(fn, ...args) => new Promise((res,rej) => { try { res(fn(...args)) } catch(e){ rej(e) } })`). Un polyfill que ignore los args rompe pdf.js con `Cannot destructure property 'docId'`. Con v4.7.76 este polyfill es dead-code inofensivo, pero déjalo correcto por si se toca la versión.

### Notas
- `/api/pdf-worker/route.ts` es **código muerto y roto** (el middleware i18n lo intercepta → 404; no está en las exclusiones del matcher). No se usa. Borrar en una limpieza.
- `public/pdf.worker.min.mjs` **está versionado en git** y debe desplegarse junto al `package.json`.
