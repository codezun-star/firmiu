# Firmiu ✍️

> SaaS de firma digital de documentos para Latinoamérica — sin impresoras ni escáneres.

🌐 **Sitio en vivo:** [firmiu.com](https://firmiu.com)

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB%20%2B%20Storage-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Paddle](https://img.shields.io/badge/Paddle-Payments-0070E0?logo=paddle&logoColor=white)](https://paddle.com)

---

## Descripción

**Firmiu** es un SaaS de firma digital orientado a contadores, abogados, inmobiliarias y pequeños negocios latinoamericanos. Permite firmar PDFs de forma remota con trazabilidad legal: canvas de firma, código de verificación OTP, captura de IP/geolocalización y audit trail embebido en el documento.

### Flujo principal

1. El dueño sube un PDF e ingresa nombre y correo del destinatario
2. El destinatario recibe un enlace único por correo (`/firmar/[token]`)
3. Dibuja su firma en canvas y verifica con un código de 4 dígitos
4. El PDF queda firmado (firma estampada con `pdf-lib`) y disponible para descargar

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14 (App Router) |
| Estilos | Tailwind CSS |
| Auth + DB + Storage | Supabase (`@supabase/ssr`) |
| Internacionalización | next-intl v3 (ES / EN) |
| Emails transaccionales | Resend |
| Firma en PDF | pdf-lib |
| Canvas de firma | react-signature-canvas |
| Pagos | Paddle (Checkout + Webhooks) |
| Deploy | Vercel |
| Lenguaje | TypeScript estricto |

---

## Características principales

### ✍️ Firma digital completa
- Canvas de firma para dispositivos táctiles y desktop
- Verificación por código OTP de 4 dígitos
- Protección contra brute-force (bloqueo tras 5 intentos fallidos)
- Audit trail embebido en página nueva del PDF (no sobreescribe el documento original)
- Captura de IP, geolocalización, browser, OS y detección de VPN

### 💳 Monetización con Paddle
- Planes Free, Starter, Pro y Business con límites mensuales de documentos
- Checkout integrado con detección de entorno (sandbox / producción)
- Webhook HMAC-SHA256 para actualización de suscripciones en tiempo real
- Cancelación con acceso hasta fin del período pagado (`effective_from: next_billing_period`)
- Cron job mensual que resetea el contador de documentos

### 🔐 Seguridad en profundidad
- Row Level Security (RLS) en todas las tablas de Supabase
- Tres clientes Supabase separados: browser, server y admin (service role)
- Sanitización de inputs: `escapeHtml`, `isValidEmail`, `isValidUUID`, `sanitizeText`
- Security headers: HSTS, CSP, X-Frame-Options, X-Content-Type-Options
- Protección de paths en middleware: null bytes, `..`, paths > 2048 chars
- Soft delete en documentos, firmas y contactos

### 🌍 Internacionalización ES / EN
- Español sin prefijo de URL (default); inglés con `/en`
- ~620 claves de traducción con paridad exacta entre idiomas
- Todos los textos en `messages/es.json` y `messages/en.json` — sin hardcodeo

### 📊 Dashboard completo
- Estadísticas del mes: enviados, pendientes y firmados + sparkline
- Módulo de documentos con tabs por estado, paginación server-side y soft delete
- Módulo de contactos con CRUD, búsqueda y avatares deterministas
- Historial de firmas con audit trail y timezone por país
- Gestión de cuenta: perfil, contraseña, plan activo, cancelar suscripción y eliminar cuenta

### 🔍 SEO agresivo
- JSON-LD (Organization, WebSite, SoftwareApplication, FAQPage)
- `generateMetadata` con canonical, hreflang, OG y Twitter Card en todas las páginas públicas
- Sitemap XML (ES + EN) y `robots.txt` configurados
- FAQ con `<details>/<summary>` — indexable sin JavaScript

---

## Estructura del proyecto

```
firmiu/
├── messages/
│   ├── es.json               # ~620 claves (ES)
│   └── en.json               # ~620 claves (EN)
├── src/
│   ├── app/
│   │   ├── actions/          # Server Actions: auth, documentos, firma, contactos, settings
│   │   ├── api/
│   │   │   ├── cron/         # Reset mensual de documentos_mes
│   │   │   └── paddle/       # Webhook con verificación HMAC-SHA256
│   │   └── [locale]/         # Rutas i18n: landing, auth, dashboard, firma
│   ├── components/
│   │   ├── landing/          # Hero, Pricing, FAQ, HowItWorks, etc.
│   │   └── ...               # Navbar, Footer, Toaster, SuccessModal, etc.
│   ├── lib/
│   │   ├── paddle.ts         # getPaddle(), openCheckout()
│   │   ├── security.ts       # Validadores y sanitizadores
│   │   └── supabase/         # client.ts, server.ts, admin.ts
│   └── middleware.ts         # Supabase + protección de rutas + next-intl
├── supabase/
│   └── migrations/           # 006 migraciones aplicadas en orden
├── vercel.json               # Cron: reset-docs el día 1 de cada mes
└── next.config.js            # Security headers
```

---

## Base de datos (Supabase / PostgreSQL)

6 migraciones aplicadas en orden:

| Migración | Contenido |
|---|---|
| 001 | `documentos`, `firmas`, RLS base |
| 002 | `firmas`: VPN, ciudad, país |
| 003 | `contactos` + RLS |
| 004 | `firmas`: brute-force (intentos, bloqueado) |
| 005 | `suscripciones` + RLS |
| 006 | Soft delete en documentos, firmas y contactos |

**Buckets de Storage:** `pdfs-originales` (privado) · `pdfs-firmados` (privado, URLs firmadas)

---

## Planes y límites

| Plan | Documentos/mes | Precio |
|---|---|---|
| Free | 3 | Gratis |
| Starter | 30 | — |
| Pro | 100 | — |
| Business | Ilimitado | — |

---

## Variables de entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@firmiu.com

# App
NEXT_PUBLIC_APP_URL=https://firmiu.com

# Paddle
NEXT_PUBLIC_PADDLE_ENV=production
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=
NEXT_PUBLIC_PADDLE_PRICE_STARTER=
NEXT_PUBLIC_PADDLE_PRICE_PRO=
NEXT_PUBLIC_PADDLE_PRICE_BUSINESS=
PADDLE_API_KEY=
PADDLE_WEBHOOK_SECRET=

# Cron
CRON_SECRET=
```

---

## Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción (45 páginas, 0 errores)
npm run lint     # ESLint
```

---

## Estado del proyecto

✅ Build: **45 páginas generadas, 0 errores de TypeScript**

Todas las rutas funcionales: landing, auth, checkout, dashboard completo, firma pública y páginas legales.

---

## Autor

Desarrollado de forma independiente como proyecto SaaS personal — arquitectura, diseño, base de datos, pagos e infraestructura propios.
