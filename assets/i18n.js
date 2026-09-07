/**
 * Diccionario de textos. Todo lo que se lee en la página está aquí.
 *
 * Uso en el HTML:
 *   data-i18n="clave"        → sustituye textContent
 *   data-i18n-html="clave"   → sustituye innerHTML (para textos con <strong>)
 *   data-i18n-ph="clave"     → sustituye el placeholder
 *   data-i18n-title="clave"  → sustituye title y aria-label
 *
 * Para cambiar un texto, edítalo en los DOS idiomas.
 */
window.I18N = {

  es: {
    'html.lang': 'es',
    'meta.title': 'Pedro Jesús Muñoz Cifuentes — Software Engineer',

    'nav.profile': 'Perfil',
    'nav.stack': 'Stack',
    'nav.projects': 'Proyectos',
    'nav.gallery': 'Galería',
    'nav.experience': 'Experiencia',
    'nav.contact': 'Contacto',

    'a11y.theme': 'Cambiar entre modo claro y oscuro',
    'a11y.sound': 'Activar o desactivar los sonidos de interfaz',
    'a11y.langES': 'Ver la página en español',
    'a11y.langEN': 'View this page in English',

    'roles': [
      'Software Engineer',
      'Backend · Java & Spring',
      'Analista de Software',
      'Arquitectura de microservicios'
    ],

    'meta.location': 'Ubicación',
    'meta.location.value': 'Cádiz, España',
    'meta.email': 'Email',
    'meta.languages': 'Idiomas',
    'meta.languages.value': 'Español · Inglés B2',

    'bio.1': 'Ingeniero de Software con más de <strong>3 años de experiencia en backend con Java y Spring Boot</strong>, incluyendo diseño e implementación de arquitecturas de microservicios. Actualmente ejerzo como Analista de Software, lo que ha reforzado mi visión técnica desde la perspectiva de requisitos, viabilidad y calidad arquitectónica, además del liderazgo técnico y la mentoría dentro del equipo.',

    'label.stack': 'Stack técnico',
    'label.projects': 'Proyectos destacados',
    'label.gallery': 'Galería · Midjourney',
    'label.music': 'En bucle',
    'label.experience': 'Experiencia',
    'label.education': 'Educación',
    'label.contact': 'Hablemos',

    'concepts': '<b>Arquitectura</b> · Microservicios · Hexagonal · APIs REST · BFF<br><b>Calidad</b> · Mockito · Code review · Clean code<br><b>Metodologías</b> · Scrum · Kanban · Agile',

    'status.live': 'Listo para uso',
    'status.testing': 'En testing',
    'status.internal': 'Uso interno',
    'status.pending': 'Por enlazar',
    'link.pending': 'Enlace pendiente',


    'proj.portfolio.desc': 'Este mismo sitio. HTML, CSS y JavaScript sin framework ni compilación: tema claro y oscuro, dos idiomas, galería con visor y una 404 con un Snake jugable.',
    'proj.portfolio3d.desc': 'Portfolio navegable en tres dimensiones: pilotas una nave entre planetas-sección y vas descubriendo experiencia, stack y proyectos. Con tour guiado y bilingüe.',
    'proj.portfolio3dv2.desc': 'Segunda versión del portfolio en 3D, planteada como un recorrido: pilotas la nave a través de seis fases —espacio profundo, campo de asteroides, nebulosa, entrada atmosférica, estación derelicta y llegada— y cada tramo revela una sección. Veinte modelos propios y post-procesado con bloom.',
    'proj.bookatme.desc': 'Comparador de los libros más vendidos de Amazon.es: 24 fichas con datos reales, pros y contras y nota de calidad-precio. Las 40 páginas se generan desde un único JSON con Python.',
    'proj.gastos.desc': 'Control de gastos en un solo archivo HTML, sin dependencias. Presupuestos, metas de ahorro, movimientos recurrentes y exportación a CSV. Todo se guarda en el navegador: los datos nunca salen de tu equipo.',
    'status.production': 'En producción',
    'status.wip': 'Subiendo el código',


    'gallery.lead': 'El diseño y la imagen me interesan tanto como el código. Estas son piezas generadas con Midjourney y afinadas a mano.',
    'gallery.empty': 'Hueco libre',
    'gallery.hint': 'Suelta tus imágenes en images/arte/ y ejecuta: python tools/build-gallery.py',

    'music.lead': 'Lo que suena mientras programo.',
    'music.empty': 'Hueco para otra playlist',

    'exp.1.role': 'Analista de Software',
    'exp.1.dates': '06/2025 — Actual',
    'exp.1.place': 'Sevilla, España',
    'exp.1.p': 'Análisis y evaluación de órdenes de trabajo y solicitudes de cambio, determinando viabilidad técnica, impacto en sistemas existentes y esfuerzo requerido.',
    'exp.1.li1': 'Documentos de requisitos funcionales y no funcionales, especificaciones técnicas y casos de uso, garantizando trazabilidad entre necesidad de negocio y solución técnica.',
    'exp.1.li2': 'Estimaciones de tiempo y recursos por descomposición de tareas y priorización por impacto.',
    'exp.1.li3': 'Code reviews del equipo, validando arquitectura hexagonal, diseño de APIs REST y calidad de código.',
    'exp.1.li4': 'Liderazgo técnico: distribución de tareas, resolución de bloqueos y mentoría como referente del equipo.',
    'exp.1.li5': 'Comunicación directa con stakeholders para clarificar requisitos y gestionar expectativas.',
    'exp.1.plain': 'Hexagonal · APIs REST · Scrum',

    'exp.2.role': 'Desarrollador de Software',
    'exp.2.dates': '10/2022 — 06/2025',
    'exp.2.place': 'Sevilla, España',
    'exp.2.p': 'Desarrollo backend en Java 21 con Spring Boot, implementando APIs REST consumidas por frontends Angular en arquitecturas de microservicios para sistemas de la Junta de Andalucía.',
    'exp.2.li1': 'Modernización de proyectos legacy de Java 8 a Java 21, mejorando rendimiento y mantenibilidad.',
    'exp.2.li2': 'Servicios con comunicación síncrona (REST) y asíncrona, asegurando desacoplamiento entre componentes.',
    'exp.2.li3': 'Persistencia con Oracle SQL mediante JPA/Hibernate y NoSQL con MongoDB.',
    'exp.2.li4': 'Seguridad y autenticación con Spring Security en entornos de microservicios.',
    'exp.2.li5': 'Contenerización con Docker e integración en pipelines CI/CD sobre Azure Pipelines.',
    'exp.2.li6': 'Tests unitarios con JUnit y Mockito; análisis de calidad con SonarQube.',

    'exp.3.role': 'Profesional de Hostelería',
    'exp.3.dates': '01/2019 — 08/2022',
    'exp.3.place': 'Conil de la Frontera, España',
    'exp.3.p': 'Atención al cliente y organización del servicio en un entorno de alta demanda.',

    'edu.role': 'Grado en Ingeniería Informática',
    'edu.dates': '2016 — 2022',
    'edu.place': 'Mención en Ingeniería del Software',

    'contact.title': 'Ponte en contacto',
    'contact.lead': 'Elige el medio que prefieras. El correo directo es la vía más rápida, pero también respondo por LinkedIn.',
    'contact.email.title': 'Correo directo',
    'contact.email.sub': 'pejemuci@hotmail.com',
    'contact.linkedin.title': 'LinkedIn',
    'contact.linkedin.sub': 'Perfil profesional',
    'contact.github.title': 'GitHub',
    'contact.github.sub': 'Código y proyectos',
    'contact.note': 'Cádiz, España · Trabajo actual en iConsulting365, Sevilla',

    'form.title': 'Escríbeme',
    'form.hint': '¿Prefieres escribir? Rellena el formulario y te contesto al correo que dejes.',
    'form.name': 'Nombre',
    'form.name.ph': 'Tu nombre',
    'form.email': 'Email',
    'form.email.ph': 'tu@correo.com',
    'form.message': 'Mensaje',
    'form.message.ph': 'Cuéntame en qué estás pensando…',
    'form.submit': 'Enviar mensaje',
    'form.err.required': 'Rellena nombre, email y mensaje.',
    'form.err.email': 'Ese email no parece válido.',
    'form.sending': 'Enviando…',
    'form.opening': 'Abriendo tu cliente de correo…',
    'form.ok': 'Mensaje enviado. Te contesto en cuanto pueda.',
    'form.fail': 'No se pudo enviar. Escríbeme a ',
    'form.subject': 'Contacto desde el portfolio — ',

    'quote': 'La simplicidad es requisito previo para la fiabilidad.',
    'quote.author': '— Edsger W. Dijkstra',
    'visitor.pre': 'Eres la visita nº ',
    'visitor.post': '',

    'footer.rights': '© 2026 Pedro Jesús Muñoz Cifuentes',

    'err.lead': 'Esta página no existe. O la escribiste mal, o la moví y no dejé nota. Ya que estás aquí, hay una partida esperándote.',
    'err.home': 'Volver al inicio',
    'err.projects': 'Ver proyectos',
    'err.hint': 'Flechas o WASD · Desliza en móvil',
    'err.start': 'PULSA START'
  },

  en: {
    'html.lang': 'en',
    'meta.title': 'Pedro Jesús Muñoz Cifuentes — Software Engineer',

    'nav.profile': 'Profile',
    'nav.stack': 'Stack',
    'nav.projects': 'Projects',
    'nav.gallery': 'Gallery',
    'nav.experience': 'Experience',
    'nav.contact': 'Contact',

    'a11y.theme': 'Switch between light and dark mode',
    'a11y.sound': 'Turn interface sounds on or off',
    'a11y.langES': 'Ver la página en español',
    'a11y.langEN': 'View this page in English',

    'roles': [
      'Software Engineer',
      'Backend · Java & Spring',
      'Software Analyst',
      'Microservices architecture'
    ],

    'meta.location': 'Location',
    'meta.location.value': 'Cádiz, Spain',
    'meta.email': 'Email',
    'meta.languages': 'Languages',
    'meta.languages.value': 'Spanish · English B2',

    'bio.1': 'Software Engineer with over <strong>3 years of backend experience in Java and Spring Boot</strong>, including the design and implementation of microservice architectures. I currently work as a Software Analyst, which has sharpened my technical judgement around requirements, feasibility and architectural quality, as well as technical leadership and mentoring within the team.',

    'label.stack': 'Tech stack',
    'label.projects': 'Featured projects',
    'label.gallery': 'Gallery · Midjourney',
    'label.music': 'On repeat',
    'label.experience': 'Experience',
    'label.education': 'Education',
    'label.contact': "Let's talk",

    'concepts': '<b>Architecture</b> · Microservices · Hexagonal · REST APIs · BFF<br><b>Quality</b> · Mockito · Code review · Clean code<br><b>Methodologies</b> · Scrum · Kanban · Agile',

    'status.live': 'Ready to use',
    'status.testing': 'In testing',
    'status.internal': 'Internal use',
    'status.pending': 'To be linked',
    'link.pending': 'Link pending',


    'proj.portfolio.desc': 'This very site. HTML, CSS and JavaScript with no framework and no build step: light and dark themes, two languages, a gallery with a lightbox and a 404 with a playable Snake.',
    'proj.portfolio3d.desc': 'A portfolio you fly through: pilot a ship between planet-sections and discover experience, stack and projects along the way. Guided tour, in two languages.',
    'proj.portfolio3dv2.desc': 'The second take on the 3D portfolio, built as a journey: pilot the ship through six phases — deep space, asteroid field, nebula, atmospheric entry, derelict station and arrival — and each leg reveals a section. Twenty custom models and bloom post-processing.',
    'proj.bookatme.desc': 'A comparison site for Amazon.es bestsellers: 24 entries with real data, pros and cons and a value-for-money score. All 40 pages are generated from a single JSON with Python.',
    'proj.gastos.desc': 'Expense tracking in a single HTML file, no dependencies. Budgets, savings goals, recurring entries and CSV export. Everything is stored in the browser: the data never leaves your machine.',
    'status.production': 'Live',
    'status.wip': 'Pushing the code',


    'gallery.lead': 'Design and imagery interest me as much as code. These are pieces generated with Midjourney and tuned by hand.',
    'gallery.empty': 'Empty slot',
    'gallery.hint': 'Drop your images into images/arte/ and run: python tools/build-gallery.py',

    'music.lead': 'What plays while I code.',
    'music.empty': 'Slot for another playlist',

    'exp.1.role': 'Software Analyst',
    'exp.1.dates': '06/2025 — Present',
    'exp.1.place': 'Seville, Spain',
    'exp.1.p': 'Analysis and assessment of work orders and change requests, determining technical feasibility, impact on existing systems and required effort.',
    'exp.1.li1': 'Functional and non-functional requirement documents, technical specifications and use cases, ensuring traceability between business need and technical solution.',
    'exp.1.li2': 'Time and resource estimates through task breakdown and impact-based prioritisation.',
    'exp.1.li3': 'Code reviews across the team, validating hexagonal architecture, REST API design and code quality.',
    'exp.1.li4': 'Technical leadership: task allocation, unblocking the team and mentoring as its technical reference.',
    'exp.1.li5': 'Direct communication with stakeholders to clarify requirements and manage expectations.',
    'exp.1.plain': 'Hexagonal · REST APIs · Scrum',

    'exp.2.role': 'Software Developer',
    'exp.2.dates': '10/2022 — 06/2025',
    'exp.2.place': 'Seville, Spain',
    'exp.2.p': 'Backend development in Java 21 with Spring Boot, building REST APIs consumed by Angular frontends in microservice architectures for Junta de Andalucía systems.',
    'exp.2.li1': 'Modernised legacy projects from Java 8 to Java 21, improving performance and maintainability.',
    'exp.2.li2': 'Services with synchronous (REST) and asynchronous communication, ensuring decoupling between components.',
    'exp.2.li3': 'Persistence with Oracle SQL through JPA/Hibernate and NoSQL with MongoDB.',
    'exp.2.li4': 'Security and authentication with Spring Security across microservice environments.',
    'exp.2.li5': 'Containerisation with Docker and integration into CI/CD pipelines on Azure Pipelines.',
    'exp.2.li6': 'Unit tests with JUnit and Mockito; code quality analysis with SonarQube.',

    'exp.3.role': 'Hospitality Professional',
    'exp.3.dates': '01/2019 — 08/2022',
    'exp.3.place': 'Conil de la Frontera, Spain',
    'exp.3.p': 'Customer service and service coordination in a high-demand environment.',

    'edu.role': "Bachelor's Degree in Computer Engineering",
    'edu.dates': '2016 — 2022',
    'edu.place': 'Software Engineering specialisation',

    'contact.title': 'Get in touch',
    'contact.lead': 'Pick whichever channel suits you. Direct email is the fastest route, but I also reply on LinkedIn.',
    'contact.email.title': 'Direct email',
    'contact.email.sub': 'pejemuci@hotmail.com',
    'contact.linkedin.title': 'LinkedIn',
    'contact.linkedin.sub': 'Professional profile',
    'contact.github.title': 'GitHub',
    'contact.github.sub': 'Code and projects',
    'contact.note': 'Cádiz, Spain · Currently at iConsulting365, Seville',

    'form.title': 'Write to me',
    'form.hint': 'Prefer to write? Fill in the form and I will reply to the address you leave.',
    'form.name': 'Name',
    'form.name.ph': 'Your name',
    'form.email': 'Email',
    'form.email.ph': 'you@email.com',
    'form.message': 'Message',
    'form.message.ph': 'Tell me what you have in mind…',
    'form.submit': 'Send message',
    'form.err.required': 'Please fill in name, email and message.',
    'form.err.email': 'That email does not look valid.',
    'form.sending': 'Sending…',
    'form.opening': 'Opening your mail client…',
    'form.ok': 'Message sent. I will get back to you soon.',
    'form.fail': 'Could not send. Write to me at ',
    'form.subject': 'Contact from the portfolio — ',

    'quote': 'Simplicity is prerequisite for reliability.',
    'quote.author': '— Edsger W. Dijkstra',
    'visitor.pre': 'You are visitor no. ',
    'visitor.post': '',

    'footer.rights': '© 2026 Pedro Jesús Muñoz Cifuentes',

    'err.lead': 'This page does not exist. Either you mistyped it, or I moved it and left no note. Since you are here, there is a game waiting.',
    'err.home': 'Back to home',
    'err.projects': 'See projects',
    'err.hint': 'Arrows or WASD · Swipe on mobile',
    'err.start': 'PRESS START'
  }
};
