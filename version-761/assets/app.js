(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        panel.classList.toggle("is-open");
      });
    }

    var slider = document.querySelector("[data-hero-slider]");
    if (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
      var current = 0;
      var timer;
      function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("is-active", i === current);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === current);
        });
      }
      function start() {
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5200);
      }
      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          window.clearInterval(timer);
          show(i);
          start();
        });
      });
      if (slides.length > 1) {
        start();
      }
    }

    var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
    scopes.forEach(function (scope) {
      var input = scope.querySelector(".page-filter-input");
      var chips = Array.prototype.slice.call(scope.querySelectorAll(".filter-chip"));
      var items = Array.prototype.slice.call(scope.querySelectorAll(".filter-item"));
      var state = { key: "all", value: "all" };

      function apply() {
        var q = input ? input.value.trim().toLowerCase() : "";
        items.forEach(function (item) {
          var text = (item.getAttribute("data-search") || item.textContent || "").toLowerCase();
          var okText = !q || text.indexOf(q) !== -1;
          var okChip = true;
          if (state.key !== "all") {
            okChip = (item.getAttribute("data-" + state.key) || "") === state.value;
          }
          item.classList.toggle("is-hidden", !(okText && okChip));
        });
      }

      if (input) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get("q");
        if (q) {
          input.value = q;
        }
        input.addEventListener("input", apply);
      }

      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          chips.forEach(function (c) {
            c.classList.remove("is-active");
          });
          chip.classList.add("is-active");
          state.key = chip.getAttribute("data-filter-key") || "all";
          state.value = chip.getAttribute("data-filter-value") || "all";
          apply();
        });
      });

      apply();
    });
  });
})();
