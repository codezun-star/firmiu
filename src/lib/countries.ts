/**
 * Per-country content for the programmatic "Firma electrónica en {país}" landing
 * pages. The legal references are the real, differentiating content that lets
 * each page rank for country-specific queries — keep them accurate.
 *
 * UI chrome (section labels, CTA copy) lives in messages/*.json under the
 * `country_page` / `country_hub` namespaces. Long-form per-country copy lives
 * here, keyed by locale, because it can't reasonably be mirrored across the
 * translation parity files.
 */

export type CountryRegion =
  | "latam"
  | "europe"
  | "north-america"
  | "africa"
  | "asia"
  | "oceania";

export interface CountryFaq {
  q: string;
  a: string;
}

export interface CountryContent {
  /** Localized country name, e.g. "México". */
  name: string;
  /** Short label for the legal framework, e.g. "Ley 25.506 de Firma Digital". */
  lawName: string;
  /** One-line summary shown in the hub card. */
  summary: string;
  /** Opening paragraph for the page hero/intro. */
  intro: string;
  /** Paragraph describing the legal framework (cites the law + authority). */
  legalBody: string;
  /** Paragraph about what makes a signature valid and how Firmiu helps. */
  validity: string;
  /** Three country-specific FAQ entries. */
  faqs: CountryFaq[];
}

export interface Country {
  slug: string;
  flag: string;
  region: CountryRegion;
  es: CountryContent;
  en: CountryContent;
}

