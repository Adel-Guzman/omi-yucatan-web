(function () {
  // 1. Marcar fechas pasadas y resaltar la próxima fecha en la línea de tiempo
  try {
    var items = document.querySelectorAll('#tl li');
    var now = new Date();
    var foundNext = false;

    items.forEach(function (li) {
      var dateStr = li.getAttribute('data-date');
      if (!dateStr) return;
      var d = new Date(dateStr + 'T23:59:59');
      if (d < now) {
        li.classList.add('past');
      } else if (!foundNext) {
        li.classList.add('next-up');
        var dSpan = li.querySelector('.d');
        if (dSpan) {
          var tag = document.createElement('span');
          tag.className = 'tag';
          tag.textContent = 'Próxima';
          dSpan.appendChild(tag);
        }
        foundNext = true;
      }
    });
  } catch (e) {}

  // 2. Galería local (apunta a tu carpeta Galeria/2026/ y Galeria/2025/)
  var PHOTOS = [
    // Fotos 2026
    { src: 'Galeria/2026/Imagen1.jpg', year: '2026', title: 'Delegación Yucatán · 31.ª OMI 2026', sub: 'Pachuca, Hidalgo · Octubre 2026' },
    { src: 'Galeria/2026/Imagen2.jpg', year: '2026', title: 'Medallistas OMI y OMIPS 2026', sub: 'Tercer lugar nacional por estados' },
    { src: 'Galeria/2026/Imagen3.jpg', year: '2026', title: 'Premiación Nacional 2026', sub: 'Delegación Yucateca' },
    { src: 'Galeria/2026/Imagen4.jpg', year: '2026', title: 'Equipo y Entrenadores 2026', sub: 'UADY · SEGEY' },
    { src: 'Galeria/2026/imagen5.jpg', year: '2026', title: 'OMI Yucatán 2026', sub: 'Actividades de la delegación' },
    // Fotos 2025
    { src: 'Galeria/2025/Imagen1.jpg', year: '2025', title: 'OMI 2025 · Guadalajara', sub: 'Segundo lugar nacional por estados' },
    { src: 'Galeria/2025/Imagen2.jpg', year: '2025', title: 'Delegación Yucatán 2025', sub: 'Guadalajara, Jalisco' },
    { src: 'Galeria/2025/Imagen3.jpg', year: '2025', title: 'Ceremonia de premiación 2025', sub: 'Medallistas de Yucatán' },
    { src: 'Galeria/2025/Imagen4.jpg', year: '2025', title: 'Competencia Nacional 2025', sub: 'OMI Yucatán' },
    { src: 'Galeria/2025/Imagen5.jpg', year: '2025', title: 'Entrenamiento y convivencia', sub: 'Delegación 2025' },
    { src: 'Galeria/2025/Imagen6.jpg', year: '2025', title: 'Reconocimiento estatal', sub: 'Facultad de Matemáticas, UADY' },
    { src: 'Galeria/2025/Imagen7.jpg', year: '2025', title: 'Equipo Yucatán 2025', sub: 'OMI · OMIPS' }
  ];

  var galleryEl = document.getElementById('gallery');
  var lb = document.getElementById('lb');
  var lbi = document.getElementById('lbi');
  var lbc = document.getElementById('lbc');
  var lbx = document.getElementById('lbx');
  var tabBtns = document.querySelectorAll('.tab-btn');

  function openLightbox(src, caption) {
    lbi.src = src;
    lbi.alt = caption;
    lbc.textContent = caption;
    lb.classList.add('on');
  }

  function closeLightbox() {
    lb.classList.remove('on');
    lbi.src = '';
  }

  if (lb) {
    lb.addEventListener('click', function (e) {
      if (e.target !== lbi) closeLightbox();
    });
  }
  if (lbx) {
    lbx.addEventListener('click', closeLightbox);
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  function renderGallery(filterYear) {
    if (!galleryEl) return;
    galleryEl.innerHTML = '';

    var list = filterYear === 'all'
      ? PHOTOS
      : PHOTOS.filter(function (p) { return p.year === filterYear; });

    list.forEach(function (p) {
      var btn = document.createElement('button');
      btn.className = 'tile';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Ampliar foto: ' + p.title);

      var img = document.createElement('img');
      img.loading = 'lazy';
      img.src = p.src;
      img.alt = p.title;
      // Si alguna imagen aún no existe con ese nombre exacto, oculta el ícono roto
      img.onerror = function () {
        this.style.display = 'none';
      };

      var cap = document.createElement('span');
      cap.className = 'cap';
      cap.textContent = p.title;

      var sub = document.createElement('small');
      sub.textContent = p.sub;
      cap.appendChild(sub);

      btn.appendChild(img);
      btn.appendChild(cap);

      btn.addEventListener('click', function () {
        openLightbox(p.src, p.title + ' — ' + p.sub);
      });

      galleryEl.appendChild(btn);
    });
  }

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      renderGallery(btn.getAttribute('data-year'));
    });
  });

  renderGallery('2026');
})();
