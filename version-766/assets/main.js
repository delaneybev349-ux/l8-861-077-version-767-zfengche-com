(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");

        if (toggle && panel) {
            toggle.addEventListener("click", function () {
                panel.classList.toggle("open");
                toggle.setAttribute("aria-expanded", panel.classList.contains("open") ? "true" : "false");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
                dot.setAttribute("aria-current", dotIndex === current ? "true" : "false");
            });
        }

        function restartHero() {
            if (timer) {
                window.clearInterval(timer);
            }

            if (slides.length > 1) {
                timer = window.setInterval(function () {
                    showSlide(current + 1);
                }, 5200);
            }
        }

        if (slides.length) {
            var prev = document.querySelector("[data-hero-prev]");
            var next = document.querySelector("[data-hero-next]");

            if (prev) {
                prev.addEventListener("click", function () {
                    showSlide(current - 1);
                    restartHero();
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    showSlide(current + 1);
                    restartHero();
                });
            }

            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    showSlide(index);
                    restartHero();
                });
            });

            showSlide(0);
            restartHero();
        }

        var filterForm = document.querySelector("[data-filter-form]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
        var empty = document.querySelector("[data-empty]");

        function valueOf(name) {
            var field = filterForm ? filterForm.querySelector("[name='" + name + "']") : null;
            return field ? field.value.trim().toLowerCase() : "";
        }

        function applyFilters() {
            if (!filterForm || !cards.length) {
                return;
            }

            var keyword = valueOf("keyword");
            var region = valueOf("region");
            var type = valueOf("type");
            var year = valueOf("year");
            var visible = 0;

            cards.forEach(function (card) {
                var text = (card.getAttribute("data-text") || "").toLowerCase();
                var cardRegion = (card.getAttribute("data-region") || "").toLowerCase();
                var cardType = (card.getAttribute("data-type") || "").toLowerCase();
                var cardYear = (card.getAttribute("data-year") || "").toLowerCase();
                var matched = true;

                if (keyword && text.indexOf(keyword) === -1) {
                    matched = false;
                }

                if (region && cardRegion.indexOf(region) === -1) {
                    matched = false;
                }

                if (type && cardType.indexOf(type) === -1) {
                    matched = false;
                }

                if (year && cardYear !== year) {
                    matched = false;
                }

                card.style.display = matched ? "" : "none";

                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("show", visible === 0);
            }
        }

        if (filterForm) {
            filterForm.addEventListener("input", applyFilters);
            filterForm.addEventListener("change", applyFilters);
            applyFilters();
        }
    });
})();