export const COUNTRIES: Country[] = [
  {
    slug: "mexico",
    flag: "🇲🇽",
    region: "latam",
    es: {
      name: "México",
      lawName: "Código de Comercio + Ley de Firma Electrónica Avanzada",
      summary: "Válida desde 2003 por el Código de Comercio y la NOM-151.",
      intro:
        "La firma electrónica es legal y plenamente válida en México. Empresas, contadores y abogados pueden firmar contratos, facturas y acuerdos sin imprimir un solo papel.",
      legalBody:
        "México reconoce la firma electrónica desde la reforma de 2003 al Código de Comercio (artículos 89 a 114) y la Ley de Firma Electrónica Avanzada de 2012. La NOM-151-SCFI-2016 regula la conservación de mensajes de datos, y la Secretaría de Economía supervisa a los prestadores de servicios de certificación.",
      validity:
        "Para tener valor probatorio, una firma debe ser atribuible al firmante e íntegra. Firmiu registra IP, dispositivo, ubicación y un código de verificación por cada firma, generando un rastro de auditoría que respalda el documento ante un tribunal mexicano.",
      faqs: [
        {
          q: "¿Es legal la firma electrónica en México?",
          a: "Sí. El Código de Comercio y la Ley de Firma Electrónica Avanzada le otorgan plena validez jurídica desde hace más de dos décadas.",
        },
        {
          q: "¿Tiene validez ante un juez?",
          a: "Sí. Un documento firmado electrónicamente con un rastro de auditoría sólido (IP, fecha, dispositivo y verificación) es admisible como prueba.",
        },
        {
          q: "¿Qué documentos puedo firmar?",
          a: "Contratos de servicios, arrendamientos, acuerdos laborales, cotizaciones y la mayoría de documentos mercantiles y civiles.",
        },
      ],
    },
    en: {
      name: "Mexico",
      lawName: "Commercial Code + Advanced Electronic Signature Law",
      summary: "Valid since 2003 under the Commercial Code and NOM-151.",
      intro:
        "Electronic signatures are legal and fully valid in Mexico. Companies, accountants and lawyers can sign contracts, invoices and agreements without printing a single page.",
      legalBody:
        "Mexico has recognized electronic signatures since the 2003 reform of the Commercial Code (articles 89–114) and the 2012 Advanced Electronic Signature Law. NOM-151-SCFI-2016 governs data-message retention, and the Ministry of Economy oversees certification service providers.",
      validity:
        "To carry evidentiary weight a signature must be attributable to the signer and tamper-evident. Firmiu records IP, device, location and a verification code for every signature, producing an audit trail that backs the document before a Mexican court.",
      faqs: [
        {
          q: "Are electronic signatures legal in Mexico?",
          a: "Yes. The Commercial Code and the Advanced Electronic Signature Law have granted them full legal validity for over two decades.",
        },
        {
          q: "Are they valid in court?",
          a: "Yes. A document signed electronically with a solid audit trail (IP, date, device and verification) is admissible as evidence.",
        },
        {
          q: "What documents can I sign?",
          a: "Service contracts, leases, employment agreements, quotes and most commercial and civil documents.",
        },
      ],
    },
  },
  {
    slug: "colombia",
    flag: "🇨🇴",
    region: "latam",
    es: {
      name: "Colombia",
      lawName: "Ley 527 de 1999",
      summary: "Reconocida por la Ley 527 de 1999 y el Decreto 2364 de 2012.",
      intro:
        "En Colombia la firma electrónica tiene plena validez legal. Es una herramienta cotidiana para inmobiliarias, despachos y pymes que firman a distancia.",
      legalBody:
        "La Ley 527 de 1999 reconoce los mensajes de datos y la firma electrónica, y el Decreto 2364 de 2012 reglamenta la firma electrónica simple. El Organismo Nacional de Acreditación (ONAC) acredita a las entidades de certificación digital.",
      validity:
        "La ley exige que la firma sea confiable y apropiada para el fin del mensaje. El rastro de auditoría de Firmiu —IP, ubicación, dispositivo y código de verificación— demuestra la identidad del firmante y la integridad del documento.",
      faqs: [
        {
          q: "¿Es legal la firma electrónica en Colombia?",
          a: "Sí. La Ley 527 de 1999 y el Decreto 2364 de 2012 le dan plena validez jurídica.",
        },
        {
          q: "¿Sirve para contratos de arrendamiento?",
          a: "Sí. Es ampliamente usada en arrendamientos, contratos de servicios y acuerdos comerciales.",
        },
        {
          q: "¿Necesito un certificado digital del Estado?",
          a: "No para la firma electrónica simple. Para ciertos trámites oficiales puede exigirse firma digital certificada.",
        },
      ],
    },
    en: {
      name: "Colombia",
      lawName: "Law 527 of 1999",
      summary: "Recognized by Law 527 of 1999 and Decree 2364 of 2012.",
      intro:
        "Electronic signatures are fully legally valid in Colombia and are an everyday tool for real-estate agencies, firms and SMBs signing remotely.",
      legalBody:
        "Law 527 of 1999 recognizes data messages and electronic signatures, and Decree 2364 of 2012 regulates simple electronic signatures. The National Accreditation Body (ONAC) accredits digital certification entities.",
      validity:
        "The law requires the signature to be reliable and appropriate for the purpose of the message. Firmiu's audit trail — IP, location, device and verification code — proves the signer's identity and the document's integrity.",
      faqs: [
        {
          q: "Are electronic signatures legal in Colombia?",
          a: "Yes. Law 527 of 1999 and Decree 2364 of 2012 grant them full legal validity.",
        },
        {
          q: "Do they work for lease agreements?",
          a: "Yes. They are widely used for leases, service contracts and commercial agreements.",
        },
        {
          q: "Do I need a government digital certificate?",
          a: "Not for a simple electronic signature. Certain official procedures may require a certified digital signature.",
        },
      ],
    },
  },
  {
    slug: "argentina",
    flag: "🇦🇷",
    region: "latam",
    es: {
      name: "Argentina",
      lawName: "Ley 25.506 de Firma Digital",
      summary: "Vigente desde 2001 por la Ley 25.506 y el Decreto 182/2019.",
      intro:
        "La firma electrónica y digital están reguladas en Argentina desde 2001. Permiten cerrar acuerdos y contratos con plena seguridad jurídica.",
      legalBody:
        "La Ley 25.506 de Firma Digital y su actualización por el Decreto 182/2019 distinguen la firma digital (con certificado del ente licenciante) de la firma electrónica. Ambas son válidas; la diferencia está en la carga de la prueba.",
      validity:
        "La firma electrónica es válida, pero su autoría debe poder acreditarse. Por eso Firmiu adjunta a cada firma su IP, ubicación, dispositivo y verificación, fortaleciendo el valor probatorio del documento.",
      faqs: [
        {
          q: "¿Es legal la firma electrónica en Argentina?",
          a: "Sí. La Ley 25.506 reconoce tanto la firma electrónica como la firma digital.",
        },
        {
          q: "¿Cuál es la diferencia con la firma digital?",
          a: "La firma digital usa un certificado de un ente licenciante e invierte la carga de la prueba; la electrónica es válida pero quien la invoca debe acreditar su autoría.",
        },
        {
          q: "¿Puedo firmar contratos laborales?",
          a: "Sí, la mayoría de acuerdos privados pueden firmarse electrónicamente.",
        },
      ],
    },
    en: {
      name: "Argentina",
      lawName: "Digital Signature Law 25,506",
      summary: "In force since 2001 under Law 25,506 and Decree 182/2019.",
      intro:
        "Electronic and digital signatures have been regulated in Argentina since 2001, allowing agreements and contracts to be closed with full legal certainty.",
      legalBody:
        "Digital Signature Law 25,506 and its update via Decree 182/2019 distinguish a digital signature (with a licensing-authority certificate) from an electronic signature. Both are valid; the difference lies in the burden of proof.",
      validity:
        "An electronic signature is valid, but its authorship must be provable. That's why Firmiu attaches IP, location, device and verification to every signature, strengthening the document's evidentiary value.",
      faqs: [
        {
          q: "Are electronic signatures legal in Argentina?",
          a: "Yes. Law 25,506 recognizes both electronic and digital signatures.",
        },
        {
          q: "How is it different from a digital signature?",
          a: "A digital signature uses a licensing-authority certificate and shifts the burden of proof; an electronic one is valid but its author must be proven by whoever invokes it.",
        },
        {
          q: "Can I sign employment contracts?",
          a: "Yes, most private agreements can be signed electronically.",
        },
      ],
    },
  },
  {
    slug: "chile",
    flag: "🇨🇱",
    region: "latam",
    es: {
      name: "Chile",
      lawName: "Ley 19.799",
      summary: "Válida desde 2002 por la Ley 19.799 sobre firma electrónica.",
      intro:
        "Chile fue uno de los primeros países de la región en regular la firma electrónica. Hoy es estándar para contratos y documentos empresariales.",
      legalBody:
        "La Ley 19.799 de 2002 regula los documentos electrónicos y la firma electrónica, equiparando su validez a la firma manuscrita. La Entidad Acreditadora, dependiente de la Subsecretaría de Economía, acredita a los prestadores de servicios de certificación.",
      validity:
        "Para los actos entre privados basta la firma electrónica simple. El rastro de auditoría de Firmiu (IP, dispositivo, ubicación y código) respalda quién firmó y cuándo, reforzando la validez del documento.",
      faqs: [
        {
          q: "¿Es legal la firma electrónica en Chile?",
          a: "Sí. La Ley 19.799 la reconoce desde 2002 con el mismo valor que la firma manuscrita.",
        },
        {
          q: "¿Sirve para contratos entre empresas?",
          a: "Sí. Es de uso habitual en contratos comerciales y de servicios.",
        },
        {
          q: "¿Necesito firma electrónica avanzada?",
          a: "Solo para ciertos actos que la ley exige; para la mayoría de acuerdos privados basta la firma electrónica simple.",
        },
      ],
    },
    en: {
      name: "Chile",
      lawName: "Law 19,799",
      summary: "Valid since 2002 under electronic-signature Law 19,799.",
      intro:
        "Chile was one of the first countries in the region to regulate electronic signatures. Today it is standard for contracts and business documents.",
      legalBody:
        "Law 19,799 of 2002 regulates electronic documents and signatures, giving them the same validity as a handwritten signature. The Accrediting Entity, under the Undersecretariat of Economy, accredits certification service providers.",
      validity:
        "For acts between private parties a simple electronic signature is enough. Firmiu's audit trail (IP, device, location and code) backs who signed and when, reinforcing the document's validity.",
      faqs: [
        {
          q: "Are electronic signatures legal in Chile?",
          a: "Yes. Law 19,799 has recognized them since 2002 with the same weight as a handwritten signature.",
        },
        {
          q: "Do they work for business-to-business contracts?",
          a: "Yes. They are routinely used in commercial and service contracts.",
        },
        {
          q: "Do I need an advanced electronic signature?",
          a: "Only for certain acts required by law; for most private agreements a simple electronic signature suffices.",
        },
      ],
    },
  },
  {
    slug: "peru",
    flag: "🇵🇪",
    region: "latam",
    es: {
      name: "Perú",
      lawName: "Ley 27.269 de Firmas y Certificados Digitales",
      summary: "Reconocida por la Ley 27.269 y su reglamento.",
      intro:
        "En Perú la firma electrónica está reconocida por ley y es una herramienta clave para negocios que operan a distancia.",
      legalBody:
        "La Ley 27.269 de Firmas y Certificados Digitales y su reglamento regulan la firma electrónica en Perú. La Infraestructura Oficial de Firma Electrónica (IOFE), supervisada por INDECOPI, da soporte a las firmas digitales certificadas.",
      validity:
        "La firma electrónica simple es válida para acuerdos privados. Firmiu añade a cada firma su rastro de auditoría —IP, ubicación, dispositivo y verificación— para sustentar la identidad del firmante.",
      faqs: [
        {
          q: "¿Es legal la firma electrónica en Perú?",
          a: "Sí. La Ley 27.269 reconoce las firmas y certificados digitales.",
        },
        {
          q: "¿Qué es la IOFE?",
          a: "La Infraestructura Oficial de Firma Electrónica, supervisada por INDECOPI, que respalda las firmas digitales certificadas en el país.",
        },
        {
          q: "¿Puedo firmar contratos comerciales?",
          a: "Sí. La firma electrónica es válida para la mayoría de contratos entre privados.",
        },
      ],
    },
    en: {
      name: "Peru",
      lawName: "Digital Signatures and Certificates Law 27,269",
      summary: "Recognized by Law 27,269 and its regulations.",
      intro:
        "In Peru electronic signatures are recognized by law and are a key tool for businesses operating remotely.",
      legalBody:
        "Law 27,269 on Digital Signatures and Certificates and its regulations govern electronic signatures in Peru. The Official Electronic Signature Infrastructure (IOFE), overseen by INDECOPI, supports certified digital signatures.",
      validity:
        "A simple electronic signature is valid for private agreements. Firmiu adds an audit trail — IP, location, device and verification — to every signature to support the signer's identity.",
      faqs: [
        {
          q: "Are electronic signatures legal in Peru?",
          a: "Yes. Law 27,269 recognizes digital signatures and certificates.",
        },
        {
          q: "What is the IOFE?",
          a: "The Official Electronic Signature Infrastructure, overseen by INDECOPI, which backs certified digital signatures in the country.",
        },
        {
          q: "Can I sign commercial contracts?",
          a: "Yes. Electronic signatures are valid for most contracts between private parties.",
        },
      ],
    },
  },
  {
    slug: "ecuador",
    flag: "🇪🇨",
    region: "latam",
    es: {
      name: "Ecuador",
      lawName: "Ley de Comercio Electrónico, Firmas y Mensajes de Datos",
      summary: "Vigente desde 2002 por la Ley de Comercio Electrónico.",
      intro:
        "Ecuador reconoce la firma electrónica desde 2002, facilitando que empresas y profesionales firmen documentos de forma remota.",
      legalBody:
        "La Ley de Comercio Electrónico, Firmas y Mensajes de Datos (2002) otorga validez a la firma electrónica y a los mensajes de datos. La ARCOTEL regula a las entidades de certificación de información.",
      validity:
        "La firma electrónica tiene los mismos efectos que la manuscrita cuando es atribuible al firmante. Firmiu documenta cada firma con IP, dispositivo, ubicación y código de verificación.",
      faqs: [
        {
          q: "¿Es legal la firma electrónica en Ecuador?",
          a: "Sí. La Ley de Comercio Electrónico la reconoce desde 2002.",
        },
        {
          q: "¿Tiene el mismo valor que una firma de puño y letra?",
          a: "Sí, cuando puede atribuirse al firmante y el documento se conserva íntegro.",
        },
        {
          q: "¿Para qué documentos sirve?",
          a: "Contratos de servicios, acuerdos comerciales, cotizaciones y documentos privados en general.",
        },
      ],
    },
    en: {
      name: "Ecuador",
      lawName: "E-Commerce, Signatures and Data Messages Law",
      summary: "In force since 2002 under the E-Commerce Law.",
      intro:
        "Ecuador has recognized electronic signatures since 2002, making it easy for companies and professionals to sign documents remotely.",
      legalBody:
        "The E-Commerce, Electronic Signatures and Data Messages Law (2002) grants validity to electronic signatures and data messages. ARCOTEL regulates information certification entities.",
      validity:
        "An electronic signature has the same effects as a handwritten one when it is attributable to the signer. Firmiu documents every signature with IP, device, location and a verification code.",
      faqs: [
        {
          q: "Are electronic signatures legal in Ecuador?",
          a: "Yes. The E-Commerce Law has recognized them since 2002.",
        },
        {
          q: "Do they carry the same weight as a handwritten signature?",
          a: "Yes, when they can be attributed to the signer and the document is kept intact.",
        },
        {
          q: "What documents are they good for?",
          a: "Service contracts, commercial agreements, quotes and private documents in general.",
        },
      ],
    },
  },
  {
    slug: "guatemala",
    flag: "🇬🇹",
    region: "latam",
    es: {
      name: "Guatemala",
      lawName: "Decreto 47-2008",
      summary: "Reconocida por el Decreto 47-2008 sobre firmas electrónicas.",
      intro:
        "En Guatemala la firma electrónica está respaldada por ley, permitiendo a negocios y profesionales firmar sin desplazamientos.",
      legalBody:
        "El Decreto 47-2008, Ley para el Reconocimiento de las Comunicaciones y Firmas Electrónicas, equipara la firma electrónica a la manuscrita. El Registro de Prestadores de Servicios de Certificación, adscrito al Ministerio de Economía, supervisa a los certificadores.",
      validity:
        "La validez depende de que la firma sea fiable y atribuible al firmante. El rastro de auditoría de Firmiu respalda cada firma con IP, ubicación, dispositivo y verificación.",
      faqs: [
        {
          q: "¿Es legal la firma electrónica en Guatemala?",
          a: "Sí. El Decreto 47-2008 la reconoce y equipara a la firma manuscrita.",
        },
        {
          q: "¿Sirve para contratos privados?",
          a: "Sí, es válida para la mayoría de acuerdos entre particulares y empresas.",
        },
        {
          q: "¿Quién supervisa a los certificadores?",
          a: "El Registro de Prestadores de Servicios de Certificación del Ministerio de Economía.",
        },
      ],
    },
    en: {
      name: "Guatemala",
      lawName: "Decree 47-2008",
      summary: "Recognized by Decree 47-2008 on electronic signatures.",
      intro:
        "In Guatemala electronic signatures are backed by law, letting businesses and professionals sign without traveling.",
      legalBody:
        "Decree 47-2008, the Law for the Recognition of Electronic Communications and Signatures, equates electronic signatures with handwritten ones. The Registry of Certification Service Providers, under the Ministry of Economy, oversees certifiers.",
      validity:
        "Validity depends on the signature being reliable and attributable to the signer. Firmiu's audit trail backs each signature with IP, location, device and verification.",
      faqs: [
        {
          q: "Are electronic signatures legal in Guatemala?",
          a: "Yes. Decree 47-2008 recognizes them and equates them with handwritten signatures.",
        },
        {
          q: "Do they work for private contracts?",
          a: "Yes, they are valid for most agreements between individuals and companies.",
        },
        {
          q: "Who oversees certifiers?",
          a: "The Registry of Certification Service Providers under the Ministry of Economy.",
        },
      ],
    },
  },
  {
    slug: "costa-rica",
    flag: "🇨🇷",
    region: "latam",
    es: {
      name: "Costa Rica",
      lawName: "Ley 8454",
      summary: "Válida desde 2005 por la Ley 8454 de firma digital.",
      intro:
        "Costa Rica cuenta con una de las legislaciones de firma digital más maduras de Centroamérica, ideal para firmar documentos de manera segura.",
      legalBody:
        "La Ley 8454 de Certificados, Firmas Digitales y Documentos Electrónicos (2005) reconoce la firma electrónica y la firma digital certificada. La Dirección de Certificadores de Firma Digital (DCFD), del MICITT, regula el sistema nacional.",
      validity:
        "La firma electrónica es válida entre privados; la firma digital certificada se exige para ciertos trámites con el Estado. Firmiu acompaña cada firma con su rastro de auditoría completo.",
      faqs: [
        {
          q: "¿Es legal la firma electrónica en Costa Rica?",
          a: "Sí. La Ley 8454 reconoce la firma electrónica y la firma digital certificada.",
        },
        {
          q: "¿Cuándo necesito firma digital certificada?",
          a: "Para ciertos trámites ante instituciones públicas; entre privados suele bastar la firma electrónica.",
        },
        {
          q: "¿Qué documentos puedo firmar?",
          a: "Contratos, acuerdos de servicios, arrendamientos y documentos comerciales en general.",
        },
      ],
    },
    en: {
      name: "Costa Rica",
      lawName: "Law 8454",
      summary: "Valid since 2005 under digital-signature Law 8454.",
      intro:
        "Costa Rica has one of the most mature digital-signature frameworks in Central America, ideal for signing documents securely.",
      legalBody:
        "Law 8454 on Certificates, Digital Signatures and Electronic Documents (2005) recognizes electronic signatures and certified digital signatures. The Digital Signature Certifiers Directorate (DCFD), under MICITT, regulates the national system.",
      validity:
        "An electronic signature is valid between private parties; a certified digital signature is required for certain government procedures. Firmiu accompanies every signature with a full audit trail.",
      faqs: [
        {
          q: "Are electronic signatures legal in Costa Rica?",
          a: "Yes. Law 8454 recognizes electronic signatures and certified digital signatures.",
        },
        {
          q: "When do I need a certified digital signature?",
          a: "For certain procedures before public institutions; between private parties an electronic signature usually suffices.",
        },
        {
          q: "What documents can I sign?",
          a: "Contracts, service agreements, leases and commercial documents in general.",
        },
      ],
    },
  },
  {
    slug: "espana",
    flag: "🇪🇸",
    region: "europe",
    es: {
      name: "España",
      lawName: "Reglamento eIDAS (UE) 910/2014 + Ley 6/2020",
      summary: "Regulada por el Reglamento europeo eIDAS y la Ley 6/2020.",
      intro:
        "En España la firma electrónica se rige por el marco europeo eIDAS, uno de los más exigentes del mundo, garantizando validez en toda la Unión Europea.",
      legalBody:
        "El Reglamento (UE) 910/2014 (eIDAS) y la Ley 6/2020 reguladora de ciertos aspectos de los servicios electrónicos de confianza establecen tres niveles: firma simple, avanzada y cualificada. Una firma electrónica no puede rechazarse como prueba solo por ser electrónica.",
      validity:
        "Para acuerdos entre particulares y empresas, la firma electrónica simple o avanzada es plenamente válida. Firmiu aporta el rastro de auditoría —IP, dispositivo, ubicación y verificación— que acredita autoría e integridad bajo eIDAS.",
      faqs: [
        {
          q: "¿Es legal la firma electrónica en España?",
          a: "Sí. El Reglamento eIDAS y la Ley 6/2020 le dan plena validez en España y en toda la UE.",
        },
        {
          q: "¿Qué diferencia hay entre firma simple, avanzada y cualificada?",
          a: "Se distinguen por el nivel de identificación y seguridad. La simple y la avanzada bastan para la mayoría de contratos privados.",
        },
        {
          q: "¿Vale en otros países de la Unión Europea?",
          a: "Sí. eIDAS garantiza el reconocimiento de la firma electrónica en todos los Estados miembros.",
        },
      ],
    },
    en: {
      name: "Spain",
      lawName: "eIDAS Regulation (EU) 910/2014 + Law 6/2020",
      summary: "Governed by the EU eIDAS Regulation and Law 6/2020.",
      intro:
        "In Spain electronic signatures follow the European eIDAS framework, one of the strictest in the world, guaranteeing validity across the whole European Union.",
      legalBody:
        "Regulation (EU) 910/2014 (eIDAS) and Law 6/2020 on trust services establish three levels: simple, advanced and qualified signatures. An electronic signature cannot be rejected as evidence solely for being electronic.",
      validity:
        "For agreements between individuals and companies, a simple or advanced electronic signature is fully valid. Firmiu provides the audit trail — IP, device, location and verification — that proves authorship and integrity under eIDAS.",
      faqs: [
        {
          q: "Are electronic signatures legal in Spain?",
          a: "Yes. The eIDAS Regulation and Law 6/2020 grant them full validity in Spain and across the EU.",
        },
        {
          q: "What's the difference between simple, advanced and qualified signatures?",
          a: "They differ in the level of identification and security. Simple and advanced are enough for most private contracts.",
        },
        {
          q: "Are they valid in other EU countries?",
          a: "Yes. eIDAS guarantees recognition of electronic signatures across all member states.",
        },
      ],
    },
  },
  {
    slug: "estados-unidos",
    flag: "🇺🇸",
    region: "north-america",
    es: {
      name: "Estados Unidos",
      lawName: "ESIGN Act + UETA",
      summary: "Válida en todo EE. UU. por la ESIGN Act y la UETA.",
      intro:
        "Para la comunidad hispana y los negocios que operan en Estados Unidos, la firma electrónica es legal en los 50 estados desde el año 2000.",
      legalBody:
        "La ley federal ESIGN Act (2000) y la ley modelo UETA, adoptada por casi todos los estados, otorgan a las firmas electrónicas el mismo efecto jurídico que a las manuscritas, siempre que las partes consientan firmar electrónicamente.",
      validity:
        "Una firma válida requiere intención de firmar, consentimiento y un registro asociado del proceso. El rastro de auditoría de Firmiu —IP, dispositivo, ubicación, marca de tiempo y verificación— cumple con esos requisitos.",
      faqs: [
        {
          q: "¿Es legal la firma electrónica en Estados Unidos?",
          a: "Sí. La ESIGN Act y la UETA la reconocen en todo el país desde el año 2000.",
        },
        {
          q: "¿Sirve para acuerdos con clientes en EE. UU.?",
          a: "Sí, para la gran mayoría de contratos comerciales y de consumo.",
        },
        {
          q: "¿Qué se necesita para que sea válida?",
          a: "Intención de firmar, consentimiento de las partes y un registro del proceso, como el rastro de auditoría que genera Firmiu.",
        },
      ],
    },
    en: {
      name: "United States",
      lawName: "ESIGN Act + UETA",
      summary: "Valid across the U.S. under the ESIGN Act and UETA.",
      intro:
        "For the Hispanic community and businesses operating in the United States, electronic signatures have been legal in all 50 states since 2000.",
      legalBody:
        "The federal ESIGN Act (2000) and the model UETA law, adopted by nearly every state, give electronic signatures the same legal effect as handwritten ones, as long as the parties consent to sign electronically.",
      validity:
        "A valid signature requires intent to sign, consent and an associated record of the process. Firmiu's audit trail — IP, device, location, timestamp and verification — meets those requirements.",
      faqs: [
        {
          q: "Are electronic signatures legal in the United States?",
          a: "Yes. The ESIGN Act and UETA have recognized them nationwide since 2000.",
        },
        {
          q: "Do they work for agreements with U.S. clients?",
          a: "Yes, for the vast majority of commercial and consumer contracts.",
        },
        {
          q: "What's required for them to be valid?",
          a: "Intent to sign, consent of the parties and a record of the process, such as the audit trail Firmiu generates.",
        },
      ],
    },
  },
  {
    slug: "bolivia",
    flag: "🇧🇴",
    region: "latam",
    es: {
      name: "Bolivia",
      lawName: "Ley 164 (2011) y Decreto Supremo 1793",
      summary: "Reconocida por la Ley 164 de 2011 y el Decreto Supremo 1793 de 2013.",
      intro:
        "En Bolivia la firma digital tiene validez jurídica y probatoria, lo que permite a empresas y profesionales firmar documentos a distancia.",
      legalBody:
        "El artículo 78 de la Ley 164 de 2011 (Ley General de Telecomunicaciones y TIC) otorga validez jurídica y probatoria a la firma digital, y el Decreto Supremo 1793 de 2013 la reglamenta. La ADSIB y la AGETIC impulsan la certificación digital, bajo supervisión de la ATT.",
      validity:
        "Para tener pleno valor, la firma debe identificar de forma única al titular y estar bajo su control exclusivo. Firmiu documenta cada firma con IP, dispositivo, ubicación y verificación, reforzando su trazabilidad.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Bolivia?", a: "Sí. La Ley 164 de 2011 y el Decreto Supremo 1793 le otorgan validez jurídica y probatoria." },
        { q: "¿Quién regula la certificación digital?", a: "La ADSIB y la AGETIC, bajo la supervisión de la ATT." },
        { q: "¿Para qué documentos sirve?", a: "Contratos de servicios, acuerdos comerciales y documentos privados en general." },
      ],
    },
    en: {
      name: "Bolivia",
      lawName: "Law 164 (2011) and Supreme Decree 1793",
      summary: "Recognized by Law 164 of 2011 and Supreme Decree 1793 of 2013.",
      intro:
        "In Bolivia digital signatures carry legal and evidentiary validity, letting companies and professionals sign documents remotely.",
      legalBody:
        "Article 78 of Law 164 of 2011 (General Telecommunications and ICT Law) grants legal and evidentiary validity to digital signatures, and Supreme Decree 1793 of 2013 regulates it. ADSIB and AGETIC drive digital certification, overseen by the ATT.",
      validity:
        "To carry full weight, the signature must uniquely identify its holder and be under their exclusive control. Firmiu documents every signature with IP, device, location and verification, reinforcing traceability.",
      faqs: [
        { q: "Are electronic signatures legal in Bolivia?", a: "Yes. Law 164 of 2011 and Supreme Decree 1793 grant them legal and evidentiary validity." },
        { q: "Who regulates digital certification?", a: "ADSIB and AGETIC, under the supervision of the ATT." },
        { q: "What documents are they good for?", a: "Service contracts, commercial agreements and private documents in general." },
      ],
    },
  },
  {
    slug: "paraguay",
    flag: "🇵🇾",
    region: "latam",
    es: {
      name: "Paraguay",
      lawName: "Ley 6822/2021 de Servicios de Confianza",
      summary: "Regulada por la Ley 6822/2021, que actualizó la anterior Ley 4017/2010.",
      intro:
        "Paraguay reconoce la validez jurídica de la firma electrónica y digital, hoy bajo una moderna ley de servicios de confianza.",
      legalBody:
        "La Ley 6822/2021 de Servicios de Confianza para las Transacciones Electrónicas, el Documento Electrónico y los Documentos Transmisibles Electrónicos reemplazó a la Ley 4017/2010 y regula la firma electrónica, la firma digital y los prestadores de servicios de confianza. El MITIC supervisa el sistema.",
      validity:
        "Los actos firmados digitalmente producen los mismos efectos que los celebrados en papel. Firmiu añade a cada firma su rastro de auditoría: IP, dispositivo, ubicación y verificación.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Paraguay?", a: "Sí. La Ley 6822/2021, que actualizó la Ley 4017/2010, le otorga validez jurídica." },
        { q: "¿Cambió la ley recientemente?", a: "Sí. En 2021 la Ley 6822 modernizó el marco de servicios de confianza electrónicos." },
        { q: "¿Sirve para contratos?", a: "Sí, para la mayoría de actos y contratos entre personas y empresas." },
      ],
    },
    en: {
      name: "Paraguay",
      lawName: "Trust Services Law 6822/2021",
      summary: "Governed by Law 6822/2021, which updated the earlier Law 4017/2010.",
      intro:
        "Paraguay recognizes the legal validity of electronic and digital signatures, now under a modern trust-services law.",
      legalBody:
        "Law 6822/2021 on Trust Services for Electronic Transactions, Electronic Documents and Electronic Transferable Documents replaced Law 4017/2010 and governs electronic signatures, digital signatures and trust service providers. MITIC oversees the system.",
      validity:
        "Acts signed digitally produce the same effects as those executed on paper. Firmiu adds an audit trail — IP, device, location and verification — to every signature.",
      faqs: [
        { q: "Are electronic signatures legal in Paraguay?", a: "Yes. Law 6822/2021, which updated Law 4017/2010, grants them legal validity." },
        { q: "Did the law change recently?", a: "Yes. In 2021 Law 6822 modernized the electronic trust-services framework." },
        { q: "Do they work for contracts?", a: "Yes, for most acts and contracts between people and companies." },
      ],
    },
  },
  {
    slug: "uruguay",
    flag: "🇺🇾",
    region: "latam",
    es: {
      name: "Uruguay",
      lawName: "Ley 18.600 (2009)",
      summary: "Válida desde 2009 por la Ley 18.600 de documento electrónico y firma electrónica.",
      intro:
        "Uruguay regula la firma electrónica desde 2009, distinguiendo la firma común de la avanzada.",
      legalBody:
        "La Ley 18.600 de 2009 reconoce la admisibilidad, validez y eficacia del documento electrónico y la firma electrónica. Distingue la firma electrónica común de la avanzada —esta última con la misma eficacia que la firma autógrafa—, bajo la Unidad de Certificación Electrónica de AGESIC.",
      validity:
        "La firma electrónica común es válida entre privados; la avanzada equivale a la firma manuscrita certificada. Firmiu respalda cada firma con su rastro de auditoría completo.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Uruguay?", a: "Sí. La Ley 18.600 la reconoce desde 2009." },
        { q: "¿Diferencia entre firma común y avanzada?", a: "La avanzada cumple requisitos técnicos adicionales y equivale a la firma autógrafa; la común es válida entre privados." },
        { q: "¿Quién regula el sistema?", a: "La Unidad de Certificación Electrónica, dependiente de AGESIC." },
      ],
    },
    en: {
      name: "Uruguay",
      lawName: "Law 18,600 (2009)",
      summary: "Valid since 2009 under Law 18,600 on electronic documents and signatures.",
      intro:
        "Uruguay has regulated electronic signatures since 2009, distinguishing ordinary from advanced signatures.",
      legalBody:
        "Law 18,600 of 2009 recognizes the admissibility, validity and effectiveness of electronic documents and signatures. It distinguishes ordinary electronic signatures from advanced ones — the latter carrying the same effect as a handwritten signature — under AGESIC's Electronic Certification Unit.",
      validity:
        "An ordinary electronic signature is valid between private parties; the advanced one is equivalent to a certified handwritten signature. Firmiu backs every signature with a full audit trail.",
      faqs: [
        { q: "Are electronic signatures legal in Uruguay?", a: "Yes. Law 18,600 has recognized them since 2009." },
        { q: "Difference between ordinary and advanced signatures?", a: "The advanced one meets additional technical requirements and equals a handwritten signature; the ordinary one is valid between private parties." },
        { q: "Who regulates the system?", a: "The Electronic Certification Unit, part of AGESIC." },
      ],
    },
  },
  {
    slug: "panama",
    flag: "🇵🇦",
    region: "latam",
    es: {
      name: "Panamá",
      lawName: "Ley 51 de 2008",
      summary: "Reconocida por la Ley 51 de 2008, modificada por la Ley 82 de 2012.",
      intro:
        "Panamá regula los documentos y firmas electrónicas desde 2008, con un marco orientado al comercio electrónico.",
      legalBody:
        "La Ley 51 de 2008 define y regula los documentos electrónicos, las firmas electrónicas y los servicios de certificación; fue modificada por la Ley 82 de 2012. La Dirección Nacional de Firma Electrónica supervisa a los prestadores de servicios de certificación.",
      validity:
        "La firma electrónica es válida para acuerdos privados y comerciales. Firmiu acompaña cada firma con IP, dispositivo, ubicación y verificación.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Panamá?", a: "Sí. La Ley 51 de 2008, modificada por la Ley 82 de 2012, la reconoce." },
        { q: "¿Quién regula la certificación?", a: "La Dirección Nacional de Firma Electrónica." },
        { q: "¿Sirve para comercio electrónico?", a: "Sí, la ley también fue diseñada para el desarrollo del comercio electrónico." },
      ],
    },
    en: {
      name: "Panama",
      lawName: "Law 51 of 2008",
      summary: "Recognized by Law 51 of 2008, amended by Law 82 of 2012.",
      intro:
        "Panama has regulated electronic documents and signatures since 2008, with a framework geared toward e-commerce.",
      legalBody:
        "Law 51 of 2008 defines and regulates electronic documents, electronic signatures and certification services; it was amended by Law 82 of 2012. The National Electronic Signature Directorate oversees certification service providers.",
      validity:
        "Electronic signatures are valid for private and commercial agreements. Firmiu accompanies every signature with IP, device, location and verification.",
      faqs: [
        { q: "Are electronic signatures legal in Panama?", a: "Yes. Law 51 of 2008, amended by Law 82 of 2012, recognizes them." },
        { q: "Who regulates certification?", a: "The National Electronic Signature Directorate." },
        { q: "Do they work for e-commerce?", a: "Yes, the law was also designed to develop electronic commerce." },
      ],
    },
  },
  {
    slug: "republica-dominicana",
    flag: "🇩🇴",
    region: "latam",
    es: {
      name: "República Dominicana",
      lawName: "Ley 126-02",
      summary: "Válida desde 2002 por la Ley 126-02 de comercio electrónico y firmas digitales.",
      intro:
        "En República Dominicana la firma digital tiene plena validez desde 2002, impulsando el comercio electrónico.",
      legalBody:
        "La Ley 126-02 sobre Comercio Electrónico, Documentos y Firmas Digitales y su reglamento (Decreto 335-03) establecen que no se negarán efectos jurídicos a un documento por estar en forma digital. El INDOTEL autoriza a las entidades de certificación.",
      validity:
        "Una firma digital segura, verificable conforme a la ley, tiene plena validez. Firmiu añade a cada firma su rastro de auditoría completo.",
      faqs: [
        { q: "¿Es legal la firma digital en República Dominicana?", a: "Sí. La Ley 126-02 le otorga validez jurídica." },
        { q: "¿Quién regula las entidades de certificación?", a: "El INDOTEL (Instituto Dominicano de las Telecomunicaciones)." },
        { q: "¿Qué documentos puedo firmar?", a: "Contratos, acuerdos comerciales y documentos privados en general." },
      ],
    },
    en: {
      name: "Dominican Republic",
      lawName: "Law 126-02",
      summary: "Valid since 2002 under Law 126-02 on e-commerce and digital signatures.",
      intro:
        "In the Dominican Republic digital signatures have been fully valid since 2002, driving electronic commerce.",
      legalBody:
        "Law 126-02 on Electronic Commerce, Documents and Digital Signatures and its regulation (Decree 335-03) establish that a document cannot be denied legal effect merely for being digital. INDOTEL authorizes certification entities.",
      validity:
        "A secure digital signature, verifiable under the law, is fully valid. Firmiu adds a complete audit trail to every signature.",
      faqs: [
        { q: "Are digital signatures legal in the Dominican Republic?", a: "Yes. Law 126-02 grants them legal validity." },
        { q: "Who regulates certification entities?", a: "INDOTEL (the Dominican Telecommunications Institute)." },
        { q: "What documents can I sign?", a: "Contracts, commercial agreements and private documents in general." },
      ],
    },
  },
  {
    slug: "nicaragua",
    flag: "🇳🇮",
    region: "latam",
    es: {
      name: "Nicaragua",
      lawName: "Ley 729 (2010)",
      summary: "Reconocida por la Ley 729 de Firma Electrónica de 2010.",
      intro:
        "Nicaragua reconoce por ley la firma electrónica, otorgándole valor legal y probatorio.",
      legalBody:
        "La Ley 729 de Firma Electrónica (2010) y su reglamento (Decreto 57-2011) otorgan a la firma electrónica certificada el mismo valor que la firma manuscrita, admisible como prueba. La DGTEC actúa como autoridad de acreditación.",
      validity:
        "La firma electrónica certificada equivale a la manuscrita; el ecosistema de prestadores acreditados aún está en desarrollo. Firmiu documenta cada firma con su rastro de auditoría.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Nicaragua?", a: "Sí. La Ley 729 de 2010 la reconoce y le da valor probatorio." },
        { q: "¿Equivale a la firma de puño y letra?", a: "La firma electrónica certificada sí, según la Ley 729." },
        { q: "¿Quién es la autoridad de acreditación?", a: "La DGTEC (Dirección General de Tecnología)." },
      ],
    },
    en: {
      name: "Nicaragua",
      lawName: "Law 729 (2010)",
      summary: "Recognized by the 2010 Electronic Signature Law 729.",
      intro:
        "Nicaragua recognizes electronic signatures by law, granting them legal and evidentiary value.",
      legalBody:
        "Electronic Signature Law 729 (2010) and its regulation (Decree 57-2011) give certified electronic signatures the same value as handwritten ones, admissible as evidence. The DGTEC acts as the accreditation authority.",
      validity:
        "A certified electronic signature equals a handwritten one; the ecosystem of accredited providers is still developing. Firmiu documents every signature with its audit trail.",
      faqs: [
        { q: "Are electronic signatures legal in Nicaragua?", a: "Yes. Law 729 of 2010 recognizes them and grants evidentiary value." },
        { q: "Are they equal to a handwritten signature?", a: "A certified electronic signature is, under Law 729." },
        { q: "Who is the accreditation authority?", a: "The DGTEC (General Directorate of Technology)." },
      ],
    },
  },
  {
    slug: "venezuela",
    flag: "🇻🇪",
    region: "latam",
    es: {
      name: "Venezuela",
      lawName: "Decreto-Ley 1.204 (2001)",
      summary: "Válida desde 2001 por el Decreto-Ley sobre Mensajes de Datos y Firmas Electrónicas.",
      intro:
        "Venezuela reconoce la firma electrónica desde 2001, equiparándola a la firma manuscrita.",
      legalBody:
        "El Decreto-Ley 1.204 sobre Mensajes de Datos y Firmas Electrónicas (2001) otorga a la firma electrónica la misma validez y eficacia probatoria que a la firma autógrafa cuando permite vincular al firmante con el mensaje. La SUSCERTE supervisa a los proveedores de servicios de certificación.",
      validity:
        "La firma debe permitir atribuir la autoría al firmante. Firmiu refuerza cada firma con IP, dispositivo, ubicación y verificación.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Venezuela?", a: "Sí. El Decreto-Ley 1.204 de 2001 la reconoce." },
        { q: "¿Quién supervisa la certificación?", a: "La SUSCERTE (Superintendencia de Servicios de Certificación Electrónica)." },
        { q: "¿Tiene valor probatorio?", a: "Sí, equivalente a la firma manuscrita cuando identifica al firmante." },
      ],
    },
    en: {
      name: "Venezuela",
      lawName: "Decree-Law 1,204 (2001)",
      summary: "Valid since 2001 under the Decree-Law on Data Messages and Electronic Signatures.",
      intro:
        "Venezuela has recognized electronic signatures since 2001, treating them as equivalent to handwritten ones.",
      legalBody:
        "Decree-Law 1,204 on Data Messages and Electronic Signatures (2001) gives electronic signatures the same validity and evidentiary effect as a handwritten signature when they link the signer to the message. SUSCERTE oversees certification service providers.",
      validity:
        "The signature must make it possible to attribute authorship to the signer. Firmiu reinforces every signature with IP, device, location and verification.",
      faqs: [
        { q: "Are electronic signatures legal in Venezuela?", a: "Yes. Decree-Law 1,204 of 2001 recognizes them." },
        { q: "Who oversees certification?", a: "SUSCERTE (the Superintendence of Electronic Certification Services)." },
        { q: "Do they have evidentiary value?", a: "Yes, equivalent to a handwritten signature when they identify the signer." },
      ],
    },
  },
  {
    slug: "el-salvador",
    flag: "🇸🇻",
    region: "latam",
    es: {
      name: "El Salvador",
      lawName: "Ley de Firma Electrónica (Decreto 133, 2015)",
      summary: "Reconocida por la Ley de Firma Electrónica de 2015.",
      intro:
        "El Salvador equipara la firma electrónica a la manuscrita desde 2015, impulsando la digitalización segura.",
      legalBody:
        "La Ley de Firma Electrónica (Decreto 133 de 2015) distingue la firma electrónica simple de la certificada. La certificada tiene la misma validez y efectos probatorios que la firma manuscrita; la simple es válida y puede constituir elemento de convicción.",
      validity:
        "Para acuerdos privados, la firma electrónica simple es válida. Firmiu acompaña cada firma con un rastro de auditoría que respalda su autoría.",
      faqs: [
        { q: "¿Es legal la firma electrónica en El Salvador?", a: "Sí. La Ley de Firma Electrónica de 2015 la reconoce." },
        { q: "¿Diferencia entre simple y certificada?", a: "La certificada equivale a la firma manuscrita en efectos probatorios; la simple es válida y sirve como elemento de convicción." },
        { q: "¿Sirve para contratos?", a: "Sí, para la mayoría de acuerdos entre privados." },
      ],
    },
    en: {
      name: "El Salvador",
      lawName: "Electronic Signature Law (Decree 133, 2015)",
      summary: "Recognized by the 2015 Electronic Signature Law.",
      intro:
        "El Salvador has equated electronic signatures with handwritten ones since 2015, driving secure digitalization.",
      legalBody:
        "The Electronic Signature Law (Decree 133 of 2015) distinguishes a simple electronic signature from a certified one. The certified signature has the same validity and evidentiary effects as a handwritten one; the simple one is valid and may serve as supporting evidence.",
      validity:
        "For private agreements, a simple electronic signature is valid. Firmiu accompanies every signature with an audit trail that backs its authorship.",
      faqs: [
        { q: "Are electronic signatures legal in El Salvador?", a: "Yes. The 2015 Electronic Signature Law recognizes them." },
        { q: "Difference between simple and certified?", a: "The certified one equals a handwritten signature for evidentiary effects; the simple one is valid and works as supporting evidence." },
        { q: "Do they work for contracts?", a: "Yes, for most agreements between private parties." },
      ],
    },
  },
  {
    slug: "honduras",
    flag: "🇭🇳",
    region: "latam",
    es: {
      name: "Honduras",
      lawName: "Ley sobre Firmas Electrónicas (Decreto 149-2013)",
      summary: "Reconocida por el Decreto 149-2013, complementada por la Ley de Comercio Electrónico (Decreto 149-2014).",
      intro:
        "Honduras otorga a la firma electrónica el mismo valor que a la manuscrita desde 2013.",
      legalBody:
        "La Ley sobre Firmas Electrónicas (Decreto 149-2013) establece que los actos y contratos firmados electrónicamente son válidos y producen los mismos efectos que los celebrados en papel. La Ley sobre Comercio Electrónico (Decreto 149-2014) complementa el marco para las transacciones electrónicas.",
      validity:
        "La firma electrónica equivale a la manuscrita para la mayoría de actos privados. Firmiu documenta cada firma con IP, dispositivo, ubicación y verificación.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Honduras?", a: "Sí. El Decreto 149-2013 le da el mismo valor que a la firma manuscrita." },
        { q: "¿Hay una ley de comercio electrónico?", a: "Sí. El Decreto 149-2014 regula las transacciones electrónicas." },
        { q: "¿Para qué documentos sirve?", a: "Contratos de servicios, acuerdos comerciales y documentos privados." },
      ],
    },
    en: {
      name: "Honduras",
      lawName: "Electronic Signatures Law (Decree 149-2013)",
      summary: "Recognized by Decree 149-2013, complemented by the E-Commerce Law (Decree 149-2014).",
      intro:
        "Honduras has given electronic signatures the same value as handwritten ones since 2013.",
      legalBody:
        "The Electronic Signatures Law (Decree 149-2013) establishes that acts and contracts signed electronically are valid and produce the same effects as those executed on paper. The E-Commerce Law (Decree 149-2014) complements the framework for electronic transactions.",
      validity:
        "An electronic signature is equivalent to a handwritten one for most private acts. Firmiu documents every signature with IP, device, location and verification.",
      faqs: [
        { q: "Are electronic signatures legal in Honduras?", a: "Yes. Decree 149-2013 gives them the same value as a handwritten signature." },
        { q: "Is there an e-commerce law?", a: "Yes. Decree 149-2014 regulates electronic transactions." },
        { q: "What documents are they good for?", a: "Service contracts, commercial agreements and private documents." },
      ],
    },
  },
  {
    slug: "puerto-rico",
    flag: "🇵🇷",
    region: "north-america",
    es: {
      name: "Puerto Rico",
      lawName: "Ley 148-2006 + UETA + ESIGN Act",
      summary: "Válida por la Ley 148-2006, la UETA y la ESIGN Act federal.",
      intro:
        "En Puerto Rico la firma electrónica es legal bajo su propia Ley de Transacciones Electrónicas y el marco federal de EE. UU.",
      legalBody:
        "La Ley 148-2006, Ley de Transacciones Electrónicas, regula las transacciones y firmas electrónicas en Puerto Rico, alineada con la UETA. Además, por ser territorio de EE. UU., aplica la ley federal ESIGN Act. El PRITS coordina su uso en el gobierno.",
      validity:
        "Una firma válida requiere intención de firmar, consentimiento y un registro del proceso. El rastro de auditoría de Firmiu —IP, dispositivo, ubicación, marca de tiempo y verificación— cumple esos requisitos.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Puerto Rico?", a: "Sí. Por la Ley 148-2006, la UETA y la ESIGN Act federal." },
        { q: "¿Aplica la ley federal de EE. UU.?", a: "Sí. Al ser territorio estadounidense, aplica la ESIGN Act." },
        { q: "¿Sirve para acuerdos comerciales?", a: "Sí, para la gran mayoría de contratos comerciales y de consumo." },
      ],
    },
    en: {
      name: "Puerto Rico",
      lawName: "Act 148-2006 + UETA + ESIGN Act",
      summary: "Valid under Act 148-2006, UETA and the federal ESIGN Act.",
      intro:
        "In Puerto Rico electronic signatures are legal under its own Electronic Transactions Act and the US federal framework.",
      legalBody:
        "Act 148-2006, the Electronic Transactions Act, regulates electronic transactions and signatures in Puerto Rico, aligned with UETA. In addition, as a US territory, the federal ESIGN Act applies. PRITS coordinates their use in government.",
      validity:
        "A valid signature requires intent to sign, consent and a record of the process. Firmiu's audit trail — IP, device, location, timestamp and verification — meets those requirements.",
      faqs: [
        { q: "Are electronic signatures legal in Puerto Rico?", a: "Yes. Under Act 148-2006, UETA and the federal ESIGN Act." },
        { q: "Does US federal law apply?", a: "Yes. As a US territory, the ESIGN Act applies." },
        { q: "Do they work for commercial agreements?", a: "Yes, for the vast majority of commercial and consumer contracts." },
      ],
    },
  },
  {
    slug: "cuba",
    flag: "🇨🇺",
    region: "latam",
    es: {
      name: "Cuba",
      lawName: "Decreto-Ley 370/2018 y Resolución 23/2022",
      summary: "Reconocida por el Decreto-Ley 370/2018 y regulada por la Resolución 23/2022.",
      intro:
        "En Cuba los documentos en formato digital firmados electrónicamente tienen validez oficial, dentro del proceso de informatización de la sociedad.",
      legalBody:
        "El Decreto-Ley 370/2018, sobre la informatización de la sociedad, reconoce en su artículo 31 la validez de los documentos digitales firmados electrónicamente. La Resolución 23/2022 del Ministerio del Interior regula los servicios de firma digital, apoyados en la Infraestructura Nacional de Llave Pública (INLP).",
      validity:
        "La firma se sustenta en certificados emitidos por prestadores autorizados. Firmiu documenta cada firma con IP, dispositivo, ubicación y verificación, reforzando su trazabilidad.",
      faqs: [
        { q: "¿Es legal la firma digital en Cuba?", a: "Sí. El Decreto-Ley 370/2018 reconoce la validez de los documentos firmados electrónicamente." },
        { q: "¿Qué norma regula los servicios de firma?", a: "La Resolución 23/2022 del Ministerio del Interior." },
        { q: "¿Para qué documentos sirve?", a: "Documentos digitales y trámites dentro del marco de informatización del país." },
      ],
    },
    en: {
      name: "Cuba",
      lawName: "Decree-Law 370/2018 and Resolution 23/2022",
      summary: "Recognized by Decree-Law 370/2018 and regulated by Resolution 23/2022.",
      intro:
        "In Cuba, electronically signed digital documents have official validity, within the country's society-informatization process.",
      legalBody:
        "Decree-Law 370/2018 on the informatization of society recognizes, in article 31, the validity of digital documents signed electronically. Resolution 23/2022 of the Ministry of the Interior regulates digital signature services, supported by the National Public Key Infrastructure (INLP).",
      validity:
        "The signature relies on certificates issued by authorized providers. Firmiu documents every signature with IP, device, location and verification, reinforcing traceability.",
      faqs: [
        { q: "Are digital signatures legal in Cuba?", a: "Yes. Decree-Law 370/2018 recognizes the validity of electronically signed documents." },
        { q: "Which rule governs signature services?", a: "Resolution 23/2022 of the Ministry of the Interior." },
        { q: "What documents are they good for?", a: "Digital documents and procedures within the country's informatization framework." },
      ],
    },
  },
  {
    slug: "guinea-ecuatorial",
    flag: "🇬🇶",
    region: "africa",
    es: {
      name: "Guinea Ecuatorial",
      lawName: "Ley Núm. 2/2017 sobre firma electrónica",
      summary: "Reconocida por la Ley 2/2017 sobre firma electrónica y documentos electrónicos.",
      intro:
        "Guinea Ecuatorial, el único país de habla hispana en África, regula la firma electrónica desde la Ley 2/2017.",
      legalBody:
        "La Ley Núm. 2/2017, de 10 de enero, sobre firma electrónica y documentos electrónicos reconoce la firma electrónica avanzada y la reconocida (basada en un certificado reconocido y un dispositivo seguro de creación de firma), esta última con el mismo valor que la firma manuscrita. También regula a los prestadores de servicios de certificación.",
      validity:
        "La firma reconocida equivale a la manuscrita; la avanzada identifica al firmante y detecta alteraciones del documento. Firmiu acompaña cada firma con su rastro de auditoría.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Guinea Ecuatorial?", a: "Sí. La Ley 2/2017 la reconoce y regula." },
        { q: "¿Equivale a la firma manuscrita?", a: "La firma electrónica reconocida sí, según la Ley 2/2017." },
        { q: "¿Para qué documentos sirve?", a: "Contratos y documentos privados; ciertos trámites pueden requerir firma reconocida." },
      ],
    },
    en: {
      name: "Equatorial Guinea",
      lawName: "Law No. 2/2017 on electronic signatures",
      summary: "Recognized by Law 2/2017 on electronic signatures and documents.",
      intro:
        "Equatorial Guinea, the only Spanish-speaking country in Africa, has regulated electronic signatures since Law 2/2017.",
      legalBody:
        "Law No. 2/2017 of January 10 on electronic signatures and documents recognizes the advanced electronic signature and the recognized one (based on a recognized certificate and a secure signature-creation device), the latter carrying the same value as a handwritten signature. It also regulates certification service providers.",
      validity:
        "The recognized signature equals a handwritten one; the advanced one identifies the signer and detects document alterations. Firmiu accompanies every signature with its audit trail.",
      faqs: [
        { q: "Are electronic signatures legal in Equatorial Guinea?", a: "Yes. Law 2/2017 recognizes and regulates them." },
        { q: "Are they equal to a handwritten signature?", a: "A recognized electronic signature is, under Law 2/2017." },
        { q: "What documents are they good for?", a: "Contracts and private documents; certain procedures may require a recognized signature." },
      ],
    },
  },
  {
    slug: "brasil",
    flag: "🇧🇷",
    region: "latam",
    es: {
      name: "Brasil",
      lawName: "MP 2.200-2/2001 (ICP-Brasil) y Ley 14.063/2020",
      summary: "Válida desde 2001 por la MP 2.200-2 (ICP-Brasil) y la Ley 14.063/2020.",
      intro: "En Brasil la firma electrónica tiene validez jurídica desde 2001 y es de uso cotidiano para contratos y acuerdos comerciales.",
      legalBody: "La Medida Provisional 2.200-2/2001 creó la ICP-Brasil y reconoció la validez de las firmas electrónicas, y la Ley 14.063/2020 define la firma simple, avanzada y cualificada. Una firma conforme al Código Civil y a la MP 2.200-2 tiene el mismo efecto que la manuscrita.",
      validity: "La firma simple es válida entre privados; la cualificada (con certificado ICP-Brasil) goza de presunción de autenticidad. Firmiu añade a cada firma su rastro de auditoría: IP, dispositivo, ubicación y verificación.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Brasil?", a: "Sí. La MP 2.200-2/2001 y la Ley 14.063/2020 le otorgan validez jurídica." },
        { q: "¿Qué es la ICP-Brasil?", a: "La infraestructura de claves públicas que respalda las firmas cualificadas con presunción de autenticidad." },
        { q: "¿Sirve para contratos privados?", a: "Sí, la firma simple es válida para la mayoría de acuerdos entre privados." },
      ],
    },
    en: {
      name: "Brazil",
      lawName: "MP 2.200-2/2001 (ICP-Brasil) and Law 14,063/2020",
      summary: "Valid since 2001 under MP 2.200-2 (ICP-Brasil) and Law 14,063/2020.",
      intro: "In Brazil electronic signatures have had legal validity since 2001 and are widely used for contracts and commercial agreements.",
      legalBody: "Provisional Measure 2.200-2/2001 created ICP-Brasil and recognized the validity of electronic signatures, and Law 14,063/2020 defines simple, advanced and qualified signatures. A signature compliant with the Civil Code and MP 2.200-2 has the same effect as a handwritten one.",
      validity: "A simple signature is valid between private parties; the qualified one (with an ICP-Brasil certificate) enjoys a presumption of authenticity. Firmiu adds an audit trail to every signature: IP, device, location and verification.",
      faqs: [
        { q: "Are electronic signatures legal in Brazil?", a: "Yes. MP 2.200-2/2001 and Law 14,063/2020 grant them legal validity." },
        { q: "What is ICP-Brasil?", a: "The public-key infrastructure that backs qualified signatures with a presumption of authenticity." },
        { q: "Do they work for private contracts?", a: "Yes, the simple signature is valid for most agreements between private parties." },
      ],
    },
  },
  {
    slug: "canada",
    flag: "🇨🇦",
    region: "north-america",
    es: {
      name: "Canadá",
      lawName: "PIPEDA y la ley uniforme UECA",
      summary: "Reconocida desde 1999 por la UECA y la ley federal PIPEDA.",
      intro: "En Canadá la firma electrónica es válida desde 1999, tanto a nivel federal como provincial.",
      legalBody: "La ley federal PIPEDA y la Ley Uniforme de Comercio Electrónico (UECA), adoptada por casi todas las provincias desde 1999, reconocen la validez de la firma electrónica. Quebec cuenta con su propia ley (Ley sobre el marco jurídico de las tecnologías de la información).",
      validity: "El derecho de contratos es provincial; si una norma no exige un método concreto, la firma electrónica es válida y exigible. Firmiu documenta cada firma con IP, dispositivo, ubicación y verificación.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Canadá?", a: "Sí. La UECA (desde 1999) y la PIPEDA la reconocen en todo el país." },
        { q: "¿Aplica igual en todas las provincias?", a: "Casi todas siguen la UECA; Quebec tiene su propia ley equivalente." },
        { q: "¿Sirve para contratos comerciales?", a: "Sí, para la mayoría de acuerdos privados entre empresas y particulares." },
      ],
    },
    en: {
      name: "Canada",
      lawName: "PIPEDA and the uniform UECA",
      summary: "Recognized since 1999 by UECA and the federal PIPEDA.",
      intro: "In Canada electronic signatures have been valid since 1999, both federally and provincially.",
      legalBody: "The federal PIPEDA and the Uniform Electronic Commerce Act (UECA), adopted by nearly all provinces since 1999, recognize the validity of electronic signatures. Quebec has its own law (Act to Establish a Legal Framework for Information Technology).",
      validity: "Contract law is provincial; if a rule doesn't require a specific method, electronic signatures are valid and enforceable. Firmiu documents every signature with IP, device, location and verification.",
      faqs: [
        { q: "Are electronic signatures legal in Canada?", a: "Yes. UECA (since 1999) and PIPEDA recognize them nationwide." },
        { q: "Does it apply the same in all provinces?", a: "Almost all follow UECA; Quebec has its own equivalent law." },
        { q: "Do they work for commercial contracts?", a: "Yes, for most private agreements between companies and individuals." },
      ],
    },
  },
  {
    slug: "reino-unido",
    flag: "🇬🇧",
    region: "europe",
    es: {
      name: "Reino Unido",
      lawName: "Electronic Communications Act 2000 y UK eIDAS",
      summary: "Válida por la Electronic Communications Act 2000 y el eIDAS británico.",
      intro: "En el Reino Unido la firma electrónica es jurídicamente vinculante y de uso habitual en contratos comerciales.",
      legalBody: "La Electronic Communications Act 2000 y el Reglamento eIDAS retenido tras el Brexit (UK eIDAS) regulan la firma electrónica, con tres niveles: simple, avanzada y cualificada. Una firma es vinculante cuando hay clara intención de firmar.",
      validity: "Para la mayoría de acuerdos privados basta la firma electrónica simple o avanzada; la cualificada equivale a la manuscrita. Firmiu aporta el rastro de auditoría que acredita identidad e integridad.",
      faqs: [
        { q: "¿Es legal la firma electrónica en el Reino Unido?", a: "Sí. La Electronic Communications Act 2000 y el UK eIDAS le dan plena validez." },
        { q: "¿Cambió algo tras el Brexit?", a: "No en lo esencial: el Reino Unido mantuvo el marco eIDAS como UK eIDAS." },
        { q: "¿Sirve para contratos comerciales?", a: "Sí, es de uso habitual en contratos y acuerdos privados." },
      ],
    },
    en: {
      name: "United Kingdom",
      lawName: "Electronic Communications Act 2000 and UK eIDAS",
      summary: "Valid under the Electronic Communications Act 2000 and UK eIDAS.",
      intro: "In the United Kingdom electronic signatures are legally binding and widely used in commercial contracts.",
      legalBody: "The Electronic Communications Act 2000 and the eIDAS Regulation retained after Brexit (UK eIDAS) govern electronic signatures, with three levels: simple, advanced and qualified. A signature is binding when there is clear intent to sign.",
      validity: "For most private agreements a simple or advanced electronic signature is enough; the qualified one is equivalent to a handwritten signature. Firmiu provides the audit trail that proves identity and integrity.",
      faqs: [
        { q: "Are electronic signatures legal in the UK?", a: "Yes. The Electronic Communications Act 2000 and UK eIDAS grant them full validity." },
        { q: "Did anything change after Brexit?", a: "Not in essence: the UK retained the eIDAS framework as UK eIDAS." },
        { q: "Do they work for commercial contracts?", a: "Yes, they are widely used in private contracts and agreements." },
      ],
    },
  },
  {
    slug: "irlanda",
    flag: "🇮🇪",
    region: "europe",
    es: {
      name: "Irlanda",
      lawName: "Electronic Commerce Act 2000 y eIDAS",
      summary: "Reconocida por la Electronic Commerce Act 2000 y el Reglamento eIDAS.",
      intro: "Irlanda reconoce la firma electrónica desde 2000, hoy dentro del marco europeo eIDAS.",
      legalBody: "La Electronic Commerce Act 2000 y el Reglamento (UE) 910/2014 (eIDAS) regulan la firma electrónica. La sección 9 de la ley de 2000 establece que un documento no puede negarse efecto jurídico solo por estar en forma electrónica.",
      validity: "Para acuerdos privados, la firma electrónica simple o avanzada es plenamente válida; la cualificada equivale a la manuscrita. Firmiu acompaña cada firma con su rastro de auditoría.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Irlanda?", a: "Sí. La Electronic Commerce Act 2000 y eIDAS le dan plena validez." },
        { q: "¿Vale en toda la UE?", a: "Sí. eIDAS garantiza el reconocimiento de la firma en todos los Estados miembros." },
        { q: "¿Hay excepciones?", a: "Algunos actos como los testamentos quedan excluidos de la firma electrónica." },
      ],
    },
    en: {
      name: "Ireland",
      lawName: "Electronic Commerce Act 2000 and eIDAS",
      summary: "Recognized by the Electronic Commerce Act 2000 and the eIDAS Regulation.",
      intro: "Ireland has recognized electronic signatures since 2000, now within the European eIDAS framework.",
      legalBody: "The Electronic Commerce Act 2000 and Regulation (EU) 910/2014 (eIDAS) govern electronic signatures. Section 9 of the 2000 Act establishes that a document cannot be denied legal effect merely for being in electronic form.",
      validity: "For private agreements, a simple or advanced electronic signature is fully valid; the qualified one equals a handwritten signature. Firmiu accompanies every signature with its audit trail.",
      faqs: [
        { q: "Are electronic signatures legal in Ireland?", a: "Yes. The Electronic Commerce Act 2000 and eIDAS grant them full validity." },
        { q: "Are they valid across the EU?", a: "Yes. eIDAS guarantees recognition of the signature in all member states." },
        { q: "Are there exceptions?", a: "Some acts such as wills are excluded from electronic signing." },
      ],
    },
  },
  {
    slug: "francia",
    flag: "🇫🇷",
    region: "europe",
    es: {
      name: "Francia",
      lawName: "eIDAS y el Código Civil (arts. 1366-1367)",
      summary: "Regulada por el Reglamento eIDAS y los artículos 1366-1367 del Código Civil.",
      intro: "En Francia la firma electrónica tiene el mismo valor que la manuscrita cuando se basa en un proceso fiable.",
      legalBody: "El Reglamento eIDAS (UE) 910/2014 y los artículos 1366 y 1367 del Código Civil regulan la firma electrónica. El artículo 1366 equipara el documento electrónico al papel cuando se identifica al firmante y se garantiza su integridad.",
      validity: "La fiabilidad se presume automáticamente para la firma cualificada; para la simple y la avanzada, el juez la valora según las pruebas. Firmiu aporta el rastro de auditoría que respalda autoría e integridad.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Francia?", a: "Sí. eIDAS y los artículos 1366-1367 del Código Civil le dan plena validez." },
        { q: "¿Tiene el mismo valor que la firma a mano?", a: "Sí, cuando se basa en un proceso fiable que identifica al firmante." },
        { q: "¿Sirve en toda la UE?", a: "Sí, eIDAS garantiza su reconocimiento en todos los Estados miembros." },
      ],
    },
    en: {
      name: "France",
      lawName: "eIDAS and the Civil Code (arts. 1366-1367)",
      summary: "Governed by the eIDAS Regulation and Civil Code articles 1366-1367.",
      intro: "In France electronic signatures carry the same value as handwritten ones when based on a reliable process.",
      legalBody: "The eIDAS Regulation (EU) 910/2014 and articles 1366 and 1367 of the Civil Code govern electronic signatures. Article 1366 equates the electronic document with paper when the signer is identified and integrity is guaranteed.",
      validity: "Reliability is presumed automatically for the qualified signature; for simple and advanced ones, the judge assesses it based on evidence. Firmiu provides the audit trail that backs authorship and integrity.",
      faqs: [
        { q: "Are electronic signatures legal in France?", a: "Yes. eIDAS and Civil Code articles 1366-1367 grant them full validity." },
        { q: "Do they carry the same value as a handwritten signature?", a: "Yes, when based on a reliable process that identifies the signer." },
        { q: "Do they work across the EU?", a: "Yes, eIDAS guarantees recognition in all member states." },
      ],
    },
  },
  {
    slug: "alemania",
    flag: "🇩🇪",
    region: "europe",
    es: {
      name: "Alemania",
      lawName: "eIDAS y la Ley de Servicios de Confianza (VDG)",
      summary: "Regulada por eIDAS y la Vertrauensdienstegesetz (VDG) de 2017.",
      intro: "En Alemania la firma electrónica es legalmente válida bajo el marco europeo eIDAS y la ley nacional de servicios de confianza.",
      legalBody: "El Reglamento eIDAS (UE) 910/2014 y la Ley de Servicios de Confianza (VDG, 2017) regulan la firma electrónica, con tres niveles: simple, avanzada y cualificada. La Agencia Federal de Redes (BNetzA) es la autoridad supervisora.",
      validity: "Para sustituir la forma escrita exigida por ley se requiere firma cualificada; para la mayoría de acuerdos privados basta la simple o avanzada. Firmiu acompaña cada firma con su rastro de auditoría.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Alemania?", a: "Sí. eIDAS y la VDG de 2017 le dan plena validez." },
        { q: "¿Cuándo necesito firma cualificada?", a: "Cuando la ley exige forma escrita; para la mayoría de contratos privados no es necesaria." },
        { q: "¿Quién supervisa el sistema?", a: "La Agencia Federal de Redes (Bundesnetzagentur, BNetzA)." },
      ],
    },
    en: {
      name: "Germany",
      lawName: "eIDAS and the Trust Services Act (VDG)",
      summary: "Governed by eIDAS and the Vertrauensdienstegesetz (VDG) of 2017.",
      intro: "In Germany electronic signatures are legally valid under the European eIDAS framework and the national trust-services act.",
      legalBody: "The eIDAS Regulation (EU) 910/2014 and the Trust Services Act (VDG, 2017) govern electronic signatures, with three levels: simple, advanced and qualified. The Federal Network Agency (BNetzA) is the supervisory authority.",
      validity: "To replace the written form required by law a qualified signature is needed; for most private agreements a simple or advanced one is enough. Firmiu accompanies every signature with its audit trail.",
      faqs: [
        { q: "Are electronic signatures legal in Germany?", a: "Yes. eIDAS and the 2017 VDG grant them full validity." },
        { q: "When do I need a qualified signature?", a: "When the law requires written form; for most private contracts it isn't necessary." },
        { q: "Who supervises the system?", a: "The Federal Network Agency (Bundesnetzagentur, BNetzA)." },
      ],
    },
  },
  {
    slug: "italia",
    flag: "🇮🇹",
    region: "europe",
    es: {
      name: "Italia",
      lawName: "eIDAS y el Código de la Administración Digital (CAD)",
      summary: "Regulada por eIDAS, el CAD y el artículo 2702 del Código Civil.",
      intro: "En Italia la firma electrónica es válida bajo eIDAS y el Código de la Administración Digital.",
      legalBody: "El Reglamento eIDAS (UE) 910/2014 y el Código de la Administración Digital (CAD) regulan la firma electrónica, con sus tres niveles. El artículo 2702 del Código Civil reconoce el valor de los documentos electrónicos que aseguran identidad e integridad.",
      validity: "Para acuerdos privados, la firma simple o avanzada es válida; la cualificada equivale a la manuscrita. Firmiu añade a cada firma su rastro de auditoría completo.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Italia?", a: "Sí. eIDAS y el CAD le dan plena validez." },
        { q: "¿Qué es la firma digital italiana?", a: "Una firma cualificada conforme al CAD, con el mismo valor que una QES de eIDAS." },
        { q: "¿Sirve en toda la UE?", a: "Sí, eIDAS garantiza su reconocimiento en todos los Estados miembros." },
      ],
    },
    en: {
      name: "Italy",
      lawName: "eIDAS and the Digital Administration Code (CAD)",
      summary: "Governed by eIDAS, the CAD and Civil Code article 2702.",
      intro: "In Italy electronic signatures are valid under eIDAS and the Digital Administration Code.",
      legalBody: "The eIDAS Regulation (EU) 910/2014 and the Digital Administration Code (CAD) govern electronic signatures, with their three levels. Article 2702 of the Civil Code recognizes the value of electronic documents that ensure identity and integrity.",
      validity: "For private agreements, a simple or advanced signature is valid; the qualified one equals a handwritten signature. Firmiu adds a full audit trail to every signature.",
      faqs: [
        { q: "Are electronic signatures legal in Italy?", a: "Yes. eIDAS and the CAD grant them full validity." },
        { q: "What is the Italian digital signature?", a: "A qualified signature under the CAD, with the same value as an eIDAS QES." },
        { q: "Do they work across the EU?", a: "Yes, eIDAS guarantees recognition in all member states." },
      ],
    },
  },
  {
    slug: "portugal",
    flag: "🇵🇹",
    region: "europe",
    es: {
      name: "Portugal",
      lawName: "eIDAS y el Decreto-Ley 12/2021",
      summary: "Regulada por eIDAS y el Decreto-Lei 12/2021.",
      intro: "Portugal aplica el marco europeo eIDAS, consolidado por el Decreto-Ley 12/2021.",
      legalBody: "El Reglamento eIDAS (UE) 910/2014 y el Decreto-Lei 12/2021 regulan la firma electrónica. La firma cualificada tiene un valor probatorio equivalente al de un documento con firma reconocida por notario, conforme al artículo 376 del Código Civil.",
      validity: "Para la mayoría de acuerdos privados basta la firma simple o avanzada; la cualificada otorga el máximo valor probatorio. Firmiu acompaña cada firma con su rastro de auditoría.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Portugal?", a: "Sí. eIDAS y el Decreto-Lei 12/2021 le dan plena validez." },
        { q: "¿La firma cualificada vale como ante notario?", a: "En términos probatorios, equivale a una firma reconocida por notario (art. 376 del Código Civil)." },
        { q: "¿Sirve en toda la UE?", a: "Sí, eIDAS garantiza su reconocimiento en todos los Estados miembros." },
      ],
    },
    en: {
      name: "Portugal",
      lawName: "eIDAS and Decree-Law 12/2021",
      summary: "Governed by eIDAS and Decree-Law 12/2021.",
      intro: "Portugal applies the European eIDAS framework, consolidated by Decree-Law 12/2021.",
      legalBody: "The eIDAS Regulation (EU) 910/2014 and Decree-Law 12/2021 govern electronic signatures. The qualified signature has evidentiary value equivalent to a document with a notary-recognized signature, under article 376 of the Civil Code.",
      validity: "For most private agreements a simple or advanced signature is enough; the qualified one grants maximum evidentiary value. Firmiu accompanies every signature with its audit trail.",
      faqs: [
        { q: "Are electronic signatures legal in Portugal?", a: "Yes. eIDAS and Decree-Law 12/2021 grant them full validity." },
        { q: "Does the qualified signature count like before a notary?", a: "In evidentiary terms, it equals a notary-recognized signature (Civil Code art. 376)." },
        { q: "Do they work across the EU?", a: "Yes, eIDAS guarantees recognition in all member states." },
      ],
    },
  },
  {
    slug: "paises-bajos",
    flag: "🇳🇱",
    region: "europe",
    es: {
      name: "Países Bajos",
      lawName: "eIDAS y el Código Civil (art. 3:15a)",
      summary: "Regulada por eIDAS y el artículo 3:15a del Código Civil neerlandés.",
      intro: "En los Países Bajos la firma electrónica tiene los mismos efectos que la manuscrita cuando el método es suficientemente fiable.",
      legalBody: "El Reglamento eIDAS (UE) 910/2014 está implementado en el artículo 3:15a del Código Civil, que reconoce a la firma electrónica los mismos efectos que a la manuscrita si el método es suficientemente fiable según las circunstancias.",
      validity: "Para acuerdos privados, la firma simple o avanzada es válida; la cualificada constituye prueba vinculante. Firmiu aporta el rastro de auditoría que respalda cada firma.",
      faqs: [
        { q: "¿Es legal la firma electrónica en los Países Bajos?", a: "Sí. eIDAS y el artículo 3:15a del Código Civil le dan plena validez." },
        { q: "¿Cuándo es vinculante como prueba?", a: "La firma cualificada normalmente constituye prueba vinculante en juicio." },
        { q: "¿Sirve en toda la UE?", a: "Sí, eIDAS garantiza su reconocimiento en todos los Estados miembros." },
      ],
    },
    en: {
      name: "Netherlands",
      lawName: "eIDAS and the Civil Code (art. 3:15a)",
      summary: "Governed by eIDAS and article 3:15a of the Dutch Civil Code.",
      intro: "In the Netherlands electronic signatures have the same effects as handwritten ones when the method is sufficiently reliable.",
      legalBody: "The eIDAS Regulation (EU) 910/2014 is implemented in article 3:15a of the Civil Code, which gives electronic signatures the same effects as handwritten ones if the method is sufficiently reliable in the circumstances.",
      validity: "For private agreements, a simple or advanced signature is valid; the qualified one constitutes binding evidence. Firmiu provides the audit trail that backs every signature.",
      faqs: [
        { q: "Are electronic signatures legal in the Netherlands?", a: "Yes. eIDAS and Civil Code article 3:15a grant them full validity." },
        { q: "When is it binding as evidence?", a: "The qualified signature normally constitutes binding evidence in court." },
        { q: "Do they work across the EU?", a: "Yes, eIDAS guarantees recognition in all member states." },
      ],
    },
  },
  {
    slug: "belgica",
    flag: "🇧🇪",
    region: "europe",
    es: {
      name: "Bélgica",
      lawName: "Reglamento eIDAS (UE) 910/2014",
      summary: "Regulada por el Reglamento europeo eIDAS, de aplicación directa.",
      intro: "En Bélgica la firma electrónica se rige por el Reglamento europeo eIDAS, de aplicación directa, complementado por la legislación nacional.",
      legalBody: "El Reglamento (UE) 910/2014 (eIDAS) es directamente aplicable en Bélgica y define los tres niveles de firma: simple, avanzada y cualificada. Una firma electrónica no puede rechazarse como prueba solo por ser electrónica.",
      validity: "Para la mayoría de acuerdos privados basta la firma simple o avanzada; la cualificada equivale a la manuscrita en toda la UE. Firmiu acompaña cada firma con su rastro de auditoría.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Bélgica?", a: "Sí. El Reglamento eIDAS le da plena validez en Bélgica y en toda la UE." },
        { q: "¿Qué niveles de firma existen?", a: "Simple, avanzada y cualificada; esta última equivale a la firma manuscrita." },
        { q: "¿Sirve en otros países de la UE?", a: "Sí, eIDAS garantiza su reconocimiento en todos los Estados miembros." },
      ],
    },
    en: {
      name: "Belgium",
      lawName: "eIDAS Regulation (EU) 910/2014",
      summary: "Governed by the directly applicable European eIDAS Regulation.",
      intro: "In Belgium electronic signatures are governed by the directly applicable European eIDAS Regulation, complemented by national legislation.",
      legalBody: "Regulation (EU) 910/2014 (eIDAS) is directly applicable in Belgium and defines the three signature levels: simple, advanced and qualified. An electronic signature cannot be rejected as evidence solely for being electronic.",
      validity: "For most private agreements a simple or advanced signature is enough; the qualified one equals a handwritten signature across the EU. Firmiu accompanies every signature with its audit trail.",
      faqs: [
        { q: "Are electronic signatures legal in Belgium?", a: "Yes. The eIDAS Regulation grants them full validity in Belgium and across the EU." },
        { q: "What signature levels exist?", a: "Simple, advanced and qualified; the latter equals a handwritten signature." },
        { q: "Do they work in other EU countries?", a: "Yes, eIDAS guarantees recognition in all member states." },
      ],
    },
  },
  {
    slug: "polonia",
    flag: "🇵🇱",
    region: "europe",
    es: {
      name: "Polonia",
      lawName: "eIDAS y la Ley de Servicios de Confianza (2016)",
      summary: "Regulada por eIDAS y la Ley de Servicios de Confianza e Identificación Electrónica de 2016.",
      intro: "Polonia aplica el marco europeo eIDAS, implementado por su Ley de Servicios de Confianza de 2016.",
      legalBody: "El Reglamento eIDAS (UE) 910/2014 garantiza el efecto jurídico de la firma electrónica, y la Ley de Servicios de Confianza e Identificación Electrónica de 2016 lo implementa en Polonia, regulando a los prestadores cualificados.",
      validity: "La firma cualificada equivale a la manuscrita en Polonia y en toda la UE; para muchos acuerdos privados basta la simple o avanzada. Firmiu añade a cada firma su rastro de auditoría.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Polonia?", a: "Sí. eIDAS y la Ley de Servicios de Confianza de 2016 le dan validez." },
        { q: "¿Qué firma equivale a la manuscrita?", a: "La firma electrónica cualificada, reconocida en toda la UE." },
        { q: "¿Sirve en otros países de la UE?", a: "Sí, eIDAS garantiza su reconocimiento entre Estados miembros." },
      ],
    },
    en: {
      name: "Poland",
      lawName: "eIDAS and the Trust Services Act (2016)",
      summary: "Governed by eIDAS and the 2016 Act on Trust Services and Electronic Identification.",
      intro: "Poland applies the European eIDAS framework, implemented by its 2016 Trust Services Act.",
      legalBody: "The eIDAS Regulation (EU) 910/2014 guarantees the legal effect of electronic signatures, and the 2016 Act on Trust Services and Electronic Identification implements it in Poland, regulating qualified providers.",
      validity: "The qualified signature equals a handwritten one in Poland and across the EU; for many private agreements a simple or advanced one is enough. Firmiu adds an audit trail to every signature.",
      faqs: [
        { q: "Are electronic signatures legal in Poland?", a: "Yes. eIDAS and the 2016 Trust Services Act grant them validity." },
        { q: "Which signature equals a handwritten one?", a: "The qualified electronic signature, recognized across the EU." },
        { q: "Do they work in other EU countries?", a: "Yes, eIDAS guarantees recognition between member states." },
      ],
    },
  },
  {
    slug: "suiza",
    flag: "🇨🇭",
    region: "europe",
    es: {
      name: "Suiza",
      lawName: "Ley Federal de Firma Electrónica (ZertES)",
      summary: "Regulada por la Ley Federal de Firma Electrónica (ZertES), vigente desde 2005.",
      intro: "En Suiza la firma electrónica está regulada por la ZertES, que reconoce varios niveles de firma.",
      legalBody: "La Ley Federal de Firma Electrónica (ZertES) reconoce cuatro tipos de firma: simple, avanzada, regulada y cualificada. Solo la firma cualificada, con un certificado de un prestador reconocido y un sello de tiempo, equivale legalmente a la manuscrita.",
      validity: "Para acuerdos privados suele bastar la firma simple o avanzada; cuando la ley exige forma escrita se requiere la cualificada. Firmiu acompaña cada firma con su rastro de auditoría.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Suiza?", a: "Sí. La ZertES la regula desde su entrada en vigor." },
        { q: "¿Qué firma equivale a la manuscrita?", a: "La firma cualificada (QES) con sello de tiempo, según la ZertES." },
        { q: "¿Sirve para contratos privados?", a: "Sí, para la mayoría de acuerdos entre privados." },
      ],
    },
    en: {
      name: "Switzerland",
      lawName: "Federal Act on Electronic Signatures (ZertES)",
      summary: "Governed by the Federal Act on Electronic Signatures (ZertES).",
      intro: "In Switzerland electronic signatures are governed by ZertES, which recognizes several signature levels.",
      legalBody: "The Federal Act on Electronic Signatures (ZertES) recognizes four types of signature: simple, advanced, regulated and qualified. Only the qualified signature, with a certificate from a recognized provider and a timestamp, is legally equivalent to a handwritten one.",
      validity: "For private agreements a simple or advanced signature usually suffices; when the law requires written form, the qualified one is needed. Firmiu accompanies every signature with its audit trail.",
      faqs: [
        { q: "Are electronic signatures legal in Switzerland?", a: "Yes. ZertES has governed them since it came into force." },
        { q: "Which signature equals a handwritten one?", a: "The qualified signature (QES) with a timestamp, under ZertES." },
        { q: "Do they work for private contracts?", a: "Yes, for most agreements between private parties." },
      ],
    },
  },
  {
    slug: "india",
    flag: "🇮🇳",
    region: "asia",
    es: {
      name: "India",
      lawName: "Information Technology Act, 2000",
      summary: "Válida desde 2000 por la Information Technology Act.",
      intro: "En India la firma electrónica es jurídicamente válida desde 2000 y los tribunales admiten los documentos firmados digitalmente.",
      legalBody: "La Information Technology Act, 2000 (con su reforma de 2008) reconoce la firma electrónica en su sección 5: cuando una ley exige una firma, la electrónica la satisface si cumple los estándares de autenticación. La sección 3A define los métodos admitidos.",
      validity: "La ley excluye ciertos documentos como pagarés, poderes, testamentos y la compraventa de inmuebles. Para el resto, Firmiu respalda cada firma con IP, dispositivo, ubicación y verificación.",
      faqs: [
        { q: "¿Es legal la firma electrónica en India?", a: "Sí. La IT Act, 2000 la reconoce con plena validez jurídica." },
        { q: "¿Hay documentos excluidos?", a: "Sí: pagarés, poderes, testamentos y la compraventa de inmuebles, entre otros." },
        { q: "¿Los tribunales aceptan documentos firmados?", a: "Sí, presumen su validez cuando cumplen la IT Act." },
      ],
    },
    en: {
      name: "India",
      lawName: "Information Technology Act, 2000",
      summary: "Valid since 2000 under the Information Technology Act.",
      intro: "In India electronic signatures have been legally valid since 2000, and courts accept digitally signed documents.",
      legalBody: "The Information Technology Act, 2000 (with its 2008 amendment) recognizes electronic signatures in Section 5: where a law requires a signature, an electronic one satisfies it if it meets authentication standards. Section 3A defines the accepted methods.",
      validity: "The law excludes certain documents such as negotiable instruments, powers of attorney, wills and the sale of immovable property. For the rest, Firmiu backs each signature with IP, device, location and verification.",
      faqs: [
        { q: "Are electronic signatures legal in India?", a: "Yes. The IT Act, 2000 recognizes them with full legal validity." },
        { q: "Are there excluded documents?", a: "Yes: negotiable instruments, powers of attorney, wills and sale of immovable property, among others." },
        { q: "Do courts accept signed documents?", a: "Yes, they presume their validity when they comply with the IT Act." },
      ],
    },
  },
  {
    slug: "filipinas",
    flag: "🇵🇭",
    region: "asia",
    es: {
      name: "Filipinas",
      lawName: "Ley de Comercio Electrónico (RA 8792)",
      summary: "Válida desde 2000 por la Republic Act 8792.",
      intro: "En Filipinas la firma electrónica tiene el mismo valor que la manuscrita desde la Ley de Comercio Electrónico de 2000.",
      legalBody: "La Republic Act 8792 (Electronic Commerce Act, 2000) reconoce los documentos electrónicos como equivalentes a los de papel y a la firma electrónica como equivalente a la manuscrita, siempre que sea fiable y verificable.",
      validity: "La firma debe identificar a la parte y ser apropiada para el fin del documento. Firmiu añade a cada firma su rastro de auditoría: IP, dispositivo, ubicación y verificación.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Filipinas?", a: "Sí. La RA 8792 la equipara a la firma manuscrita." },
        { q: "¿Qué requisitos debe cumplir?", a: "Identificar a la parte, ser fiable y verificable según el contexto." },
        { q: "¿Sirve para contratos privados?", a: "Sí, para la mayoría de acuerdos comerciales y entre privados." },
      ],
    },
    en: {
      name: "Philippines",
      lawName: "Electronic Commerce Act (RA 8792)",
      summary: "Valid since 2000 under Republic Act 8792.",
      intro: "In the Philippines electronic signatures carry the same value as handwritten ones since the 2000 Electronic Commerce Act.",
      legalBody: "Republic Act 8792 (Electronic Commerce Act, 2000) recognizes electronic documents as equivalent to paper and electronic signatures as equivalent to handwritten ones, provided they are reliable and verifiable.",
      validity: "The signature must identify the party and be appropriate for the document's purpose. Firmiu adds an audit trail to every signature: IP, device, location and verification.",
      faqs: [
        { q: "Are electronic signatures legal in the Philippines?", a: "Yes. RA 8792 equates them with handwritten signatures." },
        { q: "What requirements must they meet?", a: "Identify the party, be reliable and verifiable in context." },
        { q: "Do they work for private contracts?", a: "Yes, for most commercial and private agreements." },
      ],
    },
  },
  {
    slug: "singapur",
    flag: "🇸🇬",
    region: "asia",
    es: {
      name: "Singapur",
      lawName: "Electronic Transactions Act 2010",
      summary: "Reconocida por la Electronic Transactions Act (1998, revisada en 2010).",
      intro: "Singapur reconoce la firma electrónica desde 1998, con un marco alineado a los estándares internacionales.",
      legalBody: "La Electronic Transactions Act, introducida en 1998 y revisada en 2010, otorga a la firma electrónica el mismo valor que a la manuscrita, siguiendo la Ley Modelo de la CNUDMI. Distingue la firma electrónica de la firma electrónica segura, con presunciones adicionales.",
      validity: "La firma debe identificar a la persona e indicar su intención, con un método fiable. Firmiu documenta cada firma con IP, dispositivo, ubicación y verificación.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Singapur?", a: "Sí. La Electronic Transactions Act la reconoce desde 1998." },
        { q: "¿Qué es la firma electrónica segura?", a: "Una firma con presunciones legales adicionales de autoría e integridad." },
        { q: "¿Hay excepciones?", a: "Sí: testamentos, fideicomisos, poderes y compraventa de inmuebles, entre otros." },
      ],
    },
    en: {
      name: "Singapore",
      lawName: "Electronic Transactions Act 2010",
      summary: "Recognized by the Electronic Transactions Act (1998, revised in 2010).",
      intro: "Singapore has recognized electronic signatures since 1998, with a framework aligned to international standards.",
      legalBody: "The Electronic Transactions Act, introduced in 1998 and revised in 2010, gives electronic signatures the same value as handwritten ones, following the UNCITRAL Model Law. It distinguishes electronic signatures from secure electronic signatures, with additional presumptions.",
      validity: "The signature must identify the person and indicate their intent, with a reliable method. Firmiu documents every signature with IP, device, location and verification.",
      faqs: [
        { q: "Are electronic signatures legal in Singapore?", a: "Yes. The Electronic Transactions Act has recognized them since 1998." },
        { q: "What is a secure electronic signature?", a: "A signature with additional legal presumptions of authorship and integrity." },
        { q: "Are there exceptions?", a: "Yes: wills, trusts, powers of attorney and sale of immovable property, among others." },
      ],
    },
  },
  {
    slug: "japon",
    flag: "🇯🇵",
    region: "asia",
    es: {
      name: "Japón",
      lawName: "Ley de Firmas Electrónicas y Servicios de Certificación",
      summary: "Válida desde 2001 por la Ley de Firmas Electrónicas y Servicios de Certificación.",
      intro: "En Japón la firma electrónica es legalmente válida y, cuando es certificada, equivale a la manuscrita.",
      legalBody: "La Ley de Firmas Electrónicas y Servicios de Certificación (2001) establece que un documento se presume auténtico cuando la firma electrónica la realiza el titular. Las firmas certificadas tienen el mismo valor legal que las manuscritas.",
      validity: "La firma debe identificar de forma fiable al firmante y reflejar su intención. Firmiu acompaña cada firma con su rastro de auditoría: IP, dispositivo, ubicación y verificación.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Japón?", a: "Sí. La ley de 2001 le otorga validez y presunción de autenticidad." },
        { q: "¿Equivale a la firma manuscrita?", a: "La firma electrónica certificada sí, según la ley japonesa." },
        { q: "¿Sirve para contratos privados?", a: "Sí, para la mayoría de acuerdos entre privados." },
      ],
    },
    en: {
      name: "Japan",
      lawName: "Act on Electronic Signatures and Certification Business",
      summary: "Valid since 2001 under the Act on Electronic Signatures and Certification Business.",
      intro: "In Japan electronic signatures are legally valid and, when certified, are equivalent to handwritten ones.",
      legalBody: "The Act on Electronic Signatures and Certification Business (2001) establishes that a document is presumed authentic when the electronic signature is performed by the principal. Certified signatures have the same legal value as handwritten ones.",
      validity: "The signature must reliably identify the signer and reflect their intent. Firmiu accompanies every signature with its audit trail: IP, device, location and verification.",
      faqs: [
        { q: "Are electronic signatures legal in Japan?", a: "Yes. The 2001 Act grants them validity and a presumption of authenticity." },
        { q: "Are they equal to a handwritten signature?", a: "A certified electronic signature is, under Japanese law." },
        { q: "Do they work for private contracts?", a: "Yes, for most agreements between private parties." },
      ],
    },
  },
  {
    slug: "emiratos-arabes-unidos",
    flag: "🇦🇪",
    region: "asia",
    es: {
      name: "Emiratos Árabes Unidos",
      lawName: "Decreto-Ley Federal 46 de 2021",
      summary: "Regulada por el Decreto-Ley Federal 46 de 2021 sobre transacciones electrónicas.",
      intro: "En los Emiratos Árabes Unidos la firma electrónica es tan vinculante como la manuscrita desde la ley federal de 2021.",
      legalBody: "El Decreto-Ley Federal 46 de 2021 sobre Transacciones Electrónicas y Servicios de Confianza, junto con su reglamento (Decisión del Gabinete 28/2023), regula la validez de los documentos y firmas electrónicas y licencia a los prestadores de servicios de confianza.",
      validity: "Un documento no pierde validez por ser electrónico, y la firma electrónica es tan vinculante como la manuscrita. Firmiu añade a cada firma su rastro de auditoría completo.",
      faqs: [
        { q: "¿Es legal la firma electrónica en los EAU?", a: "Sí. El Decreto-Ley Federal 46 de 2021 la reconoce." },
        { q: "¿Es tan vinculante como la firma a mano?", a: "Sí, la ley la equipara a la firma manuscrita." },
        { q: "¿Quién licencia a los prestadores?", a: "El marco federal de servicios de confianza, según el reglamento de 2023." },
      ],
    },
    en: {
      name: "United Arab Emirates",
      lawName: "Federal Decree-Law 46 of 2021",
      summary: "Governed by Federal Decree-Law 46 of 2021 on electronic transactions.",
      intro: "In the United Arab Emirates electronic signatures are as binding as handwritten ones since the 2021 federal law.",
      legalBody: "Federal Decree-Law 46 of 2021 on Electronic Transactions and Trust Services, together with its regulation (Cabinet Decision 28/2023), governs the validity of electronic documents and signatures and licenses trust service providers.",
      validity: "A document doesn't lose validity for being electronic, and an electronic signature is as binding as a handwritten one. Firmiu adds a full audit trail to every signature.",
      faqs: [
        { q: "Are electronic signatures legal in the UAE?", a: "Yes. Federal Decree-Law 46 of 2021 recognizes them." },
        { q: "Are they as binding as a handwritten signature?", a: "Yes, the law equates them with handwritten signatures." },
        { q: "Who licenses providers?", a: "The federal trust-services framework, under the 2023 regulation." },
      ],
    },
  },
  {
    slug: "australia",
    flag: "🇦🇺",
    region: "oceania",
    es: {
      name: "Australia",
      lawName: "Electronic Transactions Act 1999",
      summary: "Válida desde 1999 por la Electronic Transactions Act (federal y estatal).",
      intro: "En Australia la firma electrónica es válida desde 1999, tanto a nivel federal como en cada estado.",
      legalBody: "La Electronic Transactions Act 1999 confirma que firmar y enviar documentos electrónicamente es tan válido como en papel. No exige un método concreto, siempre que identifique al firmante, refleje su intención y sea fiable. Cada estado tiene su propia ley equivalente.",
      validity: "Algunos documentos quedan excluidos y conviene firmarlos en papel. Para el resto, Firmiu respalda cada firma con IP, dispositivo, ubicación y verificación.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Australia?", a: "Sí. La Electronic Transactions Act 1999 la reconoce a nivel federal y estatal." },
        { q: "¿Necesito un método específico?", a: "No, mientras identifique al firmante, refleje su intención y sea fiable." },
        { q: "¿Sirve para contratos comerciales?", a: "Sí, para la mayoría de acuerdos privados." },
      ],
    },
    en: {
      name: "Australia",
      lawName: "Electronic Transactions Act 1999",
      summary: "Valid since 1999 under the Electronic Transactions Act (federal and state).",
      intro: "In Australia electronic signatures have been valid since 1999, both federally and in each state.",
      legalBody: "The Electronic Transactions Act 1999 confirms that signing and sending documents electronically is as valid as on paper. It doesn't require a specific method, as long as it identifies the signer, reflects their intent and is reliable. Each state has its own equivalent act.",
      validity: "Some documents are excluded and are best signed on paper. For the rest, Firmiu backs each signature with IP, device, location and verification.",
      faqs: [
        { q: "Are electronic signatures legal in Australia?", a: "Yes. The Electronic Transactions Act 1999 recognizes them federally and at state level." },
        { q: "Do I need a specific method?", a: "No, as long as it identifies the signer, reflects their intent and is reliable." },
        { q: "Do they work for commercial contracts?", a: "Yes, for most private agreements." },
      ],
    },
  },
  {
    slug: "nueva-zelanda",
    flag: "🇳🇿",
    region: "oceania",
    es: {
      name: "Nueva Zelanda",
      lawName: "Contract and Commercial Law Act 2017",
      summary: "Regulada por la Contract and Commercial Law Act 2017.",
      intro: "En Nueva Zelanda la firma electrónica tiene el mismo valor que la manuscrita cuando cumple ciertos requisitos.",
      legalBody: "La Contract and Commercial Law Act 2017 establece que una firma electrónica es vinculante si la otra parte consiente, identifica adecuadamente al firmante, refleja su aprobación y permite detectar alteraciones del documento.",
      validity: "Algunos documentos que requieren notarización quedan fuera. Para el resto, Firmiu acompaña cada firma con su rastro de auditoría: IP, dispositivo, ubicación y verificación.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Nueva Zelanda?", a: "Sí. La Contract and Commercial Law Act 2017 la reconoce." },
        { q: "¿Qué se necesita para que sea válida?", a: "Consentimiento, identificación del firmante, su aprobación y detección de cambios." },
        { q: "¿Hay excepciones?", a: "Sí, documentos que requieren notarización como ciertas transferencias de propiedad." },
      ],
    },
    en: {
      name: "New Zealand",
      lawName: "Contract and Commercial Law Act 2017",
      summary: "Governed by the Contract and Commercial Law Act 2017.",
      intro: "In New Zealand electronic signatures carry the same value as handwritten ones when certain requirements are met.",
      legalBody: "The Contract and Commercial Law Act 2017 establishes that an electronic signature is binding if the other party consents, it adequately identifies the signer, reflects their approval and makes document alterations detectable.",
      validity: "Some documents requiring notarization are excluded. For the rest, Firmiu accompanies every signature with its audit trail: IP, device, location and verification.",
      faqs: [
        { q: "Are electronic signatures legal in New Zealand?", a: "Yes. The Contract and Commercial Law Act 2017 recognizes them." },
        { q: "What's needed for validity?", a: "Consent, signer identification, their approval and detection of changes." },
        { q: "Are there exceptions?", a: "Yes, documents requiring notarization such as certain property transfers." },
      ],
    },
  },
  {
    slug: "sudafrica",
    flag: "🇿🇦",
    region: "africa",
    es: {
      name: "Sudáfrica",
      lawName: "Electronic Communications and Transactions Act (ECTA), 2002",
      summary: "Reconocida por la ECTA de 2002 (sección 13).",
      intro: "En Sudáfrica la firma electrónica es válida desde 2002 bajo la Electronic Communications and Transactions Act.",
      legalBody: "La sección 13 de la ECTA (Act 25 de 2002) regula la firma electrónica y reconoce dos tipos: la estándar y la avanzada (acreditada por la autoridad competente). Una firma no pierde efecto legal solo por ser electrónica.",
      validity: "La ECTA excluye actos como la transmisión de inmuebles, arrendamientos largos y letras de cambio. Para el resto, Firmiu respalda cada firma con IP, dispositivo, ubicación y verificación.",
      faqs: [
        { q: "¿Es legal la firma electrónica en Sudáfrica?", a: "Sí. La ECTA de 2002 la reconoce en su sección 13." },
        { q: "¿Qué tipos de firma reconoce?", a: "La firma electrónica estándar y la avanzada acreditada." },
        { q: "¿Hay excepciones?", a: "Sí: transmisión de inmuebles, arrendamientos de más de 20 años y letras de cambio." },
      ],
    },
    en: {
      name: "South Africa",
      lawName: "Electronic Communications and Transactions Act (ECTA), 2002",
      summary: "Recognized by ECTA of 2002 (section 13).",
      intro: "In South Africa electronic signatures have been valid since 2002 under the Electronic Communications and Transactions Act.",
      legalBody: "Section 13 of ECTA (Act 25 of 2002) governs electronic signatures and recognizes two types: the standard one and the advanced one (accredited by the relevant authority). A signature doesn't lose legal effect merely for being electronic.",
      validity: "ECTA excludes acts such as the alienation of immovable property, long leases and bills of exchange. For the rest, Firmiu backs each signature with IP, device, location and verification.",
      faqs: [
        { q: "Are electronic signatures legal in South Africa?", a: "Yes. ECTA of 2002 recognizes them in section 13." },
        { q: "What signature types does it recognize?", a: "The standard electronic signature and the accredited advanced one." },
        { q: "Are there exceptions?", a: "Yes: alienation of immovable property, leases over 20 years and bills of exchange." },
      ],
    },
  },
];

export const COUNTRY_SLUGS = COUNTRIES.map((c) => c.slug);

export function getCountry(slug: string): Country | undefined {
  return COUNTRIES.find((c) => c.slug === slug);
}

export function getCountryContent(country: Country, locale: string): CountryContent {
  return locale === "en" ? country.en : country.es;
}
