(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════
     CONFIGURACIÓN — lo único que hay que tocar
     ═══════════════════════════════════════════════════════════════ */
  const CONFIG = {

    /* ── Galería ──
       Deja los archivos en images/arte/ y añádelos aquí.
       Ejemplo: { src: 'images/arte/ciudad.jpg', title: 'Ciudad flotante' } */
    gallery: [],
    galleryPlaceholders: 6,

    /* ── Formulario ──
       Access key de web3forms.com (gratis). Si se queda vacío, el botón
       abre el cliente de correo del visitante con el mensaje ya compuesto. */
    web3formsKey: '',
    email: 'pejemuci@hotmail.com',

    /* ── Contador de visitas ── (abacus.jasoncameron.dev, sin registro) */
    visitorNamespace: 'pjmc-portfolio',
    visitorKey: 'visitas',

    /* ── Analítica ──
       Token de Cloudflare Web Analytics. Vacío = no se carga nada ni se
       hace ninguna petición. Lo sacas del panel de Cloudflare:
       Web Analytics → Add a site → copiar el token del snippet. */
    cfBeaconToken: '457b9637545b4a049d23d80de6140795',

    /* ── Rol rotativo ── (los textos viven en assets/i18n.js) */
    rolePauseMs: 2600
  };

  const $ = id => document.getElementById(id);
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* modo privado */ } }
  };

  /* Estado compartido. Se declara arriba porque applyLang() lo lee al
     arrancar, antes de que corra el bloque del contador. */
  let visitorValue = null;
  let lbIndex = 0;
  /* window.GALLERY lo genera tools/build-gallery.py (assets/gallery.js).
     CONFIG.gallery, si tiene contenido, manda sobre él. */
  let galleryItems = (CONFIG.gallery && CONFIG.gallery.length)
    ? CONFIG.gallery.slice()
    : (Array.isArray(window.GALLERY) ? window.GALLERY.slice() : []);

  /* ═══════════════════════════════════════════════════════════════
     TEMA
     El tema inicial ya lo fija un script en el <head> para evitar
     el parpadeo; aquí solo se gestiona el cambio manual.
     ═══════════════════════════════════════════════════════════════ */
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0b0b0b' : '#ffffff');
  }

  (function themeToggle() {
    const btn = $('theme-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      store.set('theme', next);
    });
  })();

  /* ═══════════════════════════════════════════════════════════════
     IDIOMA
     ═══════════════════════════════════════════════════════════════ */
  let lang = 'es';

  function t(key) {
    const dict = window.I18N[lang] || window.I18N.es;
    return Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : key;
  }

  function applyLang(next) {
    if (!window.I18N[next]) return;
    lang = next;
    root.setAttribute('lang', t('html.lang'));
    document.title = t('meta.title');

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.dataset.i18n);
    });
    /* Solo se inyecta HTML del diccionario propio, nunca de entrada externa */
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = t(el.dataset.i18nHtml);
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      el.setAttribute('placeholder', t(el.dataset.i18nPh));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      const v = t(el.dataset.i18nTitle);
      el.setAttribute('title', v);
      el.setAttribute('aria-label', v);
    });

    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === next));
    });

    renderGallery();
    refreshVisitorText();

    /* La pista del canvas vive en un atributo, no en el texto */
    const screen = $('screen');
    if (screen) screen.dataset.hint = t('err.start');
  }

  (function langSwitch() {
    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.addEventListener('click', function () {
        applyLang(b.dataset.lang);
        store.set('lang', b.dataset.lang);
      });
    });

    const saved = store.get('lang');
    const browser = (navigator.language || 'es').slice(0, 2).toLowerCase();
    applyLang(saved || (browser === 'en' ? 'en' : 'es'));
  })();

  /* ═══════════════════════════════════════════════════════════════
     AVATAR — la foto manda, el monograma es el respaldo
     ═══════════════════════════════════════════════════════════════ */
  (function avatar() {
    const img = $('avatar-img');
    const fallback = $('avatar-fallback');
    if (!img || !fallback) return;

    /* Este script corre al final del <body>: la imagen puede haber
       terminado (bien o mal) ANTES de que se registren los listeners,
       así que hay que resolver el estado también a mano. */
    const settle = function () {
      const ok = img.naturalWidth > 0;
      img.hidden = !ok;
      fallback.hidden = ok;
    };

    img.addEventListener('load', settle);
    img.addEventListener('error', settle);
    if (img.complete) settle();
  })();

  /* ═══════════════════════════════════════════════════════════════
     TOPBAR + ENLACE ACTIVO
     ═══════════════════════════════════════════════════════════════ */
  (function topbar() {
    const bar = $('topbar');
    if (!bar) return;
    const onScroll = () => bar.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  (function activeLink() {
    /* Solo enlaces a un fragmento de ESTA página. En la 404 el nav apunta a
       "/" y "/#proyectos", y querySelector('/') lanza una excepción que
       tumbaría todo lo que viene después. */
    const links = Array.from(document.querySelectorAll('.topnav a'))
      .filter(a => (a.getAttribute('href') || '').startsWith('#'));
    const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    if (!('IntersectionObserver' in window) || !sections.length) return;

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

    sections.forEach(s => io.observe(s));
  })();

  /* ═══════════════════════════════════════════════════════════════
     ROL ROTATIVO
     ═══════════════════════════════════════════════════════════════ */
  (function rotateRoles() {
    const slot = $('role-slot');
    if (!slot) return;

    let i = 0;
    const roles = () => t('roles');

    const paint = () => { slot.textContent = roles()[i % roles().length]; };
    paint();

    if (reduced) return;

    setInterval(function () {
      i += 1;
      slot.classList.remove('swap');
      void slot.offsetWidth;           /* reinicia la animación */
      slot.classList.add('swap');
      setTimeout(paint, 250);          /* cambia el texto en el punto invisible */
    }, CONFIG.rolePauseMs);
  })();

  /* ═══════════════════════════════════════════════════════════════
     GALERÍA + VISOR
     ═══════════════════════════════════════════════════════════════ */
  function renderGallery() {
    const grid = $('gallery');
    const hint = $('gallery-hint');
    if (!grid) return;

    grid.innerHTML = '';

    if (!galleryItems.length) {
      for (let i = 0; i < CONFIG.galleryPlaceholders; i++) {
        const cell = document.createElement('div');
        cell.className = 'gallery-empty';
        cell.textContent = t('gallery.empty');
        grid.appendChild(cell);
      }
      if (hint) { hint.textContent = t('gallery.hint'); hint.hidden = false; }
      return;
    }

    if (hint) hint.hidden = true;

    galleryItems.forEach(function (item, index) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gallery-item';
      btn.setAttribute('aria-label', item.title || 'Imagen ' + (index + 1));

      const img = document.createElement('img');
      img.src = item.thumb || item.src;   /* la rejilla usa la miniatura */
      img.alt = item.title || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      /* Una ruta rota no debe dejar un hueco fantasma */
      img.addEventListener('error', function () { btn.remove(); });

      btn.appendChild(img);
      btn.addEventListener('click', function () { openLightbox(index); });
      grid.appendChild(btn);
    });
  }

  function openLightbox(index) {
    const box = $('lightbox');
    if (!box || !galleryItems.length) return;
    lbIndex = index;
    paintLightbox();
    box.classList.add('open');
    document.body.classList.add('no-scroll');
    const closeBtn = $('lb-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    const box = $('lightbox');
    if (!box) return;
    box.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  function moveLightbox(step) {
    const n = galleryItems.length;
    if (!n) return;
    lbIndex = (lbIndex + step + n) % n;
    paintLightbox();
  }

  function paintLightbox() {
    const item = galleryItems[lbIndex];
    const img = $('lb-img');
    const cap = $('lb-caption');
    if (!item || !img) return;
    img.src = item.src;
    img.alt = item.title || '';
    if (cap) cap.textContent = item.title || '';
  }

  (function lightboxWiring() {
    const box = $('lightbox');
    if (!box) return;

    const close = $('lb-close');
    const prev = $('lb-prev');
    const next = $('lb-next');

    if (close) close.addEventListener('click', closeLightbox);
    if (prev) prev.addEventListener('click', function () { moveLightbox(-1); });
    if (next) next.addEventListener('click', function () { moveLightbox(1); });

    box.addEventListener('click', function (e) { if (e.target === box) closeLightbox(); });

    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); moveLightbox(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); moveLightbox(1); }
    });
  })();

  /* ═══════════════════════════════════════════════════════════════
     CONTADOR DE VISITAS
     ═══════════════════════════════════════════════════════════════ */
  function refreshVisitorText() {
    const box = $('visitor');
    if (!box || visitorValue === null) return;
    box.innerHTML = '';
    box.appendChild(document.createTextNode(t('visitor.pre')));
    const b = document.createElement('b');
    b.textContent = visitorValue.toLocaleString(lang === 'en' ? 'en-GB' : 'es-ES');
    box.appendChild(b);
    box.appendChild(document.createTextNode(t('visitor.post')));
    box.classList.add('ready');
  }

  (function visitorCounter() {
    /* Sin el contador en el DOM (por ejemplo en la 404) no se cuenta visita */
    if (!CONFIG.visitorNamespace || !$('visitor')) return;

    const url = 'https://abacus.jasoncameron.dev/hit/'
      + encodeURIComponent(CONFIG.visitorNamespace) + '/'
      + encodeURIComponent(CONFIG.visitorKey);

    fetch(url)
      .then(r => r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)))
      .then(function (data) {
        if (typeof data.value !== 'number') throw new Error('respuesta inesperada');
        visitorValue = data.value;
        refreshVisitorText();
      })
      .catch(function () { /* Sin contador: la línea se queda oculta */ });
  })();

  /* ═══════════════════════════════════════════════════════════════
     SONIDO — apagado por defecto, se recuerda la elección
     ═══════════════════════════════════════════════════════════════ */
  (function sound() {
    const sfx = window.Sfx;
    if (!sfx) return;

    const btn = $('sfx-btn');
    if (btn) {
      btn.setAttribute('aria-pressed', String(sfx.isEnabled()));
      btn.addEventListener('click', function () {
        sfx.setEnabled(!sfx.isEnabled());
        btn.setAttribute('aria-pressed', String(sfx.isEnabled()));
      });
    }

    /* Delegación: un solo listener para toda la página */
    document.addEventListener('click', function (e) {
      const el = e.target.closest('a, button');
      if (!el || el === btn) return;
      if (el.closest('.console')) return;      // la consola tiene sus propios sonidos

      if (el.matches('.topnav a, .footer-links a, .socials a, .link-more')) sfx.play('nav');
      else if (el.matches('.lightbox-btn')) sfx.play('back');
      else sfx.play('select');
    });
  })();

  /* ═══════════════════════════════════════════════════════════════
     FORMULARIO
     ═══════════════════════════════════════════════════════════════ */
  (function contactForm() {
    const form = $('contact-form');
    const status = $('cf-status');
    const submit = $('cf-submit');
    if (!form) return;

    const setStatus = function (msg, kind) {
      status.textContent = msg;
      status.className = 'form-status' + (kind ? ' ' + kind : '');
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (form.botcheck.value) return;                /* trampa antispam */

      if (!name || !email || !message) { setStatus(t('form.err.required'), 'err'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setStatus(t('form.err.email'), 'err'); return; }

      const subject = t('form.subject') + name;

      if (!CONFIG.web3formsKey) {
        const body = message + '\n\n—\n' + name + '\n' + email;
        window.location.href = 'mailto:' + CONFIG.email
          + '?subject=' + encodeURIComponent(subject)
          + '&body=' + encodeURIComponent(body);
        setStatus(t('form.opening'));
        return;
      }

      submit.disabled = true;
      setStatus(t('form.sending'));

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: CONFIG.web3formsKey,
          subject: subject,
          from_name: name,
          name: name,
          email: email,
          message: message
        })
      })
        .then(r => r.json())
        .then(function (d) {
          if (!d.success) throw new Error(d.message || 'error');
          form.reset();
          setStatus(t('form.ok'), 'ok');
        })
        .catch(function () { setStatus(t('form.fail') + CONFIG.email, 'err'); })
        .finally(function () { submit.disabled = false; });
    });
  })();

  /* ═══════════════════════════════════════════════════════════════
     ANALÍTICA — Cloudflare Web Analytics
     Sin cookies y sin identificar a nadie, así que no necesita banner.
     Se inserta a mano en lugar de dejar que Cloudflare lo inyecte solo:
     la inyección automática del plan gratuito excluye el tráfico de la UE,
     que es justo el que interesa aquí.
     ═══════════════════════════════════════════════════════════════ */
  (function analytics() {
    const token = (CONFIG.cfBeaconToken || '').trim();
    if (!token) return;

    const beacon = document.createElement('script');
    beacon.defer = true;
    /* El atributo va ANTES de insertarlo: el script lo lee al ejecutarse */
    beacon.setAttribute('data-cf-beacon', JSON.stringify({ token: token }));
    beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    document.head.appendChild(beacon);
  })();

})();
