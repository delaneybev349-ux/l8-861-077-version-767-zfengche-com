(function () {
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var hidden = mobileNav.hasAttribute('hidden');
      if (hidden) {
        mobileNav.removeAttribute('hidden');
      } else {
        mobileNav.setAttribute('hidden', '');
      }
      toggle.setAttribute('aria-expanded', String(hidden));
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var prev = document.querySelector('[data-hero-prev]');
  var next = document.querySelector('[data-hero-next]');
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === current);
    });
  }

  if (slides.length) {
    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });
    setInterval(function () {
      showSlide(current + 1);
    }, 5000);
  }

  var filters = Array.prototype.slice.call(document.querySelectorAll('.js-card-filter'));
  filters.forEach(function (input) {
    input.addEventListener('input', function () {
      var keyword = input.value.trim().toLowerCase();
      var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
      cards.forEach(function (card) {
        var haystack = (card.getAttribute('data-filter') || '').toLowerCase();
        card.classList.toggle('is-filtered-out', Boolean(keyword) && haystack.indexOf(keyword) === -1);
      });
    });
  });

  var searchInput = document.getElementById('search-page-input');
  var searchResults = document.getElementById('search-results');
  var searchSummary = document.getElementById('search-summary');
  if (searchInput && searchResults && Array.isArray(window.SEARCH_INDEX)) {
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    searchInput.value = initial;

    function renderSearch(value) {
      var keyword = value.trim().toLowerCase();
      var list = window.SEARCH_INDEX;
      if (keyword) {
        list = list.filter(function (item) {
          return item.keywords.toLowerCase().indexOf(keyword) !== -1;
        });
      }
      list = list.slice(0, 200);
      searchResults.innerHTML = list.map(function (item) {
        return [
          '<article class="movie-card" data-filter="', escapeHtml(item.keywords), '">',
          '<a class="movie-card__poster" href="', escapeHtml(item.href), '">',
          '<img src="', escapeHtml(item.cover), '" alt="', escapeHtml(item.title), '" loading="lazy">',
          '<span class="movie-card__play">▶</span>',
          '</a>',
          '<div class="movie-card__body">',
          '<div class="movie-card__meta"><span>', escapeHtml(item.region), '</span><span>', escapeHtml(item.year), '</span></div>',
          '<h2><a href="', escapeHtml(item.href), '">', escapeHtml(item.title), '</a></h2>',
          '<p>', escapeHtml(item.oneLine), '</p>',
          '<div class="movie-card__tags"><span>', escapeHtml(item.type), '</span><span>', escapeHtml(item.category), '</span></div>',
          '</div>',
          '</article>'
        ].join('');
      }).join('');
      searchSummary.textContent = keyword ? '找到 ' + list.length + ' 条相关结果' : '显示最新可搜索影片';
    }

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    renderSearch(initial);
    searchInput.addEventListener('input', function () {
      renderSearch(searchInput.value);
    });
  }
})();
