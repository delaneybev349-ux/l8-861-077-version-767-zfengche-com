(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var navPanel = document.querySelector('[data-nav-panel]');

  if (menuButton && navPanel) {
    menuButton.addEventListener('click', function () {
      navPanel.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-card-search]'));
  var categoryFilter = document.querySelector('[data-category-filter]');

  function filterCards() {
    var query = searchInputs.map(function (input) {
      return input.value.trim().toLowerCase();
    }).filter(Boolean).join(' ');
    var category = categoryFilter ? categoryFilter.value : '全部';
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));

    cards.forEach(function (card) {
      var text = card.textContent.toLowerCase() + ' ' + (card.getAttribute('data-title') || '').toLowerCase();
      var cardCategory = card.getAttribute('data-category') || '';
      var matchText = !query || text.indexOf(query) !== -1;
      var matchCategory = category === '全部' || cardCategory === category;
      card.style.display = matchText && matchCategory ? '' : 'none';
    });
  }

  searchInputs.forEach(function (input) {
    input.addEventListener('input', filterCards);
  });

  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterCards);
  }
})();
