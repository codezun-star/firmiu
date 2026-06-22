/**
 * Per-profession content for the "Firma digital para {profesión}" landing pages.
 * Mirrors the country-pages architecture: long-form bilingual copy lives here,
 * while shared UI labels live in messages/*.json (`usecase_page` namespace and
 * reused keys from `country_page`).
 */

export interface UseCaseFaq {
  q: string;
  a: string;
}

export interface UseCaseBenefit {
  title: string;
  desc: string;
}

export interface UseCaseContent {
  name: string; // "Contadores"
  h1: string; // "Firma digital para contadores"
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  intro: string;
  uses: string[]; // documents they sign
  benefits: UseCaseBenefit[];
  faqs: UseCaseFaq[];
}

export type UseCaseIcon =
  | "calculator"
  | "scale"
  | "home"
  | "users"
  | "briefcase"
  | "office"
  | "chart"
  | "megaphone"
  | "heart"
  | "shield"
  | "globe"
  | "truck"
  | "camera"
  | "academic"
  | "document";

export interface UseCase {
  slug: string;
  icon: UseCaseIcon;
  es: UseCaseContent;
  en: UseCaseContent;
}

export const USE_CASES: UseCase[] = [
  {
    slug: "contadores",
    icon: "calculator",
    es: {
      name: "Contadores",
      h1: "Firma digital para contadores",
      metaTitle: "Firma Digital para Contadores — Firma Declaraciones y Contratos | Firmiu",
      metaDescription:
        "Firma digital para contadores y despachos contables. Envía cartas de encargo, estados financieros y contratos de servicios para firma sin imprimir.",
      keywords:
        "firma digital para contadores, firma electrónica despacho contable, firmar carta de encargo, firma electrónica estados financieros",
      intro:
        "Los despachos contables manejan decenas de firmas al mes. Con Firmiu envías cartas de encargo, contratos y declaraciones para firma en minutos, sin que el cliente tenga que imprimir o escanear.",
      uses: [
        "Cartas de encargo y propuestas de servicios",
        "Contratos de prestación de servicios contables",
        "Estados financieros y balances para aprobación",
        "Autorizaciones y poderes para trámites",
      ],
      benefits: [
        {
          title: "Cierra clientes más rápido",
          desc: "El cliente firma desde su teléfono en segundos; tú empiezas a trabajar el mismo día.",
        },
        {
          title: "Rastro de auditoría completo",
          desc: "Cada firma guarda IP, fecha, dispositivo y verificación, ideal para tu archivo profesional.",
        },
        {
          title: "Sin papel ni impresora",
          desc: "Olvídate de imprimir, firmar, escanear y reenviar. Todo queda digital y ordenado.",
        },
      ],
      faqs: [
        {
          q: "¿La firma de mis clientes tiene validez legal?",
          a: "Sí. La firma electrónica es legalmente válida en Latinoamérica, España y EE. UU., y Firmiu añade un rastro de auditoría que respalda cada documento.",
        },
        {
          q: "¿Puedo enviar varios documentos al mismo cliente?",
          a: "Sí. Puedes enviar tantos documentos como tu plan permita y reutilizar tus contactos guardados.",
        },
        {
          q: "¿El cliente necesita crear una cuenta?",
          a: "No. Recibe un enlace único por correo y firma directamente, sin registrarse.",
        },
      ],
    },
    en: {
      name: "Accountants",
      h1: "Digital signatures for accountants",
      metaTitle: "Digital Signatures for Accountants — Sign Engagement Letters & Contracts | Firmiu",
      metaDescription:
        "Digital signatures for accountants and accounting firms. Send engagement letters, financial statements and service contracts for signature without printing.",
      keywords:
        "digital signature for accountants, e-signature accounting firm, sign engagement letter, electronic signature financial statements",
      intro:
        "Accounting firms handle dozens of signatures a month. With Firmiu you send engagement letters, contracts and statements for signature in minutes — no printing or scanning required.",
      uses: [
        "Engagement letters and service proposals",
        "Accounting service contracts",
        "Financial statements and balances for approval",
        "Authorizations and powers of attorney",
      ],
      benefits: [
        {
          title: "Close clients faster",
          desc: "Clients sign from their phone in seconds; you start working the same day.",
        },
        {
          title: "Full audit trail",
          desc: "Every signature stores IP, date, device and verification — perfect for your professional records.",
        },
        {
          title: "No paper, no printer",
          desc: "Forget printing, signing, scanning and resending. Everything stays digital and tidy.",
        },
      ],
      faqs: [
        {
          q: "Are my clients' signatures legally valid?",
          a: "Yes. Electronic signatures are legally valid across Latin America, Spain and the US, and Firmiu adds an audit trail that backs every document.",
        },
        {
          q: "Can I send several documents to the same client?",
          a: "Yes. You can send as many documents as your plan allows and reuse your saved contacts.",
        },
        {
          q: "Does the client need to create an account?",
          a: "No. They get a unique link by email and sign directly, without signing up.",
        },
      ],
    },
  },
  {
    slug: "abogados",
    icon: "scale",
    es: {
      name: "Abogados",
      h1: "Firma digital para abogados",
      metaTitle: "Firma Digital para Abogados — Firma Contratos con Validez Legal | Firmiu",
      metaDescription:
        "Firma digital para abogados y despachos jurídicos. Firma contratos, poderes y acuerdos con rastro de auditoría y validez legal, sin desplazamientos.",
      keywords:
        "firma digital para abogados, firma electrónica despacho jurídico, firmar contrato online, firma electrónica poder legal",
      intro:
        "Para un despacho jurídico, cada firma cuenta. Firmiu te permite enviar contratos, poderes y acuerdos para firma con un rastro de auditoría sólido que respalda su validez ante un tribunal.",
      uses: [
        "Contratos civiles y mercantiles",
        "Acuerdos de confidencialidad (NDA)",
        "Poderes y autorizaciones",
        "Convenios y transacciones",
      ],
      benefits: [
        {
          title: "Validez probatoria",
          desc: "IP, ubicación, dispositivo, marca de tiempo y verificación por cada firma respaldan el documento.",
        },
        {
          title: "Firma a distancia",
          desc: "Tus clientes firman desde cualquier lugar, sin necesidad de acudir al despacho.",
        },
        {
          title: "Documentos organizados",
          desc: "Consulta el historial de firmas y descarga los PDF firmados cuando los necesites.",
        },
      ],
      faqs: [
        {
          q: "¿Un contrato firmado con Firmiu sirve como prueba?",
          a: "Sí. La firma electrónica es admisible como prueba y el rastro de auditoría de Firmiu refuerza su valor probatorio.",
        },
        {
          q: "¿Puedo firmar acuerdos con clientes en otro país?",
          a: "Sí. La firma electrónica se reconoce en Latinoamérica, España y EE. UU.; consulta nuestras páginas por país.",
        },
        {
          q: "¿Es seguro el almacenamiento de los documentos?",
          a: "Sí. Los PDF se guardan cifrados y solo son accesibles mediante enlaces firmados temporales.",
        },
      ],
    },
    en: {
      name: "Lawyers",
      h1: "Digital signatures for lawyers",
      metaTitle: "Digital Signatures for Lawyers — Sign Legally Valid Contracts | Firmiu",
      metaDescription:
        "Digital signatures for lawyers and law firms. Sign contracts, powers of attorney and agreements with an audit trail and legal validity, with no travel.",
      keywords:
        "digital signature for lawyers, e-signature law firm, sign contract online, electronic signature power of attorney",
      intro:
        "For a law firm, every signature matters. Firmiu lets you send contracts, powers of attorney and agreements for signature with a solid audit trail that backs their validity in court.",
      uses: [
        "Civil and commercial contracts",
        "Non-disclosure agreements (NDAs)",
        "Powers of attorney and authorizations",
        "Settlements and agreements",
      ],
      benefits: [
        {
          title: "Evidentiary value",
          desc: "IP, location, device, timestamp and verification on every signature back the document.",
        },
        {
          title: "Remote signing",
          desc: "Your clients sign from anywhere, with no need to visit the office.",
        },
        {
          title: "Organized documents",
          desc: "Review the signature history and download signed PDFs whenever you need them.",
        },
      ],
      faqs: [
        {
          q: "Does a contract signed with Firmiu work as evidence?",
          a: "Yes. Electronic signatures are admissible as evidence, and Firmiu's audit trail strengthens their evidentiary value.",
        },
        {
          q: "Can I sign agreements with clients in another country?",
          a: "Yes. Electronic signatures are recognized across Latin America, Spain and the US; see our country pages.",
        },
        {
          q: "Is document storage secure?",
          a: "Yes. PDFs are stored encrypted and only accessible through temporary signed links.",
        },
      ],
    },
  },
  {
    slug: "inmobiliarias",
    icon: "home",
    es: {
      name: "Inmobiliarias",
      h1: "Firma digital para inmobiliarias",
      metaTitle: "Firma Digital para Inmobiliarias — Firma Contratos de Arriendo | Firmiu",
      metaDescription:
        "Firma digital para inmobiliarias y agentes. Firma contratos de arrendamiento, reservas y mandatos a distancia, sin que el cliente pise la oficina.",
      keywords:
        "firma digital para inmobiliarias, firma electrónica contrato de arrendamiento, firmar reserva inmueble, firma electrónica agente inmobiliario",
      intro:
        "En el sector inmobiliario, cerrar rápido es clave. Firmiu permite que inquilinos, propietarios y compradores firmen contratos de arrendamiento, reservas y mandatos desde su teléfono.",
      uses: [
        "Contratos de arrendamiento",
        "Reservas y promesas de compraventa",
        "Mandatos de venta o administración",
        "Inventarios y actas de entrega",
      ],
      benefits: [
        {
          title: "Cierra operaciones más rápido",
          desc: "El cliente firma en el momento, sin esperar a coordinar una cita presencial.",
        },
        {
          title: "Firma desde el móvil",
          desc: "El canvas táctil permite firmar cómodamente desde cualquier teléfono.",
        },
        {
          title: "Cada firma documentada",
          desc: "IP, ubicación y verificación respaldan quién firmó cada contrato y cuándo.",
        },
      ],
      faqs: [
        {
          q: "¿Sirve para contratos de arrendamiento?",
          a: "Sí. Es uno de los usos más habituales y la firma electrónica es válida para arrendamientos en la región.",
        },
        {
          q: "¿El inquilino puede firmar desde el celular?",
          a: "Sí. Recibe un enlace y firma con el dedo desde su teléfono, sin instalar nada.",
        },
        {
          q: "¿Puedo reutilizar los datos de mis clientes?",
          a: "Sí. Guarda contactos y envía nuevos contratos en segundos.",
        },
      ],
    },
    en: {
      name: "Real estate",
      h1: "Digital signatures for real estate",
      metaTitle: "Digital Signatures for Real Estate — Sign Lease Agreements | Firmiu",
      metaDescription:
        "Digital signatures for real-estate agencies and agents. Sign lease agreements, reservations and mandates remotely, without clients visiting the office.",
      keywords:
        "digital signature for real estate, e-signature lease agreement, sign property reservation, electronic signature real estate agent",
      intro:
        "In real estate, closing fast is everything. Firmiu lets tenants, owners and buyers sign lease agreements, reservations and mandates from their phone.",
      uses: [
        "Lease agreements",
        "Reservations and purchase promises",
        "Sales or management mandates",
        "Inventories and handover records",
      ],
      benefits: [
        {
          title: "Close deals faster",
          desc: "Clients sign on the spot, with no need to coordinate an in-person appointment.",
        },
        {
          title: "Sign from mobile",
          desc: "The touch canvas makes it easy to sign comfortably from any phone.",
        },
        {
          title: "Every signature documented",
          desc: "IP, location and verification back who signed each contract and when.",
        },
      ],
      faqs: [
        {
          q: "Does it work for lease agreements?",
          a: "Yes. It's one of the most common uses, and electronic signatures are valid for leases across the region.",
        },
        {
          q: "Can the tenant sign from their phone?",
          a: "Yes. They get a link and sign with their finger on their phone, with nothing to install.",
        },
        {
          q: "Can I reuse my clients' details?",
          a: "Yes. Save contacts and send new contracts in seconds.",
        },
      ],
    },
  },
  {
    slug: "recursos-humanos",
    icon: "users",
    es: {
      name: "Recursos Humanos",
      h1: "Firma digital para Recursos Humanos",
      metaTitle: "Firma Digital para Recursos Humanos — Firma Contratos Laborales | Firmiu",
      metaDescription:
        "Firma digital para equipos de RR. HH. Firma contratos laborales, anexos y políticas internas con tus empleados de forma remota y trazable.",
      keywords:
        "firma digital para recursos humanos, firma electrónica contrato laboral, onboarding firma electrónica, firma electrónica empleados",
      intro:
        "Contratar y gestionar personal implica muchas firmas. Firmiu agiliza el onboarding: tus nuevos empleados firman contratos y políticas desde casa, antes de su primer día.",
      uses: [
        "Contratos laborales y anexos",
        "Acuerdos de confidencialidad",
        "Políticas internas y códigos de conducta",
        "Recibos y autorizaciones",
      ],
      benefits: [
        {
          title: "Onboarding sin fricción",
          desc: "El empleado firma su contrato a distancia y empieza con todo en regla.",
        },
        {
          title: "Trazabilidad por persona",
          desc: "Sabes quién firmó qué documento, cuándo y desde dónde.",
        },
        {
          title: "Menos trabajo administrativo",
          desc: "Sin imprimir, archivar ni perseguir firmas en papel.",
        },
      ],
      faqs: [
        {
          q: "¿Puedo firmar contratos laborales electrónicamente?",
          a: "Sí. La mayoría de acuerdos laborales privados pueden firmarse electrónicamente con plena validez.",
        },
        {
          q: "¿Funciona para empleados remotos?",
          a: "Sí. El empleado firma desde cualquier lugar con un enlace único.",
        },
        {
          q: "¿Queda registro de cada firma?",
          a: "Sí. Cada firma guarda fecha, IP, dispositivo y verificación.",
        },
      ],
    },
    en: {
      name: "Human Resources",
      h1: "Digital signatures for Human Resources",
      metaTitle: "Digital Signatures for HR — Sign Employment Contracts | Firmiu",
      metaDescription:
        "Digital signatures for HR teams. Sign employment contracts, addenda and internal policies with your employees remotely and with full traceability.",
      keywords:
        "digital signature for human resources, e-signature employment contract, onboarding electronic signature, electronic signature employees",
      intro:
        "Hiring and managing staff means a lot of signatures. Firmiu speeds up onboarding: new employees sign contracts and policies from home, before their first day.",
      uses: [
        "Employment contracts and addenda",
        "Confidentiality agreements",
        "Internal policies and codes of conduct",
        "Receipts and authorizations",
      ],
      benefits: [
        {
          title: "Frictionless onboarding",
          desc: "Employees sign their contract remotely and start fully set up.",
        },
        {
          title: "Per-person traceability",
          desc: "You know who signed which document, when and from where.",
        },
        {
          title: "Less admin work",
          desc: "No printing, filing or chasing paper signatures.",
        },
      ],
      faqs: [
        {
          q: "Can I sign employment contracts electronically?",
          a: "Yes. Most private employment agreements can be signed electronically with full validity.",
        },
        {
          q: "Does it work for remote employees?",
          a: "Yes. The employee signs from anywhere with a unique link.",
        },
        {
          q: "Is there a record of each signature?",
          a: "Yes. Every signature stores date, IP, device and verification.",
        },
      ],
    },
  },
  {
    slug: "freelancers",
    icon: "briefcase",
    es: {
      name: "Freelancers",
      h1: "Firma digital para freelancers",
      metaTitle: "Firma Digital para Freelancers — Firma Contratos con Clientes | Firmiu",
      metaDescription: "Firma digital para freelancers y autónomos. Envía propuestas, contratos y NDAs a tus clientes para firma sin imprimir, desde cualquier lugar.",
      keywords: "firma digital para freelancers, firma electrónica autónomos, firmar contrato freelance, firma electrónica propuestas",
      intro: "Como freelancer, cada proyecto empieza con un acuerdo. Firmiu te permite enviar propuestas y contratos para firma y empezar a trabajar el mismo día, sin imprimir nada.",
      uses: ["Contratos de prestación de servicios", "Propuestas y presupuestos", "Acuerdos de confidencialidad (NDA)", "Órdenes de trabajo y entregables"],
      benefits: [
        { title: "Cobra antes", desc: "Cierra el acuerdo en minutos y arranca el proyecto sin esperas." },
        { title: "Imagen profesional", desc: "Envía documentos serios con un proceso de firma claro y moderno." },
        { title: "Respaldo en cada firma", desc: "IP, fecha y verificación quedan registrados por si surge una disputa." },
      ],
      faqs: [
        { q: "¿La firma con mis clientes es válida?", a: "Sí. La firma electrónica tiene validez legal en Latinoamérica, España y EE. UU." },
        { q: "¿Mi cliente necesita registrarse?", a: "No. Firma desde un enlace único, sin crear ninguna cuenta." },
        { q: "¿Puedo enviar varios documentos?", a: "Sí, según tu plan, y puedes guardar contactos para enviar más rápido." },
      ],
    },
    en: {
      name: "Freelancers",
      h1: "Digital signatures for freelancers",
      metaTitle: "Digital Signatures for Freelancers — Sign Client Contracts | Firmiu",
      metaDescription: "Digital signatures for freelancers. Send proposals, contracts and NDAs to your clients for signature without printing, from anywhere.",
      keywords: "digital signature for freelancers, e-signature self-employed, sign freelance contract, electronic signature proposals",
      intro: "As a freelancer, every project starts with an agreement. Firmiu lets you send proposals and contracts for signature and start working the same day — no printing required.",
      uses: ["Service contracts", "Proposals and quotes", "Non-disclosure agreements (NDAs)", "Work orders and deliverables"],
      benefits: [
        { title: "Get paid sooner", desc: "Close the agreement in minutes and start the project with no waiting." },
        { title: "Professional image", desc: "Send polished documents with a clear, modern signing process." },
        { title: "Backing on every signature", desc: "IP, date and verification are logged in case a dispute arises." },
      ],
      faqs: [
        { q: "Are signatures with my clients valid?", a: "Yes. Electronic signatures are legally valid across Latin America, Spain and the US." },
        { q: "Does my client need to register?", a: "No. They sign from a unique link, without creating any account." },
        { q: "Can I send several documents?", a: "Yes, depending on your plan, and you can save contacts to send faster." },
      ],
    },
  },
  {
    slug: "pymes",
    icon: "office",
    es: {
      name: "Pymes",
      h1: "Firma digital para pymes",
      metaTitle: "Firma Digital para Pymes — Firma Contratos y Acuerdos | Firmiu",
      metaDescription: "Firma digital para pequeñas y medianas empresas. Firma contratos, acuerdos con proveedores y documentos comerciales sin papel.",
      keywords: "firma digital para pymes, firma electrónica empresa, firmar contratos empresa, firma electrónica proveedores",
      intro: "Las pymes ganan tiempo cuando dejan de mover papeles. Firmiu centraliza la firma de contratos, acuerdos y documentos comerciales en un flujo simple.",
      uses: ["Contratos con clientes y proveedores", "Acuerdos comerciales y de servicios", "Cotizaciones y órdenes de compra", "Documentos internos y autorizaciones"],
      benefits: [
        { title: "Menos burocracia", desc: "Olvídate de imprimir, firmar y escanear: todo queda digital y ordenado." },
        { title: "Cierres más rápidos", desc: "Tus clientes y proveedores firman desde el móvil en segundos." },
        { title: "Control y trazabilidad", desc: "Consulta el historial de firmas y descarga los PDF cuando los necesites." },
      ],
      faqs: [
        { q: "¿Es legal para una empresa?", a: "Sí. La firma electrónica es válida para la mayoría de documentos mercantiles en la región." },
        { q: "¿Cuántos documentos puedo enviar?", a: "Depende de tu plan; hay opciones desde el plan gratuito hasta documentos ilimitados." },
        { q: "¿Necesito instalar algo?", a: "No. Firmiu funciona desde el navegador, sin instalaciones." },
      ],
    },
    en: {
      name: "Small businesses",
      h1: "Digital signatures for small businesses",
      metaTitle: "Digital Signatures for SMBs — Sign Contracts and Agreements | Firmiu",
      metaDescription: "Digital signatures for small and medium businesses. Sign contracts, supplier agreements and commercial documents paper-free.",
      keywords: "digital signature for SMB, e-signature small business, sign business contracts, electronic signature suppliers",
      intro: "Small businesses save time when they stop moving paper around. Firmiu centralizes signing contracts, agreements and commercial documents in one simple flow.",
      uses: ["Contracts with clients and suppliers", "Commercial and service agreements", "Quotes and purchase orders", "Internal documents and authorizations"],
      benefits: [
        { title: "Less bureaucracy", desc: "Forget printing, signing and scanning: everything stays digital and tidy." },
        { title: "Faster closes", desc: "Your clients and suppliers sign from mobile in seconds." },
        { title: "Control and traceability", desc: "Review the signature history and download PDFs whenever you need them." },
      ],
      faqs: [
        { q: "Is it legal for a company?", a: "Yes. Electronic signatures are valid for most commercial documents in the region." },
        { q: "How many documents can I send?", a: "It depends on your plan; options range from a free plan to unlimited documents." },
        { q: "Do I need to install anything?", a: "No. Firmiu runs from the browser, with no installations." },
      ],
    },
  },
  {
    slug: "startups",
    icon: "chart",
    es: {
      name: "Startups",
      h1: "Firma digital para startups",
      metaTitle: "Firma Digital para Startups — Firma Acuerdos y NDAs | Firmiu",
      metaDescription: "Firma digital para startups. Firma NDAs, acuerdos con inversores, contratos de equipo y de clientes a la velocidad que necesitas.",
      keywords: "firma digital para startups, firma electrónica NDA, firmar acuerdo inversores, firma electrónica equipo",
      intro: "Las startups se mueven rápido y la firma no debería frenarlas. Con Firmiu cierras NDAs, acuerdos con inversores y contratos de equipo en minutos.",
      uses: ["Acuerdos de confidencialidad (NDA)", "Contratos con clientes y partners", "Acuerdos con colaboradores y equipo", "Term sheets y cartas de intención"],
      benefits: [
        { title: "Velocidad", desc: "Firma a distancia con cualquier parte, sin coordinar reuniones presenciales." },
        { title: "Escala contigo", desc: "Desde el primer cliente hasta documentos ilimitados según tu plan." },
        { title: "Cada acuerdo documentado", desc: "El rastro de auditoría respalda quién firmó qué y cuándo." },
      ],
      faqs: [
        { q: "¿Sirve para firmar con inversores?", a: "Sí, para la mayoría de acuerdos privados y cartas de intención." },
        { q: "¿Puedo firmar con partes en otros países?", a: "Sí. La firma electrónica se reconoce en LATAM, España y EE. UU." },
        { q: "¿Es seguro?", a: "Sí. Los documentos se guardan cifrados y con enlaces firmados temporales." },
      ],
    },
    en: {
      name: "Startups",
      h1: "Digital signatures for startups",
      metaTitle: "Digital Signatures for Startups — Sign Agreements and NDAs | Firmiu",
      metaDescription: "Digital signatures for startups. Sign NDAs, investor agreements, team and client contracts at the speed you need.",
      keywords: "digital signature for startups, e-signature NDA, sign investor agreement, electronic signature team",
      intro: "Startups move fast, and signing shouldn't slow them down. With Firmiu you close NDAs, investor agreements and team contracts in minutes.",
      uses: ["Non-disclosure agreements (NDAs)", "Contracts with clients and partners", "Agreements with collaborators and team", "Term sheets and letters of intent"],
      benefits: [
        { title: "Speed", desc: "Sign remotely with any party, without coordinating in-person meetings." },
        { title: "Scales with you", desc: "From your first client to unlimited documents depending on your plan." },
        { title: "Every agreement documented", desc: "The audit trail backs who signed what and when." },
      ],
      faqs: [
        { q: "Does it work for signing with investors?", a: "Yes, for most private agreements and letters of intent." },
        { q: "Can I sign with parties in other countries?", a: "Yes. Electronic signatures are recognized across Latin America, Spain and the US." },
        { q: "Is it secure?", a: "Yes. Documents are stored encrypted and with temporary signed links." },
      ],
    },
  },
  {
    slug: "agencias-de-marketing",
    icon: "megaphone",
    es: {
      name: "Agencias de marketing",
      h1: "Firma digital para agencias de marketing",
      metaTitle: "Firma Digital para Agencias de Marketing — Firma Contratos | Firmiu",
      metaDescription: "Firma digital para agencias de marketing y publicidad. Firma contratos de campaña, propuestas y acuerdos con clientes sin imprimir.",
      keywords: "firma digital para agencias de marketing, firma electrónica publicidad, firmar contrato de campaña, firma electrónica agencia",
      intro: "Las agencias firman propuestas y contratos constantemente. Firmiu acelera cada onboarding de cliente con firma digital lista en minutos.",
      uses: ["Contratos de campaña y retainer", "Propuestas y presupuestos", "Acuerdos de cesión de derechos", "Briefs y órdenes de servicio"],
      benefits: [
        { title: "Onboarding ágil", desc: "El cliente firma y la campaña arranca sin demoras administrativas." },
        { title: "Todo en orden", desc: "Centraliza contratos firmados y descárgalos cuando los necesites." },
        { title: "Respaldo legal", desc: "Cada firma guarda IP, fecha, dispositivo y verificación." },
      ],
      faqs: [
        { q: "¿Sirve para contratos de retainer?", a: "Sí, y para propuestas, cesiones de derechos y acuerdos de servicio." },
        { q: "¿El cliente firma desde el móvil?", a: "Sí, con un enlace único y sin instalar nada." },
        { q: "¿Puedo guardar a mis clientes?", a: "Sí. Guarda contactos y envía nuevos contratos en segundos." },
      ],
    },
    en: {
      name: "Marketing agencies",
      h1: "Digital signatures for marketing agencies",
      metaTitle: "Digital Signatures for Marketing Agencies — Sign Contracts | Firmiu",
      metaDescription: "Digital signatures for marketing and advertising agencies. Sign campaign contracts, proposals and client agreements without printing.",
      keywords: "digital signature for marketing agencies, e-signature advertising, sign campaign contract, electronic signature agency",
      intro: "Agencies sign proposals and contracts constantly. Firmiu speeds up every client onboarding with digital signing ready in minutes.",
      uses: ["Campaign and retainer contracts", "Proposals and quotes", "Rights-assignment agreements", "Briefs and service orders"],
      benefits: [
        { title: "Fast onboarding", desc: "The client signs and the campaign starts with no admin delays." },
        { title: "Everything in order", desc: "Centralize signed contracts and download them whenever you need." },
        { title: "Legal backing", desc: "Every signature stores IP, date, device and verification." },
      ],
      faqs: [
        { q: "Does it work for retainer contracts?", a: "Yes, and for proposals, rights assignments and service agreements." },
        { q: "Does the client sign from mobile?", a: "Yes, with a unique link and nothing to install." },
        { q: "Can I save my clients?", a: "Yes. Save contacts and send new contracts in seconds." },
      ],
    },
  },
  {
    slug: "consultores",
    icon: "briefcase",
    es: {
      name: "Consultores",
      h1: "Firma digital para consultores",
      metaTitle: "Firma Digital para Consultores — Firma Contratos y Propuestas | Firmiu",
      metaDescription: "Firma digital para consultores y asesores. Firma contratos de consultoría, propuestas y acuerdos de confidencialidad a distancia.",
      keywords: "firma digital para consultores, firma electrónica asesores, firmar contrato de consultoría, firma electrónica propuesta",
      intro: "Para un consultor, el tiempo es el activo principal. Firmiu te permite cerrar contratos y propuestas sin perder horas en papeleo.",
      uses: ["Contratos de consultoría", "Propuestas y planes de trabajo", "Acuerdos de confidencialidad (NDA)", "Informes y entregables para aprobación"],
      benefits: [
        { title: "Empieza antes", desc: "El cliente firma y arrancas el encargo el mismo día." },
        { title: "Sin fricción", desc: "Tu cliente firma desde el navegador, sin cuentas ni instalaciones." },
        { title: "Trazabilidad", desc: "Cada firma queda documentada con IP, fecha y verificación." },
      ],
      faqs: [
        { q: "¿La firma es legalmente válida?", a: "Sí, para la mayoría de acuerdos profesionales privados." },
        { q: "¿Puedo enviar informes para aprobación?", a: "Sí. Envía cualquier PDF para que el cliente lo firme." },
        { q: "¿Funciona internacionalmente?", a: "Sí. La firma electrónica se reconoce en LATAM, España y EE. UU." },
      ],
    },
    en: {
      name: "Consultants",
      h1: "Digital signatures for consultants",
      metaTitle: "Digital Signatures for Consultants — Sign Contracts and Proposals | Firmiu",
      metaDescription: "Digital signatures for consultants and advisors. Sign consulting contracts, proposals and NDAs remotely.",
      keywords: "digital signature for consultants, e-signature advisors, sign consulting contract, electronic signature proposal",
      intro: "For a consultant, time is the main asset. Firmiu lets you close contracts and proposals without losing hours to paperwork.",
      uses: ["Consulting contracts", "Proposals and work plans", "Non-disclosure agreements (NDAs)", "Reports and deliverables for approval"],
      benefits: [
        { title: "Start sooner", desc: "The client signs and you begin the engagement the same day." },
        { title: "Friction-free", desc: "Your client signs from the browser, with no accounts or installs." },
        { title: "Traceability", desc: "Every signature is documented with IP, date and verification." },
      ],
      faqs: [
        { q: "Is the signature legally valid?", a: "Yes, for most private professional agreements." },
        { q: "Can I send reports for approval?", a: "Yes. Send any PDF for the client to sign." },
        { q: "Does it work internationally?", a: "Yes. Electronic signatures are recognized across Latin America, Spain and the US." },
      ],
    },
  },
  {
    slug: "arquitectos",
    icon: "office",
    es: {
      name: "Arquitectos",
      h1: "Firma digital para arquitectos",
      metaTitle: "Firma Digital para Arquitectos — Firma Contratos y Proyectos | Firmiu",
      metaDescription: "Firma digital para arquitectos y estudios. Firma contratos de proyecto, presupuestos y actas de aprobación con tus clientes sin imprimir.",
      keywords: "firma digital para arquitectos, firma electrónica estudio de arquitectura, firmar contrato de obra, firma electrónica proyecto",
      intro: "Los proyectos de arquitectura avanzan por etapas y cada una requiere aprobaciones. Firmiu permite firmar contratos y actas con el cliente sin papeleo.",
      uses: ["Contratos de proyecto y honorarios", "Presupuestos y adendas", "Actas de aprobación de etapas", "Acuerdos con proveedores y contratistas"],
      benefits: [
        { title: "Aprobaciones rápidas", desc: "El cliente firma cada etapa desde su teléfono, sin reuniones." },
        { title: "Proyectos ordenados", desc: "Conserva todos los documentos firmados de cada proyecto." },
        { title: "Respaldo en cada firma", desc: "IP, fecha y verificación documentan cada aprobación." },
      ],
      faqs: [
        { q: "¿Sirve para contratos de obra?", a: "Sí, para contratos de proyecto, honorarios y acuerdos privados." },
        { q: "¿Puedo firmar por etapas?", a: "Sí. Envía un documento por cada etapa o aprobación que necesites." },
        { q: "¿El cliente necesita una cuenta?", a: "No. Firma desde un enlace único por correo." },
      ],
    },
    en: {
      name: "Architects",
      h1: "Digital signatures for architects",
      metaTitle: "Digital Signatures for Architects — Sign Contracts and Projects | Firmiu",
      metaDescription: "Digital signatures for architects and studios. Sign project contracts, quotes and approval records with your clients without printing.",
      keywords: "digital signature for architects, e-signature architecture studio, sign project contract, electronic signature project",
      intro: "Architecture projects move in stages, and each one needs approvals. Firmiu lets you sign contracts and records with the client without paperwork.",
      uses: ["Project and fee contracts", "Quotes and addenda", "Stage-approval records", "Agreements with suppliers and contractors"],
      benefits: [
        { title: "Fast approvals", desc: "The client signs each stage from their phone, with no meetings." },
        { title: "Organized projects", desc: "Keep every signed document for each project." },
        { title: "Backing on every signature", desc: "IP, date and verification document each approval." },
      ],
      faqs: [
        { q: "Does it work for construction contracts?", a: "Yes, for project and fee contracts and private agreements." },
        { q: "Can I sign by stages?", a: "Yes. Send a document for each stage or approval you need." },
        { q: "Does the client need an account?", a: "No. They sign from a unique link by email." },
      ],
    },
  },
  {
    slug: "clinicas-medicas",
    icon: "heart",
    es: {
      name: "Clínicas médicas",
      h1: "Firma digital para clínicas médicas",
      metaTitle: "Firma Digital para Clínicas Médicas — Consentimientos y Más | Firmiu",
      metaDescription: "Firma digital para clínicas y consultorios. Firma consentimientos informados, contratos de servicios y autorizaciones de pacientes sin papel.",
      keywords: "firma digital para clínicas, firma electrónica consentimiento informado, firma electrónica consultorio médico, firmar autorización paciente",
      intro: "Las clínicas manejan muchos documentos por paciente. Firmiu agiliza la firma de consentimientos y autorizaciones de forma ordenada y trazable.",
      uses: ["Consentimientos informados", "Contratos de servicios y presupuestos", "Autorizaciones y descargos", "Políticas de privacidad de datos"],
      benefits: [
        { title: "Menos papel en recepción", desc: "El paciente firma desde su teléfono o una tablet en la clínica." },
        { title: "Cada firma trazable", desc: "IP, fecha y verificación respaldan cada consentimiento." },
        { title: "Documentos organizados", desc: "Conserva el historial de firmas y descárgalas cuando las necesites." },
      ],
      faqs: [
        { q: "¿Puedo firmar consentimientos informados?", a: "Sí, como documento privado con el paciente; verifica los requisitos de tu jurisdicción y especialidad." },
        { q: "¿El paciente necesita una cuenta?", a: "No. Firma desde un enlace único, sin registrarse." },
        { q: "¿Queda registro de la firma?", a: "Sí. Cada firma guarda fecha, IP, dispositivo y verificación." },
      ],
    },
    en: {
      name: "Medical clinics",
      h1: "Digital signatures for medical clinics",
      metaTitle: "Digital Signatures for Medical Clinics — Consents and More | Firmiu",
      metaDescription: "Digital signatures for clinics and practices. Sign informed consents, service contracts and patient authorizations paper-free.",
      keywords: "digital signature for clinics, e-signature informed consent, electronic signature medical practice, sign patient authorization",
      intro: "Clinics handle many documents per patient. Firmiu speeds up signing consents and authorizations in an organized, traceable way.",
      uses: ["Informed consents", "Service contracts and quotes", "Authorizations and waivers", "Data-privacy policies"],
      benefits: [
        { title: "Less paper at reception", desc: "The patient signs from their phone or a tablet at the clinic." },
        { title: "Every signature traceable", desc: "IP, date and verification back each consent." },
        { title: "Organized documents", desc: "Keep the signature history and download them when needed." },
      ],
      faqs: [
        { q: "Can I sign informed consents?", a: "Yes, as a private document with the patient; check the requirements for your jurisdiction and specialty." },
        { q: "Does the patient need an account?", a: "No. They sign from a unique link, without registering." },
        { q: "Is there a record of the signature?", a: "Yes. Every signature stores date, IP, device and verification." },
      ],
    },
  },
  {
    slug: "clinicas-dentales",
    icon: "heart",
    es: {
      name: "Clínicas dentales",
      h1: "Firma digital para clínicas dentales",
      metaTitle: "Firma Digital para Clínicas Dentales — Consentimientos | Firmiu",
      metaDescription: "Firma digital para clínicas y consultorios dentales. Firma consentimientos, presupuestos de tratamiento y autorizaciones sin papel.",
      keywords: "firma digital para clínicas dentales, firma electrónica odontología, consentimiento dental, firmar presupuesto tratamiento",
      intro: "Cada tratamiento dental implica presupuestos y consentimientos. Firmiu permite firmarlos de forma rápida y dejar todo documentado.",
      uses: ["Consentimientos de tratamiento", "Presupuestos y planes de pago", "Autorizaciones de procedimientos", "Políticas de la clínica"],
      benefits: [
        { title: "Agiliza la consulta", desc: "El paciente firma su presupuesto y consentimiento en minutos." },
        { title: "Sin papeleo", desc: "Olvídate de imprimir y archivar formularios en papel." },
        { title: "Respaldo documentado", desc: "Cada firma guarda IP, fecha y verificación." },
      ],
      faqs: [
        { q: "¿Sirve para consentimientos de tratamiento?", a: "Sí, como documento privado con el paciente; revisa los requisitos locales de tu actividad." },
        { q: "¿El paciente firma desde el móvil?", a: "Sí, con un enlace único, sin instalar nada." },
        { q: "¿Puedo reutilizar mis formularios?", a: "Sí. Sube tu PDF cada vez y guarda contactos para enviar más rápido." },
      ],
    },
    en: {
      name: "Dental clinics",
      h1: "Digital signatures for dental clinics",
      metaTitle: "Digital Signatures for Dental Clinics — Consents | Firmiu",
      metaDescription: "Digital signatures for dental clinics and practices. Sign consents, treatment quotes and authorizations paper-free.",
      keywords: "digital signature for dental clinics, e-signature dentistry, dental consent, sign treatment quote",
      intro: "Every dental treatment involves quotes and consents. Firmiu lets you sign them quickly and keep everything documented.",
      uses: ["Treatment consents", "Quotes and payment plans", "Procedure authorizations", "Clinic policies"],
      benefits: [
        { title: "Speed up the visit", desc: "The patient signs their quote and consent in minutes." },
        { title: "No paperwork", desc: "Forget printing and filing paper forms." },
        { title: "Documented backing", desc: "Every signature stores IP, date and verification." },
      ],
      faqs: [
        { q: "Does it work for treatment consents?", a: "Yes, as a private document with the patient; check the local requirements for your practice." },
        { q: "Does the patient sign from mobile?", a: "Yes, with a unique link and nothing to install." },
        { q: "Can I reuse my forms?", a: "Yes. Upload your PDF each time and save contacts to send faster." },
      ],
    },
  },
  {
    slug: "seguros",
    icon: "shield",
    es: {
      name: "Seguros",
      h1: "Firma digital para agentes de seguros",
      metaTitle: "Firma Digital para Seguros — Firma Pólizas y Solicitudes | Firmiu",
      metaDescription: "Firma digital para agentes y corredores de seguros. Firma solicitudes, pólizas y endosos con tus clientes a distancia, sin imprimir.",
      keywords: "firma digital para seguros, firma electrónica póliza, corredor de seguros firma, firmar solicitud de seguro",
      intro: "En seguros, cerrar a tiempo lo es todo. Firmiu permite que tus clientes firmen solicitudes y documentos de póliza desde donde estén.",
      uses: ["Solicitudes de seguro", "Documentos y endosos de póliza", "Declaraciones y cuestionarios", "Autorizaciones de cobro"],
      benefits: [
        { title: "Cierra pólizas más rápido", desc: "El cliente firma en el momento, sin esperar una cita presencial." },
        { title: "Firma desde el móvil", desc: "Tus clientes firman cómodamente desde cualquier teléfono." },
        { title: "Cada firma documentada", desc: "IP, ubicación y verificación respaldan cada documento." },
      ],
      faqs: [
        { q: "¿Es válida para documentos de seguro?", a: "Sí, para la mayoría de documentos privados; consulta requisitos específicos de tu aseguradora y país." },
        { q: "¿El cliente necesita registrarse?", a: "No. Firma desde un enlace único por correo." },
        { q: "¿Puedo guardar a mis clientes?", a: "Sí, para enviar nuevos documentos en segundos." },
      ],
    },
    en: {
      name: "Insurance",
      h1: "Digital signatures for insurance agents",
      metaTitle: "Digital Signatures for Insurance — Sign Policies and Applications | Firmiu",
      metaDescription: "Digital signatures for insurance agents and brokers. Sign applications, policies and endorsements with clients remotely, without printing.",
      keywords: "digital signature for insurance, e-signature policy, insurance broker signature, sign insurance application",
      intro: "In insurance, closing on time is everything. Firmiu lets your clients sign applications and policy documents from wherever they are.",
      uses: ["Insurance applications", "Policy documents and endorsements", "Declarations and questionnaires", "Payment authorizations"],
      benefits: [
        { title: "Close policies faster", desc: "The client signs on the spot, with no need for an in-person appointment." },
        { title: "Sign from mobile", desc: "Your clients sign comfortably from any phone." },
        { title: "Every signature documented", desc: "IP, location and verification back each document." },
      ],
      faqs: [
        { q: "Is it valid for insurance documents?", a: "Yes, for most private documents; check the specific requirements of your insurer and country." },
        { q: "Does the client need to register?", a: "No. They sign from a unique link by email." },
        { q: "Can I save my clients?", a: "Yes, to send new documents in seconds." },
      ],
    },
  },
  {
    slug: "agencias-de-viajes",
    icon: "globe",
    es: {
      name: "Agencias de viajes",
      h1: "Firma digital para agencias de viajes",
      metaTitle: "Firma Digital para Agencias de Viajes — Contratos y Reservas | Firmiu",
      metaDescription: "Firma digital para agencias de viajes. Firma contratos de servicios, reservas y términos con tus clientes sin que pasen por la oficina.",
      keywords: "firma digital para agencias de viajes, firma electrónica reserva, contrato de viaje firma, firmar términos de viaje",
      intro: "Tus clientes reservan desde cualquier lugar; la firma debería ser igual de fácil. Con Firmiu firman contratos y reservas en minutos.",
      uses: ["Contratos de servicios turísticos", "Reservas y confirmaciones", "Términos y condiciones del viaje", "Autorizaciones y consentimientos"],
      benefits: [
        { title: "Reservas sin demoras", desc: "El cliente firma y confirma su viaje sin pasar por la oficina." },
        { title: "Firma desde cualquier lugar", desc: "Funciona desde el móvil, esté donde esté tu cliente." },
        { title: "Todo documentado", desc: "Cada firma guarda IP, fecha y verificación." },
      ],
      faqs: [
        { q: "¿Sirve para contratos de viaje?", a: "Sí, para contratos de servicios, reservas y términos privados." },
        { q: "¿El cliente firma desde el extranjero?", a: "Sí. La firma electrónica se reconoce internacionalmente." },
        { q: "¿Necesita instalar algo?", a: "No. Firma desde el navegador con un enlace único." },
      ],
    },
    en: {
      name: "Travel agencies",
      h1: "Digital signatures for travel agencies",
      metaTitle: "Digital Signatures for Travel Agencies — Contracts and Bookings | Firmiu",
      metaDescription: "Digital signatures for travel agencies. Sign service contracts, bookings and terms with clients without them visiting the office.",
      keywords: "digital signature for travel agencies, e-signature booking, travel contract signature, sign travel terms",
      intro: "Your clients book from anywhere; signing should be just as easy. With Firmiu they sign contracts and bookings in minutes.",
      uses: ["Travel service contracts", "Bookings and confirmations", "Trip terms and conditions", "Authorizations and consents"],
      benefits: [
        { title: "Bookings with no delays", desc: "The client signs and confirms their trip without visiting the office." },
        { title: "Sign from anywhere", desc: "Works from mobile, wherever your client is." },
        { title: "Everything documented", desc: "Every signature stores IP, date and verification." },
      ],
      faqs: [
        { q: "Does it work for travel contracts?", a: "Yes, for service contracts, bookings and private terms." },
        { q: "Can the client sign from abroad?", a: "Yes. Electronic signatures are recognized internationally." },
        { q: "Do they need to install anything?", a: "No. They sign from the browser with a unique link." },
      ],
    },
  },
  {
    slug: "transporte-y-logistica",
    icon: "truck",
    es: {
      name: "Transporte y logística",
      h1: "Firma digital para transporte y logística",
      metaTitle: "Firma Digital para Transporte y Logística — Contratos | Firmiu",
      metaDescription: "Firma digital para empresas de transporte y logística. Firma contratos de servicio, acuerdos con transportistas y autorizaciones sin papel.",
      keywords: "firma digital para transporte, firma electrónica logística, contrato de transporte firma, firmar acuerdo transportista",
      intro: "El sector logístico mueve documentos tan rápido como mercancías. Firmiu permite firmar contratos y acuerdos sin frenar la operación.",
      uses: ["Contratos de servicio de transporte", "Acuerdos con transportistas y clientes", "Autorizaciones y mandatos", "Términos y condiciones de servicio"],
      benefits: [
        { title: "Operación sin pausas", desc: "Firma acuerdos a distancia sin detener la cadena logística." },
        { title: "Firma desde el móvil", desc: "Transportistas y clientes firman desde cualquier teléfono." },
        { title: "Trazabilidad total", desc: "Cada firma guarda IP, fecha, ubicación y verificación." },
      ],
      faqs: [
        { q: "¿Sirve para contratos de transporte?", a: "Sí, para contratos de servicio y acuerdos privados." },
        { q: "¿Puedo firmar con transportistas externos?", a: "Sí. Reciben un enlace único y firman sin registrarse." },
        { q: "¿Funciona en varios países?", a: "Sí. La firma electrónica se reconoce en LATAM, España y EE. UU." },
      ],
    },
    en: {
      name: "Transport & logistics",
      h1: "Digital signatures for transport & logistics",
      metaTitle: "Digital Signatures for Transport & Logistics — Contracts | Firmiu",
      metaDescription: "Digital signatures for transport and logistics companies. Sign service contracts, carrier agreements and authorizations paper-free.",
      keywords: "digital signature for transport, e-signature logistics, transport contract signature, sign carrier agreement",
      intro: "The logistics sector moves documents as fast as goods. Firmiu lets you sign contracts and agreements without slowing the operation.",
      uses: ["Transport service contracts", "Agreements with carriers and clients", "Authorizations and mandates", "Service terms and conditions"],
      benefits: [
        { title: "Operations without pauses", desc: "Sign agreements remotely without stopping the logistics chain." },
        { title: "Sign from mobile", desc: "Carriers and clients sign from any phone." },
        { title: "Full traceability", desc: "Every signature stores IP, date, location and verification." },
      ],
      faqs: [
        { q: "Does it work for transport contracts?", a: "Yes, for service contracts and private agreements." },
        { q: "Can I sign with external carriers?", a: "Yes. They get a unique link and sign without registering." },
        { q: "Does it work across countries?", a: "Yes. Electronic signatures are recognized across Latin America, Spain and the US." },
      ],
    },
  },
  {
    slug: "fotografos",
    icon: "camera",
    es: {
      name: "Fotógrafos",
      h1: "Firma digital para fotógrafos",
      metaTitle: "Firma Digital para Fotógrafos — Contratos y Cesiones | Firmiu",
      metaDescription: "Firma digital para fotógrafos y creativos. Firma contratos de sesión, cesiones de derechos de imagen y presupuestos sin imprimir.",
      keywords: "firma digital para fotógrafos, firma electrónica cesión de derechos, contrato de sesión fotográfica, firmar release de imagen",
      intro: "Cada sesión necesita su contrato y su cesión de derechos. Firmiu te permite cerrarlos antes de disparar la primera foto.",
      uses: ["Contratos de sesión y eventos", "Cesiones de derechos de imagen (model release)", "Presupuestos y reservas", "Licencias de uso de fotografías"],
      benefits: [
        { title: "Cierra la sesión rápido", desc: "El cliente firma su contrato y reserva en minutos." },
        { title: "Derechos en orden", desc: "Documenta cada cesión de derechos de imagen con respaldo." },
        { title: "Cada firma trazable", desc: "IP, fecha y verificación quedan registrados." },
      ],
      faqs: [
        { q: "¿Sirve para cesiones de derechos de imagen?", a: "Sí, como acuerdo privado entre tú y la persona fotografiada." },
        { q: "¿El cliente necesita una cuenta?", a: "No. Firma desde un enlace único por correo." },
        { q: "¿Puedo reutilizar mis contratos?", a: "Sí. Sube tu PDF cada vez y guarda contactos para enviar más rápido." },
      ],
    },
    en: {
      name: "Photographers",
      h1: "Digital signatures for photographers",
      metaTitle: "Digital Signatures for Photographers — Contracts and Releases | Firmiu",
      metaDescription: "Digital signatures for photographers and creatives. Sign session contracts, model releases and quotes without printing.",
      keywords: "digital signature for photographers, e-signature image rights, photo session contract, sign model release",
      intro: "Every session needs its contract and rights release. Firmiu lets you close them before taking the first shot.",
      uses: ["Session and event contracts", "Image rights releases (model release)", "Quotes and bookings", "Photo usage licenses"],
      benefits: [
        { title: "Close the session fast", desc: "The client signs their contract and booking in minutes." },
        { title: "Rights in order", desc: "Document every image-rights release with backing." },
        { title: "Every signature traceable", desc: "IP, date and verification are logged." },
      ],
      faqs: [
        { q: "Does it work for image-rights releases?", a: "Yes, as a private agreement between you and the photographed person." },
        { q: "Does the client need an account?", a: "No. They sign from a unique link by email." },
        { q: "Can I reuse my contracts?", a: "Yes. Upload your PDF each time and save contacts to send faster." },
      ],
    },
  },
  {
    slug: "escuelas",
    icon: "academic",
    es: {
      name: "Escuelas y academias",
      h1: "Firma digital para escuelas y academias",
      metaTitle: "Firma Digital para Escuelas — Matrículas y Autorizaciones | Firmiu",
      metaDescription: "Firma digital para escuelas, colegios y academias. Firma matrículas, autorizaciones y acuerdos con padres y alumnos sin papel.",
      keywords: "firma digital para escuelas, firma electrónica matrícula, autorización escolar firma, firmar inscripción academia",
      intro: "Las instituciones educativas juntan firmas en cada inscripción. Firmiu permite a padres y alumnos firmar matrículas y autorizaciones a distancia.",
      uses: ["Matrículas e inscripciones", "Autorizaciones de salidas y actividades", "Acuerdos de pago y reglamentos", "Consentimientos de uso de imagen"],
      benefits: [
        { title: "Inscripciones sin filas", desc: "Los padres firman desde casa, antes del primer día de clases." },
        { title: "Todo organizado", desc: "Conserva cada documento firmado por alumno o familia." },
        { title: "Respaldo por persona", desc: "Sabes quién firmó qué, cuándo y desde dónde." },
      ],
      faqs: [
        { q: "¿Sirve para matrículas?", a: "Sí, y para autorizaciones, reglamentos y acuerdos de pago." },
        { q: "¿Los padres necesitan una cuenta?", a: "No. Firman desde un enlace único por correo." },
        { q: "¿Queda registro de cada firma?", a: "Sí. Cada firma guarda fecha, IP, dispositivo y verificación." },
      ],
    },
    en: {
      name: "Schools & academies",
      h1: "Digital signatures for schools & academies",
      metaTitle: "Digital Signatures for Schools — Enrollments and Authorizations | Firmiu",
      metaDescription: "Digital signatures for schools and academies. Sign enrollments, authorizations and agreements with parents and students paper-free.",
      keywords: "digital signature for schools, e-signature enrollment, school authorization signature, sign academy registration",
      intro: "Educational institutions collect signatures at every enrollment. Firmiu lets parents and students sign enrollments and authorizations remotely.",
      uses: ["Enrollments and registrations", "Field-trip and activity authorizations", "Payment agreements and policies", "Image-use consents"],
      benefits: [
        { title: "Enrollments without lines", desc: "Parents sign from home, before the first day of class." },
        { title: "Everything organized", desc: "Keep every signed document per student or family." },
        { title: "Per-person backing", desc: "You know who signed what, when and from where." },
      ],
      faqs: [
        { q: "Does it work for enrollments?", a: "Yes, and for authorizations, policies and payment agreements." },
        { q: "Do parents need an account?", a: "No. They sign from a unique link by email." },
        { q: "Is there a record of each signature?", a: "Yes. Every signature stores date, IP, device and verification." },
      ],
    },
  },
  {
    slug: "constructoras",
    icon: "office",
    es: {
      name: "Constructoras",
      h1: "Firma digital para constructoras",
      metaTitle: "Firma Digital para Constructoras — Contratos de Obra | Firmiu",
      metaDescription: "Firma digital para constructoras y contratistas. Firma contratos de obra, subcontratos y actas con clientes y proveedores sin imprimir.",
      keywords: "firma digital para constructoras, firma electrónica contrato de obra, subcontrato firma, firmar acta de obra",
      intro: "En construcción intervienen muchas partes y muchos documentos. Firmiu permite firmar contratos, subcontratos y actas sin frenar la obra.",
      uses: ["Contratos de obra y honorarios", "Subcontratos con proveedores", "Actas de avance y recepción", "Órdenes de cambio y adendas"],
      benefits: [
        { title: "Acuerdos sin demoras", desc: "Clientes y proveedores firman a distancia, sin reuniones." },
        { title: "Cada etapa documentada", desc: "Conserva actas y contratos firmados de toda la obra." },
        { title: "Trazabilidad", desc: "IP, fecha y verificación respaldan cada firma." },
      ],
      faqs: [
        { q: "¿Sirve para contratos de obra?", a: "Sí, y para subcontratos, actas y órdenes de cambio privadas." },
        { q: "¿Puedo firmar con varios proveedores?", a: "Sí. Cada uno recibe su enlace único y firma sin registrarse." },
        { q: "¿Funciona en varios países?", a: "Sí. La firma electrónica se reconoce en LATAM, España y EE. UU." },
      ],
    },
    en: {
      name: "Construction",
      h1: "Digital signatures for construction companies",
      metaTitle: "Digital Signatures for Construction — Project Contracts | Firmiu",
      metaDescription: "Digital signatures for construction companies and contractors. Sign project contracts, subcontracts and records with clients and suppliers without printing.",
      keywords: "digital signature for construction, e-signature project contract, subcontract signature, sign construction record",
      intro: "Construction involves many parties and many documents. Firmiu lets you sign contracts, subcontracts and records without slowing the site.",
      uses: ["Project and fee contracts", "Subcontracts with suppliers", "Progress and acceptance records", "Change orders and addenda"],
      benefits: [
        { title: "Agreements without delays", desc: "Clients and suppliers sign remotely, with no meetings." },
        { title: "Every stage documented", desc: "Keep signed records and contracts for the whole project." },
        { title: "Traceability", desc: "IP, date and verification back every signature." },
      ],
      faqs: [
        { q: "Does it work for project contracts?", a: "Yes, and for subcontracts, records and private change orders." },
        { q: "Can I sign with several suppliers?", a: "Yes. Each gets their unique link and signs without registering." },
        { q: "Does it work across countries?", a: "Yes. Electronic signatures are recognized across Latin America, Spain and the US." },
      ],
    },
  },
  {
    slug: "comercio-electronico",
    icon: "document",
    es: {
      name: "Comercio electrónico",
      h1: "Firma digital para comercio electrónico",
      metaTitle: "Firma Digital para E-commerce — Contratos y Acuerdos | Firmiu",
      metaDescription: "Firma digital para tiendas online y e-commerce. Firma contratos con proveedores, acuerdos de dropshipping y términos comerciales sin papel.",
      keywords: "firma digital para ecommerce, firma electrónica tienda online, contrato proveedor ecommerce, firmar acuerdo dropshipping",
      intro: "Tu negocio vive en internet; tus contratos también pueden. Firmiu permite firmar acuerdos con proveedores y partners sin salir de lo digital.",
      uses: ["Contratos con proveedores y marcas", "Acuerdos de dropshipping y distribución", "Términos comerciales y de afiliados", "Acuerdos de confidencialidad (NDA)"],
      benefits: [
        { title: "Todo digital", desc: "Cierra acuerdos sin imprimir ni escanear, igual que vendes." },
        { title: "Rápido y a distancia", desc: "Tus proveedores firman desde cualquier lugar en minutos." },
        { title: "Respaldo en cada firma", desc: "IP, fecha y verificación documentan cada acuerdo." },
      ],
      faqs: [
        { q: "¿Sirve para acuerdos con proveedores?", a: "Sí, para contratos de suministro, distribución y acuerdos privados." },
        { q: "¿Puedo firmar con proveedores en otros países?", a: "Sí. La firma electrónica se reconoce internacionalmente." },
        { q: "¿Es seguro?", a: "Sí. Los documentos se guardan cifrados y con enlaces firmados temporales." },
      ],
    },
    en: {
      name: "E-commerce",
      h1: "Digital signatures for e-commerce",
      metaTitle: "Digital Signatures for E-commerce — Contracts and Agreements | Firmiu",
      metaDescription: "Digital signatures for online stores and e-commerce. Sign supplier contracts, dropshipping agreements and commercial terms paper-free.",
      keywords: "digital signature for ecommerce, e-signature online store, ecommerce supplier contract, sign dropshipping agreement",
      intro: "Your business lives online; your contracts can too. Firmiu lets you sign agreements with suppliers and partners without leaving the digital world.",
      uses: ["Contracts with suppliers and brands", "Dropshipping and distribution agreements", "Commercial and affiliate terms", "Non-disclosure agreements (NDAs)"],
      benefits: [
        { title: "Fully digital", desc: "Close agreements without printing or scanning, just like you sell." },
        { title: "Fast and remote", desc: "Your suppliers sign from anywhere in minutes." },
        { title: "Backing on every signature", desc: "IP, date and verification document each agreement." },
      ],
      faqs: [
        { q: "Does it work for supplier agreements?", a: "Yes, for supply and distribution contracts and private agreements." },
        { q: "Can I sign with suppliers in other countries?", a: "Yes. Electronic signatures are recognized internationally." },
        { q: "Is it secure?", a: "Yes. Documents are stored encrypted and with temporary signed links." },
      ],
    },
  },
  {
    slug: "gimnasios",
    icon: "heart",
    es: {
      name: "Gimnasios",
      h1: "Firma digital para gimnasios",
      metaTitle: "Firma Digital para Gimnasios — Membresías y Descargos | Firmiu",
      metaDescription: "Firma digital para gimnasios y centros deportivos. Firma membresías, descargos de responsabilidad y contratos de servicio sin papel.",
      keywords: "firma digital para gimnasios, firma electrónica membresía, descargo de responsabilidad firma, firmar contrato gimnasio",
      intro: "Cada nuevo socio firma su membresía y su descargo. Firmiu permite cerrar la inscripción en recepción o desde el móvil en minutos.",
      uses: ["Contratos de membresía", "Descargos de responsabilidad (waiver)", "Autorizaciones de cobro recurrente", "Reglamentos y políticas del centro"],
      benefits: [
        { title: "Inscripción exprés", desc: "El socio firma su membresía y descargo en segundos." },
        { title: "Sin papeleo en recepción", desc: "Firma desde el móvil del socio o una tablet del gimnasio." },
        { title: "Respaldo documentado", desc: "IP, fecha y verificación quedan registrados en cada firma." },
      ],
      faqs: [
        { q: "¿Sirve para descargos de responsabilidad?", a: "Sí, como acuerdo privado entre el gimnasio y el socio." },
        { q: "¿El socio necesita una cuenta?", a: "No. Firma desde un enlace único, sin registrarse." },
        { q: "¿Puedo guardar a mis socios?", a: "Sí, para enviarles nuevos documentos en segundos." },
      ],
    },
    en: {
      name: "Gyms",
      h1: "Digital signatures for gyms",
      metaTitle: "Digital Signatures for Gyms — Memberships and Waivers | Firmiu",
      metaDescription: "Digital signatures for gyms and fitness centers. Sign memberships, liability waivers and service contracts paper-free.",
      keywords: "digital signature for gyms, e-signature membership, liability waiver signature, sign gym contract",
      intro: "Every new member signs their membership and waiver. Firmiu lets you close sign-up at reception or from mobile in minutes.",
      uses: ["Membership contracts", "Liability waivers", "Recurring-payment authorizations", "Center rules and policies"],
      benefits: [
        { title: "Express sign-up", desc: "The member signs their membership and waiver in seconds." },
        { title: "No paperwork at reception", desc: "Sign from the member's phone or a gym tablet." },
        { title: "Documented backing", desc: "IP, date and verification are logged on every signature." },
      ],
      faqs: [
        { q: "Does it work for liability waivers?", a: "Yes, as a private agreement between the gym and the member." },
        { q: "Does the member need an account?", a: "No. They sign from a unique link, without registering." },
        { q: "Can I save my members?", a: "Yes, to send them new documents in seconds." },
      ],
    },
  },
  {
    slug: "gestorias-asesorias",
    icon: "briefcase",
    es: {
      name: "Gestorías y asesorías",
      h1: "Firma digital para gestorías y asesorías",
      metaTitle: "Firma Digital para Gestorías y Asesorías — Firma con Clientes | Firmiu",
      metaDescription: "Firma digital para gestorías y asesorías. Firma contratos de servicio, autorizaciones y mandatos con tus clientes sin imprimir.",
      keywords: "firma digital para gestorías, firma electrónica asesoría, autorización gestoría firma, firmar mandato cliente",
      intro: "Las gestorías tramitan a diario en nombre de sus clientes, y cada gestión necesita una autorización firmada. Firmiu agiliza esas firmas sin papeleo.",
      uses: ["Contratos de servicios y honorarios", "Autorizaciones y mandatos de representación", "Acuerdos de protección de datos", "Documentos para trámites del cliente"],
      benefits: [
        { title: "Tramita más rápido", desc: "Consigue la autorización del cliente en minutos y avanza con la gestión." },
        { title: "Todo documentado", desc: "Conserva cada autorización firmada con su rastro de auditoría." },
        { title: "Sin desplazamientos", desc: "Tus clientes firman desde donde estén, sin pasar por la oficina." },
      ],
      faqs: [
        { q: "¿Sirve para autorizaciones y mandatos?", a: "Sí, para la mayoría de autorizaciones privadas de representación y servicio." },
        { q: "¿El cliente necesita registrarse?", a: "No. Firma desde un enlace único por correo." },
        { q: "¿Puedo guardar a mis clientes?", a: "Sí, para enviar nuevos documentos en segundos." },
      ],
    },
    en: {
      name: "Agencies & advisory firms",
      h1: "Digital signatures for advisory firms",
      metaTitle: "Digital Signatures for Advisory Firms — Sign with Clients | Firmiu",
      metaDescription: "Digital signatures for advisory and admin firms. Sign service contracts, authorizations and mandates with clients without printing.",
      keywords: "digital signature for advisory firms, e-signature agency, authorization signature, sign client mandate",
      intro: "Advisory firms file on behalf of clients every day, and each task needs a signed authorization. Firmiu speeds up those signatures with no paperwork.",
      uses: ["Service and fee contracts", "Authorizations and representation mandates", "Data-protection agreements", "Documents for client procedures"],
      benefits: [
        { title: "File faster", desc: "Get the client's authorization in minutes and move forward." },
        { title: "Everything documented", desc: "Keep each signed authorization with its audit trail." },
        { title: "No travel", desc: "Your clients sign from wherever they are, without visiting the office." },
      ],
      faqs: [
        { q: "Does it work for authorizations and mandates?", a: "Yes, for most private representation and service authorizations." },
        { q: "Does the client need to register?", a: "No. They sign from a unique link by email." },
        { q: "Can I save my clients?", a: "Yes, to send new documents in seconds." },
      ],
    },
  },
  {
    slug: "veterinarias",
    icon: "heart",
    es: {
      name: "Veterinarias",
      h1: "Firma digital para veterinarias",
      metaTitle: "Firma Digital para Veterinarias — Consentimientos y Más | Firmiu",
      metaDescription: "Firma digital para clínicas veterinarias. Firma consentimientos de cirugía, presupuestos y autorizaciones con los dueños sin papel.",
      keywords: "firma digital para veterinarias, firma electrónica consentimiento veterinario, autorización cirugía mascota, firmar presupuesto veterinario",
      intro: "Cada procedimiento veterinario implica un consentimiento o un presupuesto. Firmiu permite a los dueños firmarlos rápido, en la clínica o desde casa.",
      uses: ["Consentimientos de cirugía y tratamiento", "Presupuestos y planes de atención", "Autorizaciones de hospitalización", "Contratos de servicios y planes"],
      benefits: [
        { title: "Agiliza la consulta", desc: "El dueño firma el consentimiento en segundos, sin esperas." },
        { title: "Sin papeleo", desc: "Olvídate de imprimir y archivar formularios." },
        { title: "Respaldo documentado", desc: "IP, fecha y verificación quedan registrados en cada firma." },
      ],
      faqs: [
        { q: "¿Sirve para consentimientos veterinarios?", a: "Sí, como acuerdo privado entre la clínica y el dueño de la mascota." },
        { q: "¿El dueño firma desde el móvil?", a: "Sí, con un enlace único y sin instalar nada." },
        { q: "¿Puedo reutilizar mis formularios?", a: "Sí. Sube tu PDF cada vez y guarda contactos para enviar más rápido." },
      ],
    },
    en: {
      name: "Veterinary clinics",
      h1: "Digital signatures for veterinary clinics",
      metaTitle: "Digital Signatures for Veterinary Clinics — Consents and More | Firmiu",
      metaDescription: "Digital signatures for veterinary clinics. Sign surgery consents, quotes and authorizations with owners paper-free.",
      keywords: "digital signature for veterinary clinics, e-signature vet consent, pet surgery authorization, sign vet quote",
      intro: "Every veterinary procedure involves a consent or a quote. Firmiu lets owners sign them quickly, at the clinic or from home.",
      uses: ["Surgery and treatment consents", "Quotes and care plans", "Hospitalization authorizations", "Service contracts and plans"],
      benefits: [
        { title: "Speed up the visit", desc: "The owner signs the consent in seconds, with no waiting." },
        { title: "No paperwork", desc: "Forget printing and filing forms." },
        { title: "Documented backing", desc: "IP, date and verification are logged on every signature." },
      ],
      faqs: [
        { q: "Does it work for veterinary consents?", a: "Yes, as a private agreement between the clinic and the pet's owner." },
        { q: "Does the owner sign from mobile?", a: "Yes, with a unique link and nothing to install." },
        { q: "Can I reuse my forms?", a: "Yes. Upload your PDF each time and save contacts to send faster." },
      ],
    },
  },
  {
    slug: "restaurantes-y-franquicias",
    icon: "document",
    es: {
      name: "Restaurantes y franquicias",
      h1: "Firma digital para restaurantes y franquicias",
      metaTitle: "Firma Digital para Restaurantes y Franquicias — Contratos | Firmiu",
      metaDescription: "Firma digital para restaurantes y franquicias. Firma contratos con proveedores, acuerdos de franquicia y de personal sin imprimir.",
      keywords: "firma digital para restaurantes, firma electrónica franquicia, contrato proveedor restaurante, firmar acuerdo de franquicia",
      intro: "Un restaurante firma acuerdos con proveedores, personal y, si crece, franquiciados. Firmiu centraliza todas esas firmas en un flujo simple.",
      uses: ["Contratos con proveedores", "Acuerdos de franquicia y licencia", "Contratos de personal", "Acuerdos de servicios y alquiler de equipo"],
      benefits: [
        { title: "Acuerdos sin demoras", desc: "Proveedores y franquiciados firman a distancia en minutos." },
        { title: "Todo en orden", desc: "Conserva cada contrato firmado de cada local o proveedor." },
        { title: "Respaldo legal", desc: "Cada firma guarda IP, fecha, dispositivo y verificación." },
      ],
      faqs: [
        { q: "¿Sirve para acuerdos de franquicia?", a: "Sí, para contratos de franquicia, licencia y acuerdos privados." },
        { q: "¿Puedo firmar con varios proveedores?", a: "Sí. Cada uno recibe su enlace único y firma sin registrarse." },
        { q: "¿Funciona en varios países?", a: "Sí. La firma electrónica se reconoce en LATAM, España y EE. UU." },
      ],
    },
    en: {
      name: "Restaurants & franchises",
      h1: "Digital signatures for restaurants & franchises",
      metaTitle: "Digital Signatures for Restaurants & Franchises — Contracts | Firmiu",
      metaDescription: "Digital signatures for restaurants and franchises. Sign supplier contracts, franchise agreements and staff documents without printing.",
      keywords: "digital signature for restaurants, e-signature franchise, restaurant supplier contract, sign franchise agreement",
      intro: "A restaurant signs agreements with suppliers, staff and, as it grows, franchisees. Firmiu centralizes all those signatures in one simple flow.",
      uses: ["Supplier contracts", "Franchise and license agreements", "Staff contracts", "Service and equipment-rental agreements"],
      benefits: [
        { title: "Agreements without delays", desc: "Suppliers and franchisees sign remotely in minutes." },
        { title: "Everything in order", desc: "Keep every signed contract for each location or supplier." },
        { title: "Legal backing", desc: "Every signature stores IP, date, device and verification." },
      ],
      faqs: [
        { q: "Does it work for franchise agreements?", a: "Yes, for franchise and license contracts and private agreements." },
        { q: "Can I sign with several suppliers?", a: "Yes. Each gets their unique link and signs without registering." },
        { q: "Does it work across countries?", a: "Yes. Electronic signatures are recognized across Latin America, Spain and the US." },
      ],
    },
  },
  {
    slug: "agencias-de-reclutamiento",
    icon: "users",
    es: {
      name: "Agencias de reclutamiento",
      h1: "Firma digital para agencias de reclutamiento",
      metaTitle: "Firma Digital para Reclutamiento — Contratos y Acuerdos | Firmiu",
      metaDescription: "Firma digital para agencias de reclutamiento y selección. Firma contratos con candidatos y empresas, NDAs y acuerdos de colocación sin papel.",
      keywords: "firma digital para reclutamiento, firma electrónica selección de personal, contrato candidato firma, firmar acuerdo de colocación",
      intro: "El reclutamiento se mueve a la velocidad del mercado. Firmiu permite firmar acuerdos con empresas y candidatos sin frenar el proceso.",
      uses: ["Contratos de servicios de reclutamiento", "Acuerdos de colocación con empresas", "NDAs y acuerdos de confidencialidad", "Cartas de oferta y aceptación"],
      benefits: [
        { title: "Cierra posiciones más rápido", desc: "Empresas y candidatos firman a distancia, sin esperas." },
        { title: "Proceso ordenado", desc: "Conserva cada acuerdo firmado por cliente y candidato." },
        { title: "Trazabilidad", desc: "IP, fecha y verificación respaldan cada firma." },
      ],
      faqs: [
        { q: "¿Sirve para cartas de oferta?", a: "Sí, y para contratos de servicio y acuerdos de colocación privados." },
        { q: "¿El candidato necesita una cuenta?", a: "No. Firma desde un enlace único por correo." },
        { q: "¿Funciona con clientes en otros países?", a: "Sí. La firma electrónica se reconoce internacionalmente." },
      ],
    },
    en: {
      name: "Recruitment agencies",
      h1: "Digital signatures for recruitment agencies",
      metaTitle: "Digital Signatures for Recruitment — Contracts and Agreements | Firmiu",
      metaDescription: "Digital signatures for recruitment agencies. Sign contracts with candidates and companies, NDAs and placement agreements paper-free.",
      keywords: "digital signature for recruitment, e-signature staffing, candidate contract signature, sign placement agreement",
      intro: "Recruitment moves at market speed. Firmiu lets you sign agreements with companies and candidates without slowing the process.",
      uses: ["Recruitment service contracts", "Placement agreements with companies", "NDAs and confidentiality agreements", "Offer and acceptance letters"],
      benefits: [
        { title: "Fill roles faster", desc: "Companies and candidates sign remotely, with no waiting." },
        { title: "Organized process", desc: "Keep every signed agreement per client and candidate." },
        { title: "Traceability", desc: "IP, date and verification back every signature." },
      ],
      faqs: [
        { q: "Does it work for offer letters?", a: "Yes, and for service contracts and private placement agreements." },
        { q: "Does the candidate need an account?", a: "No. They sign from a unique link by email." },
        { q: "Does it work with clients in other countries?", a: "Yes. Electronic signatures are recognized internationally." },
      ],
    },
  },
  {
    slug: "ong-y-asociaciones",
    icon: "users",
    es: {
      name: "ONG y asociaciones",
      h1: "Firma digital para ONG y asociaciones",
      metaTitle: "Firma Digital para ONG y Asociaciones — Convenios y Más | Firmiu",
      metaDescription: "Firma digital para ONG, fundaciones y asociaciones. Firma convenios, acuerdos de voluntariado y de colaboración sin papel.",
      keywords: "firma digital para ONG, firma electrónica asociación, convenio de colaboración firma, firmar acuerdo de voluntariado",
      intro: "Las organizaciones sin fines de lucro firman convenios y acuerdos constantemente. Firmiu lo hace simple, rápido y sin gastos de papelería.",
      uses: ["Convenios de colaboración", "Acuerdos de voluntariado", "Contratos con proveedores y aliados", "Autorizaciones y consentimientos"],
      benefits: [
        { title: "Más tiempo para tu causa", desc: "Menos papeleo administrativo y más foco en tu misión." },
        { title: "Firma a distancia", desc: "Voluntarios y aliados firman desde cualquier lugar." },
        { title: "Todo documentado", desc: "Cada firma guarda IP, fecha y verificación." },
      ],
      faqs: [
        { q: "¿Sirve para convenios de colaboración?", a: "Sí, y para acuerdos de voluntariado y contratos privados." },
        { q: "¿El firmante necesita una cuenta?", a: "No. Firma desde un enlace único, sin registrarse." },
        { q: "¿Hay un plan gratuito?", a: "Sí, Firmiu ofrece un plan gratuito para empezar." },
      ],
    },
    en: {
      name: "NGOs & associations",
      h1: "Digital signatures for NGOs & associations",
      metaTitle: "Digital Signatures for NGOs & Associations — Agreements | Firmiu",
      metaDescription: "Digital signatures for NGOs, foundations and associations. Sign partnership, volunteer and collaboration agreements paper-free.",
      keywords: "digital signature for NGOs, e-signature association, collaboration agreement signature, sign volunteer agreement",
      intro: "Nonprofits sign agreements constantly. Firmiu makes it simple, fast and free of stationery costs.",
      uses: ["Collaboration agreements", "Volunteer agreements", "Contracts with suppliers and partners", "Authorizations and consents"],
      benefits: [
        { title: "More time for your cause", desc: "Less admin paperwork and more focus on your mission." },
        { title: "Sign remotely", desc: "Volunteers and partners sign from anywhere." },
        { title: "Everything documented", desc: "Every signature stores IP, date and verification." },
      ],
      faqs: [
        { q: "Does it work for collaboration agreements?", a: "Yes, and for volunteer agreements and private contracts." },
        { q: "Does the signer need an account?", a: "No. They sign from a unique link, without registering." },
        { q: "Is there a free plan?", a: "Yes, Firmiu offers a free plan to get started." },
      ],
    },
  },
  {
    slug: "coworkings",
    icon: "office",
    es: {
      name: "Coworkings",
      h1: "Firma digital para espacios de coworking",
      metaTitle: "Firma Digital para Coworkings — Membresías y Contratos | Firmiu",
      metaDescription: "Firma digital para espacios de coworking. Firma membresías, contratos de alquiler de oficina y reglamentos con tus miembros sin papel.",
      keywords: "firma digital para coworking, firma electrónica membresía oficina, contrato coworking firma, firmar reglamento espacio de trabajo",
      intro: "Cada nuevo miembro de un coworking firma su membresía y reglamento. Firmiu permite cerrar la alta en recepción o a distancia en minutos.",
      uses: ["Contratos de membresía", "Alquiler de oficinas y salas", "Reglamentos y políticas del espacio", "Autorizaciones de cobro recurrente"],
      benefits: [
        { title: "Alta exprés", desc: "El miembro firma su membresía y reglamento en segundos." },
        { title: "Sin papeleo en recepción", desc: "Firma desde el móvil del miembro o una tablet del espacio." },
        { title: "Respaldo documentado", desc: "IP, fecha y verificación quedan registrados." },
      ],
      faqs: [
        { q: "¿Sirve para contratos de membresía?", a: "Sí, y para alquiler de oficinas, salas y reglamentos." },
        { q: "¿El miembro necesita una cuenta?", a: "No. Firma desde un enlace único, sin registrarse." },
        { q: "¿Puedo guardar a mis miembros?", a: "Sí, para enviar nuevos documentos en segundos." },
      ],
    },
    en: {
      name: "Coworking spaces",
      h1: "Digital signatures for coworking spaces",
      metaTitle: "Digital Signatures for Coworking Spaces — Memberships | Firmiu",
      metaDescription: "Digital signatures for coworking spaces. Sign memberships, office-rental contracts and policies with members paper-free.",
      keywords: "digital signature for coworking, e-signature office membership, coworking contract signature, sign workspace policy",
      intro: "Every new coworking member signs their membership and policies. Firmiu lets you close sign-up at reception or remotely in minutes.",
      uses: ["Membership contracts", "Office and room rentals", "Space rules and policies", "Recurring-payment authorizations"],
      benefits: [
        { title: "Express sign-up", desc: "The member signs their membership and policy in seconds." },
        { title: "No paperwork at reception", desc: "Sign from the member's phone or a space tablet." },
        { title: "Documented backing", desc: "IP, date and verification are logged." },
      ],
      faqs: [
        { q: "Does it work for membership contracts?", a: "Yes, and for office and room rentals and policies." },
        { q: "Does the member need an account?", a: "No. They sign from a unique link, without registering." },
        { q: "Can I save my members?", a: "Yes, to send new documents in seconds." },
      ],
    },
  },
  {
    slug: "salones-de-belleza",
    icon: "heart",
    es: {
      name: "Salones de belleza y estética",
      h1: "Firma digital para salones de belleza y estética",
      metaTitle: "Firma Digital para Estética — Consentimientos y Descargos | Firmiu",
      metaDescription: "Firma digital para salones de belleza, spa y centros de estética. Firma consentimientos, descargos y presupuestos de tratamiento sin papel.",
      keywords: "firma digital para estética, firma electrónica salón de belleza, consentimiento estética firma, firmar descargo tratamiento",
      intro: "Tratamientos estéticos y de spa suelen requerir un consentimiento o descargo. Firmiu permite firmarlos en recepción o desde el móvil en segundos.",
      uses: ["Consentimientos de tratamiento", "Descargos de responsabilidad", "Presupuestos y planes de sesiones", "Políticas y reglamentos del centro"],
      benefits: [
        { title: "Agiliza la cita", desc: "El cliente firma su consentimiento sin demoras antes del tratamiento." },
        { title: "Sin papeleo", desc: "Olvídate de imprimir y archivar formularios." },
        { title: "Respaldo documentado", desc: "IP, fecha y verificación quedan registrados en cada firma." },
      ],
      faqs: [
        { q: "¿Sirve para consentimientos y descargos?", a: "Sí, como acuerdo privado entre el centro y el cliente." },
        { q: "¿El cliente firma desde el móvil?", a: "Sí, con un enlace único, sin instalar nada." },
        { q: "¿Puedo reutilizar mis formularios?", a: "Sí. Sube tu PDF cada vez y guarda contactos para enviar más rápido." },
      ],
    },
    en: {
      name: "Beauty & aesthetics salons",
      h1: "Digital signatures for beauty & aesthetics salons",
      metaTitle: "Digital Signatures for Aesthetics — Consents and Waivers | Firmiu",
      metaDescription: "Digital signatures for beauty salons, spas and aesthetics centers. Sign consents, waivers and treatment quotes paper-free.",
      keywords: "digital signature for aesthetics, e-signature beauty salon, aesthetics consent signature, sign treatment waiver",
      intro: "Aesthetic and spa treatments often need a consent or waiver. Firmiu lets you sign them at reception or from mobile in seconds.",
      uses: ["Treatment consents", "Liability waivers", "Quotes and session plans", "Center policies and rules"],
      benefits: [
        { title: "Speed up the appointment", desc: "The client signs their consent without delays before the treatment." },
        { title: "No paperwork", desc: "Forget printing and filing forms." },
        { title: "Documented backing", desc: "IP, date and verification are logged on every signature." },
      ],
      faqs: [
        { q: "Does it work for consents and waivers?", a: "Yes, as a private agreement between the center and the client." },
        { q: "Does the client sign from mobile?", a: "Yes, with a unique link and nothing to install." },
        { q: "Can I reuse my forms?", a: "Yes. Upload your PDF each time and save contacts to send faster." },
      ],
    },
  },
  {
    slug: "agencias-de-eventos",
    icon: "megaphone",
    es: {
      name: "Agencias de eventos",
      h1: "Firma digital para agencias de eventos",
      metaTitle: "Firma Digital para Eventos — Contratos y Reservas | Firmiu",
      metaDescription: "Firma digital para agencias de eventos y wedding planners. Firma contratos, reservas y acuerdos con proveedores y clientes sin imprimir.",
      keywords: "firma digital para eventos, firma electrónica wedding planner, contrato de evento firma, firmar reserva de evento",
      intro: "Organizar un evento implica contratos con clientes y proveedores contra reloj. Firmiu permite firmarlos a distancia y cerrar fechas más rápido.",
      uses: ["Contratos de servicios para eventos", "Reservas y confirmaciones de fecha", "Acuerdos con proveedores y locales", "Términos y condiciones del evento"],
      benefits: [
        { title: "Cierra fechas más rápido", desc: "El cliente firma su contrato y reserva en minutos." },
        { title: "Proveedores coordinados", desc: "Cada proveedor firma su acuerdo a distancia, sin reuniones." },
        { title: "Todo documentado", desc: "IP, fecha y verificación respaldan cada firma." },
      ],
      faqs: [
        { q: "¿Sirve para contratos de evento?", a: "Sí, y para reservas y acuerdos privados con proveedores." },
        { q: "¿El cliente firma desde el móvil?", a: "Sí, con un enlace único, sin instalar nada." },
        { q: "¿Puedo guardar a mis proveedores?", a: "Sí, para enviarles nuevos acuerdos en segundos." },
      ],
    },
    en: {
      name: "Event agencies",
      h1: "Digital signatures for event agencies",
      metaTitle: "Digital Signatures for Events — Contracts and Bookings | Firmiu",
      metaDescription: "Digital signatures for event agencies and wedding planners. Sign contracts, bookings and agreements with suppliers and clients without printing.",
      keywords: "digital signature for events, e-signature wedding planner, event contract signature, sign event booking",
      intro: "Organizing an event means contracts with clients and suppliers against the clock. Firmiu lets you sign them remotely and lock dates faster.",
      uses: ["Event service contracts", "Bookings and date confirmations", "Agreements with suppliers and venues", "Event terms and conditions"],
      benefits: [
        { title: "Lock dates faster", desc: "The client signs their contract and booking in minutes." },
        { title: "Coordinated suppliers", desc: "Each supplier signs their agreement remotely, with no meetings." },
        { title: "Everything documented", desc: "IP, date and verification back every signature." },
      ],
      faqs: [
        { q: "Does it work for event contracts?", a: "Yes, and for bookings and private supplier agreements." },
        { q: "Does the client sign from mobile?", a: "Yes, with a unique link and nothing to install." },
        { q: "Can I save my suppliers?", a: "Yes, to send them new agreements in seconds." },
      ],
    },
  },
  {
    slug: "psicologos",
    icon: "heart",
    es: {
      name: "Psicólogos",
      h1: "Firma digital para psicólogos",
      metaTitle: "Firma Digital para Psicólogos — Consentimiento Informado Online | Firmiu",
      metaDescription: "Firma digital para psicólogos y terapeutas. Firma el consentimiento informado, el encuadre terapéutico y contratos de sesión online, sin papel.",
      keywords: "firma digital para psicólogos, consentimiento informado psicología online, firma electrónica terapeuta, contrato de sesión terapia firma",
      intro: "La terapia online creció y con ella la necesidad de firmar el consentimiento a distancia. Firmiu permite que tu paciente firme antes de la primera sesión.",
      uses: ["Consentimiento informado", "Encuadre y contrato terapéutico", "Acuerdos de confidencialidad", "Autorizaciones de menores"],
      benefits: [
        { title: "Listo antes de empezar", desc: "El paciente firma el consentimiento antes de la primera sesión." },
        { title: "Trazabilidad por persona", desc: "IP, fecha y verificación documentan cada firma." },
        { title: "Sin papeleo", desc: "Olvídate de imprimir y escanear formularios." },
      ],
      faqs: [
        { q: "¿Sirve para el consentimiento informado?", a: "Sí, como acuerdo privado con el paciente; revisa los requisitos de tu colegio profesional y país." },
        { q: "¿El paciente firma desde el móvil?", a: "Sí, desde un enlace único, sin instalar nada." },
        { q: "¿Puedo reutilizar mi formulario?", a: "Sí. Sube tu PDF cada vez y guarda contactos para enviar más rápido." },
      ],
    },
    en: {
      name: "Psychologists",
      h1: "Digital signatures for psychologists",
      metaTitle: "Digital Signatures for Psychologists — Online Informed Consent | Firmiu",
      metaDescription: "Digital signatures for psychologists and therapists. Sign informed consent, the therapeutic agreement and session contracts online, paper-free.",
      keywords: "digital signature for psychologists, online informed consent psychology, e-signature therapist, therapy session contract signature",
      intro: "Online therapy has grown, and with it the need to sign consent remotely. Firmiu lets your patient sign before the first session.",
      uses: ["Informed consent", "Therapeutic agreement", "Confidentiality agreements", "Minor authorizations"],
      benefits: [
        { title: "Ready before you start", desc: "The patient signs consent before the first session." },
        { title: "Per-person traceability", desc: "IP, date and verification document each signature." },
        { title: "No paperwork", desc: "Forget printing and scanning forms." },
      ],
      faqs: [
        { q: "Does it work for informed consent?", a: "Yes, as a private agreement with the patient; check your professional board's and country's requirements." },
        { q: "Does the patient sign from mobile?", a: "Yes, from a unique link, with nothing to install." },
        { q: "Can I reuse my form?", a: "Yes. Upload your PDF each time and save contacts to send faster." },
      ],
    },
  },
  {
    slug: "nutricionistas",
    icon: "heart",
    es: {
      name: "Nutricionistas",
      h1: "Firma digital para nutricionistas",
      metaTitle: "Firma Digital para Nutricionistas — Consentimientos y Planes | Firmiu",
      metaDescription: "Firma digital para nutricionistas y dietistas. Firma consentimientos, planes nutricionales y contratos de seguimiento con tus pacientes online.",
      keywords: "firma digital para nutricionistas, consentimiento nutrición firma, firma electrónica dietista, contrato seguimiento nutricional",
      intro: "Las consultas de nutrición suelen ser online y por planes. Firmiu permite firmar consentimientos y contratos de seguimiento sin papeleo.",
      uses: ["Consentimientos de tratamiento", "Contratos de seguimiento y planes", "Acuerdos de confidencialidad", "Autorizaciones y descargos"],
      benefits: [
        { title: "Onboarding ágil", desc: "El paciente firma su plan y empieza el mismo día." },
        { title: "Todo documentado", desc: "Cada firma guarda IP, fecha y verificación." },
        { title: "Consulta sin papel", desc: "Firma a distancia, ideal para la consulta online." },
      ],
      faqs: [
        { q: "¿Sirve para contratos de seguimiento?", a: "Sí, y para consentimientos y acuerdos privados con el paciente." },
        { q: "¿El paciente necesita una cuenta?", a: "No. Firma desde un enlace único por correo." },
        { q: "¿Funciona para consulta online?", a: "Sí, el paciente firma desde cualquier lugar." },
      ],
    },
    en: {
      name: "Nutritionists",
      h1: "Digital signatures for nutritionists",
      metaTitle: "Digital Signatures for Nutritionists — Consents and Plans | Firmiu",
      metaDescription: "Digital signatures for nutritionists and dietitians. Sign consents, nutrition plans and follow-up contracts with patients online.",
      keywords: "digital signature for nutritionists, nutrition consent signature, e-signature dietitian, nutrition follow-up contract",
      intro: "Nutrition consultations are often online and plan-based. Firmiu lets you sign consents and follow-up contracts with no paperwork.",
      uses: ["Treatment consents", "Follow-up contracts and plans", "Confidentiality agreements", "Authorizations and waivers"],
      benefits: [
        { title: "Smooth onboarding", desc: "The patient signs their plan and starts the same day." },
        { title: "Everything documented", desc: "Every signature stores IP, date and verification." },
        { title: "Paper-free consultation", desc: "Sign remotely, ideal for online consultations." },
      ],
      faqs: [
        { q: "Does it work for follow-up contracts?", a: "Yes, and for consents and private agreements with the patient." },
        { q: "Does the patient need an account?", a: "No. They sign from a unique link by email." },
        { q: "Does it work for online consultations?", a: "Yes, the patient signs from anywhere." },
      ],
    },
  },
  {
    slug: "fisioterapeutas",
    icon: "heart",
    es: {
      name: "Fisioterapeutas",
      h1: "Firma digital para fisioterapeutas",
      metaTitle: "Firma Digital para Fisioterapeutas — Consentimientos | Firmiu",
      metaDescription: "Firma digital para fisioterapeutas y centros de rehabilitación. Firma consentimientos, presupuestos y planes de tratamiento sin papel.",
      keywords: "firma digital para fisioterapeutas, consentimiento fisioterapia firma, firma electrónica rehabilitación, contrato tratamiento fisio",
      intro: "Cada tratamiento de fisioterapia parte de un consentimiento. Firmiu permite firmarlo en la consulta o desde el móvil en segundos.",
      uses: ["Consentimientos de tratamiento", "Presupuestos y bonos de sesiones", "Planes de rehabilitación", "Descargos de responsabilidad"],
      benefits: [
        { title: "Agiliza la consulta", desc: "El paciente firma su consentimiento sin esperas." },
        { title: "Sin papeleo", desc: "Olvídate de imprimir y archivar formularios." },
        { title: "Respaldo documentado", desc: "IP, fecha y verificación quedan registrados." },
      ],
      faqs: [
        { q: "¿Sirve para consentimientos de tratamiento?", a: "Sí, como documento privado con el paciente; revisa los requisitos locales de tu actividad." },
        { q: "¿El paciente firma desde el móvil?", a: "Sí, con un enlace único, sin instalar nada." },
        { q: "¿Puedo reutilizar mis formularios?", a: "Sí. Sube tu PDF y guarda contactos para enviar más rápido." },
      ],
    },
    en: {
      name: "Physiotherapists",
      h1: "Digital signatures for physiotherapists",
      metaTitle: "Digital Signatures for Physiotherapists — Consents | Firmiu",
      metaDescription: "Digital signatures for physiotherapists and rehab centers. Sign consents, quotes and treatment plans paper-free.",
      keywords: "digital signature for physiotherapists, physiotherapy consent signature, e-signature rehab, physio treatment contract",
      intro: "Every physiotherapy treatment starts with a consent. Firmiu lets you sign it at the clinic or from mobile in seconds.",
      uses: ["Treatment consents", "Quotes and session packs", "Rehabilitation plans", "Liability waivers"],
      benefits: [
        { title: "Speed up the visit", desc: "The patient signs their consent with no waiting." },
        { title: "No paperwork", desc: "Forget printing and filing forms." },
        { title: "Documented backing", desc: "IP, date and verification are logged." },
      ],
      faqs: [
        { q: "Does it work for treatment consents?", a: "Yes, as a private document with the patient; check the local requirements for your practice." },
        { q: "Does the patient sign from mobile?", a: "Yes, with a unique link and nothing to install." },
        { q: "Can I reuse my forms?", a: "Yes. Upload your PDF and save contacts to send faster." },
      ],
    },
  },
  {
    slug: "entrenadores-personales",
    icon: "users",
    es: {
      name: "Entrenadores personales",
      h1: "Firma digital para entrenadores personales",
      metaTitle: "Firma Digital para Entrenadores Personales — Descargos | Firmiu",
      metaDescription: "Firma digital para entrenadores personales y coaches fitness. Firma descargos de responsabilidad, planes y contratos con tus clientes online.",
      keywords: "firma digital para entrenadores personales, descargo de responsabilidad fitness firma, firma electrónica coach fitness, contrato entrenamiento personal",
      intro: "Antes de entrenar a alguien necesitas su descargo de responsabilidad firmado. Firmiu te lo resuelve en minutos, presencial u online.",
      uses: ["Descargos de responsabilidad (waiver)", "Contratos de entrenamiento y planes", "Cuestionarios de salud (PAR-Q)", "Autorizaciones de cobro recurrente"],
      benefits: [
        { title: "Empieza sin riesgos", desc: "El cliente firma su descargo antes del primer entrenamiento." },
        { title: "Firma desde el móvil", desc: "Tus clientes firman desde cualquier teléfono." },
        { title: "Cada firma documentada", desc: "IP, fecha y verificación quedan registrados." },
      ],
      faqs: [
        { q: "¿Sirve para descargos de responsabilidad?", a: "Sí, como acuerdo privado entre el entrenador y el cliente." },
        { q: "¿El cliente necesita una cuenta?", a: "No. Firma desde un enlace único, sin registrarse." },
        { q: "¿Funciona para entrenamiento online?", a: "Sí, el cliente firma desde cualquier lugar." },
      ],
    },
    en: {
      name: "Personal trainers",
      h1: "Digital signatures for personal trainers",
      metaTitle: "Digital Signatures for Personal Trainers — Waivers | Firmiu",
      metaDescription: "Digital signatures for personal trainers and fitness coaches. Sign liability waivers, plans and contracts with clients online.",
      keywords: "digital signature for personal trainers, fitness liability waiver signature, e-signature fitness coach, personal training contract",
      intro: "Before training someone you need their signed waiver. Firmiu solves it in minutes, in person or online.",
      uses: ["Liability waivers", "Training contracts and plans", "Health questionnaires (PAR-Q)", "Recurring-payment authorizations"],
      benefits: [
        { title: "Start risk-free", desc: "The client signs their waiver before the first workout." },
        { title: "Sign from mobile", desc: "Your clients sign from any phone." },
        { title: "Every signature documented", desc: "IP, date and verification are logged." },
      ],
      faqs: [
        { q: "Does it work for liability waivers?", a: "Yes, as a private agreement between the trainer and the client." },
        { q: "Does the client need an account?", a: "No. They sign from a unique link, without registering." },
        { q: "Does it work for online training?", a: "Yes, the client signs from anywhere." },
      ],
    },
  },
  {
    slug: "autoescuelas",
    icon: "academic",
    es: {
      name: "Autoescuelas",
      h1: "Firma digital para autoescuelas",
      metaTitle: "Firma Digital para Autoescuelas — Matrículas y Contratos | Firmiu",
      metaDescription: "Firma digital para autoescuelas y academias de conducción. Firma matrículas, contratos de curso y autorizaciones con tus alumnos sin papel.",
      keywords: "firma digital para autoescuelas, matrícula autoescuela firma, firma electrónica academia de conducción, contrato curso de manejo",
      intro: "Cada alumno de autoescuela firma su matrícula y contrato de curso. Firmiu permite cerrar la inscripción en recepción o a distancia.",
      uses: ["Matrículas e inscripciones", "Contratos de curso y forma de pago", "Autorizaciones de menores", "Reglamentos de la academia"],
      benefits: [
        { title: "Inscripción sin filas", desc: "El alumno firma su matrícula desde el móvil en minutos." },
        { title: "Todo en orden", desc: "Conserva cada documento firmado por alumno." },
        { title: "Respaldo por persona", desc: "Sabes quién firmó qué, cuándo y desde dónde." },
      ],
      faqs: [
        { q: "¿Sirve para matrículas?", a: "Sí, y para contratos de curso y autorizaciones privadas." },
        { q: "¿El alumno necesita una cuenta?", a: "No. Firma desde un enlace único por correo." },
        { q: "¿Queda registro de cada firma?", a: "Sí. Cada firma guarda fecha, IP, dispositivo y verificación." },
      ],
    },
    en: {
      name: "Driving schools",
      h1: "Digital signatures for driving schools",
      metaTitle: "Digital Signatures for Driving Schools — Enrollments | Firmiu",
      metaDescription: "Digital signatures for driving schools. Sign enrollments, course contracts and authorizations with students paper-free.",
      keywords: "digital signature for driving schools, driving school enrollment signature, e-signature driving academy, driving course contract",
      intro: "Every driving-school student signs their enrollment and course contract. Firmiu lets you close sign-up at reception or remotely.",
      uses: ["Enrollments and registrations", "Course contracts and payment terms", "Minor authorizations", "Academy rules"],
      benefits: [
        { title: "Enrollment without lines", desc: "The student signs their enrollment from mobile in minutes." },
        { title: "Everything in order", desc: "Keep every signed document per student." },
        { title: "Per-person backing", desc: "You know who signed what, when and from where." },
      ],
      faqs: [
        { q: "Does it work for enrollments?", a: "Yes, and for course contracts and private authorizations." },
        { q: "Does the student need an account?", a: "No. They sign from a unique link by email." },
        { q: "Is there a record of each signature?", a: "Yes. Every signature stores date, IP, device and verification." },
      ],
    },
  },
  {
    slug: "talleres-mecanicos",
    icon: "document",
    es: {
      name: "Talleres mecánicos",
      h1: "Firma digital para talleres mecánicos",
      metaTitle: "Firma Digital para Talleres Mecánicos — Presupuestos y Órdenes | Firmiu",
      metaDescription: "Firma digital para talleres mecánicos y automotrices. Firma órdenes de reparación, presupuestos y autorizaciones con tus clientes sin papel.",
      keywords: "firma digital para talleres mecánicos, orden de reparación firma, presupuesto taller firma, autorización reparación vehículo",
      intro: "Antes de tocar un vehículo necesitas la autorización del cliente. Firmiu permite firmar órdenes de reparación y presupuestos en segundos.",
      uses: ["Órdenes de reparación", "Presupuestos y autorizaciones de trabajo", "Descargos por riesgos", "Recepción y entrega del vehículo"],
      benefits: [
        { title: "Autoriza al instante", desc: "El cliente firma la orden desde su teléfono y empiezas a trabajar." },
        { title: "Evita malentendidos", desc: "Cada autorización queda documentada con su rastro de auditoría." },
        { title: "Sin papeleo", desc: "Olvídate de imprimir y archivar órdenes en papel." },
      ],
      faqs: [
        { q: "¿Sirve para órdenes de reparación?", a: "Sí, y para presupuestos y autorizaciones privadas de trabajo." },
        { q: "¿El cliente necesita una cuenta?", a: "No. Firma desde un enlace único, sin registrarse." },
        { q: "¿Puedo guardar a mis clientes?", a: "Sí, para enviar nuevas órdenes en segundos." },
      ],
    },
    en: {
      name: "Auto repair shops",
      h1: "Digital signatures for auto repair shops",
      metaTitle: "Digital Signatures for Auto Repair Shops — Estimates and Orders | Firmiu",
      metaDescription: "Digital signatures for auto repair shops. Sign repair orders, estimates and authorizations with customers paper-free.",
      keywords: "digital signature for auto repair shops, repair order signature, shop estimate signature, vehicle repair authorization",
      intro: "Before touching a vehicle you need the customer's authorization. Firmiu lets you sign repair orders and estimates in seconds.",
      uses: ["Repair orders", "Estimates and work authorizations", "Risk waivers", "Vehicle drop-off and pickup"],
      benefits: [
        { title: "Authorize instantly", desc: "The customer signs the order from their phone and you get to work." },
        { title: "Avoid misunderstandings", desc: "Every authorization is documented with its audit trail." },
        { title: "No paperwork", desc: "Forget printing and filing paper orders." },
      ],
      faqs: [
        { q: "Does it work for repair orders?", a: "Yes, and for estimates and private work authorizations." },
        { q: "Does the customer need an account?", a: "No. They sign from a unique link, without registering." },
        { q: "Can I save my customers?", a: "Yes, to send new orders in seconds." },
      ],
    },
  },
  {
    slug: "agencias-de-desarrollo",
    icon: "briefcase",
    es: {
      name: "Agencias de software",
      h1: "Firma digital para agencias de software",
      metaTitle: "Firma Digital para Agencias de Software — Contratos y NDAs | Firmiu",
      metaDescription: "Firma digital para agencias de desarrollo y software. Firma contratos de proyecto, NDAs y acuerdos de mantenimiento con clientes online.",
      keywords: "firma digital para agencias de software, contrato de desarrollo firma, firma electrónica NDA software, acuerdo de mantenimiento firma",
      intro: "Cada proyecto de software empieza con un contrato y, a menudo, un NDA. Firmiu te permite cerrarlos y comenzar a desarrollar el mismo día.",
      uses: ["Contratos de desarrollo y proyecto", "Acuerdos de confidencialidad (NDA)", "Acuerdos de nivel de servicio (SLA)", "Contratos de mantenimiento y soporte"],
      benefits: [
        { title: "Arranca antes", desc: "El cliente firma y comienzas el sprint sin esperas." },
        { title: "Firma con clientes remotos", desc: "Trabaja con clientes de cualquier país sin fricción." },
        { title: "Respaldo en cada firma", desc: "IP, fecha y verificación documentan el acuerdo." },
      ],
      faqs: [
        { q: "¿Sirve para NDAs y SLAs?", a: "Sí, y para contratos de proyecto y mantenimiento privados." },
        { q: "¿Puedo firmar con clientes en otros países?", a: "Sí. La firma electrónica se reconoce internacionalmente." },
        { q: "¿Es seguro?", a: "Sí. Los documentos se guardan cifrados y con enlaces firmados temporales." },
      ],
    },
    en: {
      name: "Software agencies",
      h1: "Digital signatures for software agencies",
      metaTitle: "Digital Signatures for Software Agencies — Contracts and NDAs | Firmiu",
      metaDescription: "Digital signatures for development and software agencies. Sign project contracts, NDAs and maintenance agreements with clients online.",
      keywords: "digital signature for software agencies, development contract signature, e-signature software NDA, maintenance agreement signature",
      intro: "Every software project starts with a contract and often an NDA. Firmiu lets you close them and start developing the same day.",
      uses: ["Development and project contracts", "Non-disclosure agreements (NDAs)", "Service-level agreements (SLAs)", "Maintenance and support contracts"],
      benefits: [
        { title: "Start sooner", desc: "The client signs and you begin the sprint with no waiting." },
        { title: "Sign with remote clients", desc: "Work with clients in any country without friction." },
        { title: "Backing on every signature", desc: "IP, date and verification document the agreement." },
      ],
      faqs: [
        { q: "Does it work for NDAs and SLAs?", a: "Yes, and for private project and maintenance contracts." },
        { q: "Can I sign with clients in other countries?", a: "Yes. Electronic signatures are recognized internationally." },
        { q: "Is it secure?", a: "Yes. Documents are stored encrypted and with temporary signed links." },
      ],
    },
  },
  {
    slug: "disenadores",
    icon: "briefcase",
    es: {
      name: "Diseñadores",
      h1: "Firma digital para diseñadores",
      metaTitle: "Firma Digital para Diseñadores — Contratos y Cesiones | Firmiu",
      metaDescription: "Firma digital para diseñadores y agencias de diseño. Firma contratos, presupuestos y cesiones de derechos con tus clientes sin imprimir.",
      keywords: "firma digital para diseñadores, contrato de diseño firma, cesión de derechos diseño firma, firma electrónica agencia de diseño",
      intro: "Cada encargo de diseño necesita su contrato y su cesión de derechos. Firmiu te permite cerrarlos y empezar a crear el mismo día.",
      uses: ["Contratos de diseño y proyecto", "Presupuestos y propuestas", "Cesiones de derechos de uso", "Acuerdos de confidencialidad (NDA)"],
      benefits: [
        { title: "Empieza antes", desc: "El cliente firma y arrancas el proyecto sin esperas." },
        { title: "Derechos en orden", desc: "Documenta cada cesión de derechos con respaldo." },
        { title: "Imagen profesional", desc: "Un proceso de firma claro transmite seriedad." },
      ],
      faqs: [
        { q: "¿Sirve para cesiones de derechos?", a: "Sí, como acuerdo privado entre tú y el cliente." },
        { q: "¿El cliente necesita una cuenta?", a: "No. Firma desde un enlace único por correo." },
        { q: "¿Puedo reutilizar mis contratos?", a: "Sí. Sube tu PDF cada vez y guarda contactos para enviar más rápido." },
      ],
    },
    en: {
      name: "Designers",
      h1: "Digital signatures for designers",
      metaTitle: "Digital Signatures for Designers — Contracts and Rights | Firmiu",
      metaDescription: "Digital signatures for designers and design agencies. Sign contracts, quotes and rights assignments with clients without printing.",
      keywords: "digital signature for designers, design contract signature, design rights assignment signature, e-signature design agency",
      intro: "Every design commission needs its contract and rights assignment. Firmiu lets you close them and start creating the same day.",
      uses: ["Design and project contracts", "Quotes and proposals", "Usage-rights assignments", "Non-disclosure agreements (NDAs)"],
      benefits: [
        { title: "Start sooner", desc: "The client signs and you begin the project with no waiting." },
        { title: "Rights in order", desc: "Document every rights assignment with backing." },
        { title: "Professional image", desc: "A clear signing process conveys seriousness." },
      ],
      faqs: [
        { q: "Does it work for rights assignments?", a: "Yes, as a private agreement between you and the client." },
        { q: "Does the client need an account?", a: "No. They sign from a unique link by email." },
        { q: "Can I reuse my contracts?", a: "Yes. Upload your PDF each time and save contacts to send faster." },
      ],
    },
  },
  {
    slug: "traductores",
    icon: "document",
    es: {
      name: "Traductores",
      h1: "Firma digital para traductores",
      metaTitle: "Firma Digital para Traductores — Contratos y Presupuestos | Firmiu",
      metaDescription: "Firma digital para traductores e intérpretes. Firma contratos de servicio, presupuestos y acuerdos de confidencialidad con clientes online.",
      keywords: "firma digital para traductores, contrato de traducción firma, firma electrónica intérprete, acuerdo de confidencialidad traducción",
      intro: "Como traductor trabajas con clientes de todo el mundo. Firmiu te permite firmar contratos y presupuestos a distancia, sin imprimir.",
      uses: ["Contratos de servicios de traducción", "Presupuestos y órdenes de trabajo", "Acuerdos de confidencialidad (NDA)", "Cesiones de derechos sobre la traducción"],
      benefits: [
        { title: "Cierra a distancia", desc: "Firma con clientes de cualquier país en minutos." },
        { title: "Cobra antes", desc: "Acuerda y empieza el encargo sin esperas." },
        { title: "Respaldo documentado", desc: "IP, fecha y verificación respaldan cada firma." },
      ],
      faqs: [
        { q: "¿Sirve para acuerdos de confidencialidad?", a: "Sí, y para contratos de servicio y presupuestos privados." },
        { q: "¿Funciona con clientes internacionales?", a: "Sí. La firma electrónica se reconoce internacionalmente." },
        { q: "¿El cliente necesita una cuenta?", a: "No. Firma desde un enlace único por correo." },
      ],
    },
    en: {
      name: "Translators",
      h1: "Digital signatures for translators",
      metaTitle: "Digital Signatures for Translators — Contracts and Quotes | Firmiu",
      metaDescription: "Digital signatures for translators and interpreters. Sign service contracts, quotes and NDAs with clients online.",
      keywords: "digital signature for translators, translation contract signature, e-signature interpreter, translation NDA signature",
      intro: "As a translator you work with clients worldwide. Firmiu lets you sign contracts and quotes remotely, without printing.",
      uses: ["Translation service contracts", "Quotes and work orders", "Non-disclosure agreements (NDAs)", "Translation rights assignments"],
      benefits: [
        { title: "Close remotely", desc: "Sign with clients in any country in minutes." },
        { title: "Get paid sooner", desc: "Agree and start the job with no waiting." },
        { title: "Documented backing", desc: "IP, date and verification back every signature." },
      ],
      faqs: [
        { q: "Does it work for NDAs?", a: "Yes, and for private service contracts and quotes." },
        { q: "Does it work with international clients?", a: "Yes. Electronic signatures are recognized internationally." },
        { q: "Does the client need an account?", a: "No. They sign from a unique link by email." },
      ],
    },
  },
  {
    slug: "productoras-audiovisuales",
    icon: "camera",
    es: {
      name: "Productoras audiovisuales",
      h1: "Firma digital para productoras audiovisuales",
      metaTitle: "Firma Digital para Productoras — Cesiones y Contratos | Firmiu",
      metaDescription: "Firma digital para productoras de video y audiovisuales. Firma cesiones de derechos de imagen, contratos de talento y de locación sin papel.",
      keywords: "firma digital para productoras audiovisuales, cesión de derechos de imagen firma, contrato de talento firma, firma electrónica productora de video",
      intro: "Un rodaje implica cesiones de derechos y contratos con talento y locaciones. Firmiu permite firmarlos rápido, incluso el día del rodaje.",
      uses: ["Cesiones de derechos de imagen (release)", "Contratos con talento y equipo", "Acuerdos de locación", "Licencias de uso del material"],
      benefits: [
        { title: "Listo el día del rodaje", desc: "Talento y locaciones firman desde el móvil en el set." },
        { title: "Derechos asegurados", desc: "Cada cesión queda documentada con respaldo." },
        { title: "Producción ordenada", desc: "Conserva todos los documentos firmados de cada proyecto." },
      ],
      faqs: [
        { q: "¿Sirve para cesiones de derechos de imagen?", a: "Sí, como acuerdo privado con la persona o locación." },
        { q: "¿Se puede firmar en el set?", a: "Sí, desde el móvil con un enlace único." },
        { q: "¿Puedo reutilizar mis modelos de contrato?", a: "Sí. Sube tu PDF cada vez y guarda contactos." },
      ],
    },
    en: {
      name: "Video production",
      h1: "Digital signatures for video production",
      metaTitle: "Digital Signatures for Production — Releases and Contracts | Firmiu",
      metaDescription: "Digital signatures for video and audiovisual production. Sign image-rights releases, talent contracts and location agreements paper-free.",
      keywords: "digital signature for video production, image rights release signature, talent contract signature, e-signature production company",
      intro: "A shoot involves rights releases and contracts with talent and locations. Firmiu lets you sign them fast, even on shoot day.",
      uses: ["Image-rights releases", "Talent and crew contracts", "Location agreements", "Footage usage licenses"],
      benefits: [
        { title: "Ready on shoot day", desc: "Talent and locations sign from mobile on set." },
        { title: "Rights secured", desc: "Every release is documented with backing." },
        { title: "Organized production", desc: "Keep all signed documents for each project." },
      ],
      faqs: [
        { q: "Does it work for image-rights releases?", a: "Yes, as a private agreement with the person or location." },
        { q: "Can it be signed on set?", a: "Yes, from mobile with a unique link." },
        { q: "Can I reuse my contract templates?", a: "Yes. Upload your PDF each time and save contacts." },
      ],
    },
  },
  {
    slug: "concesionarios",
    icon: "truck",
    es: {
      name: "Concesionarios de autos",
      h1: "Firma digital para concesionarios de autos",
      metaTitle: "Firma Digital para Concesionarios — Contratos de Compraventa | Firmiu",
      metaDescription: "Firma digital para concesionarios y venta de vehículos. Firma contratos de compraventa, reservas y financiación con tus clientes sin papel.",
      keywords: "firma digital para concesionarios, contrato de compraventa de auto firma, reserva de vehículo firma, firma electrónica venta de autos",
      intro: "Vender un auto implica contratos de compraventa y reservas. Firmiu permite que el cliente firme en el concesionario o desde casa.",
      uses: ["Contratos de compraventa de vehículos", "Reservas y señas", "Acuerdos de financiación", "Entregas y actas de recepción"],
      benefits: [
        { title: "Cierra la venta más rápido", desc: "El cliente firma su contrato sin esperas ni papeleo." },
        { title: "Firma desde el móvil", desc: "Tus clientes firman cómodamente desde cualquier teléfono." },
        { title: "Cada operación documentada", desc: "IP, fecha y verificación respaldan cada contrato." },
      ],
      faqs: [
        { q: "¿Sirve para contratos de compraventa?", a: "Sí, para contratos privados de compraventa y reservas; consulta requisitos de registro vehicular de tu país." },
        { q: "¿El cliente necesita una cuenta?", a: "No. Firma desde un enlace único por correo." },
        { q: "¿Puedo guardar a mis clientes?", a: "Sí, para enviar nuevos documentos en segundos." },
      ],
    },
    en: {
      name: "Car dealerships",
      h1: "Digital signatures for car dealerships",
      metaTitle: "Digital Signatures for Dealerships — Sales Contracts | Firmiu",
      metaDescription: "Digital signatures for car dealerships and vehicle sales. Sign sales contracts, reservations and financing with customers paper-free.",
      keywords: "digital signature for car dealerships, vehicle sales contract signature, car reservation signature, e-signature auto sales",
      intro: "Selling a car involves sales contracts and reservations. Firmiu lets the customer sign at the dealership or from home.",
      uses: ["Vehicle sales contracts", "Reservations and deposits", "Financing agreements", "Deliveries and handover records"],
      benefits: [
        { title: "Close the sale faster", desc: "The customer signs their contract with no waiting or paperwork." },
        { title: "Sign from mobile", desc: "Your customers sign comfortably from any phone." },
        { title: "Every deal documented", desc: "IP, date and verification back each contract." },
      ],
      faqs: [
        { q: "Does it work for sales contracts?", a: "Yes, for private sales contracts and reservations; check your country's vehicle-registration requirements." },
        { q: "Does the customer need an account?", a: "No. They sign from a unique link by email." },
        { q: "Can I save my customers?", a: "Yes, to send new documents in seconds." },
      ],
    },
  },
  {
    slug: "importadores-exportadores",
    icon: "globe",
    es: {
      name: "Importadores y exportadores",
      h1: "Firma digital para importadores y exportadores",
      metaTitle: "Firma Digital para Comercio Exterior — Contratos Internacionales | Firmiu",
      metaDescription: "Firma digital para importadores y exportadores. Firma contratos internacionales, acuerdos de distribución y proformas con socios de otros países.",
      keywords: "firma digital para importadores, firma electrónica comercio exterior, contrato internacional firma, acuerdo de distribución firma",
      intro: "El comercio exterior se cierra entre países y zonas horarias. Firmiu permite firmar contratos internacionales sin enviar papeles por mensajería.",
      uses: ["Contratos de compraventa internacional", "Acuerdos de distribución y representación", "Proformas y órdenes de compra", "Acuerdos de confidencialidad (NDA)"],
      benefits: [
        { title: "Cierra entre países", desc: "Tus socios firman a distancia, sin importar dónde estén." },
        { title: "Sin mensajería", desc: "Olvídate de enviar contratos físicos al extranjero." },
        { title: "Respaldo documentado", desc: "IP, fecha, ubicación y verificación respaldan cada firma." },
      ],
      faqs: [
        { q: "¿Sirve para contratos internacionales?", a: "Sí, para la mayoría de acuerdos comerciales privados entre empresas." },
        { q: "¿Mi socio en otro país puede firmar?", a: "Sí. La firma electrónica se reconoce internacionalmente." },
        { q: "¿Es seguro?", a: "Sí. Los documentos se guardan cifrados y con enlaces firmados temporales." },
      ],
    },
    en: {
      name: "Importers & exporters",
      h1: "Digital signatures for importers & exporters",
      metaTitle: "Digital Signatures for Foreign Trade — International Contracts | Firmiu",
      metaDescription: "Digital signatures for importers and exporters. Sign international contracts, distribution agreements and proformas with partners abroad.",
      keywords: "digital signature for importers, e-signature foreign trade, international contract signature, distribution agreement signature",
      intro: "Foreign trade closes across countries and time zones. Firmiu lets you sign international contracts without couriering papers.",
      uses: ["International sales contracts", "Distribution and representation agreements", "Proformas and purchase orders", "Non-disclosure agreements (NDAs)"],
      benefits: [
        { title: "Close across countries", desc: "Your partners sign remotely, wherever they are." },
        { title: "No courier", desc: "Forget sending physical contracts abroad." },
        { title: "Documented backing", desc: "IP, date, location and verification back every signature." },
      ],
      faqs: [
        { q: "Does it work for international contracts?", a: "Yes, for most private commercial agreements between companies." },
        { q: "Can my partner abroad sign?", a: "Yes. Electronic signatures are recognized internationally." },
        { q: "Is it secure?", a: "Yes. Documents are stored encrypted and with temporary signed links." },
      ],
    },
  },
  {
    slug: "coaches",
    icon: "users",
    es: {
      name: "Coaches y mentores",
      h1: "Firma digital para coaches y mentores",
      metaTitle: "Firma Digital para Coaches — Contratos de Coaching | Firmiu",
      metaDescription: "Firma digital para coaches y mentores. Firma contratos de coaching, acuerdos de confidencialidad y consentimientos con tus clientes online.",
      keywords: "firma digital para coaches, contrato de coaching firma, firma electrónica mentor, acuerdo de coaching online",
      intro: "El coaching suele ser online y por programas. Firmiu te permite firmar contratos y acuerdos con tus clientes antes de la primera sesión.",
      uses: ["Contratos de coaching y mentoría", "Acuerdos de confidencialidad", "Consentimientos y encuadre", "Programas y planes de sesiones"],
      benefits: [
        { title: "Empieza con todo claro", desc: "El cliente firma el encuadre antes de la primera sesión." },
        { title: "Sin papeleo", desc: "Firma a distancia, ideal para el coaching online." },
        { title: "Respaldo en cada firma", desc: "IP, fecha y verificación quedan registrados." },
      ],
      faqs: [
        { q: "¿Sirve para contratos de coaching?", a: "Sí, y para acuerdos de confidencialidad y consentimientos privados." },
        { q: "¿El cliente necesita una cuenta?", a: "No. Firma desde un enlace único por correo." },
        { q: "¿Funciona para coaching online?", a: "Sí, el cliente firma desde cualquier lugar." },
      ],
    },
    en: {
      name: "Coaches & mentors",
      h1: "Digital signatures for coaches & mentors",
      metaTitle: "Digital Signatures for Coaches — Coaching Contracts | Firmiu",
      metaDescription: "Digital signatures for coaches and mentors. Sign coaching contracts, confidentiality agreements and consents with clients online.",
      keywords: "digital signature for coaches, coaching contract signature, e-signature mentor, online coaching agreement",
      intro: "Coaching is often online and program-based. Firmiu lets you sign contracts and agreements with clients before the first session.",
      uses: ["Coaching and mentoring contracts", "Confidentiality agreements", "Consents and agreements", "Programs and session plans"],
      benefits: [
        { title: "Start with everything clear", desc: "The client signs the agreement before the first session." },
        { title: "No paperwork", desc: "Sign remotely, ideal for online coaching." },
        { title: "Backing on every signature", desc: "IP, date and verification are logged." },
      ],
      faqs: [
        { q: "Does it work for coaching contracts?", a: "Yes, and for confidentiality agreements and private consents." },
        { q: "Does the client need an account?", a: "No. They sign from a unique link by email." },
        { q: "Does it work for online coaching?", a: "Yes, the client signs from anywhere." },
      ],
    },
  },
  {
    slug: "imprentas",
    icon: "document",
    es: {
      name: "Imprentas",
      h1: "Firma digital para imprentas",
      metaTitle: "Firma Digital para Imprentas — Órdenes y Presupuestos | Firmiu",
      metaDescription: "Firma digital para imprentas y gráficas. Firma órdenes de trabajo, presupuestos y aprobaciones de arte con tus clientes sin papel.",
      keywords: "firma digital para imprentas, orden de trabajo imprenta firma, presupuesto gráfica firma, aprobación de arte firma",
      intro: "Cada trabajo de imprenta empieza con un presupuesto y una aprobación. Firmiu permite firmarlos rápido y evitar reimpresiones por malentendidos.",
      uses: ["Órdenes de trabajo y presupuestos", "Aprobaciones de arte final", "Contratos con clientes", "Acuerdos con proveedores"],
      benefits: [
        { title: "Evita reimpresiones", desc: "La aprobación firmada deja claro qué se imprime y con qué arte." },
        { title: "Cierra trabajos rápido", desc: "El cliente firma su presupuesto en minutos." },
        { title: "Respaldo documentado", desc: "IP, fecha y verificación respaldan cada firma." },
      ],
      faqs: [
        { q: "¿Sirve para aprobar el arte final?", a: "Sí, deja constancia firmada de la versión aprobada." },
        { q: "¿El cliente necesita una cuenta?", a: "No. Firma desde un enlace único, sin registrarse." },
        { q: "¿Puedo guardar a mis clientes?", a: "Sí, para enviar nuevos presupuestos en segundos." },
      ],
    },
    en: {
      name: "Print shops",
      h1: "Digital signatures for print shops",
      metaTitle: "Digital Signatures for Print Shops — Orders and Quotes | Firmiu",
      metaDescription: "Digital signatures for print shops. Sign work orders, quotes and artwork approvals with clients paper-free.",
      keywords: "digital signature for print shops, print work order signature, print quote signature, artwork approval signature",
      intro: "Every print job starts with a quote and an approval. Firmiu lets you sign them fast and avoid reprints from misunderstandings.",
      uses: ["Work orders and quotes", "Final artwork approvals", "Client contracts", "Supplier agreements"],
      benefits: [
        { title: "Avoid reprints", desc: "The signed approval makes clear what's printed and with which artwork." },
        { title: "Close jobs fast", desc: "The client signs their quote in minutes." },
        { title: "Documented backing", desc: "IP, date and verification back every signature." },
      ],
      faqs: [
        { q: "Does it work for final artwork approval?", a: "Yes, it leaves a signed record of the approved version." },
        { q: "Does the client need an account?", a: "No. They sign from a unique link, without registering." },
        { q: "Can I save my clients?", a: "Yes, to send new quotes in seconds." },
      ],
    },
  },
  {
    slug: "editoriales",
    icon: "document",
    es: {
      name: "Editoriales",
      h1: "Firma digital para editoriales",
      metaTitle: "Firma Digital para Editoriales — Contratos con Autores | Firmiu",
      metaDescription: "Firma digital para editoriales. Firma contratos de edición, cesiones de derechos y acuerdos con autores e ilustradores sin papel.",
      keywords: "firma digital para editoriales, contrato de edición firma, cesión de derechos de autor firma, firma electrónica editorial",
      intro: "Publicar implica contratos con autores, ilustradores y traductores. Firmiu permite firmar contratos de edición y cesiones de derechos a distancia.",
      uses: ["Contratos de edición", "Cesiones de derechos de autor", "Acuerdos con ilustradores y traductores", "Contratos de distribución"],
      benefits: [
        { title: "Cierra con autores remotos", desc: "Firma con autores de cualquier país sin esperas." },
        { title: "Derechos en orden", desc: "Documenta cada cesión de derechos con respaldo." },
        { title: "Catálogo ordenado", desc: "Conserva todos los contratos firmados de cada obra." },
      ],
      faqs: [
        { q: "¿Sirve para cesiones de derechos de autor?", a: "Sí, como acuerdo privado entre la editorial y el autor." },
        { q: "¿Puedo firmar con autores internacionales?", a: "Sí. La firma electrónica se reconoce internacionalmente." },
        { q: "¿Es seguro?", a: "Sí. Los documentos se guardan cifrados y con enlaces firmados temporales." },
      ],
    },
    en: {
      name: "Publishers",
      h1: "Digital signatures for publishers",
      metaTitle: "Digital Signatures for Publishers — Author Contracts | Firmiu",
      metaDescription: "Digital signatures for publishers. Sign publishing contracts, rights assignments and agreements with authors and illustrators paper-free.",
      keywords: "digital signature for publishers, publishing contract signature, copyright assignment signature, e-signature publishing",
      intro: "Publishing involves contracts with authors, illustrators and translators. Firmiu lets you sign publishing contracts and rights assignments remotely.",
      uses: ["Publishing contracts", "Copyright assignments", "Agreements with illustrators and translators", "Distribution contracts"],
      benefits: [
        { title: "Close with remote authors", desc: "Sign with authors in any country with no waiting." },
        { title: "Rights in order", desc: "Document every rights assignment with backing." },
        { title: "Organized catalog", desc: "Keep every signed contract for each title." },
      ],
      faqs: [
        { q: "Does it work for copyright assignments?", a: "Yes, as a private agreement between the publisher and the author." },
        { q: "Can I sign with international authors?", a: "Yes. Electronic signatures are recognized internationally." },
        { q: "Is it secure?", a: "Yes. Documents are stored encrypted and with temporary signed links." },
      ],
    },
  },
  {
    slug: "musicos",
    icon: "camera",
    es: {
      name: "Músicos y artistas",
      h1: "Firma digital para músicos y artistas",
      metaTitle: "Firma Digital para Músicos — Contratos y Cesiones | Firmiu",
      metaDescription: "Firma digital para músicos, bandas y artistas. Firma contratos de actuación, cesiones de derechos y acuerdos con sellos sin imprimir.",
      keywords: "firma digital para músicos, contrato de actuación firma, cesión de derechos música firma, firma electrónica artista",
      intro: "Tocar, grabar o ceder derechos implica contratos. Firmiu permite a músicos y artistas firmar acuerdos a distancia, incluso de gira.",
      uses: ["Contratos de actuación y conciertos", "Cesiones de derechos y licencias", "Acuerdos con sellos y mánagers", "Contratos de colaboración"],
      benefits: [
        { title: "Firma de gira", desc: "Cierra contratos desde el móvil, estés donde estés." },
        { title: "Derechos asegurados", desc: "Documenta cada cesión y licencia con respaldo." },
        { title: "Cada acuerdo registrado", desc: "IP, fecha y verificación respaldan tus firmas." },
      ],
      faqs: [
        { q: "¿Sirve para contratos de actuación?", a: "Sí, y para cesiones de derechos y acuerdos privados." },
        { q: "¿Puedo firmar desde el celular?", a: "Sí, con un enlace único, sin instalar nada." },
        { q: "¿Funciona internacionalmente?", a: "Sí. La firma electrónica se reconoce en LATAM, España y EE. UU." },
      ],
    },
    en: {
      name: "Musicians & artists",
      h1: "Digital signatures for musicians & artists",
      metaTitle: "Digital Signatures for Musicians — Contracts and Rights | Firmiu",
      metaDescription: "Digital signatures for musicians, bands and artists. Sign performance contracts, rights assignments and label agreements without printing.",
      keywords: "digital signature for musicians, performance contract signature, music rights assignment signature, e-signature artist",
      intro: "Playing, recording or assigning rights means contracts. Firmiu lets musicians and artists sign agreements remotely, even on tour.",
      uses: ["Performance and concert contracts", "Rights assignments and licenses", "Agreements with labels and managers", "Collaboration contracts"],
      benefits: [
        { title: "Sign on tour", desc: "Close contracts from mobile, wherever you are." },
        { title: "Rights secured", desc: "Document every assignment and license with backing." },
        { title: "Every agreement logged", desc: "IP, date and verification back your signatures." },
      ],
      faqs: [
        { q: "Does it work for performance contracts?", a: "Yes, and for rights assignments and private agreements." },
        { q: "Can I sign from my phone?", a: "Yes, with a unique link and nothing to install." },
        { q: "Does it work internationally?", a: "Yes. Electronic signatures are recognized across Latin America, Spain and the US." },
      ],
    },
  },
  {
    slug: "empresas-de-limpieza",
    icon: "briefcase",
    es: {
      name: "Empresas de limpieza",
      h1: "Firma digital para empresas de limpieza",
      metaTitle: "Firma Digital para Empresas de Limpieza — Contratos | Firmiu",
      metaDescription: "Firma digital para empresas de limpieza. Firma contratos de servicio, presupuestos y acuerdos recurrentes con tus clientes sin papel.",
      keywords: "firma digital para empresas de limpieza, contrato de limpieza firma, presupuesto limpieza firma, firma electrónica servicio de limpieza",
      intro: "Los servicios de limpieza suelen ser recurrentes y por contrato. Firmiu permite cerrar contratos y presupuestos sin desplazamientos.",
      uses: ["Contratos de servicio recurrente", "Presupuestos y cotizaciones", "Acuerdos de cobro automático", "Términos y condiciones del servicio"],
      benefits: [
        { title: "Cierra clientes rápido", desc: "El cliente firma su contrato desde el móvil en minutos." },
        { title: "Sin visitas para firmar", desc: "Olvídate de ir a la oficina del cliente solo a firmar." },
        { title: "Todo documentado", desc: "IP, fecha y verificación respaldan cada acuerdo." },
      ],
      faqs: [
        { q: "¿Sirve para contratos recurrentes?", a: "Sí, y para presupuestos y acuerdos privados de servicio." },
        { q: "¿El cliente necesita una cuenta?", a: "No. Firma desde un enlace único por correo." },
        { q: "¿Puedo guardar a mis clientes?", a: "Sí, para enviar nuevos contratos en segundos." },
      ],
    },
    en: {
      name: "Cleaning companies",
      h1: "Digital signatures for cleaning companies",
      metaTitle: "Digital Signatures for Cleaning Companies — Contracts | Firmiu",
      metaDescription: "Digital signatures for cleaning companies. Sign service contracts, quotes and recurring agreements with clients paper-free.",
      keywords: "digital signature for cleaning companies, cleaning contract signature, cleaning quote signature, e-signature cleaning service",
      intro: "Cleaning services are often recurring and contract-based. Firmiu lets you close contracts and quotes with no travel.",
      uses: ["Recurring service contracts", "Quotes and estimates", "Auto-payment agreements", "Service terms and conditions"],
      benefits: [
        { title: "Close clients fast", desc: "The client signs their contract from mobile in minutes." },
        { title: "No visits to sign", desc: "Forget going to the client's office just to sign." },
        { title: "Everything documented", desc: "IP, date and verification back each agreement." },
      ],
      faqs: [
        { q: "Does it work for recurring contracts?", a: "Yes, and for quotes and private service agreements." },
        { q: "Does the client need an account?", a: "No. They sign from a unique link by email." },
        { q: "Can I save my clients?", a: "Yes, to send new contracts in seconds." },
      ],
    },
  },
  {
    slug: "empresas-de-mudanzas",
    icon: "truck",
    es: {
      name: "Empresas de mudanzas",
      h1: "Firma digital para empresas de mudanzas",
      metaTitle: "Firma Digital para Mudanzas — Contratos y Presupuestos | Firmiu",
      metaDescription: "Firma digital para empresas de mudanzas. Firma contratos, presupuestos e inventarios con tus clientes sin papel, incluso el día del traslado.",
      keywords: "firma digital para mudanzas, contrato de mudanza firma, presupuesto mudanza firma, inventario de mudanza firma",
      intro: "Una mudanza implica presupuesto, contrato e inventario. Firmiu permite firmarlos a distancia o en el lugar, desde el móvil.",
      uses: ["Contratos de servicio de mudanza", "Presupuestos y confirmaciones", "Inventarios y actas de entrega", "Descargos por daños"],
      benefits: [
        { title: "Confirma sin papeleo", desc: "El cliente firma su presupuesto y contrato en minutos." },
        { title: "Firma en el lugar", desc: "Inventarios y entregas se firman desde el móvil en el sitio." },
        { title: "Cada operación documentada", desc: "IP, fecha, ubicación y verificación respaldan cada firma." },
      ],
      faqs: [
        { q: "¿Sirve para inventarios y actas?", a: "Sí, y para contratos, presupuestos y descargos privados." },
        { q: "¿Se puede firmar el día de la mudanza?", a: "Sí, desde el móvil con un enlace único." },
        { q: "¿El cliente necesita una cuenta?", a: "No. Firma sin registrarse." },
      ],
    },
    en: {
      name: "Moving companies",
      h1: "Digital signatures for moving companies",
      metaTitle: "Digital Signatures for Movers — Contracts and Quotes | Firmiu",
      metaDescription: "Digital signatures for moving companies. Sign contracts, quotes and inventories with clients paper-free, even on moving day.",
      keywords: "digital signature for moving companies, moving contract signature, moving quote signature, moving inventory signature",
      intro: "A move involves a quote, a contract and an inventory. Firmiu lets you sign them remotely or on site, from mobile.",
      uses: ["Moving service contracts", "Quotes and confirmations", "Inventories and handover records", "Damage waivers"],
      benefits: [
        { title: "Confirm without paperwork", desc: "The client signs their quote and contract in minutes." },
        { title: "Sign on site", desc: "Inventories and handovers are signed from mobile on location." },
        { title: "Every operation documented", desc: "IP, date, location and verification back each signature." },
      ],
      faqs: [
        { q: "Does it work for inventories and records?", a: "Yes, and for contracts, quotes and private waivers." },
        { q: "Can it be signed on moving day?", a: "Yes, from mobile with a unique link." },
        { q: "Does the client need an account?", a: "No. They sign without registering." },
      ],
    },
  },
  {
    slug: "empresas-de-seguridad",
    icon: "shield",
    es: {
      name: "Seguridad privada",
      h1: "Firma digital para empresas de seguridad privada",
      metaTitle: "Firma Digital para Seguridad Privada — Contratos | Firmiu",
      metaDescription: "Firma digital para empresas de seguridad privada. Firma contratos de servicio, acuerdos de personal y de confidencialidad sin papel.",
      keywords: "firma digital para empresas de seguridad, contrato de seguridad privada firma, firma electrónica vigilancia, acuerdo de confidencialidad seguridad",
      intro: "Las empresas de seguridad firman contratos con clientes y personal de forma constante. Firmiu agiliza esas firmas sin frenar el servicio.",
      uses: ["Contratos de servicio de seguridad", "Acuerdos con personal y guardias", "Acuerdos de confidencialidad (NDA)", "Protocolos y autorizaciones"],
      benefits: [
        { title: "Cierra contratos a distancia", desc: "Clientes y personal firman desde el móvil en minutos." },
        { title: "Confidencialidad cubierta", desc: "Firma NDAs rápido con todo tu equipo." },
        { title: "Trazabilidad total", desc: "IP, fecha y verificación respaldan cada firma." },
      ],
      faqs: [
        { q: "¿Sirve para contratos con clientes?", a: "Sí, y para acuerdos de personal y de confidencialidad privados." },
        { q: "¿Mi personal puede firmar a distancia?", a: "Sí, cada uno recibe su enlace único." },
        { q: "¿Es seguro?", a: "Sí. Los documentos se guardan cifrados y con enlaces firmados temporales." },
      ],
    },
    en: {
      name: "Private security",
      h1: "Digital signatures for private security companies",
      metaTitle: "Digital Signatures for Private Security — Contracts | Firmiu",
      metaDescription: "Digital signatures for private security companies. Sign service contracts, staff agreements and NDAs paper-free.",
      keywords: "digital signature for security companies, private security contract signature, e-signature security guards, security NDA signature",
      intro: "Security companies sign contracts with clients and staff constantly. Firmiu speeds up those signatures without slowing the service.",
      uses: ["Security service contracts", "Agreements with staff and guards", "Non-disclosure agreements (NDAs)", "Protocols and authorizations"],
      benefits: [
        { title: "Close contracts remotely", desc: "Clients and staff sign from mobile in minutes." },
        { title: "Confidentiality covered", desc: "Sign NDAs fast with your whole team." },
        { title: "Full traceability", desc: "IP, date and verification back every signature." },
      ],
      faqs: [
        { q: "Does it work for client contracts?", a: "Yes, and for private staff and confidentiality agreements." },
        { q: "Can my staff sign remotely?", a: "Yes, each one receives their unique link." },
        { q: "Is it secure?", a: "Yes. Documents are stored encrypted and with temporary signed links." },
      ],
    },
  },
  {
    slug: "catering",
    icon: "document",
    es: {
      name: "Servicios de catering",
      h1: "Firma digital para servicios de catering",
      metaTitle: "Firma Digital para Catering — Contratos y Reservas | Firmiu",
      metaDescription: "Firma digital para servicios de catering y banquetes. Firma contratos de evento, presupuestos y reservas con tus clientes sin papel.",
      keywords: "firma digital para catering, contrato de catering firma, presupuesto banquete firma, reserva de evento catering firma",
      intro: "Cada evento de catering se confirma con un contrato y una reserva. Firmiu permite cerrar fechas y presupuestos a distancia, en minutos.",
      uses: ["Contratos de servicio para eventos", "Presupuestos y menús aprobados", "Reservas y confirmaciones de fecha", "Acuerdos con proveedores"],
      benefits: [
        { title: "Cierra fechas más rápido", desc: "El cliente firma su contrato y reserva en minutos." },
        { title: "Menú y precio claros", desc: "La firma deja constancia de lo acordado, sin malentendidos." },
        { title: "Todo documentado", desc: "IP, fecha y verificación respaldan cada firma." },
      ],
      faqs: [
        { q: "¿Sirve para reservas de evento?", a: "Sí, y para contratos y presupuestos privados." },
        { q: "¿El cliente firma desde el móvil?", a: "Sí, con un enlace único, sin instalar nada." },
        { q: "¿Puedo guardar a mis clientes?", a: "Sí, para enviar nuevos contratos en segundos." },
      ],
    },
    en: {
      name: "Catering services",
      h1: "Digital signatures for catering services",
      metaTitle: "Digital Signatures for Catering — Contracts and Bookings | Firmiu",
      metaDescription: "Digital signatures for catering and banquet services. Sign event contracts, quotes and bookings with clients paper-free.",
      keywords: "digital signature for catering, catering contract signature, banquet quote signature, catering event booking signature",
      intro: "Every catering event is confirmed with a contract and a booking. Firmiu lets you lock dates and quotes remotely, in minutes.",
      uses: ["Event service contracts", "Quotes and approved menus", "Bookings and date confirmations", "Supplier agreements"],
      benefits: [
        { title: "Lock dates faster", desc: "The client signs their contract and booking in minutes." },
        { title: "Menu and price clear", desc: "The signature records what was agreed, with no misunderstandings." },
        { title: "Everything documented", desc: "IP, date and verification back every signature." },
      ],
      faqs: [
        { q: "Does it work for event bookings?", a: "Yes, and for private contracts and quotes." },
        { q: "Does the client sign from mobile?", a: "Yes, with a unique link and nothing to install." },
        { q: "Can I save my clients?", a: "Yes, to send new contracts in seconds." },
      ],
    },
  },
  {
    slug: "jardineria",
    icon: "briefcase",
    es: {
      name: "Jardinería y paisajismo",
      h1: "Firma digital para jardinería y paisajismo",
      metaTitle: "Firma Digital para Jardinería — Presupuestos y Contratos | Firmiu",
      metaDescription: "Firma digital para empresas de jardinería y paisajismo. Firma presupuestos, contratos de mantenimiento y proyectos con tus clientes sin papel.",
      keywords: "firma digital para jardinería, presupuesto jardinería firma, contrato de mantenimiento firma, firma electrónica paisajismo",
      intro: "Los servicios de jardinería se cierran por presupuesto y suelen ser recurrentes. Firmiu permite firmar contratos y presupuestos sin desplazarte.",
      uses: ["Presupuestos y proyectos", "Contratos de mantenimiento recurrente", "Acuerdos de cobro automático", "Términos del servicio"],
      benefits: [
        { title: "Aprueba el proyecto rápido", desc: "El cliente firma su presupuesto en minutos." },
        { title: "Sin visitas solo para firmar", desc: "Cierra contratos a distancia, desde el móvil." },
        { title: "Respaldo documentado", desc: "IP, fecha y verificación respaldan cada firma." },
      ],
      faqs: [
        { q: "¿Sirve para contratos de mantenimiento?", a: "Sí, y para presupuestos y acuerdos privados de servicio." },
        { q: "¿El cliente necesita una cuenta?", a: "No. Firma desde un enlace único por correo." },
        { q: "¿Puedo guardar a mis clientes?", a: "Sí, para enviar nuevos presupuestos en segundos." },
      ],
    },
    en: {
      name: "Landscaping",
      h1: "Digital signatures for landscaping",
      metaTitle: "Digital Signatures for Landscaping — Quotes and Contracts | Firmiu",
      metaDescription: "Digital signatures for landscaping and gardening companies. Sign quotes, maintenance contracts and projects with clients paper-free.",
      keywords: "digital signature for landscaping, landscaping quote signature, maintenance contract signature, e-signature gardening",
      intro: "Landscaping services close on a quote and are often recurring. Firmiu lets you sign contracts and quotes without traveling.",
      uses: ["Quotes and projects", "Recurring maintenance contracts", "Auto-payment agreements", "Service terms"],
      benefits: [
        { title: "Approve the project fast", desc: "The client signs their quote in minutes." },
        { title: "No visits just to sign", desc: "Close contracts remotely, from mobile." },
        { title: "Documented backing", desc: "IP, date and verification back every signature." },
      ],
      faqs: [
        { q: "Does it work for maintenance contracts?", a: "Yes, and for quotes and private service agreements." },
        { q: "Does the client need an account?", a: "No. They sign from a unique link by email." },
        { q: "Can I save my clients?", a: "Yes, to send new quotes in seconds." },
      ],
    },
  },
  {
    slug: "opticas",
    icon: "heart",
    es: {
      name: "Ópticas",
      h1: "Firma digital para ópticas",
      metaTitle: "Firma Digital para Ópticas — Consentimientos y Presupuestos | Firmiu",
      metaDescription: "Firma digital para ópticas. Firma consentimientos, presupuestos de lentes y autorizaciones con tus clientes sin papel.",
      keywords: "firma digital para ópticas, consentimiento óptica firma, presupuesto de lentes firma, firma electrónica óptica",
      intro: "Las ópticas manejan presupuestos y, a veces, consentimientos para ciertos servicios. Firmiu permite firmarlos en el local o desde el móvil.",
      uses: ["Presupuestos de lentes y monturas", "Consentimientos para servicios", "Autorizaciones y garantías", "Acuerdos de pago a plazos"],
      benefits: [
        { title: "Agiliza la atención", desc: "El cliente firma su presupuesto sin papeleo." },
        { title: "Sin formularios en papel", desc: "Firma desde el móvil del cliente o una tablet." },
        { title: "Respaldo documentado", desc: "IP, fecha y verificación quedan registrados." },
      ],
      faqs: [
        { q: "¿Sirve para presupuestos y consentimientos?", a: "Sí, como documentos privados entre la óptica y el cliente." },
        { q: "¿El cliente firma desde el móvil?", a: "Sí, con un enlace único, sin instalar nada." },
        { q: "¿Puedo reutilizar mis formularios?", a: "Sí. Sube tu PDF y guarda contactos para enviar más rápido." },
      ],
    },
    en: {
      name: "Opticians",
      h1: "Digital signatures for opticians",
      metaTitle: "Digital Signatures for Opticians — Consents and Quotes | Firmiu",
      metaDescription: "Digital signatures for opticians. Sign consents, eyewear quotes and authorizations with clients paper-free.",
      keywords: "digital signature for opticians, optician consent signature, eyewear quote signature, e-signature optician",
      intro: "Opticians handle quotes and sometimes consents for certain services. Firmiu lets you sign them in-store or from mobile.",
      uses: ["Eyewear and frame quotes", "Service consents", "Authorizations and warranties", "Installment-payment agreements"],
      benefits: [
        { title: "Speed up service", desc: "The client signs their quote with no paperwork." },
        { title: "No paper forms", desc: "Sign from the client's phone or a tablet." },
        { title: "Documented backing", desc: "IP, date and verification are logged." },
      ],
      faqs: [
        { q: "Does it work for quotes and consents?", a: "Yes, as private documents between the optician and the client." },
        { q: "Does the client sign from mobile?", a: "Yes, with a unique link and nothing to install." },
        { q: "Can I reuse my forms?", a: "Yes. Upload your PDF and save contacts to send faster." },
      ],
    },
  },
  {
    slug: "laboratorios",
    icon: "heart",
    es: {
      name: "Laboratorios clínicos",
      h1: "Firma digital para laboratorios clínicos",
      metaTitle: "Firma Digital para Laboratorios — Consentimientos | Firmiu",
      metaDescription: "Firma digital para laboratorios clínicos y de análisis. Firma consentimientos, autorizaciones y contratos con pacientes y empresas sin papel.",
      keywords: "firma digital para laboratorios, consentimiento laboratorio firma, firma electrónica análisis clínicos, autorización de pruebas firma",
      intro: "Los laboratorios recogen consentimientos y autorizaciones por cada estudio. Firmiu permite firmarlos en recepción o a distancia, sin papeleo.",
      uses: ["Consentimientos para pruebas", "Autorizaciones de toma de muestras", "Contratos con empresas y aseguradoras", "Políticas de datos del paciente"],
      benefits: [
        { title: "Recepción sin papel", desc: "El paciente firma su consentimiento desde el móvil o una tablet." },
        { title: "Cada firma trazable", desc: "IP, fecha y verificación respaldan cada documento." },
        { title: "Documentos organizados", desc: "Conserva el historial de firmas y descárgalo cuando lo necesites." },
      ],
      faqs: [
        { q: "¿Sirve para consentimientos de pruebas?", a: "Sí, como documento privado con el paciente; revisa los requisitos de tu actividad y país." },
        { q: "¿El paciente necesita una cuenta?", a: "No. Firma desde un enlace único, sin registrarse." },
        { q: "¿Sirve para convenios con empresas?", a: "Sí, para contratos privados con empresas y aseguradoras." },
      ],
    },
    en: {
      name: "Clinical labs",
      h1: "Digital signatures for clinical labs",
      metaTitle: "Digital Signatures for Labs — Consents | Firmiu",
      metaDescription: "Digital signatures for clinical and testing labs. Sign consents, authorizations and contracts with patients and companies paper-free.",
      keywords: "digital signature for labs, lab consent signature, e-signature clinical tests, test authorization signature",
      intro: "Labs collect consents and authorizations for each study. Firmiu lets you sign them at reception or remotely, with no paperwork.",
      uses: ["Test consents", "Sample-collection authorizations", "Contracts with companies and insurers", "Patient data policies"],
      benefits: [
        { title: "Paper-free reception", desc: "The patient signs their consent from mobile or a tablet." },
        { title: "Every signature traceable", desc: "IP, date and verification back each document." },
        { title: "Organized documents", desc: "Keep the signature history and download it when needed." },
      ],
      faqs: [
        { q: "Does it work for test consents?", a: "Yes, as a private document with the patient; check the requirements for your practice and country." },
        { q: "Does the patient need an account?", a: "No. They sign from a unique link, without registering." },
        { q: "Does it work for company contracts?", a: "Yes, for private contracts with companies and insurers." },
      ],
    },
  },
  {
    slug: "academias-de-idiomas",
    icon: "academic",
    es: {
      name: "Academias de idiomas",
      h1: "Firma digital para academias de idiomas",
      metaTitle: "Firma Digital para Academias de Idiomas — Matrículas | Firmiu",
      metaDescription: "Firma digital para academias de idiomas. Firma matrículas, contratos de curso y autorizaciones con tus alumnos sin papel.",
      keywords: "firma digital para academias de idiomas, matrícula academia firma, contrato de curso de inglés firma, firma electrónica academia",
      intro: "Cada alumno firma su matrícula y contrato de curso. Firmiu permite cerrar la inscripción online, ideal para academias presenciales y virtuales.",
      uses: ["Matrículas e inscripciones", "Contratos de curso y forma de pago", "Autorizaciones de menores", "Reglamentos de la academia"],
      benefits: [
        { title: "Inscripción online", desc: "El alumno firma su matrícula desde casa, antes de empezar." },
        { title: "Ideal para cursos online", desc: "Firma a distancia, perfecta para academias virtuales." },
        { title: "Respaldo por alumno", desc: "Sabes quién firmó qué y cuándo." },
      ],
      faqs: [
        { q: "¿Sirve para matrículas?", a: "Sí, y para contratos de curso y autorizaciones privadas." },
        { q: "¿Funciona para academias online?", a: "Sí, el alumno firma desde cualquier lugar." },
        { q: "¿Queda registro de cada firma?", a: "Sí. Cada firma guarda fecha, IP, dispositivo y verificación." },
      ],
    },
    en: {
      name: "Language schools",
      h1: "Digital signatures for language schools",
      metaTitle: "Digital Signatures for Language Schools — Enrollments | Firmiu",
      metaDescription: "Digital signatures for language schools. Sign enrollments, course contracts and authorizations with students paper-free.",
      keywords: "digital signature for language schools, language school enrollment signature, course contract signature, e-signature academy",
      intro: "Every student signs their enrollment and course contract. Firmiu lets you close sign-up online, ideal for in-person and virtual schools.",
      uses: ["Enrollments and registrations", "Course contracts and payment terms", "Minor authorizations", "School rules"],
      benefits: [
        { title: "Online enrollment", desc: "The student signs their enrollment from home, before starting." },
        { title: "Ideal for online courses", desc: "Sign remotely, perfect for virtual schools." },
        { title: "Per-student backing", desc: "You know who signed what and when." },
      ],
      faqs: [
        { q: "Does it work for enrollments?", a: "Yes, and for course contracts and private authorizations." },
        { q: "Does it work for online schools?", a: "Yes, the student signs from anywhere." },
        { q: "Is there a record of each signature?", a: "Yes. Every signature stores date, IP, device and verification." },
      ],
    },
  },
  {
    slug: "escuelas-de-musica",
    icon: "academic",
    es: {
      name: "Escuelas de música",
      h1: "Firma digital para escuelas de música",
      metaTitle: "Firma Digital para Escuelas de Música — Matrículas | Firmiu",
      metaDescription: "Firma digital para escuelas y academias de música. Firma matrículas, contratos de clase y autorizaciones con alumnos y padres sin papel.",
      keywords: "firma digital para escuelas de música, matrícula música firma, contrato de clases de música firma, firma electrónica academia de música",
      intro: "Las escuelas de música inscriben alumnos cada temporada. Firmiu permite a alumnos y padres firmar matrículas y autorizaciones a distancia.",
      uses: ["Matrículas e inscripciones", "Contratos de clases y planes", "Autorizaciones de menores", "Alquiler de instrumentos"],
      benefits: [
        { title: "Inscripción sin filas", desc: "Los padres firman desde casa, antes de la primera clase." },
        { title: "Todo organizado", desc: "Conserva cada documento firmado por alumno o familia." },
        { title: "Respaldo por persona", desc: "Sabes quién firmó qué, cuándo y desde dónde." },
      ],
      faqs: [
        { q: "¿Sirve para matrículas?", a: "Sí, y para contratos de clase y autorizaciones privadas." },
        { q: "¿Los padres necesitan una cuenta?", a: "No. Firman desde un enlace único por correo." },
        { q: "¿Sirve para alquiler de instrumentos?", a: "Sí, como acuerdo privado con su rastro de auditoría." },
      ],
    },
    en: {
      name: "Music schools",
      h1: "Digital signatures for music schools",
      metaTitle: "Digital Signatures for Music Schools — Enrollments | Firmiu",
      metaDescription: "Digital signatures for music schools and academies. Sign enrollments, class contracts and authorizations with students and parents paper-free.",
      keywords: "digital signature for music schools, music enrollment signature, music class contract signature, e-signature music academy",
      intro: "Music schools enroll students every season. Firmiu lets students and parents sign enrollments and authorizations remotely.",
      uses: ["Enrollments and registrations", "Class contracts and plans", "Minor authorizations", "Instrument rentals"],
      benefits: [
        { title: "Enrollment without lines", desc: "Parents sign from home, before the first class." },
        { title: "Everything organized", desc: "Keep every signed document per student or family." },
        { title: "Per-person backing", desc: "You know who signed what, when and from where." },
      ],
      faqs: [
        { q: "Does it work for enrollments?", a: "Yes, and for class contracts and private authorizations." },
        { q: "Do parents need an account?", a: "No. They sign from a unique link by email." },
        { q: "Does it work for instrument rentals?", a: "Yes, as a private agreement with its audit trail." },
      ],
    },
  },
  {
    slug: "guarderias",
    icon: "heart",
    es: {
      name: "Guarderías",
      h1: "Firma digital para guarderías",
      metaTitle: "Firma Digital para Guarderías — Matrículas y Autorizaciones | Firmiu",
      metaDescription: "Firma digital para guarderías y jardines infantiles. Firma matrículas, autorizaciones y consentimientos con los padres sin papel.",
      keywords: "firma digital para guarderías, matrícula guardería firma, autorización jardín infantil firma, consentimiento guardería firma",
      intro: "Las guarderías recogen matrículas y muchas autorizaciones de los padres. Firmiu permite firmarlas a distancia, sin acumular papeles.",
      uses: ["Matrículas e inscripciones", "Autorizaciones de recogida y salidas", "Consentimientos y fichas médicas", "Reglamentos y acuerdos de pago"],
      benefits: [
        { title: "Inscripción desde casa", desc: "Los padres firman la matrícula antes del primer día." },
        { title: "Autorizaciones al instante", desc: "Recoge permisos de salidas o recogida en minutos." },
        { title: "Respaldo por familia", desc: "Cada firma guarda IP, fecha y verificación." },
      ],
      faqs: [
        { q: "¿Sirve para autorizaciones de recogida?", a: "Sí, y para matrículas y consentimientos privados." },
        { q: "¿Los padres necesitan una cuenta?", a: "No. Firman desde un enlace único por correo." },
        { q: "¿Queda registro de cada firma?", a: "Sí. Cada firma guarda fecha, IP, dispositivo y verificación." },
      ],
    },
    en: {
      name: "Daycares",
      h1: "Digital signatures for daycares",
      metaTitle: "Digital Signatures for Daycares — Enrollments and Authorizations | Firmiu",
      metaDescription: "Digital signatures for daycares and kindergartens. Sign enrollments, authorizations and consents with parents paper-free.",
      keywords: "digital signature for daycares, daycare enrollment signature, kindergarten authorization signature, daycare consent signature",
      intro: "Daycares collect enrollments and many parent authorizations. Firmiu lets you sign them remotely, without piling up paper.",
      uses: ["Enrollments and registrations", "Pickup and outing authorizations", "Consents and medical forms", "Rules and payment agreements"],
      benefits: [
        { title: "Enroll from home", desc: "Parents sign the enrollment before the first day." },
        { title: "Instant authorizations", desc: "Collect outing or pickup permissions in minutes." },
        { title: "Per-family backing", desc: "Every signature stores IP, date and verification." },
      ],
      faqs: [
        { q: "Does it work for pickup authorizations?", a: "Yes, and for enrollments and private consents." },
        { q: "Do parents need an account?", a: "No. They sign from a unique link by email." },
        { q: "Is there a record of each signature?", a: "Yes. Every signature stores date, IP, device and verification." },
      ],
    },
  },
  {
    slug: "estudios-de-tatuajes",
    icon: "heart",
    es: {
      name: "Estudios de tatuajes",
      h1: "Firma digital para estudios de tatuajes",
      metaTitle: "Firma Digital para Tatuajes — Consentimientos y Descargos | Firmiu",
      metaDescription: "Firma digital para estudios de tatuajes y piercing. Firma consentimientos y descargos de responsabilidad con tus clientes sin papel.",
      keywords: "firma digital para estudios de tatuajes, consentimiento tatuaje firma, descargo de responsabilidad tatuaje firma, firma electrónica piercing",
      intro: "Antes de cada tatuaje o piercing necesitas un consentimiento firmado. Firmiu permite recogerlo desde el móvil o una tablet en segundos.",
      uses: ["Consentimientos informados", "Descargos de responsabilidad", "Cuidados posteriores y autorizaciones", "Reservas y señas"],
      benefits: [
        { title: "Consentimiento al instante", desc: "El cliente firma antes de empezar, sin papeleo." },
        { title: "Firma en el estudio", desc: "Desde el móvil del cliente o una tablet, en segundos." },
        { title: "Respaldo documentado", desc: "IP, fecha y verificación respaldan cada firma." },
      ],
      faqs: [
        { q: "¿Sirve para consentimientos y descargos?", a: "Sí, como acuerdo privado entre el estudio y el cliente." },
        { q: "¿El cliente firma desde el móvil?", a: "Sí, con un enlace único, sin instalar nada." },
        { q: "¿Puedo reutilizar mis formularios?", a: "Sí. Sube tu PDF y guarda contactos para enviar más rápido." },
      ],
    },
    en: {
      name: "Tattoo studios",
      h1: "Digital signatures for tattoo studios",
      metaTitle: "Digital Signatures for Tattoo Studios — Consents and Waivers | Firmiu",
      metaDescription: "Digital signatures for tattoo and piercing studios. Sign consents and liability waivers with clients paper-free.",
      keywords: "digital signature for tattoo studios, tattoo consent signature, tattoo liability waiver signature, e-signature piercing",
      intro: "Before every tattoo or piercing you need a signed consent. Firmiu lets you collect it from mobile or a tablet in seconds.",
      uses: ["Informed consents", "Liability waivers", "Aftercare and authorizations", "Bookings and deposits"],
      benefits: [
        { title: "Instant consent", desc: "The client signs before starting, with no paperwork." },
        { title: "Sign at the studio", desc: "From the client's phone or a tablet, in seconds." },
        { title: "Documented backing", desc: "IP, date and verification back every signature." },
      ],
      faqs: [
        { q: "Does it work for consents and waivers?", a: "Yes, as a private agreement between the studio and the client." },
        { q: "Does the client sign from mobile?", a: "Yes, with a unique link and nothing to install." },
        { q: "Can I reuse my forms?", a: "Yes. Upload your PDF and save contacts to send faster." },
      ],
    },
  },
  {
    slug: "clubes-deportivos",
    icon: "users",
    es: {
      name: "Clubes deportivos",
      h1: "Firma digital para clubes deportivos",
      metaTitle: "Firma Digital para Clubes Deportivos — Inscripciones | Firmiu",
      metaDescription: "Firma digital para clubes y academias deportivas. Firma inscripciones, descargos y autorizaciones con socios y padres sin papel.",
      keywords: "firma digital para clubes deportivos, inscripción club deportivo firma, descargo deportivo firma, autorización menor deporte firma",
      intro: "Cada temporada los clubes inscriben socios y recogen descargos. Firmiu permite firmar inscripciones y autorizaciones a distancia.",
      uses: ["Inscripciones y membresías", "Descargos de responsabilidad", "Autorizaciones de menores", "Reglamentos y cuotas"],
      benefits: [
        { title: "Inscripción sin filas", desc: "Socios y padres firman desde casa, antes de empezar." },
        { title: "Descargos cubiertos", desc: "Recoge cada descargo firmado, con respaldo." },
        { title: "Trazabilidad por socio", desc: "Sabes quién firmó qué y cuándo." },
      ],
      faqs: [
        { q: "¿Sirve para descargos deportivos?", a: "Sí, como acuerdo privado entre el club y el socio." },
        { q: "¿Los padres pueden firmar por menores?", a: "Sí, con autorizaciones firmadas desde un enlace único." },
        { q: "¿Queda registro de cada firma?", a: "Sí. Cada firma guarda fecha, IP, dispositivo y verificación." },
      ],
    },
    en: {
      name: "Sports clubs",
      h1: "Digital signatures for sports clubs",
      metaTitle: "Digital Signatures for Sports Clubs — Registrations | Firmiu",
      metaDescription: "Digital signatures for sports clubs and academies. Sign registrations, waivers and authorizations with members and parents paper-free.",
      keywords: "digital signature for sports clubs, sports club registration signature, sports waiver signature, minor sports authorization signature",
      intro: "Each season clubs register members and collect waivers. Firmiu lets you sign registrations and authorizations remotely.",
      uses: ["Registrations and memberships", "Liability waivers", "Minor authorizations", "Rules and fees"],
      benefits: [
        { title: "Registration without lines", desc: "Members and parents sign from home, before starting." },
        { title: "Waivers covered", desc: "Collect every signed waiver, with backing." },
        { title: "Per-member traceability", desc: "You know who signed what and when." },
      ],
      faqs: [
        { q: "Does it work for sports waivers?", a: "Yes, as a private agreement between the club and the member." },
        { q: "Can parents sign for minors?", a: "Yes, with authorizations signed from a unique link." },
        { q: "Is there a record of each signature?", a: "Yes. Every signature stores date, IP, device and verification." },
      ],
    },
  },
  {
    slug: "cooperativas",
    icon: "users",
    es: {
      name: "Cooperativas",
      h1: "Firma digital para cooperativas",
      metaTitle: "Firma Digital para Cooperativas — Acuerdos y Adhesiones | Firmiu",
      metaDescription: "Firma digital para cooperativas y asociaciones. Firma adhesiones de socios, acuerdos y autorizaciones a distancia, sin papel.",
      keywords: "firma digital para cooperativas, adhesión de socio firma, acuerdo cooperativa firma, firma electrónica asociación de socios",
      intro: "Las cooperativas suman socios y firman acuerdos de forma constante. Firmiu permite que los socios firmen adhesiones y autorizaciones a distancia.",
      uses: ["Adhesiones de nuevos socios", "Acuerdos y autorizaciones internas", "Contratos con proveedores", "Consentimientos de datos"],
      benefits: [
        { title: "Suma socios sin papeleo", desc: "El socio firma su adhesión desde el móvil en minutos." },
        { title: "Acuerdos a distancia", desc: "Firma con socios y proveedores sin reuniones." },
        { title: "Todo documentado", desc: "Cada firma guarda IP, fecha y verificación." },
      ],
      faqs: [
        { q: "¿Sirve para adhesiones de socios?", a: "Sí, y para acuerdos y autorizaciones privadas." },
        { q: "¿El socio necesita una cuenta?", a: "No. Firma desde un enlace único por correo." },
        { q: "¿Hay un plan gratuito?", a: "Sí, Firmiu ofrece un plan gratuito para empezar." },
      ],
    },
    en: {
      name: "Cooperatives",
      h1: "Digital signatures for cooperatives",
      metaTitle: "Digital Signatures for Cooperatives — Agreements and Memberships | Firmiu",
      metaDescription: "Digital signatures for cooperatives and associations. Sign member memberships, agreements and authorizations remotely, paper-free.",
      keywords: "digital signature for cooperatives, member membership signature, cooperative agreement signature, e-signature members association",
      intro: "Cooperatives add members and sign agreements constantly. Firmiu lets members sign memberships and authorizations remotely.",
      uses: ["New member memberships", "Internal agreements and authorizations", "Supplier contracts", "Data consents"],
      benefits: [
        { title: "Add members without paperwork", desc: "The member signs their membership from mobile in minutes." },
        { title: "Remote agreements", desc: "Sign with members and suppliers without meetings." },
        { title: "Everything documented", desc: "Every signature stores IP, date and verification." },
      ],
      faqs: [
        { q: "Does it work for member memberships?", a: "Yes, and for private agreements and authorizations." },
        { q: "Does the member need an account?", a: "No. They sign from a unique link by email." },
        { q: "Is there a free plan?", a: "Yes, Firmiu offers a free plan to get started." },
      ],
    },
  },
  {
    slug: "agencias-de-modelos",
    icon: "camera",
    es: {
      name: "Agencias de modelos",
      h1: "Firma digital para agencias de modelos",
      metaTitle: "Firma Digital para Agencias de Modelos — Contratos | Firmiu",
      metaDescription: "Firma digital para agencias de modelos y talentos. Firma contratos de representación, cesiones de imagen y acuerdos de booking sin papel.",
      keywords: "firma digital para agencias de modelos, contrato de representación modelo firma, cesión de imagen firma, acuerdo de booking firma",
      intro: "Representar modelos implica contratos y cesiones de imagen constantes. Firmiu permite firmarlos a distancia, incluso antes de un booking.",
      uses: ["Contratos de representación", "Cesiones de derechos de imagen", "Acuerdos de booking y trabajos", "Autorizaciones de menores"],
      benefits: [
        { title: "Cierra bookings rápido", desc: "Modelos y clientes firman desde el móvil en minutos." },
        { title: "Imagen en orden", desc: "Documenta cada cesión de derechos de imagen con respaldo." },
        { title: "Cada acuerdo registrado", desc: "IP, fecha y verificación respaldan cada firma." },
      ],
      faqs: [
        { q: "¿Sirve para cesiones de imagen?", a: "Sí, como acuerdo privado con el modelo o su representante." },
        { q: "¿Se puede firmar antes de un trabajo?", a: "Sí, desde el móvil con un enlace único." },
        { q: "¿Funciona con clientes en otros países?", a: "Sí. La firma electrónica se reconoce internacionalmente." },
      ],
    },
    en: {
      name: "Modeling agencies",
      h1: "Digital signatures for modeling agencies",
      metaTitle: "Digital Signatures for Modeling Agencies — Contracts | Firmiu",
      metaDescription: "Digital signatures for modeling and talent agencies. Sign representation contracts, image releases and booking agreements paper-free.",
      keywords: "digital signature for modeling agencies, model representation contract signature, image release signature, booking agreement signature",
      intro: "Representing models means constant contracts and image releases. Firmiu lets you sign them remotely, even before a booking.",
      uses: ["Representation contracts", "Image-rights releases", "Booking and job agreements", "Minor authorizations"],
      benefits: [
        { title: "Close bookings fast", desc: "Models and clients sign from mobile in minutes." },
        { title: "Image rights in order", desc: "Document every image-rights release with backing." },
        { title: "Every agreement logged", desc: "IP, date and verification back each signature." },
      ],
      faqs: [
        { q: "Does it work for image releases?", a: "Yes, as a private agreement with the model or their representative." },
        { q: "Can it be signed before a job?", a: "Yes, from mobile with a unique link." },
        { q: "Does it work with clients in other countries?", a: "Yes. Electronic signatures are recognized internationally." },
      ],
    },
  },
  {
    slug: "centros-de-formacion",
    icon: "academic",
    es: {
      name: "Centros de formación",
      h1: "Firma digital para centros de formación",
      metaTitle: "Firma Digital para Centros de Formación — Matrículas | Firmiu",
      metaDescription: "Firma digital para centros de formación y cursos online. Firma matrículas, contratos y términos con tus alumnos sin papel.",
      keywords: "firma digital para centros de formación, matrícula curso firma, contrato de formación firma, firma electrónica curso online",
      intro: "Centros de formación y plataformas de cursos inscriben alumnos a diario. Firmiu permite firmar matrículas y contratos a distancia, en minutos.",
      uses: ["Matrículas e inscripciones", "Contratos de formación y pago", "Términos y condiciones del curso", "Acuerdos con formadores"],
      benefits: [
        { title: "Inscripción 100% online", desc: "El alumno firma su matrícula desde cualquier lugar." },
        { title: "Ideal para cursos a distancia", desc: "Perfecto para formación online y bootcamps." },
        { title: "Respaldo por alumno", desc: "Cada firma guarda IP, fecha y verificación." },
      ],
      faqs: [
        { q: "¿Sirve para matrículas de cursos?", a: "Sí, y para contratos de formación y términos privados." },
        { q: "¿Funciona para cursos online?", a: "Sí, el alumno firma desde cualquier lugar." },
        { q: "¿El alumno necesita una cuenta?", a: "No. Firma desde un enlace único por correo." },
      ],
    },
    en: {
      name: "Training centers",
      h1: "Digital signatures for training centers",
      metaTitle: "Digital Signatures for Training Centers — Enrollments | Firmiu",
      metaDescription: "Digital signatures for training centers and online courses. Sign enrollments, contracts and terms with students paper-free.",
      keywords: "digital signature for training centers, course enrollment signature, training contract signature, e-signature online course",
      intro: "Training centers and course platforms enroll students daily. Firmiu lets you sign enrollments and contracts remotely, in minutes.",
      uses: ["Enrollments and registrations", "Training and payment contracts", "Course terms and conditions", "Agreements with instructors"],
      benefits: [
        { title: "100% online enrollment", desc: "The student signs their enrollment from anywhere." },
        { title: "Ideal for remote courses", desc: "Perfect for online training and bootcamps." },
        { title: "Per-student backing", desc: "Every signature stores IP, date and verification." },
      ],
      faqs: [
        { q: "Does it work for course enrollments?", a: "Yes, and for training contracts and private terms." },
        { q: "Does it work for online courses?", a: "Yes, the student signs from anywhere." },
        { q: "Does the student need an account?", a: "No. They sign from a unique link by email." },
      ],
    },
  },
  {
    slug: "spa-y-bienestar",
    icon: "heart",
    es: {
      name: "Spa y bienestar",
      h1: "Firma digital para spa y centros de bienestar",
      metaTitle: "Firma Digital para Spa — Consentimientos y Bonos | Firmiu",
      metaDescription: "Firma digital para spa y centros de bienestar. Firma consentimientos, descargos y bonos de tratamientos con tus clientes sin papel.",
      keywords: "firma digital para spa, consentimiento spa firma, bono de tratamientos firma, firma electrónica centro de bienestar",
      intro: "Los tratamientos de spa y bienestar suelen requerir consentimientos y bonos. Firmiu permite firmarlos en recepción o desde el móvil, en segundos.",
      uses: ["Consentimientos de tratamiento", "Descargos de responsabilidad", "Bonos y paquetes de sesiones", "Políticas del centro"],
      benefits: [
        { title: "Agiliza la cita", desc: "El cliente firma su consentimiento sin esperas." },
        { title: "Vende bonos sin papeleo", desc: "Cierra paquetes de sesiones firmados al instante." },
        { title: "Respaldo documentado", desc: "IP, fecha y verificación respaldan cada firma." },
      ],
      faqs: [
        { q: "¿Sirve para consentimientos y bonos?", a: "Sí, como documentos privados entre el centro y el cliente." },
        { q: "¿El cliente firma desde el móvil?", a: "Sí, con un enlace único, sin instalar nada." },
        { q: "¿Puedo guardar a mis clientes?", a: "Sí, para enviar nuevos bonos en segundos." },
      ],
    },
    en: {
      name: "Spa & wellness",
      h1: "Digital signatures for spa & wellness centers",
      metaTitle: "Digital Signatures for Spas — Consents and Packages | Firmiu",
      metaDescription: "Digital signatures for spas and wellness centers. Sign consents, waivers and treatment packages with clients paper-free.",
      keywords: "digital signature for spa, spa consent signature, treatment package signature, e-signature wellness center",
      intro: "Spa and wellness treatments often need consents and packages. Firmiu lets you sign them at reception or from mobile, in seconds.",
      uses: ["Treatment consents", "Liability waivers", "Session packages and bundles", "Center policies"],
      benefits: [
        { title: "Speed up the appointment", desc: "The client signs their consent with no waiting." },
        { title: "Sell packages without paperwork", desc: "Close signed session bundles instantly." },
        { title: "Documented backing", desc: "IP, date and verification back every signature." },
      ],
      faqs: [
        { q: "Does it work for consents and packages?", a: "Yes, as private documents between the center and the client." },
        { q: "Does the client sign from mobile?", a: "Yes, with a unique link and nothing to install." },
        { q: "Can I save my clients?", a: "Yes, to send new packages in seconds." },
      ],
    },
  },
];

/** Heroicons-style outline SVG paths for each use-case icon. */
export const USE_CASE_ICON_PATHS: Record<UseCaseIcon, string> = {
  calculator:
    "M9 7h6m-6 4h6m-2 4h2m-6 0h.01M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z",
  scale: "M12 3v18m0-18l7 4-7 4-7-4 7-4zM5 10v6m14-6v6M3 16h4m10 0h4",
  home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  users:
    "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  briefcase:
    "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  office:
    "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  chart:
    "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  megaphone:
    "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
  heart:
    "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  shield:
    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  globe:
    "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
  truck:
    "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1",
  camera:
    "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM15 13a3 3 0 11-6 0 3 3 0 016 0z",
  academic:
    "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
  document:
    "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
};

export const USE_CASE_SLUGS = USE_CASES.map((u) => u.slug);

export function getUseCase(slug: string): UseCase | undefined {
  return USE_CASES.find((u) => u.slug === slug);
}

export function getUseCaseContent(useCase: UseCase, locale: string): UseCaseContent {
  return locale === "en" ? useCase.en : useCase.es;
}
