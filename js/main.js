(function () {
  // 1. Fechas importantes: avanza automáticamente a la siguiente fecha cuando pasa la actual
  try {
    var items = document.querySelectorAll('#tl li');
    var nextBanner = document.getElementById('next-banner');

    if (items.length) {
      var now = new Date();
      var nextItem = null;

      items.forEach(function (li) {
        var dateStr = li.getAttribute('data-date');
        if (!dateStr) return;
        var d = new Date(dateStr + 'T23:59:59');
        var dSpan = li.querySelector('.d');

        if (d < now) {
          li.classList.add('past');
          if (dSpan) {
            var doneTag = document.createElement('span');
            doneTag.className = 'tag done';
            doneTag.textContent = 'Finalizada';
            dSpan.appendChild(doneTag);
          }
        } else if (!nextItem) {
          nextItem = li;
          li.classList.add('next-up');
          if (dSpan) {
            var nextTag = document.createElement('span');
            nextTag.className = 'tag';
            nextTag.textContent = 'Próxima etapa';
            dSpan.appendChild(nextTag);
          }
        }
      });

      if (nextBanner) {
        if (nextItem) {
          var fechaTxt = nextItem.querySelector('.d').childNodes[0].textContent.trim();
          var tituloTxt = nextItem.querySelector('b').textContent.trim();
          nextBanner.innerHTML =
            '<div><span class="nb-label">Siguiente fecha en el calendario</span><b>' + tituloTxt + '</b></div>' +
            '<span class="nb-date">' + fechaTxt + '</span>';
        } else {
          nextBanner.innerHTML =
            '<div><span class="nb-label">Calendario 2026–2027</span><b>Todas las etapas programadas han concluido</b></div>';
        }
      }
    }
  } catch (e) {}

  // 2. Galería limpia sin títulos (en galeria.html)
  var galleryEl = document.getElementById('gallery');
  if (galleryEl) {
    var PHOTOS = [
      { src: 'Galeria/2026/Imagen1.jpg', year: '2026' },
      { src: 'Galeria/2026/Imagen2.jpg', year: '2026' },
      { src: 'Galeria/2026/Imagen3.jpg', year: '2026' },
      { src: 'Galeria/2026/Imagen4.jpg', year: '2026' },
      { src: 'Galeria/2026/imagen5.jpg', year: '2026' },
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

  // 3. Fondo decorativo de nodos y grafos en la portada (index.html)
  var canvas = document.getElementById('hero-graph');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var nodes = [];
    var rafId = null;

    function initGraph() {
      var rect = canvas.parentElement.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var w = rect.width;
      var h = rect.height;
      var count = Math.max(26, Math.min(60, Math.floor((w * h) / 18000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 2 + 1.8,
          gold: Math.random() < 0.22
        });
      }
    }

    function drawGraph() {
      var rect = canvas.parentElement.getBoundingClientRect();
      var w = rect.width;
      var h = rect.height;
      ctx.clearRect(0, 0, w, h);

      var maxDist = 155;
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;

        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j];
          var dx = a.x - b.x;
          var dy = a.y - b.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            var alpha = (1 - dist / maxDist) * 0.28;
            ctx.strokeStyle = 'rgba(60, 196, 194, ' + alpha.toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (var k = 0; k < nodes.length; k++) {
        var n = nodes[k];
        ctx.fillStyle = n.gold ? 'rgba(242, 183, 5, 0.55)' : 'rgba(60, 196, 194, 0.55)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = window.requestAnimationFrame(drawGraph);
    }

    initGraph();
    drawGraph();
    window.addEventListener('resize', function () {
      if (rafId) window.cancelAnimationFrame(rafId);
      initGraph();
      drawGraph();
    });
  }

})();
