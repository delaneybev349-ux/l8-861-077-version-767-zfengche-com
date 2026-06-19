(function () {
  function onReady(callback) {
    if (document.readyState !== "loading") {
      callback();
    } else {
      document.addEventListener("DOMContentLoaded", callback);
    }
  }

  onReady(function () {
    document.querySelectorAll("[data-nav-toggle]").forEach(function (button) {
      var target = document.querySelector(button.getAttribute("data-nav-toggle"));
      if (!target) {
        return;
      }
      button.addEventListener("click", function () {
        target.classList.toggle("is-open");
        button.classList.toggle("is-open");
      });
    });

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var thumbs = Array.prototype.slice.call(document.querySelectorAll("[data-hero-thumb]"));
    var currentSlide = 0;
    var timer = null;

    function activateSlide(index) {
      if (!slides.length) {
        return;
      }
      currentSlide = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === currentSlide);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === currentSlide);
      });
      thumbs.forEach(function (thumb, thumbIndex) {
        thumb.classList.toggle("is-active", thumbIndex === currentSlide);
      });
    }

    function scheduleHero() {
      if (!slides.length) {
        return;
      }
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        activateSlide(currentSlide + 1);
      }, 6200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        activateSlide(index);
        scheduleHero();
      });
    });

    thumbs.forEach(function (thumb, index) {
      thumb.addEventListener("click", function () {
        activateSlide(index);
        scheduleHero();
      });
    });

    document.querySelectorAll("[data-hero-prev]").forEach(function (button) {
      button.addEventListener("click", function () {
        activateSlide(currentSlide - 1);
        scheduleHero();
      });
    });

    document.querySelectorAll("[data-hero-next]").forEach(function (button) {
      button.addEventListener("click", function () {
        activateSlide(currentSlide + 1);
        scheduleHero();
      });
    });

    activateSlide(0);
    scheduleHero();

    document.querySelectorAll("[data-search-scope]").forEach(function (scope) {
      var input = scope.querySelector("[data-search-input]");
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
      var buttons = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-value]"));
      var empty = scope.querySelector("[data-empty-state]");
      var activeFilter = "all";

      function applyFilter() {
        var keyword = input ? input.value.trim().toLowerCase() : "";
        var visible = 0;
        cards.forEach(function (card) {
          var searchText = (card.getAttribute("data-search-text") || "").toLowerCase();
          var category = card.getAttribute("data-category") || "";
          var keywordMatch = !keyword || searchText.indexOf(keyword) !== -1;
          var categoryMatch = activeFilter === "all" || category === activeFilter;
          var shouldShow = keywordMatch && categoryMatch;
          card.classList.toggle("is-hidden-card", !shouldShow);
          if (shouldShow) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }

      if (input) {
        input.addEventListener("input", applyFilter);
      }

      buttons.forEach(function (button) {
        button.addEventListener("click", function () {
          activeFilter = button.getAttribute("data-filter-value") || "all";
          buttons.forEach(function (item) {
            item.classList.toggle("is-active", item === button);
          });
          applyFilter();
        });
      });

      applyFilter();
    });
  });
})();
