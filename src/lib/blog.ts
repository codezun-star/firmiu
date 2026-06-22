/**
 * Blog content store. Articles are authored bilingually here and rendered by
 * `/blog` (index) and `/blog/[slug]` (article). Keeping posts as structured
 * data avoids pulling in a Markdown pipeline while still producing rich,
 * indexable HTML with Article + Breadcrumb structured data.
 */

export interface BlogSection {
  heading?: string;
  paragraphs: string[];
}

export interface BlogPostContent {
  title: string;
  excerpt: string;
  keywords: string;
  readingMinutes: number;
  sections: BlogSection[];
}

export interface BlogPost {
  slug: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  es: BlogPostContent;
  en: BlogPostContent;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "es-legal-la-firma-electronica",
    date: "2026-01-15",
    es: {
      title: "¿Es legal la firma electrónica? Lo que debes saber",
      excerpt:
        "La firma electrónica es legal en toda Latinoamérica, España y Estados Unidos. Te explicamos qué la hace válida y en qué países está reconocida.",
      keywords:
        "es legal la firma electrónica, validez firma electrónica, firma electrónica legal latinoamérica, firma electrónica españa, firma electrónica estados unidos, países firma electrónica",
      readingMinutes: 6,
      sections: [
        {
          paragraphs: [
            "Sí: la firma electrónica es legal y tiene validez jurídica en prácticamente todos los países de habla hispana, además de Estados Unidos. La duda más común no es si es legal, sino qué requisitos debe cumplir para tener pleno valor probatorio.",
          ],
        },
        {
          heading: "Un marco legal sólido en cada país",
          paragraphs: [
            "Cada país cuenta con su propia ley. México la reconoce desde la reforma al Código de Comercio de 2003; Colombia con la Ley 527 de 1999; Argentina con la Ley 25.506; Chile con la Ley 19.799; y España bajo el Reglamento europeo eIDAS. En Estados Unidos, la ESIGN Act y la UETA le dan validez en los 50 estados.",
            "Aunque cambian los nombres, todas comparten un principio: un documento no puede rechazarse como prueba solo por estar firmado electrónicamente.",
          ],
        },
        {
          heading: "¿En qué países es legal?",
          paragraphs: [
            "La firma electrónica está reconocida por ley en toda la región: México, Colombia, Argentina, Chile, Perú, Ecuador, Guatemala, Costa Rica, Bolivia, Paraguay, Uruguay, Panamá, República Dominicana, Nicaragua, Venezuela, El Salvador y Honduras. También en España —bajo el marco europeo eIDAS— y en Estados Unidos y Puerto Rico, mediante la ESIGN Act y la UETA.",
            "Algunos países distinguen entre la firma electrónica simple y la certificada o avanzada: la primera es válida para la mayoría de acuerdos privados, mientras que ciertos trámites oficiales pueden exigir la versión certificada.",
          ],
        },
        {
          heading: "¿Qué hace válida una firma electrónica?",
          paragraphs: [
            "Tres elementos son clave: que la firma sea atribuible a una persona, que el documento se conserve íntegro y que exista un registro del proceso. Ese registro —conocido como rastro de auditoría— suele incluir la fecha y hora, la dirección IP, el dispositivo y algún método de verificación de identidad.",
            "Firmiu genera ese rastro automáticamente en cada firma, de modo que el documento queda respaldado si alguna vez se cuestiona.",
          ],
        },
        {
          heading: "En resumen",
          paragraphs: [
            "Firmar electrónicamente es legal, seguro y cada vez más habitual. Si quieres conocer el detalle de tu país, revisa nuestra guía de validez legal por país.",
          ],
        },
      ],
    },
    en: {
      title: "Are electronic signatures legal? What you need to know",
      excerpt:
        "Electronic signatures are legal across Latin America, Spain and the United States. Here's what makes them valid and where they're recognized.",
      keywords:
        "are electronic signatures legal, electronic signature validity, electronic signature legal latin america, electronic signature spain, electronic signature united states, countries electronic signature",
      readingMinutes: 6,
      sections: [
        {
          paragraphs: [
            "Yes: electronic signatures are legal and legally valid in virtually every Spanish-speaking country, as well as the United States. The most common question isn't whether they're legal, but what requirements they must meet to carry full evidentiary value.",
          ],
        },
        {
          heading: "A solid legal framework in every country",
          paragraphs: [
            "Each country has its own law. Mexico has recognized them since the 2003 Commercial Code reform; Colombia under Law 527 of 1999; Argentina under Law 25,506; Chile under Law 19,799; and Spain under the European eIDAS Regulation. In the United States, the ESIGN Act and UETA give them validity across all 50 states.",
            "Although the names change, they all share one principle: a document cannot be rejected as evidence solely because it was signed electronically.",
          ],
        },
        {
          heading: "Where is it legal?",
          paragraphs: [
            "Electronic signatures are recognized by law across the region: Mexico, Colombia, Argentina, Chile, Peru, Ecuador, Guatemala, Costa Rica, Bolivia, Paraguay, Uruguay, Panama, the Dominican Republic, Nicaragua, Venezuela, El Salvador and Honduras. Also in Spain — under the European eIDAS framework — and in the United States and Puerto Rico, through the ESIGN Act and UETA.",
            "Some countries distinguish between a simple electronic signature and a certified or advanced one: the former is valid for most private agreements, while certain official procedures may require the certified version.",
          ],
        },
        {
          heading: "What makes an electronic signature valid?",
          paragraphs: [
            "Three elements are key: the signature must be attributable to a person, the document must be kept intact, and there must be a record of the process. That record — known as an audit trail — usually includes the date and time, IP address, device and some identity-verification method.",
            "Firmiu generates that trail automatically on every signature, so the document is backed if it is ever challenged.",
          ],
        },
        {
          heading: "In short",
          paragraphs: [
            "Signing electronically is legal, secure and increasingly common. To see the details for your country, check our legal-validity-by-country guide.",
          ],
        },
      ],
    },
  },
  {
    slug: "como-firmar-un-pdf-sin-imprimir",
    date: "2026-02-10",
    es: {
      title: "Cómo firmar un PDF sin imprimir (paso a paso)",
      excerpt:
        "Olvídate de la impresora y el escáner. Aprende a firmar un PDF online en minutos y a enviarlo para que otra persona lo firme.",
      keywords:
        "cómo firmar un pdf, firmar pdf sin imprimir, firmar pdf online, firmar documento pdf, firma electrónica pdf",
      readingMinutes: 5,
      sections: [
        {
          paragraphs: [
            "Imprimir, firmar a mano, escanear y reenviar es un proceso lento y propenso a errores. Hoy puedes firmar un PDF y recolectar firmas de terceros sin tocar una impresora.",
          ],
        },
        {
          heading: "1. Sube tu documento",
          paragraphs: [
            "Carga el PDF que necesitas firmar o enviar a firma. En Firmiu basta con arrastrarlo y escribir el nombre y correo de la persona que debe firmar.",
          ],
        },
        {
          heading: "2. El firmante recibe un enlace",
          paragraphs: [
            "La persona recibe un correo con un enlace único y seguro. No necesita crear una cuenta ni instalar nada: abre el enlace y firma directamente desde el navegador, incluso desde el teléfono.",
          ],
        },
        {
          heading: "3. Firma y verificación",
          paragraphs: [
            "El firmante dibuja su firma en pantalla y confirma con un código de verificación. Ese paso añade seguridad y deja constancia de quién firmó.",
          ],
        },
        {
          heading: "4. Descarga el PDF firmado",
          paragraphs: [
            "El documento queda firmado y disponible para descargar, con un rastro de auditoría que registra la fecha, el dispositivo y la ubicación. Sin papel, sin esperas y con respaldo legal.",
          ],
        },
        {
          heading: "Consejos para que no falle nada",
          paragraphs: [
            "Verifica que el correo del destinatario sea correcto antes de enviar: el enlace de firma viaja por email. Y si la persona tarda en firmar, un recordatorio amable suele bastar para cerrar el documento.",
            "Guarda siempre el PDF firmado y su rastro de auditoría juntos: son la prueba de que el documento se firmó y de quién lo hizo.",
          ],
        },
      ],
    },
    en: {
      title: "How to sign a PDF without printing (step by step)",
      excerpt:
        "Forget the printer and scanner. Learn how to sign a PDF online in minutes and send it for someone else to sign.",
      keywords:
        "how to sign a pdf, sign pdf without printing, sign pdf online, sign pdf document, electronic signature pdf",
      readingMinutes: 5,
      sections: [
        {
          paragraphs: [
            "Printing, signing by hand, scanning and resending is slow and error-prone. Today you can sign a PDF and collect signatures from others without touching a printer.",
          ],
        },
        {
          heading: "1. Upload your document",
          paragraphs: [
            "Upload the PDF you need to sign or send for signature. In Firmiu you just drag it in and enter the name and email of the person who must sign.",
          ],
        },
        {
          heading: "2. The signer receives a link",
          paragraphs: [
            "The person gets an email with a unique, secure link. They don't need to create an account or install anything: they open the link and sign right from the browser, even on their phone.",
          ],
        },
        {
          heading: "3. Signing and verification",
          paragraphs: [
            "The signer draws their signature on screen and confirms with a verification code. That step adds security and records who signed.",
          ],
        },
        {
          heading: "4. Download the signed PDF",
          paragraphs: [
            "The document is signed and ready to download, with an audit trail logging the date, device and location. No paper, no waiting, and legally backed.",
          ],
        },
        {
          heading: "Tips so nothing goes wrong",
          paragraphs: [
            "Double-check the recipient's email before sending: the signing link travels by email. And if the person is slow to sign, a friendly reminder is usually enough to close the document.",
            "Always keep the signed PDF and its audit trail together: they are the proof that the document was signed and by whom.",
          ],
        },
      ],
    },
  },
  {
    slug: "firma-electronica-vs-firma-digital",
    date: "2026-03-05",
    es: {
      title: "Firma electrónica vs firma digital: ¿cuál es la diferencia?",
      excerpt:
        "Se usan como sinónimos, pero no son lo mismo. Te explicamos la diferencia y cuándo necesitas cada una.",
      keywords:
        "firma electrónica vs firma digital, diferencia firma electrónica y digital, qué es firma digital, qué es firma electrónica",
      readingMinutes: 5,
      sections: [
        {
          paragraphs: [
            "«Firma electrónica» y «firma digital» se usan a menudo como sinónimos, pero técnicamente designan cosas distintas. Entender la diferencia te ayuda a elegir la herramienta adecuada para cada documento.",
          ],
        },
        {
          heading: "Firma electrónica",
          paragraphs: [
            "Es el concepto amplio: cualquier dato en formato electrónico que una persona usa para firmar. Puede ser una firma dibujada en pantalla, un clic de aceptación o un código. Es válida para la gran mayoría de contratos entre privados y es la que usa Firmiu, reforzada con un rastro de auditoría.",
          ],
        },
        {
          heading: "Firma digital",
          paragraphs: [
            "Es un tipo específico de firma electrónica que utiliza criptografía y un certificado emitido por una autoridad acreditada. Ofrece el máximo nivel de identificación y, en algunos países, se exige para ciertos trámites con el Estado.",
          ],
        },
        {
          heading: "¿Cuál necesitas?",
          paragraphs: [
            "Para contratos de servicios, arrendamientos, acuerdos comerciales y la mayoría de documentos del día a día, la firma electrónica es suficiente y mucho más ágil. La firma digital certificada se reserva para trámites oficiales que la exigen expresamente.",
            "Si tu objetivo es firmar y cerrar acuerdos rápido, sin fricción y con respaldo legal, la firma electrónica con rastro de auditoría es la opción práctica.",
          ],
        },
      ],
    },
    en: {
      title: "Electronic signature vs digital signature: what's the difference?",
      excerpt:
        "They're used interchangeably, but they aren't the same. Here's the difference and when you need each one.",
      keywords:
        "electronic signature vs digital signature, difference electronic and digital signature, what is a digital signature, what is an electronic signature",
      readingMinutes: 5,
      sections: [
        {
          paragraphs: [
            "“Electronic signature” and “digital signature” are often used interchangeably, but technically they mean different things. Understanding the difference helps you pick the right tool for each document.",
          ],
        },
        {
          heading: "Electronic signature",
          paragraphs: [
            "This is the broad concept: any electronic data a person uses to sign. It can be a signature drawn on screen, an acceptance click or a code. It's valid for the vast majority of contracts between private parties and is what Firmiu uses, reinforced with an audit trail.",
          ],
        },
        {
          heading: "Digital signature",
          paragraphs: [
            "This is a specific type of electronic signature that uses cryptography and a certificate issued by an accredited authority. It offers the highest level of identification and, in some countries, is required for certain government procedures.",
          ],
        },
        {
          heading: "Which one do you need?",
          paragraphs: [
            "For service contracts, leases, commercial agreements and most day-to-day documents, an electronic signature is enough and far quicker. A certified digital signature is reserved for official procedures that explicitly require it.",
            "If your goal is to sign and close agreements fast, friction-free and legally backed, an electronic signature with an audit trail is the practical option.",
          ],
        },
      ],
    },
  },
  {
    slug: "tipos-de-firma-electronica",
    date: "2026-04-08",
    es: {
      title: "Tipos de firma electrónica: simple, avanzada y cualificada",
      excerpt:
        "No todas las firmas electrónicas son iguales. Te explicamos los tres niveles y cuál necesitas para cada documento.",
      keywords:
        "tipos de firma electrónica, firma electrónica simple, firma electrónica avanzada, firma electrónica cualificada, niveles firma electrónica eIDAS",
      readingMinutes: 6,
      sections: [
        {
          paragraphs: [
            "No todas las firmas electrónicas ofrecen el mismo nivel de seguridad ni de garantía legal. El marco europeo eIDAS, una de las referencias más usadas en el mundo, define tres niveles. Conocerlos te ayuda a elegir el adecuado para cada documento.",
          ],
        },
        {
          heading: "1. Firma electrónica simple",
          paragraphs: [
            "Es el nivel básico: cualquier dato electrónico que una persona usa para firmar, como una firma dibujada en pantalla, un clic de aceptación o un código. Es válida para la gran mayoría de acuerdos entre privados y es la más ágil de usar.",
          ],
        },
        {
          heading: "2. Firma electrónica avanzada",
          paragraphs: [
            "Añade requisitos técnicos: debe estar vinculada de forma única al firmante, permitir identificarlo, crearse con medios bajo su control exclusivo y detectar cualquier alteración posterior del documento. Ofrece más garantías que la simple sin llegar a exigir un certificado cualificado.",
          ],
        },
        {
          heading: "3. Firma electrónica cualificada",
          paragraphs: [
            "Es el nivel más alto. Se basa en un certificado emitido por un prestador cualificado y se crea con un dispositivo seguro de creación de firma (QSCD). Bajo eIDAS, tiene el mismo valor legal que una firma manuscrita en toda la Unión Europea. Varios países de Latinoamérica usan un concepto equivalente: la firma electrónica certificada o digital.",
          ],
        },
        {
          heading: "eIDAS y su actualización de 2024",
          paragraphs: [
            "El Reglamento europeo eIDAS (UE) 910/2014 fue actualizado por el Reglamento (UE) 2024/1183, conocido como eIDAS 2.0. Esta reforma introduce la Cartera Europea de Identidad Digital (EUDI Wallet), que los Estados miembros deben poner a disposición de sus ciudadanos, pero mantiene los tres niveles de firma sin cambios.",
          ],
        },
        {
          heading: "¿Cuál necesitas?",
          paragraphs: [
            "Para contratos de servicios, arrendamientos, acuerdos comerciales y la mayoría de documentos privados, la firma electrónica simple o avanzada es suficiente y mucho más práctica. La cualificada o certificada se reserva para trámites que la exigen de forma expresa. Firmiu utiliza firma electrónica reforzada con un rastro de auditoría completo, ideal para el día a día de empresas y profesionales.",
          ],
        },
      ],
    },
    en: {
      title: "Types of electronic signature: simple, advanced and qualified",
      excerpt:
        "Not all electronic signatures are the same. Here are the three levels and which one you need for each document.",
      keywords:
        "types of electronic signature, simple electronic signature, advanced electronic signature, qualified electronic signature, electronic signature levels eIDAS",
      readingMinutes: 6,
      sections: [
        {
          paragraphs: [
            "Not all electronic signatures offer the same level of security or legal assurance. The European eIDAS framework, one of the most widely used references in the world, defines three levels. Knowing them helps you choose the right one for each document.",
          ],
        },
        {
          heading: "1. Simple electronic signature",
          paragraphs: [
            "This is the basic level: any electronic data a person uses to sign, such as a signature drawn on screen, an acceptance click or a code. It's valid for the vast majority of agreements between private parties and is the quickest to use.",
          ],
        },
        {
          heading: "2. Advanced electronic signature",
          paragraphs: [
            "It adds technical requirements: it must be uniquely linked to the signer, allow their identification, be created with means under their exclusive control, and detect any later alteration of the document. It offers more assurance than the simple one without requiring a qualified certificate.",
          ],
        },
        {
          heading: "3. Qualified electronic signature",
          paragraphs: [
            "This is the highest level. It is based on a certificate issued by a qualified provider and created with a secure signature-creation device (QSCD). Under eIDAS, it carries the same legal weight as a handwritten signature across the entire European Union. Several Latin American countries use an equivalent concept: the certified or digital signature.",
          ],
        },
        {
          heading: "eIDAS and its 2024 update",
          paragraphs: [
            "The European eIDAS Regulation (EU) 910/2014 was updated by Regulation (EU) 2024/1183, known as eIDAS 2.0. This reform introduces the European Digital Identity Wallet (EUDI Wallet), which member states must make available to their citizens, but keeps the three signature levels unchanged.",
          ],
        },
        {
          heading: "Which one do you need?",
          paragraphs: [
            "For service contracts, leases, commercial agreements and most private documents, a simple or advanced electronic signature is enough and far more practical. The qualified or certified one is reserved for procedures that explicitly require it. Firmiu uses an electronic signature reinforced with a full audit trail, ideal for the day-to-day of companies and professionals.",
          ],
        },
      ],
    },
  },
  {
    slug: "que-es-rastro-de-auditoria-firma-electronica",
    date: "2026-05-12",
    es: {
      title: "¿Qué es el rastro de auditoría y por qué da validez a una firma?",
      excerpt:
        "La validez de una firma electrónica no depende solo del trazo. Te explicamos qué es el rastro de auditoría y por qué importa.",
      keywords:
        "rastro de auditoría firma electrónica, audit trail firma, validez firma electrónica prueba, evidencia firma electrónica",
      readingMinutes: 5,
      sections: [
        {
          paragraphs: [
            "Cuando alguien firma electrónicamente, lo que da fuerza legal al documento no es solo la firma dibujada, sino poder demostrar quién firmó, cuándo y que el documento no se alteró después. Eso es exactamente lo que aporta el rastro de auditoría.",
          ],
        },
        {
          heading: "Qué guarda un rastro de auditoría",
          paragraphs: [
            "Un buen rastro de auditoría registra, en el momento de firmar, datos como la fecha y hora exactas, la dirección IP del firmante, el dispositivo y navegador utilizados, una ubicación aproximada y un método de verificación, como un código enviado al firmante.",
          ],
        },
        {
          heading: "Por qué importa ante una disputa",
          paragraphs: [
            "La mayoría de leyes de firma electrónica exigen dos cosas para dar validez a un documento: que la firma sea atribuible a una persona y que el documento se conserve íntegro. El rastro de auditoría es justamente la evidencia que respalda ambos puntos si alguien cuestiona la firma.",
          ],
        },
        {
          heading: "Cómo lo aplica Firmiu",
          paragraphs: [
            "Firmiu genera un rastro de auditoría en cada firma: IP, dispositivo, ubicación, marca de tiempo y un código de verificación de cuatro dígitos. Toda esa información acompaña al PDF firmado, de modo que el documento queda respaldado sin que tengas que hacer nada extra.",
          ],
        },
      ],
    },
    en: {
      title: "What is an audit trail and why does it make a signature valid?",
      excerpt:
        "The validity of an electronic signature doesn't depend only on the stroke. Here's what an audit trail is and why it matters.",
      keywords:
        "audit trail electronic signature, electronic signature evidence, electronic signature validity proof, signature audit log",
      readingMinutes: 5,
      sections: [
        {
          paragraphs: [
            "When someone signs electronically, what gives the document legal strength isn't just the drawn signature, but being able to prove who signed, when, and that the document wasn't altered afterward. That's exactly what the audit trail provides.",
          ],
        },
        {
          heading: "What an audit trail records",
          paragraphs: [
            "A good audit trail records, at the moment of signing, data such as the exact date and time, the signer's IP address, the device and browser used, an approximate location, and a verification method such as a code sent to the signer.",
          ],
        },
        {
          heading: "Why it matters in a dispute",
          paragraphs: [
            "Most electronic-signature laws require two things to give a document validity: that the signature be attributable to a person and that the document be kept intact. The audit trail is precisely the evidence that backs both points if someone challenges the signature.",
          ],
        },
        {
          heading: "How Firmiu applies it",
          paragraphs: [
            "Firmiu generates an audit trail on every signature: IP, device, location, timestamp and a four-digit verification code. All of that information travels with the signed PDF, so the document is backed without you having to do anything extra.",
          ],
        },
      ],
    },
  },
  {
    slug: "como-enviar-documento-para-firmar",
    date: "2026-06-03",
    es: {
      title: "Cómo enviar un documento para que lo firme tu cliente",
      excerpt:
        "Enviar un PDF a firma y recibirlo firmado puede tomar minutos. Te explicamos el flujo y algunos consejos para cerrar más rápido.",
      keywords:
        "enviar documento para firmar, solicitar firma a cliente, enviar pdf a firma, recolectar firma electrónica, firma remota cliente",
      readingMinutes: 5,
      sections: [
        {
          paragraphs: [
            "Recolectar la firma de un cliente solía implicar imprimir, enviar por mensajería o coordinar una reunión. Hoy puedes enviar un documento a firma y recibirlo firmado en cuestión de minutos, sin que la otra persona instale nada.",
          ],
        },
        {
          heading: "Paso 1: prepara el documento",
          paragraphs: [
            "Ten listo el PDF que quieres que firmen y a mano el nombre y el correo de la persona destinataria. Asegúrate de que el documento esté en su versión final, ya que la firma se aplicará sobre ese archivo.",
          ],
        },
        {
          heading: "Paso 2: envía la solicitud de firma",
          paragraphs: [
            "Sube el PDF y escribe el nombre y correo del destinatario. El sistema genera un enlace único y seguro y lo envía por correo. Tu cliente no necesita crear una cuenta para firmar.",
          ],
        },
        {
          heading: "Paso 3: tu cliente firma desde donde esté",
          paragraphs: [
            "El destinatario abre el enlace, dibuja su firma y confirma con un código de verificación. Puede hacerlo desde la computadora o el teléfono, en cualquier momento y lugar.",
          ],
        },
        {
          heading: "Paso 4: recibe el documento firmado",
          paragraphs: [
            "En cuanto firma, el PDF queda completo con su rastro de auditoría y disponible para descargar. Tienes la prueba de quién firmó, cuándo y desde qué dispositivo.",
          ],
        },
        {
          heading: "Consejos para cerrar más rápido",
          paragraphs: [
            "Confirma el correo del destinatario antes de enviar y avísale que recibirá el enlace, para que no lo confunda con spam. Si tarda en firmar, un recordatorio suele bastar para cerrar el documento el mismo día.",
            "Guarda tus contactos frecuentes: así enviar un nuevo documento a un cliente habitual toma apenas unos segundos.",
          ],
        },
      ],
    },
    en: {
      title: "How to send a document for your client to sign",
      excerpt:
        "Sending a PDF for signature and getting it back signed can take minutes. Here's the flow and some tips to close faster.",
      keywords:
        "send document for signature, request signature from client, send pdf for signing, collect electronic signature, remote signature client",
      readingMinutes: 5,
      sections: [
        {
          paragraphs: [
            "Collecting a client's signature used to mean printing, sending by courier or coordinating a meeting. Today you can send a document for signature and get it back signed in a matter of minutes, with the other person installing nothing.",
          ],
        },
        {
          heading: "Step 1: prepare the document",
          paragraphs: [
            "Have the PDF you want signed ready and the recipient's name and email at hand. Make sure the document is in its final version, since the signature will be applied to that file.",
          ],
        },
        {
          heading: "Step 2: send the signature request",
          paragraphs: [
            "Upload the PDF and enter the recipient's name and email. The system generates a unique, secure link and sends it by email. Your client doesn't need to create an account to sign.",
          ],
        },
        {
          heading: "Step 3: your client signs from anywhere",
          paragraphs: [
            "The recipient opens the link, draws their signature and confirms with a verification code. They can do it from a computer or phone, anytime and anywhere.",
          ],
        },
        {
          heading: "Step 4: receive the signed document",
          paragraphs: [
            "As soon as they sign, the PDF is complete with its audit trail and ready to download. You have proof of who signed, when and from which device.",
          ],
        },
        {
          heading: "Tips to close faster",
          paragraphs: [
            "Confirm the recipient's email before sending and let them know they'll receive the link, so they don't mistake it for spam. If they're slow to sign, a reminder is usually enough to close the document the same day.",
            "Save your frequent contacts: that way sending a new document to a regular client takes just a few seconds.",
          ],
        },
      ],
    },
  },
  {
    slug: "como-firmar-contrato-de-arrendamiento-online",
    date: "2026-06-08",
    es: {
      title: "Cómo firmar un contrato de arrendamiento online",
      excerpt:
        "Firmar un contrato de alquiler ya no exige juntarse en una oficina. Te explicamos cómo hacerlo online, paso a paso y con validez.",
      keywords:
        "cómo firmar un contrato de arrendamiento online, firmar contrato de alquiler, firma electrónica contrato de arriendo, firmar arrendamiento a distancia",
      readingMinutes: 5,
      sections: [
        {
          paragraphs: [
            "Cerrar un alquiler solía implicar coordinar una cita para que propietario e inquilino firmaran en papel. Hoy puedes firmar un contrato de arrendamiento online en minutos, sin que ninguna de las partes se desplace.",
          ],
        },
        {
          heading: "¿Es válido firmar un arrendamiento online?",
          paragraphs: [
            "Sí. El contrato de arrendamiento es uno de los documentos privados que más se firma electrónicamente, y la firma electrónica es válida para este tipo de acuerdos en Latinoamérica, España y Estados Unidos. Lo importante es poder demostrar quién firmó y que el documento no se alteró: ahí entra el rastro de auditoría.",
          ],
        },
        {
          heading: "Pasos para firmar el contrato de arriendo",
          paragraphs: [
            "El propietario o la inmobiliaria sube el PDF del contrato y escribe el nombre y correo del inquilino. El inquilino recibe un enlace único, firma desde su teléfono o computadora y confirma con un código de verificación. En cuanto firma, el contrato queda completo y disponible para descargar.",
          ],
        },
        {
          heading: "Ventajas para inmobiliarias y propietarios",
          paragraphs: [
            "Cierras la operación el mismo día, sin esperar a coordinar una firma presencial. El inquilino firma cómodamente desde el móvil, y cada contrato queda respaldado con IP, fecha, dispositivo y verificación. Si gestionas varios inmuebles, puedes guardar tus contactos y enviar nuevos contratos en segundos.",
          ],
        },
      ],
    },
    en: {
      title: "How to sign a lease agreement online",
      excerpt:
        "Signing a lease no longer means meeting at an office. Here's how to do it online, step by step and with validity.",
      keywords:
        "how to sign a lease agreement online, sign rental contract, electronic signature lease, sign lease remotely",
      readingMinutes: 5,
      sections: [
        {
          paragraphs: [
            "Closing a rental used to mean coordinating an appointment for landlord and tenant to sign on paper. Today you can sign a lease agreement online in minutes, without either party traveling.",
          ],
        },
        {
          heading: "Is signing a lease online valid?",
          paragraphs: [
            "Yes. The lease is one of the most commonly e-signed private documents, and electronic signatures are valid for this kind of agreement across Latin America, Spain and the United States. What matters is being able to prove who signed and that the document wasn't altered: that's where the audit trail comes in.",
          ],
        },
        {
          heading: "Steps to sign the lease",
          paragraphs: [
            "The landlord or agency uploads the contract PDF and enters the tenant's name and email. The tenant receives a unique link, signs from their phone or computer and confirms with a verification code. As soon as they sign, the contract is complete and ready to download.",
          ],
        },
        {
          heading: "Benefits for agencies and landlords",
          paragraphs: [
            "You close the deal the same day, with no need to coordinate an in-person signing. The tenant signs comfortably from mobile, and each contract is backed with IP, date, device and verification. If you manage several properties, you can save your contacts and send new contracts in seconds.",
          ],
        },
      ],
    },
  },
  {
    slug: "como-firmar-contrato-de-trabajo-electronicamente",
    date: "2026-06-10",
    es: {
      title: "Cómo firmar un contrato de trabajo electrónicamente",
      excerpt:
        "Contratar personal remoto es habitual y firmar el contrato no debería ser el cuello de botella. Te explicamos cómo hacerlo.",
      keywords:
        "cómo firmar un contrato de trabajo electrónicamente, firmar contrato laboral online, firma electrónica contrato de trabajo, contrato laboral remoto firma",
      readingMinutes: 5,
      sections: [
        {
          paragraphs: [
            "Cada vez más empresas contratan a distancia, y pedir al nuevo empleado que imprima, firme y escanee su contrato es un freno innecesario. Firmar un contrato de trabajo electrónicamente resuelve ese paso en minutos.",
          ],
        },
        {
          heading: "¿Es válido un contrato laboral firmado electrónicamente?",
          paragraphs: [
            "En la mayoría de países, los acuerdos laborales privados pueden firmarse electrónicamente con plena validez. Ten en cuenta que algunos trámites ante autoridades laborales pueden exigir formalidades adicionales, por lo que conviene revisar las normas de tu país y tipo de contrato.",
          ],
        },
        {
          heading: "Cómo hacerlo paso a paso",
          paragraphs: [
            "Sube el PDF del contrato y escribe el nombre y correo del empleado. La persona recibe un enlace único, firma desde donde esté y confirma con un código de verificación. El contrato firmado queda disponible para ambas partes, con su rastro de auditoría.",
          ],
        },
        {
          heading: "Ideal para equipos remotos",
          paragraphs: [
            "El nuevo empleado firma su contrato antes del primer día, sin importar en qué ciudad o país esté. Recursos Humanos gana trazabilidad —sabe quién firmó qué y cuándo— y elimina el papeleo de cada incorporación.",
          ],
        },
      ],
    },
    en: {
      title: "How to sign an employment contract electronically",
      excerpt:
        "Hiring remote staff is common, and signing the contract shouldn't be the bottleneck. Here's how to do it.",
      keywords:
        "how to sign an employment contract electronically, sign employment contract online, electronic signature employment contract, remote employment contract signature",
      readingMinutes: 5,
      sections: [
        {
          paragraphs: [
            "More and more companies hire remotely, and asking a new employee to print, sign and scan their contract is an unnecessary drag. Signing an employment contract electronically solves that step in minutes.",
          ],
        },
        {
          heading: "Is an electronically signed employment contract valid?",
          paragraphs: [
            "In most countries, private employment agreements can be signed electronically with full validity. Keep in mind that some procedures before labor authorities may require additional formalities, so it's worth checking the rules in your country and contract type.",
          ],
        },
        {
          heading: "How to do it step by step",
          paragraphs: [
            "Upload the contract PDF and enter the employee's name and email. The person receives a unique link, signs from wherever they are and confirms with a verification code. The signed contract is available to both parties, with its audit trail.",
          ],
        },
        {
          heading: "Ideal for remote teams",
          paragraphs: [
            "The new employee signs their contract before day one, no matter what city or country they're in. HR gains traceability — knowing who signed what and when — and eliminates the paperwork of each onboarding.",
          ],
        },
      ],
    },
  },
  {
    slug: "como-firmar-un-pdf-desde-el-celular",
    date: "2026-06-12",
    es: {
      title: "Cómo firmar un PDF desde el celular",
      excerpt:
        "No necesitas una computadora ni apps complicadas. Te explicamos cómo firmar un PDF directamente desde tu teléfono.",
      keywords:
        "cómo firmar un pdf desde el celular, firmar pdf en el móvil, firmar documento desde el teléfono, firma electrónica móvil",
      readingMinutes: 4,
      sections: [
        {
          paragraphs: [
            "La mayoría de las firmas hoy ocurren desde el teléfono. Firmar un PDF desde el celular es rápido, no requiere instalar nada y funciona igual de bien que desde una computadora.",
          ],
        },
        {
          heading: "Sí, puedes firmar desde el móvil",
          paragraphs: [
            "Cuando recibes un documento para firmar, basta con abrir el enlace que llega a tu correo. Se abre en el navegador del teléfono, sin descargar aplicaciones ni crear cuentas.",
          ],
        },
        {
          heading: "Paso a paso desde el teléfono",
          paragraphs: [
            "Abre el enlace, revisa el documento, dibuja tu firma con el dedo en la pantalla y confirma con el código de verificación que recibes. En segundos el documento queda firmado y la otra parte lo recibe completo.",
          ],
        },
        {
          heading: "Por qué es tan práctico",
          paragraphs: [
            "El lienzo táctil hace que firmar con el dedo sea natural, y al no depender de impresoras ni escáneres puedes cerrar un documento desde cualquier lugar. Cada firma queda respaldada con su rastro de auditoría.",
          ],
        },
      ],
    },
    en: {
      title: "How to sign a PDF from your phone",
      excerpt:
        "You don't need a computer or complicated apps. Here's how to sign a PDF directly from your phone.",
      keywords:
        "how to sign a pdf from your phone, sign pdf on mobile, sign document from phone, mobile electronic signature",
      readingMinutes: 4,
      sections: [
        {
          paragraphs: [
            "Most signatures today happen from the phone. Signing a PDF from your phone is fast, requires no installation and works just as well as from a computer.",
          ],
        },
        {
          heading: "Yes, you can sign from mobile",
          paragraphs: [
            "When you receive a document to sign, you just open the link that arrives in your email. It opens in the phone's browser, with no apps to download or accounts to create.",
          ],
        },
        {
          heading: "Step by step from your phone",
          paragraphs: [
            "Open the link, review the document, draw your signature with your finger on the screen and confirm with the verification code you receive. In seconds the document is signed and the other party receives it complete.",
          ],
        },
        {
          heading: "Why it's so practical",
          paragraphs: [
            "The touch canvas makes signing with your finger natural, and since it doesn't rely on printers or scanners you can close a document from anywhere. Every signature is backed with its audit trail.",
          ],
        },
      ],
    },
  },
  {
    slug: "firma-electronica-gratis",
    date: "2026-06-15",
    es: {
      title: "Firma electrónica gratis: cómo empezar sin costo",
      excerpt:
        "¿Necesitas firmar documentos sin gastar? Te explicamos cómo usar la firma electrónica gratis y cuándo conviene un plan de pago.",
      keywords:
        "firma electrónica gratis, firmar documentos gratis, firma digital gratis, firmar pdf gratis online",
      readingMinutes: 4,
      sections: [
        {
          paragraphs: [
            "Si solo necesitas firmar algunos documentos al mes, no tienes por qué pagar desde el primer día. La firma electrónica gratis es una buena forma de empezar y comprobar que se adapta a tu trabajo.",
          ],
        },
        {
          heading: "¿Existe la firma electrónica gratis?",
          paragraphs: [
            "Sí. Firmiu ofrece un plan gratuito que te permite enviar documentos a firma cada mes sin tarjeta de crédito. Es ideal para freelancers, profesionales y pequeños negocios que empiezan a digitalizar sus firmas.",
          ],
        },
        {
          heading: "Qué incluye empezar gratis",
          paragraphs: [
            "Con el plan gratuito subes tu PDF, lo envías a firma y recibes el documento firmado con su rastro de auditoría completo, igual que en los planes de pago. La diferencia está en la cantidad de documentos que puedes enviar al mes.",
          ],
        },
        {
          heading: "¿Cuándo conviene un plan de pago?",
          paragraphs: [
            "Cuando tu volumen de firmas crece. Si cada mes envías más documentos de los que cubre el plan gratuito, un plan de pago te da más capacidad sin cambiar tu forma de trabajar. Puedes empezar gratis y subir de plan cuando lo necesites.",
          ],
        },
      ],
    },
    en: {
      title: "Free electronic signature: how to start at no cost",
      excerpt:
        "Need to sign documents without spending? Here's how to use a free electronic signature and when a paid plan makes sense.",
      keywords:
        "free electronic signature, sign documents free, free digital signature, sign pdf free online",
      readingMinutes: 4,
      sections: [
        {
          paragraphs: [
            "If you only need to sign a few documents a month, you don't have to pay from day one. A free electronic signature is a good way to start and confirm it fits your work.",
          ],
        },
        {
          heading: "Is there a free electronic signature?",
          paragraphs: [
            "Yes. Firmiu offers a free plan that lets you send documents for signature each month with no credit card. It's ideal for freelancers, professionals and small businesses starting to digitize their signatures.",
          ],
        },
        {
          heading: "What starting for free includes",
          paragraphs: [
            "With the free plan you upload your PDF, send it for signature and receive the signed document with its full audit trail, just like the paid plans. The difference is the number of documents you can send per month.",
          ],
        },
        {
          heading: "When does a paid plan make sense?",
          paragraphs: [
            "When your signing volume grows. If each month you send more documents than the free plan covers, a paid plan gives you more capacity without changing how you work. You can start free and upgrade when you need to.",
          ],
        },
      ],
    },
  },
  {
    slug: "como-elegir-herramienta-de-firma-electronica",
    date: "2026-06-18",
    es: {
      title: "Cómo elegir una herramienta de firma electrónica",
      excerpt:
        "No todas las herramientas de firma sirven para lo mismo. Te damos los criterios para elegir la adecuada para tu negocio.",
      keywords:
        "cómo elegir herramienta de firma electrónica, mejor herramienta de firma electrónica, software de firma electrónica, herramienta para firmar documentos",
      readingMinutes: 6,
      sections: [
        {
          paragraphs: [
            "Hay muchas herramientas para firmar documentos, pero no todas encajan con tu forma de trabajar ni con tu región. Antes de decidir, conviene mirar algunos criterios clave que marcan la diferencia en el día a día.",
          ],
        },
        {
          heading: "Validez legal y rastro de auditoría",
          paragraphs: [
            "Lo primero: que las firmas tengan validez legal en tu país y que la herramienta genere un rastro de auditoría (IP, fecha, dispositivo, verificación). Ese registro es lo que respalda el documento si alguna vez se cuestiona la firma.",
          ],
        },
        {
          heading: "Facilidad para quien firma",
          paragraphs: [
            "Si tu cliente tiene que crear una cuenta o instalar una app para firmar, perderás firmas por el camino. Busca una herramienta donde el firmante reciba un enlace y firme directamente desde el navegador, incluso desde el móvil.",
          ],
        },
        {
          heading: "Precio e idioma",
          paragraphs: [
            "Revisa que el precio se ajuste a tu volumen real de firmas y que exista un plan para empezar sin gran inversión. Para Latinoamérica y España, una herramienta en español y pensada para la región evita fricciones de idioma y soporte.",
          ],
        },
        {
          heading: "En resumen",
          paragraphs: [
            "Elige una herramienta con validez legal, rastro de auditoría, una experiencia sencilla para el firmante y un precio acorde a tu volumen. Firmiu reúne esos puntos con un enfoque en Latinoamérica, España y el público hispano de Estados Unidos.",
          ],
        },
      ],
    },
    en: {
      title: "How to choose an electronic signature tool",
      excerpt:
        "Not all signing tools are for the same thing. Here are the criteria to choose the right one for your business.",
      keywords:
        "how to choose electronic signature tool, best electronic signature tool, electronic signature software, tool to sign documents",
      readingMinutes: 6,
      sections: [
        {
          paragraphs: [
            "There are many tools to sign documents, but not all fit your way of working or your region. Before deciding, it's worth looking at a few key criteria that make a real difference day to day.",
          ],
        },
        {
          heading: "Legal validity and audit trail",
          paragraphs: [
            "First: that signatures are legally valid in your country and that the tool generates an audit trail (IP, date, device, verification). That record is what backs the document if a signature is ever challenged.",
          ],
        },
        {
          heading: "Ease for the signer",
          paragraphs: [
            "If your client has to create an account or install an app to sign, you'll lose signatures along the way. Look for a tool where the signer receives a link and signs directly from the browser, even from mobile.",
          ],
        },
        {
          heading: "Price and language",
          paragraphs: [
            "Check that the price fits your real signing volume and that there's a plan to start without a big investment. For Latin America and Spain, a tool in Spanish and built for the region avoids language and support friction.",
          ],
        },
        {
          heading: "In short",
          paragraphs: [
            "Choose a tool with legal validity, an audit trail, a simple experience for the signer and a price that matches your volume. Firmiu brings those together with a focus on Latin America, Spain and the US Hispanic audience.",
          ],
        },
      ],
    },
  },
  {
    slug: "que-documentos-puedes-firmar-electronicamente",
    date: "2026-06-20",
    es: {
      title: "Qué documentos puedes firmar electrónicamente",
      excerpt:
        "La firma electrónica sirve para muchos más documentos de los que imaginas. Te mostramos los más comunes y las excepciones.",
      keywords:
        "qué documentos puedes firmar electrónicamente, documentos firma electrónica, qué se puede firmar online, tipos de documentos firma digital",
      readingMinutes: 5,
      sections: [
        {
          paragraphs: [
            "La firma electrónica no se limita a un par de casos: cubre la mayoría de los documentos privados que firman empresas y profesionales cada día. Aquí tienes los más habituales y también las excepciones a tener en cuenta.",
          ],
        },
        {
          heading: "Documentos que se firman a diario",
          paragraphs: [
            "Contratos de servicios, contratos de arrendamiento, acuerdos comerciales, presupuestos y cotizaciones, acuerdos de confidencialidad (NDA), órdenes de trabajo, consentimientos, autorizaciones y la mayoría de acuerdos entre particulares y empresas.",
            "En la práctica, si hoy imprimes un documento solo para firmarlo y escanearlo, es muy probable que puedas firmarlo electrónicamente.",
          ],
        },
        {
          heading: "Documentos con formalidades especiales",
          paragraphs: [
            "Algunos actos pueden requerir formalidades adicionales o intervención notarial según el país, como ciertos testamentos, determinados actos de constitución o trámites específicos ante el Estado. En esos casos conviene revisar las normas locales antes de firmar.",
          ],
        },
        {
          heading: "La regla práctica",
          paragraphs: [
            "Para el día a día de un negocio —contratos, acuerdos, presupuestos y autorizaciones— la firma electrónica con rastro de auditoría es suficiente y mucho más ágil. Si un documento exige una formalidad especial, tu asesor legal o tu país te lo indicarán.",
          ],
        },
      ],
    },
    en: {
      title: "What documents can you sign electronically",
      excerpt:
        "Electronic signatures work for far more documents than you'd think. Here are the most common ones and the exceptions.",
      keywords:
        "what documents can you sign electronically, electronic signature documents, what can you sign online, types of documents digital signature",
      readingMinutes: 5,
      sections: [
        {
          paragraphs: [
            "Electronic signatures aren't limited to a couple of cases: they cover most of the private documents companies and professionals sign every day. Here are the most common ones, along with the exceptions to keep in mind.",
          ],
        },
        {
          heading: "Documents signed every day",
          paragraphs: [
            "Service contracts, lease agreements, commercial agreements, quotes and estimates, non-disclosure agreements (NDAs), work orders, consents, authorizations and most agreements between individuals and companies.",
            "In practice, if today you print a document just to sign and scan it, you can most likely sign it electronically.",
          ],
        },
        {
          heading: "Documents with special formalities",
          paragraphs: [
            "Some acts may require additional formalities or notarial involvement depending on the country, such as certain wills, specific incorporation acts or particular government procedures. In those cases it's best to check local rules before signing.",
          ],
        },
        {
          heading: "The practical rule",
          paragraphs: [
            "For a business's day-to-day — contracts, agreements, quotes and authorizations — an electronic signature with an audit trail is enough and far quicker. If a document requires a special formality, your legal advisor or your country will let you know.",
          ],
        },
      ],
    },
  },
  {
    slug: "como-firmar-contrato-de-compraventa-online",
    date: "2026-01-08",
    es: {
      title: "Cómo firmar un contrato de compraventa online",
      excerpt:
        "Vender un bien ya no exige juntarse a firmar en papel. Te explicamos cómo firmar un contrato de compraventa online con validez.",
      keywords:
        "cómo firmar un contrato de compraventa online, firmar contrato de compraventa, firma electrónica compraventa, contrato de compraventa de vehículo firma",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["Cerrar una compraventa rápido marca la diferencia entre concretar la operación o perderla. Hoy puedes firmar un contrato de compraventa online en minutos, sin que comprador y vendedor coincidan en el mismo lugar."] },
        { heading: "¿Es válido firmar una compraventa online?", paragraphs: ["Sí, para la mayoría de bienes muebles —vehículos, equipos, mercancías— la firma electrónica es válida para el contrato de compraventa privado. Ten en cuenta que la compraventa de inmuebles suele requerir escritura pública ante notario según el país, así que conviene revisarlo en esos casos."] },
        { heading: "Cómo hacerlo paso a paso", paragraphs: ["Una de las partes sube el PDF del contrato y escribe el nombre y correo de la otra. Esta recibe un enlace único, firma desde su teléfono o computadora y confirma con un código. El contrato firmado queda disponible para ambos, con su rastro de auditoría."] },
        { heading: "Por qué conviene", paragraphs: ["Cierras la operación el mismo día y cada firma queda respaldada con IP, fecha, dispositivo y verificación. Si vendes seguido, guardas tus contactos y envías nuevos contratos en segundos."] },
      ],
    },
    en: {
      title: "How to sign a sales contract online",
      excerpt:
        "Selling an item no longer means meeting to sign on paper. Here's how to sign a sales contract online with validity.",
      keywords:
        "how to sign a sales contract online, sign sales contract, electronic signature sales contract, vehicle sales contract signature",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["Closing a sale fast is the difference between landing the deal or losing it. Today you can sign a sales contract online in minutes, without buyer and seller being in the same place."] },
        { heading: "Is signing a sale online valid?", paragraphs: ["Yes, for most movable goods — vehicles, equipment, merchandise — electronic signatures are valid for a private sales contract. Keep in mind that the sale of real estate often requires a notarized deed depending on the country, so check it in those cases."] },
        { heading: "How to do it step by step", paragraphs: ["One party uploads the contract PDF and enters the other's name and email. They receive a unique link, sign from their phone or computer and confirm with a code. The signed contract is available to both, with its audit trail."] },
        { heading: "Why it's worth it", paragraphs: ["You close the deal the same day and every signature is backed with IP, date, device and verification. If you sell often, save your contacts and send new contracts in seconds."] },
      ],
    },
  },
  {
    slug: "como-firmar-un-nda-online",
    date: "2026-01-22",
    es: {
      title: "Cómo firmar un acuerdo de confidencialidad (NDA) online",
      excerpt:
        "Antes de compartir información sensible, firma el NDA. Te explicamos cómo hacerlo online en minutos.",
      keywords:
        "cómo firmar un NDA online, firmar acuerdo de confidencialidad, firma electrónica NDA, firmar contrato de confidencialidad",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["Un acuerdo de confidencialidad (NDA) suele ser el primer documento que firmas antes de hablar de un proyecto. Cuanto antes se firme, antes avanzas: por eso firmarlo online es la opción práctica."] },
        { heading: "¿El NDA firmado electrónicamente es válido?", paragraphs: ["Sí. Un NDA es un acuerdo privado entre partes y la firma electrónica es válida para este tipo de documentos. El rastro de auditoría respalda quién firmó y cuándo, justo lo que necesitas si la confidencialidad llega a discutirse."] },
        { heading: "Cómo firmarlo en minutos", paragraphs: ["Sube el PDF del NDA, escribe el correo de la otra parte y envíalo. La persona abre el enlace, firma y confirma con un código. En segundos tienes el acuerdo firmado, listo para empezar a colaborar."] },
        { heading: "Ideal para startups y agencias", paragraphs: ["Si compartes ideas, código o datos con clientes y partners, firmar NDAs a distancia te ahorra días de espera y deja todo documentado."] },
      ],
    },
    en: {
      title: "How to sign a non-disclosure agreement (NDA) online",
      excerpt:
        "Before sharing sensitive information, sign the NDA. Here's how to do it online in minutes.",
      keywords:
        "how to sign an NDA online, sign non-disclosure agreement, electronic signature NDA, sign confidentiality agreement",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["A non-disclosure agreement (NDA) is often the first document you sign before discussing a project. The sooner it's signed, the sooner you move forward: that's why signing it online is the practical option."] },
        { heading: "Is an electronically signed NDA valid?", paragraphs: ["Yes. An NDA is a private agreement between parties and electronic signatures are valid for this kind of document. The audit trail backs who signed and when, exactly what you need if confidentiality is ever disputed."] },
        { heading: "How to sign it in minutes", paragraphs: ["Upload the NDA PDF, enter the other party's email and send it. They open the link, sign and confirm with a code. In seconds you have the signed agreement, ready to start collaborating."] },
        { heading: "Ideal for startups and agencies", paragraphs: ["If you share ideas, code or data with clients and partners, signing NDAs remotely saves you days of waiting and keeps everything documented."] },
      ],
    },
  },
  {
    slug: "como-firmar-contrato-de-servicios-online",
    date: "2026-02-05",
    es: {
      title: "Cómo firmar un contrato de prestación de servicios online",
      excerpt:
        "El contrato de servicios es el que cierra cada proyecto. Aprende a firmarlo online y empezar a trabajar el mismo día.",
      keywords:
        "cómo firmar un contrato de servicios online, firmar contrato de prestación de servicios, firma electrónica contrato de servicios, contrato de servicios firma digital",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["El contrato de prestación de servicios es el documento que da el visto bueno para empezar un trabajo. Firmarlo online evita que ese paso retrase el inicio del proyecto."] },
        { heading: "¿Es válido firmar servicios online?", paragraphs: ["Sí. Los contratos de servicios entre privados pueden firmarse electrónicamente con plena validez en LATAM, España y EE. UU. Lo importante es contar con un rastro de auditoría que respalde la firma."] },
        { heading: "Pasos para firmarlo", paragraphs: ["Sube el PDF, escribe el correo del cliente y envíalo. El cliente firma desde su móvil o computadora y confirma con un código. Recibes el contrato firmado y arrancas el encargo."] },
        { heading: "Perfecto para freelancers y agencias", paragraphs: ["Si vives de proyectos, cada día que tardas en firmar es un día que tardas en cobrar. Firmar online acelera el cierre y proyecta profesionalismo."] },
      ],
    },
    en: {
      title: "How to sign a service agreement online",
      excerpt:
        "The service agreement is what kicks off every project. Learn to sign it online and start working the same day.",
      keywords:
        "how to sign a service agreement online, sign service contract, electronic signature service agreement, service contract digital signature",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["The service agreement is the document that greenlights a job. Signing it online keeps that step from delaying the project's start."] },
        { heading: "Is signing a service agreement online valid?", paragraphs: ["Yes. Service contracts between private parties can be signed electronically with full validity across Latin America, Spain and the US. What matters is having an audit trail that backs the signature."] },
        { heading: "Steps to sign it", paragraphs: ["Upload the PDF, enter the client's email and send it. The client signs from their phone or computer and confirms with a code. You receive the signed contract and start the engagement."] },
        { heading: "Perfect for freelancers and agencies", paragraphs: ["If you live on projects, every day you take to sign is a day you take to get paid. Signing online speeds up the close and projects professionalism."] },
      ],
    },
  },
  {
    slug: "como-firmar-presupuesto-o-cotizacion",
    date: "2026-02-18",
    es: {
      title: "Cómo firmar un presupuesto o cotización online",
      excerpt:
        "Un presupuesto firmado es un trabajo aprobado. Aprende a conseguir esa firma online en minutos.",
      keywords:
        "cómo firmar un presupuesto online, firmar cotización, firma electrónica presupuesto, aprobar presupuesto con firma",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["Un presupuesto solo cuenta cuando el cliente lo aprueba. Conseguir esa firma de forma digital convierte una cotización en un trabajo confirmado, sin idas y vueltas."] },
        { heading: "Por qué firmar el presupuesto", paragraphs: ["La firma del cliente sobre el presupuesto deja claro el alcance, el precio y los plazos acordados. Si surge una diferencia, tienes el documento firmado con su rastro de auditoría como respaldo."] },
        { heading: "Cómo hacerlo", paragraphs: ["Sube el PDF del presupuesto, escribe el correo del cliente y envíalo. El cliente lo revisa, firma desde el móvil y confirma con un código. Recibes la aprobación y comienzas el trabajo."] },
        { heading: "Menos cotizaciones perdidas", paragraphs: ["Pedir la firma en el momento reduce las cotizaciones que quedan en el aire. El cliente decide y firma sin fricción, y tú avanzas."] },
      ],
    },
    en: {
      title: "How to sign a quote or estimate online",
      excerpt:
        "A signed quote is an approved job. Learn to get that signature online in minutes.",
      keywords:
        "how to sign a quote online, sign estimate, electronic signature quote, approve quote with signature",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["A quote only counts when the client approves it. Getting that signature digitally turns an estimate into a confirmed job, without back-and-forth."] },
        { heading: "Why sign the quote", paragraphs: ["The client's signature on the quote makes the scope, price and agreed timelines clear. If a disagreement comes up, you have the signed document with its audit trail as backing."] },
        { heading: "How to do it", paragraphs: ["Upload the quote PDF, enter the client's email and send it. The client reviews it, signs from mobile and confirms with a code. You receive the approval and start the work."] },
        { heading: "Fewer lost quotes", paragraphs: ["Asking for the signature on the spot reduces quotes left hanging. The client decides and signs without friction, and you move forward."] },
      ],
    },
  },
  {
    slug: "como-firmar-contrato-de-prestamo",
    date: "2026-03-04",
    es: {
      title: "Cómo firmar un contrato de préstamo entre particulares",
      excerpt:
        "Prestar dinero sin un documento firmado es un riesgo. Aprende a firmar un contrato de préstamo online.",
      keywords:
        "cómo firmar un contrato de préstamo, firmar pagaré online, firma electrónica préstamo entre particulares, contrato de préstamo firma digital",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["Un préstamo entre particulares siempre debería quedar por escrito y firmado. Hacerlo online es rápido y deja constancia clara de las condiciones acordadas."] },
        { heading: "¿Es válido firmarlo electrónicamente?", paragraphs: ["Sí, el contrato de préstamo es un acuerdo privado y puede firmarse electrónicamente. Ten presente que los intereses y ciertas formalidades varían por país, así que conviene reflejar bien plazos e importes."] },
        { heading: "Cómo hacerlo", paragraphs: ["Sube el PDF con las condiciones del préstamo, escribe el correo de la otra parte y envíalo. La persona firma desde su teléfono y confirma con un código. Ambos quedan con el contrato firmado y su rastro de auditoría."] },
        { heading: "Tranquilidad para las dos partes", paragraphs: ["Dejar el préstamo documentado y firmado evita malentendidos y respalda quién acordó qué, con fecha y verificación."] },
      ],
    },
    en: {
      title: "How to sign a private loan agreement",
      excerpt:
        "Lending money without a signed document is a risk. Learn to sign a loan agreement online.",
      keywords:
        "how to sign a loan agreement, sign promissory note online, electronic signature private loan, loan contract digital signature",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["A loan between private parties should always be put in writing and signed. Doing it online is fast and leaves a clear record of the agreed terms."] },
        { heading: "Is signing it electronically valid?", paragraphs: ["Yes, a loan agreement is a private contract and can be signed electronically. Keep in mind that interest and certain formalities vary by country, so it's worth clearly stating terms and amounts."] },
        { heading: "How to do it", paragraphs: ["Upload the PDF with the loan terms, enter the other party's email and send it. They sign from their phone and confirm with a code. Both end up with the signed contract and its audit trail."] },
        { heading: "Peace of mind for both parties", paragraphs: ["Keeping the loan documented and signed avoids misunderstandings and backs who agreed to what, with date and verification."] },
      ],
    },
  },
  {
    slug: "como-firmar-poder-o-autorizacion",
    date: "2026-03-19",
    es: {
      title: "Cómo firmar una autorización o poder simple online",
      excerpt:
        "Autorizar a alguien a actuar en tu nombre puede hacerse online. Te explicamos cómo firmar la autorización.",
      keywords:
        "cómo firmar una autorización online, firmar poder simple, firma electrónica autorización, carta de autorización firma",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["Muchas gestiones requieren una autorización firmada: recoger un documento, representar a alguien en un trámite o dar permiso para una gestión puntual. Firmarla online evita desplazamientos."] },
        { heading: "¿Sirve la firma electrónica?", paragraphs: ["Para autorizaciones y poderes simples entre privados, la firma electrónica es válida. Algunos poderes que la ley exige otorgar ante notario quedan fuera, así que conviene revisar el tipo de poder en tu país."] },
        { heading: "Cómo firmarla", paragraphs: ["Sube el PDF de la autorización, escribe el correo de quien debe firmar y envíalo. La persona firma desde su móvil y confirma con un código. La autorización queda firmada y descargable al instante."] },
        { heading: "Rápido y con respaldo", paragraphs: ["Cada autorización guarda IP, fecha, dispositivo y verificación, dejando claro quién la otorgó y cuándo."] },
      ],
    },
    en: {
      title: "How to sign an authorization or simple power online",
      excerpt:
        "Authorizing someone to act on your behalf can be done online. Here's how to sign the authorization.",
      keywords:
        "how to sign an authorization online, sign simple power, electronic signature authorization, authorization letter signature",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["Many tasks require a signed authorization: picking up a document, representing someone in a procedure or granting permission for a specific task. Signing it online avoids travel."] },
        { heading: "Does an electronic signature work?", paragraphs: ["For simple authorizations and powers between private parties, electronic signatures are valid. Some powers that the law requires to be granted before a notary fall outside this, so check the type of power in your country."] },
        { heading: "How to sign it", paragraphs: ["Upload the authorization PDF, enter the signer's email and send it. They sign from mobile and confirm with a code. The authorization is signed and downloadable instantly."] },
        { heading: "Fast and backed", paragraphs: ["Every authorization stores IP, date, device and verification, making clear who granted it and when."] },
      ],
    },
  },
  {
    slug: "como-firmar-consentimiento-informado-online",
    date: "2026-04-02",
    es: {
      title: "Cómo firmar un consentimiento informado online",
      excerpt:
        "Clínicas y consultas pueden recoger el consentimiento del paciente sin papel. Te explicamos cómo.",
      keywords:
        "cómo firmar un consentimiento informado online, consentimiento informado digital, firma electrónica consentimiento, firmar consentimiento paciente",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["El consentimiento informado es un paso obligado antes de muchos tratamientos. Recogerlo de forma digital agiliza la consulta y evita acumular formularios en papel."] },
        { heading: "¿Es válido el consentimiento digital?", paragraphs: ["Como acuerdo privado entre el profesional y el paciente, la firma electrónica es válida. Conviene revisar los requisitos de tu colegio profesional y país, ya que algunas especialidades tienen normas específicas."] },
        { heading: "Cómo hacerlo", paragraphs: ["Sube el PDF del consentimiento, escribe el correo o pásalo en una tablet, y el paciente firma con el dedo y confirma con un código. El documento queda firmado con su rastro de auditoría."] },
        { heading: "Más ágil para tu consulta", paragraphs: ["El paciente firma antes de la cita o en recepción, sin papeleo, y tú conservas cada consentimiento documentado y fácil de localizar."] },
      ],
    },
    en: {
      title: "How to sign an informed consent online",
      excerpt:
        "Clinics and practices can collect patient consent paper-free. Here's how.",
      keywords:
        "how to sign an informed consent online, digital informed consent, electronic signature consent, sign patient consent",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["Informed consent is a required step before many treatments. Collecting it digitally speeds up the visit and avoids piling up paper forms."] },
        { heading: "Is digital consent valid?", paragraphs: ["As a private agreement between the professional and the patient, electronic signatures are valid. It's worth checking your professional board's and country's requirements, since some specialties have specific rules."] },
        { heading: "How to do it", paragraphs: ["Upload the consent PDF, enter the email or hand it over on a tablet, and the patient signs with their finger and confirms with a code. The document is signed with its audit trail."] },
        { heading: "Smoother for your practice", paragraphs: ["The patient signs before the appointment or at reception, with no paperwork, and you keep every consent documented and easy to find."] },
      ],
    },
  },
  {
    slug: "firmar-contrato-con-cliente-en-otro-pais",
    date: "2026-04-15",
    es: {
      title: "Cómo firmar un contrato con un cliente en otro país",
      excerpt:
        "Trabajar con clientes internacionales no debería frenarse por la firma. Te explicamos cómo cerrar a distancia.",
      keywords:
        "firmar contrato con cliente en otro país, firma electrónica internacional, firmar contrato internacional online, contrato a distancia firma",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["Cuando tu cliente está en otro país y otra zona horaria, enviar contratos por mensajería es lento y caro. La firma electrónica permite cerrar acuerdos internacionales en minutos."] },
        { heading: "¿Vale firmar entre países?", paragraphs: ["Sí. La firma electrónica se reconoce en Latinoamérica, España y Estados Unidos, y es habitual en contratos comerciales privados entre empresas de distintos países. El rastro de auditoría respalda la operación."] },
        { heading: "Cómo cerrar a distancia", paragraphs: ["Subes el contrato, escribes el correo de tu cliente —esté donde esté— y lo envías. Firma desde su navegador y confirma con un código. Ambos quedan con el documento firmado."] },
        { heading: "Sin mensajería ni esperas", paragraphs: ["Olvídate de imprimir y enviar papeles al extranjero. Cierras el mismo día y dejas constancia de quién firmó, cuándo y desde dónde."] },
      ],
    },
    en: {
      title: "How to sign a contract with a client in another country",
      excerpt:
        "Working with international clients shouldn't be slowed by signing. Here's how to close remotely.",
      keywords:
        "sign contract with client in another country, international electronic signature, sign international contract online, remote contract signature",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["When your client is in another country and time zone, sending contracts by courier is slow and expensive. Electronic signatures let you close international deals in minutes."] },
        { heading: "Is signing across countries valid?", paragraphs: ["Yes. Electronic signatures are recognized across Latin America, Spain and the US, and are common in private commercial contracts between companies in different countries. The audit trail backs the deal."] },
        { heading: "How to close remotely", paragraphs: ["You upload the contract, enter your client's email — wherever they are — and send it. They sign from their browser and confirm with a code. Both end up with the signed document."] },
        { heading: "No courier, no waiting", paragraphs: ["Forget printing and sending papers abroad. You close the same day and keep a record of who signed, when and from where."] },
      ],
    },
  },
  {
    slug: "cuanto-cuesta-la-firma-electronica",
    date: "2026-04-29",
    es: {
      title: "¿Cuánto cuesta la firma electrónica?",
      excerpt:
        "El precio de firmar documentos online varía mucho. Te explicamos de qué depende y cómo empezar sin gastar.",
      keywords:
        "cuánto cuesta la firma electrónica, precio firma electrónica, firma digital precio, cuánto cuesta firmar documentos online",
      readingMinutes: 5,
      sections: [
        { paragraphs: ["Una de las primeras preguntas al elegir una herramienta de firma es cuánto cuesta. La respuesta depende sobre todo de cuántos documentos firmas al mes y de las funciones que necesitas."] },
        { heading: "¿De qué depende el precio?", paragraphs: ["Casi todas las herramientas cobran por volumen: a más documentos al mes, más cuesta el plan. También influyen funciones como almacenamiento, número de usuarios o integraciones. Lo importante es pagar por el volumen que de verdad usas."] },
        { heading: "Cómo empezar sin gastar", paragraphs: ["No necesitas pagar desde el primer día. Firmiu ofrece un plan gratuito para firmar documentos cada mes sin tarjeta de crédito, ideal para probar y empezar. Cuando tu volumen crece, subes a un plan de pago."] },
        { heading: "El cálculo que importa", paragraphs: ["Compara el costo del plan con el tiempo y el papel que ahorras: imprimir, enviar y perseguir firmas cuesta horas. Una herramienta de firma suele pagarse sola con los primeros documentos cerrados a tiempo."] },
      ],
    },
    en: {
      title: "How much does electronic signature cost?",
      excerpt:
        "The price of signing documents online varies a lot. Here's what it depends on and how to start at no cost.",
      keywords:
        "how much does electronic signature cost, electronic signature price, digital signature pricing, cost to sign documents online",
      readingMinutes: 5,
      sections: [
        { paragraphs: ["One of the first questions when choosing a signing tool is how much it costs. The answer depends mainly on how many documents you sign per month and the features you need."] },
        { heading: "What does the price depend on?", paragraphs: ["Almost all tools charge by volume: more documents per month, more expensive the plan. Features like storage, number of users or integrations also matter. The key is paying for the volume you actually use."] },
        { heading: "How to start at no cost", paragraphs: ["You don't need to pay from day one. Firmiu offers a free plan to sign documents each month with no credit card, ideal for trying it out and getting started. When your volume grows, you upgrade to a paid plan."] },
        { heading: "The calculation that matters", paragraphs: ["Compare the plan's cost with the time and paper you save: printing, sending and chasing signatures costs hours. A signing tool usually pays for itself with the first deals closed on time."] },
      ],
    },
  },
  {
    slug: "alternativa-a-docusign-latinoamerica",
    date: "2026-05-06",
    es: {
      title: "Alternativa a DocuSign para Latinoamérica",
      excerpt:
        "¿Buscas una opción más simple y en español para firmar documentos? Te contamos qué mirar en una alternativa.",
      keywords:
        "alternativa a DocuSign, alternativa firma electrónica latinoamérica, herramienta de firma en español, firma electrónica simple y económica",
      readingMinutes: 5,
      sections: [
        { paragraphs: ["Las grandes plataformas de firma electrónica son potentes, pero a veces resultan complejas o caras para lo que un negocio pequeño o un profesional necesita. Por eso muchos buscan una alternativa más simple y pensada para su región."] },
        { heading: "Qué buscar en una alternativa", paragraphs: ["Para Latinoamérica y España conviene una herramienta en español, con precios acordes al volumen real, validez legal en tu país y una experiencia sencilla: que tu cliente firme desde un enlace, sin crear cuenta ni instalar nada."] },
        { heading: "Dónde encaja Firmiu", paragraphs: ["Firmiu se enfoca justo en eso: firmar y enviar documentos PDF de forma rápida, en español, con rastro de auditoría y un plan gratuito para empezar. Está pensado para contadores, abogados, inmobiliarias, freelancers y pymes de la región."] },
        { heading: "La decisión práctica", paragraphs: ["Si necesitas funciones empresariales muy específicas, una plataforma grande puede tener sentido. Si lo que quieres es firmar contratos y acuerdos sin complicaciones y sin pagar de más, una alternativa simple suele convertir mejor en tu día a día."] },
      ],
    },
    en: {
      title: "A DocuSign alternative for Latin America",
      excerpt:
        "Looking for a simpler, Spanish-first option to sign documents? Here's what to look for in an alternative.",
      keywords:
        "DocuSign alternative, electronic signature alternative latin america, signing tool in spanish, simple affordable electronic signature",
      readingMinutes: 5,
      sections: [
        { paragraphs: ["Large electronic signature platforms are powerful, but they can be complex or expensive for what a small business or professional actually needs. That's why many look for a simpler alternative built for their region."] },
        { heading: "What to look for in an alternative", paragraphs: ["For Latin America and Spain it helps to have a tool in Spanish, with pricing that matches your real volume, legal validity in your country and a simple experience: your client signs from a link, without creating an account or installing anything."] },
        { heading: "Where Firmiu fits", paragraphs: ["Firmiu focuses on exactly that: signing and sending PDF documents fast, in Spanish, with an audit trail and a free plan to start. It's built for accountants, lawyers, real-estate agents, freelancers and SMBs in the region."] },
        { heading: "The practical decision", paragraphs: ["If you need very specific enterprise features, a large platform can make sense. If what you want is to sign contracts and agreements without complications and without overpaying, a simple alternative usually converts better in your day-to-day."] },
      ],
    },
  },
  {
    slug: "cobrar-mas-rapido-firmando-contratos-online",
    date: "2026-05-20",
    es: {
      title: "Cómo cobrar más rápido firmando contratos online",
      excerpt:
        "El tiempo entre acordar y firmar es tiempo sin cobrar. Te explicamos cómo acortarlo con la firma online.",
      keywords:
        "cobrar más rápido firmando online, acelerar cobro con firma electrónica, firmar contrato y empezar a cobrar, reducir tiempos de cobro",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["Entre que cierras un acuerdo de palabra y empiezas a trabajar (y a cobrar) suele haber un cuello de botella: la firma del contrato. Acortar ese paso acelera directamente tu flujo de caja."] },
        { heading: "El papel frena el cobro", paragraphs: ["Imprimir, firmar, escanear y reenviar puede tardar días, sobre todo si el cliente está ocupado o lejos. Cada día de demora es un día que no facturas ese proyecto."] },
        { heading: "Firmar online lo acelera", paragraphs: ["Con la firma electrónica el cliente recibe un enlace y firma en minutos desde su móvil. En cuanto firma, puedes empezar el trabajo o emitir el cobro, con el contrato respaldado por su rastro de auditoría."] },
        { heading: "Pequeño cambio, gran impacto", paragraphs: ["Reducir el tiempo de firma de días a minutos, multiplicado por cada cliente al mes, se traduce en cobrar antes y con menos fricción."] },
      ],
    },
    en: {
      title: "How to get paid faster by signing contracts online",
      excerpt:
        "The time between agreeing and signing is time without getting paid. Here's how to shorten it with online signing.",
      keywords:
        "get paid faster signing online, speed up payment with electronic signature, sign contract and start billing, reduce payment times",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["Between closing a verbal deal and starting work (and getting paid) there's usually a bottleneck: signing the contract. Shortening that step directly accelerates your cash flow."] },
        { heading: "Paper slows down payment", paragraphs: ["Printing, signing, scanning and resending can take days, especially if the client is busy or far away. Every day of delay is a day you don't bill that project."] },
        { heading: "Signing online speeds it up", paragraphs: ["With electronic signatures the client receives a link and signs in minutes from their phone. As soon as they sign, you can start the work or issue the invoice, with the contract backed by its audit trail."] },
        { heading: "Small change, big impact", paragraphs: ["Cutting signing time from days to minutes, multiplied by each client per month, means getting paid sooner and with less friction."] },
      ],
    },
  },
  {
    slug: "como-firmar-un-documento-word",
    date: "2026-05-27",
    es: {
      title: "Cómo firmar un documento de Word",
      excerpt:
        "¿Tienes el contrato en Word y necesitas firmarlo? Te explicamos la forma más simple y con validez.",
      keywords:
        "cómo firmar un documento word, firmar documento word online, convertir word a pdf y firmar, firma electrónica documento word",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["Muchos contratos se redactan en Word, pero para firmarlos y conservarlos conviene un formato estable. La forma más simple y segura de firmar un documento de Word es convertirlo a PDF y firmar ese PDF."] },
        { heading: "Por qué pasar a PDF", paragraphs: ["El PDF fija el contenido: el documento no cambia de formato ni se edita por accidente, y es el estándar para documentos firmados. Desde Word puedes guardar o exportar como PDF en un par de clics."] },
        { heading: "Cómo firmarlo", paragraphs: ["Una vez en PDF, súbelo y escribe el correo de quien debe firmar. La persona firma desde el navegador y confirma con un código. Recibes el documento firmado con su rastro de auditoría."] },
        { heading: "Listo para enviar", paragraphs: ["Así evitas problemas de formato y obtienes un documento firmado, estable y respaldado, listo para archivar o compartir."] },
      ],
    },
    en: {
      title: "How to sign a Word document",
      excerpt:
        "Have the contract in Word and need to sign it? Here's the simplest way, with validity.",
      keywords:
        "how to sign a word document, sign word document online, convert word to pdf and sign, electronic signature word document",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["Many contracts are drafted in Word, but to sign and keep them you want a stable format. The simplest, safest way to sign a Word document is to convert it to PDF and sign that PDF."] },
        { heading: "Why move to PDF", paragraphs: ["PDF locks the content: the document doesn't change formatting or get edited by accident, and it's the standard for signed documents. From Word you can save or export as PDF in a couple of clicks."] },
        { heading: "How to sign it", paragraphs: ["Once it's a PDF, upload it and enter the email of whoever must sign. They sign from the browser and confirm with a code. You receive the signed document with its audit trail."] },
        { heading: "Ready to send", paragraphs: ["This avoids formatting issues and gives you a signed, stable, backed document, ready to file or share."] },
      ],
    },
  },
  {
    slug: "como-anadir-una-firma-a-un-pdf",
    date: "2026-06-05",
    es: {
      title: "Cómo añadir una firma a un PDF",
      excerpt:
        "Añadir tu firma a un PDF es más fácil de lo que parece. Te explicamos cómo hacerlo y dejarlo con validez.",
      keywords:
        "cómo añadir una firma a un pdf, insertar firma en pdf, poner firma en pdf, firmar pdf online",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["Añadir una firma a un PDF no debería obligarte a imprimir, firmar a mano y escanear. Con una herramienta de firma electrónica lo haces directamente sobre el documento, en minutos."] },
        { heading: "Tu propia firma o la de un tercero", paragraphs: ["Puedes firmar tú mismo un PDF o enviarlo para que lo firme otra persona. En ambos casos la firma se dibuja en pantalla y se estampa sobre el documento, sin perder calidad ni formato."] },
        { heading: "Cómo hacerlo", paragraphs: ["Sube el PDF, indica quién debe firmar y envía. La firma se realiza desde el navegador, incluso desde el móvil, y se confirma con un código. El PDF queda firmado y con su rastro de auditoría."] },
        { heading: "Una firma que vale", paragraphs: ["A diferencia de pegar una imagen de tu firma, una firma electrónica con rastro de auditoría deja constancia de quién firmó, cuándo y desde dónde, lo que le da respaldo legal."] },
      ],
    },
    en: {
      title: "How to add a signature to a PDF",
      excerpt:
        "Adding your signature to a PDF is easier than it seems. Here's how to do it and keep it valid.",
      keywords:
        "how to add a signature to a pdf, insert signature in pdf, put signature on pdf, sign pdf online",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["Adding a signature to a PDF shouldn't force you to print, sign by hand and scan. With an electronic signature tool you do it directly on the document, in minutes."] },
        { heading: "Your own signature or someone else's", paragraphs: ["You can sign a PDF yourself or send it for someone else to sign. In both cases the signature is drawn on screen and stamped onto the document, without losing quality or format."] },
        { heading: "How to do it", paragraphs: ["Upload the PDF, indicate who must sign and send it. Signing happens from the browser, even from mobile, and is confirmed with a code. The PDF is signed and carries its audit trail."] },
        { heading: "A signature that counts", paragraphs: ["Unlike pasting an image of your signature, an electronic signature with an audit trail records who signed, when and from where, which gives it legal backing."] },
      ],
    },
  },
  {
    slug: "como-solicitar-firma-cliente-por-correo",
    date: "2026-01-15",
    es: {
      title: "Cómo solicitar la firma de un cliente por correo",
      excerpt:
        "Pedir una firma por correo de forma profesional aumenta tus probabilidades de cerrar. Te explicamos cómo.",
      keywords:
        "cómo solicitar la firma de un cliente, pedir firma por correo, solicitar firma electrónica, enviar documento a firmar por email",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["Mandar un PDF adjunto y pedir \"fírmalo y reenvíamelo\" suele terminar en silencio. Solicitar la firma con un enlace claro y un proceso simple aumenta mucho las probabilidades de que tu cliente firme."] },
        { heading: "El problema del adjunto", paragraphs: ["Si el cliente tiene que descargar, imprimir, firmar, escanear y reenviar, la mayoría lo deja para después. Cada paso extra es una oportunidad de que el documento se quede sin firmar."] },
        { heading: "La forma que sí funciona", paragraphs: ["Con una herramienta de firma, el cliente recibe un correo con un enlace, abre el documento y firma en segundos desde el navegador. No necesita cuenta ni instalar nada."] },
        { heading: "Y si tarda en firmar", paragraphs: ["Un recordatorio amable suele bastar para cerrar el documento el mismo día. Todo queda registrado con su rastro de auditoría."] },
      ],
    },
    en: {
      title: "How to request a client's signature by email",
      excerpt:
        "Asking for a signature by email professionally increases your chances of closing. Here's how.",
      keywords:
        "how to request a client's signature, ask for signature by email, request electronic signature, send document to sign by email",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["Sending a PDF attachment and asking \"sign it and send it back\" usually ends in silence. Requesting the signature with a clear link and a simple process greatly increases the chances your client signs."] },
        { heading: "The attachment problem", paragraphs: ["If the client has to download, print, sign, scan and resend, most leave it for later. Every extra step is a chance for the document to go unsigned."] },
        { heading: "The way that works", paragraphs: ["With a signing tool, the client receives an email with a link, opens the document and signs in seconds from the browser. They need no account and install nothing."] },
        { heading: "And if they're slow to sign", paragraphs: ["A friendly reminder is usually enough to close the document the same day. Everything is recorded with its audit trail."] },
      ],
    },
  },
  {
    slug: "firma-electronica-para-empresas",
    date: "2026-02-11",
    es: {
      title: "Firma electrónica para empresas: guía práctica",
      excerpt:
        "Implementar la firma electrónica en tu empresa ahorra tiempo y papel. Te explicamos por dónde empezar.",
      keywords:
        "firma electrónica para empresas, firma digital empresas, implementar firma electrónica negocio, firma electrónica corporativa",
      readingMinutes: 5,
      sections: [
        { paragraphs: ["Las empresas firman decenas de documentos al mes: contratos con clientes y proveedores, acuerdos internos, autorizaciones. Llevar todo eso a la firma electrónica ahorra tiempo, papel y traslados."] },
        { heading: "Qué puede firmar tu empresa", paragraphs: ["Contratos comerciales, acuerdos de servicios, órdenes de compra, NDAs, documentos de personal y la mayoría de acuerdos privados. En general, todo lo que hoy imprimes solo para firmar puede pasar a firma electrónica."] },
        { heading: "Por dónde empezar", paragraphs: ["Elige una herramienta con validez legal y rastro de auditoría, donde la otra parte firme desde un enlace sin complicaciones. Empieza por el flujo que más te frena hoy —por ejemplo, contratos con clientes— y amplía desde ahí."] },
        { heading: "El retorno", paragraphs: ["Menos tiempo persiguiendo firmas, menos papel y cierres más rápidos. Cada documento firmado a tiempo es dinero que entra antes y un proceso menos atascado."] },
      ],
    },
    en: {
      title: "Electronic signature for businesses: a practical guide",
      excerpt:
        "Rolling out electronic signatures in your company saves time and paper. Here's where to start.",
      keywords:
        "electronic signature for businesses, digital signature companies, implement electronic signature business, corporate electronic signature",
      readingMinutes: 5,
      sections: [
        { paragraphs: ["Companies sign dozens of documents a month: contracts with clients and suppliers, internal agreements, authorizations. Moving all of that to electronic signatures saves time, paper and travel."] },
        { heading: "What your company can sign", paragraphs: ["Commercial contracts, service agreements, purchase orders, NDAs, staff documents and most private agreements. In general, everything you print today just to sign can move to electronic signing."] },
        { heading: "Where to start", paragraphs: ["Choose a tool with legal validity and an audit trail, where the other party signs from a link without hassle. Start with the flow that slows you down most today — for example, client contracts — and expand from there."] },
        { heading: "The return", paragraphs: ["Less time chasing signatures, less paper and faster closes. Every document signed on time is money in sooner and one less stuck process."] },
      ],
    },
  },
  {
    slug: "firma-electronica-reemplaza-al-notario",
    date: "2026-03-12",
    es: {
      title: "¿La firma electrónica reemplaza al notario?",
      excerpt:
        "Una duda común antes de firmar online: ¿necesito un notario? Te lo aclaramos.",
      keywords:
        "firma electrónica reemplaza al notario, firma electrónica necesita notario, firmar sin notario, validez firma sin notario",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["Mucha gente cree que un documento solo vale si lo firma un notario. La realidad es que la mayoría de los acuerdos privados no necesitan notario, y la firma electrónica es suficiente para ellos."] },
        { heading: "Cuándo no necesitas notario", paragraphs: ["Contratos de servicios, arrendamientos, acuerdos comerciales, NDAs, presupuestos y la mayoría de documentos entre privados son válidos con firma electrónica, sin intervención notarial."] },
        { heading: "Cuándo sí interviene el notario", paragraphs: ["Algunos actos exigen por ley escritura pública o intervención notarial, como ciertas compraventas de inmuebles o constituciones de sociedad, según el país. En esos casos el notario sigue siendo necesario."] },
        { heading: "La regla práctica", paragraphs: ["Para el día a día de tu negocio, la firma electrónica con rastro de auditoría es suficiente y mucho más ágil. Si un trámite concreto exige notario, tu asesor o tu país te lo indicarán."] },
      ],
    },
    en: {
      title: "Does an electronic signature replace a notary?",
      excerpt:
        "A common question before signing online: do I need a notary? Here's the answer.",
      keywords:
        "does electronic signature replace notary, electronic signature need notary, sign without notary, signature validity without notary",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["Many people think a document is only valid if a notary signs it. The reality is that most private agreements don't need a notary, and an electronic signature is enough for them."] },
        { heading: "When you don't need a notary", paragraphs: ["Service contracts, leases, commercial agreements, NDAs, quotes and most documents between private parties are valid with an electronic signature, without notarial involvement."] },
        { heading: "When the notary does step in", paragraphs: ["Some acts require a public deed or notarial involvement by law, such as certain real-estate sales or company incorporations, depending on the country. In those cases the notary is still needed."] },
        { heading: "The practical rule", paragraphs: ["For your business's day-to-day, an electronic signature with an audit trail is enough and far quicker. If a specific procedure requires a notary, your advisor or your country will let you know."] },
      ],
    },
  },
  {
    slug: "como-reducir-el-papeleo-en-tu-negocio",
    date: "2026-04-22",
    es: {
      title: "Cómo reducir el papeleo en tu negocio",
      excerpt:
        "El papeleo cuesta tiempo y dinero. Te damos pasos concretos para reducirlo, empezando por las firmas.",
      keywords:
        "cómo reducir el papeleo en tu negocio, eliminar papeleo empresa, digitalizar documentos negocio, negocio sin papel",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["Imprimir, archivar y buscar documentos en papel consume horas cada semana. Reducir el papeleo no solo ahorra dinero: libera tiempo que puedes dedicar a vender y atender clientes."] },
        { heading: "Empieza por las firmas", paragraphs: ["Las firmas son uno de los mayores generadores de papel: cada contrato suele imprimirse solo para firmarlo. Pasar a la firma electrónica elimina ese ciclo de imprimir, firmar y escanear de un plumazo."] },
        { heading: "Digitaliza el flujo, no solo el archivo", paragraphs: ["No se trata solo de escanear lo que ya tienes en papel, sino de que los documentos nazcan y se firmen en digital. Así no vuelves a imprimir y todo queda ordenado y fácil de encontrar."] },
        { heading: "El resultado", paragraphs: ["Menos papel, menos archivadores y menos tiempo perdido. Cada documento firmado en digital queda con su rastro de auditoría, listo para buscar y compartir en segundos."] },
      ],
    },
    en: {
      title: "How to reduce paperwork in your business",
      excerpt:
        "Paperwork costs time and money. Here are concrete steps to cut it, starting with signatures.",
      keywords:
        "how to reduce paperwork in your business, eliminate business paperwork, digitize business documents, paperless business",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["Printing, filing and searching for paper documents eats up hours every week. Reducing paperwork doesn't just save money: it frees up time you can spend selling and serving clients."] },
        { heading: "Start with signatures", paragraphs: ["Signatures are one of the biggest paper generators: each contract is usually printed just to sign it. Moving to electronic signatures removes that print-sign-scan cycle at a stroke."] },
        { heading: "Digitize the flow, not just the archive", paragraphs: ["It's not only about scanning what you already have on paper, but about documents being born and signed digitally. That way you don't print again and everything stays organized and easy to find."] },
        { heading: "The result", paragraphs: ["Less paper, fewer filing cabinets and less wasted time. Every document signed digitally keeps its audit trail, ready to find and share in seconds."] },
      ],
    },
  },
  {
    slug: "como-evitar-que-un-cliente-no-firme",
    date: "2026-05-13",
    es: {
      title: "Cómo evitar que un cliente se demore en firmar",
      excerpt:
        "Un contrato sin firmar es una venta a medias. Te damos trucos para que tus clientes firmen a tiempo.",
      keywords:
        "cómo evitar que un cliente no firme, lograr que el cliente firme, recordatorio de firma, acelerar firma de contratos",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["Has acordado todo, enviaste el contrato… y el cliente no firma. Es una de las situaciones que más ventas frena. La buena noticia es que la mayoría de las demoras se evitan con un proceso de firma simple."] },
        { heading: "Quita fricción", paragraphs: ["Cuanto más fácil sea firmar, antes firmará tu cliente. Evita pedirle que descargue, imprima o cree una cuenta: lo ideal es que abra un enlace y firme desde el móvil en segundos."] },
        { heading: "Usa recordatorios", paragraphs: ["A veces el cliente simplemente lo olvidó. Un recordatorio amable suele bastar para cerrar el documento. Una herramienta que envíe recordatorios automáticos te quita ese trabajo de encima."] },
        { heading: "Pide la firma en el momento", paragraphs: ["Si puedes, envía el documento mientras la conversación está fresca. Pedir la firma justo después de acordar, con un proceso de un clic, es cuando más rápido firman."] },
      ],
    },
    en: {
      title: "How to keep a client from delaying their signature",
      excerpt:
        "An unsigned contract is a half-made sale. Here are tips to get your clients to sign on time.",
      keywords:
        "how to keep a client from delaying signature, get the client to sign, signature reminder, speed up contract signing",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["You agreed everything, sent the contract… and the client doesn't sign. It's one of the situations that stalls the most sales. The good news is that most delays are avoided with a simple signing process."] },
        { heading: "Remove friction", paragraphs: ["The easier it is to sign, the sooner your client will. Avoid asking them to download, print or create an account: ideally they open a link and sign from mobile in seconds."] },
        { heading: "Use reminders", paragraphs: ["Sometimes the client simply forgot. A friendly reminder is usually enough to close the document. A tool that sends automatic reminders takes that work off your hands."] },
        { heading: "Ask for the signature in the moment", paragraphs: ["If you can, send the document while the conversation is fresh. Asking for the signature right after agreeing, with a one-click process, is when people sign fastest."] },
      ],
    },
  },
  {
    slug: "como-firmar-contrato-de-obra",
    date: "2026-06-01",
    es: {
      title: "Cómo firmar un contrato de obra o construcción online",
      excerpt:
        "Las obras involucran muchas partes y documentos. Aprende a firmar contratos y actas online sin frenar el trabajo.",
      keywords:
        "cómo firmar un contrato de obra, firmar contrato de construcción online, firma electrónica contrato de obra, acta de obra firma",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["En una obra intervienen clientes, contratistas y proveedores, y cada etapa genera documentos que firmar. Hacerlo online evita que la firma se convierta en el cuello de botella del avance."] },
        { heading: "Qué se firma en una obra", paragraphs: ["Contratos de obra y honorarios, subcontratos, actas de avance y recepción, y órdenes de cambio. La mayoría son acuerdos privados que pueden firmarse electrónicamente con plena validez."] },
        { heading: "Cómo firmarlos a distancia", paragraphs: ["Subes el PDF, escribes el correo de la otra parte y envías. Cada quien firma desde su teléfono y confirma con un código. El documento queda firmado con su rastro de auditoría."] },
        { heading: "Avanza sin parar la obra", paragraphs: ["Clientes y proveedores firman sin reuniones, y conservas cada acta y contrato firmado de toda la obra, fácil de localizar."] },
      ],
    },
    en: {
      title: "How to sign a construction contract online",
      excerpt:
        "Construction involves many parties and documents. Learn to sign contracts and records online without stopping work.",
      keywords:
        "how to sign a construction contract, sign construction contract online, electronic signature construction contract, construction record signature",
      readingMinutes: 4,
      sections: [
        { paragraphs: ["A construction project involves clients, contractors and suppliers, and each stage generates documents to sign. Doing it online keeps signing from becoming the bottleneck of progress."] },
        { heading: "What gets signed on a project", paragraphs: ["Project and fee contracts, subcontracts, progress and acceptance records, and change orders. Most are private agreements that can be signed electronically with full validity."] },
        { heading: "How to sign them remotely", paragraphs: ["You upload the PDF, enter the other party's email and send. Each one signs from their phone and confirms with a code. The document is signed with its audit trail."] },
        { heading: "Move forward without stopping the site", paragraphs: ["Clients and suppliers sign without meetings, and you keep every signed record and contract for the whole project, easy to find."] },
      ],
    },
  },
  {
    slug: "ventajas-de-la-firma-electronica",
    date: "2026-06-14",
    es: {
      title: "Ventajas de la firma electrónica para tu negocio",
      excerpt:
        "Más allá de ahorrar papel, la firma electrónica cambia cómo cierras acuerdos. Estas son sus ventajas.",
      keywords:
        "ventajas de la firma electrónica, beneficios firma electrónica, por qué usar firma electrónica, firma electrónica negocio ventajas",
      readingMinutes: 5,
      sections: [
        { paragraphs: ["La firma electrónica se asocia con \"ahorrar papel\", pero su mayor ventaja es la velocidad: cierras acuerdos en minutos en lugar de días. Estas son las ventajas que más impactan en un negocio."] },
        { heading: "Cierres más rápidos", paragraphs: ["El cliente firma desde el móvil en segundos, sin imprimir ni escanear. Acortar el tiempo de firma significa empezar antes y, muchas veces, cobrar antes."] },
        { heading: "Validez y respaldo", paragraphs: ["La firma electrónica es legal en LATAM, España y EE. UU., y el rastro de auditoría —IP, fecha, dispositivo, verificación— deja constancia de quién firmó, útil ante cualquier disputa."] },
        { heading: "Orden y ahorro", paragraphs: ["Sin papel que imprimir, archivar ni perseguir. Los documentos firmados quedan organizados y fáciles de encontrar, y reduces costos de papelería y mensajería."] },
        { heading: "Mejor experiencia para tu cliente", paragraphs: ["Firmar sin complicaciones transmite profesionalismo y hace que tu cliente diga \"sí\" con menos fricción. Una buena experiencia de firma también vende."] },
      ],
    },
    en: {
      title: "Benefits of electronic signatures for your business",
      excerpt:
        "Beyond saving paper, electronic signatures change how you close deals. Here are the benefits.",
      keywords:
        "benefits of electronic signatures, advantages electronic signature, why use electronic signature, electronic signature business benefits",
      readingMinutes: 5,
      sections: [
        { paragraphs: ["Electronic signatures are associated with \"saving paper,\" but their biggest benefit is speed: you close deals in minutes instead of days. These are the benefits that most impact a business."] },
        { heading: "Faster closes", paragraphs: ["The client signs from mobile in seconds, without printing or scanning. Cutting signing time means starting sooner and, often, getting paid sooner."] },
        { heading: "Validity and backing", paragraphs: ["Electronic signatures are legal across Latin America, Spain and the US, and the audit trail — IP, date, device, verification — records who signed, useful in any dispute."] },
        { heading: "Order and savings", paragraphs: ["No paper to print, file or chase. Signed documents stay organized and easy to find, and you cut stationery and courier costs."] },
        { heading: "A better experience for your client", paragraphs: ["Signing without complications conveys professionalism and makes your client say \"yes\" with less friction. A good signing experience sells, too."] },
      ],
    },
  },
];

export const BLOG_SLUGS = BLOG_POSTS.map((p) => p.slug);

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getPostContent(post: BlogPost, locale: string): BlogPostContent {
  return locale === "en" ? post.en : post.es;
}

/** Posts sorted newest-first, for the index. */
export function sortedPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}
