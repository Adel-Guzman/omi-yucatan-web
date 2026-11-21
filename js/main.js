(function () {
  // 1. Marcar fechas pasadas y resaltar la próxima fecha (en convocatoria.html)
  try {
    var items = document.querySelectorAll('#tl li');
    if (items.length) {
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
    }
  } catch (e) {}

  // 2. Galería limpia sin títulos (en galeria.html)
  var galleryEl = document.getElementById('gallery');
  if (galleryEl) {
    var PHOTOS = [
      // 2026
      { src: 'Galeria/2026/Imagen1.jpg', year: '2026' },
      { src: 'Galeria/2026/Imagen2.jpg', year: '2026' },
      { src: 'Galeria/2026/Imagen3.jpg', year: '2026' },
      { src: 'Galeria/2026/Imagen4.jpg', year: '2026' },
      { src: 'Galeria/2026/imagen5.jpg', year: '2026' },
      // 2025
      { src: 'Galeria/2025/Imagen1.jpg', year: '2025' },
      { src: 'Galeria/2025/Imagen2.jpg', year: '2025' },
      { src: 'Galeria/2025/Imagen3.jpg', year: '2025' },
      { src: 'Galeria/2025/Imagen4.jpg', year: '2025' },
      { src: 'Galeria/2025/Imagen5.jpg', year: '2025' },
      { src: 'Galeria/2025/Imagen6.jpg', year: '2025' },
      { src: 'Galeria/2025/Imagen7.jpg', year: '2025' }
    ];

    var lb = document.getElementById('lb');
    var lbi = document.getElementById('lbi');
    var lbx = document.getElementById('lbx');
    var tabBtns = document.querySelectorAll('.tab-btn');

    function openLightbox(src) {
      lbi.src = src;
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
    if (lbx) lbx.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });

    function renderGallery(filterYear) {
      galleryEl.innerHTML = '';
      var list = filterYear === 'all'
        ? PHOTOS
        : PHOTOS.filter(function (p) { return p.year === filterYear; });

      list.forEach(function (p) {
        var btn = document.createElement('button');
        btn.className = 'tile';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Ampliar fotografía');

        var img = document.createElement('img');
        img.loading = 'lazy';
        img.src = p.src;
        img.alt = 'Fotografía OMI Yucatán ' + p.year;
        img.onerror = function () {
          btn.style.display = 'none';
        };

        btn.appendChild(img);
        btn.addEventListener('click', function () {
          openLightbox(p.src);
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
  }
})();
