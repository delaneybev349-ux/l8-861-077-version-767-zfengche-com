document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector("[data-menu-toggle]");
    const nav = document.getElementById("siteNav");

    if (menuButton && nav) {
        menuButton.addEventListener("click", function () {
            nav.classList.toggle("is-open");
            document.body.classList.toggle("nav-open", nav.classList.contains("is-open"));
        });
    }

    const slides = Array.from(document.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(document.querySelectorAll("[data-hero-dot]"));
    let activeSlide = 0;
    let heroTimer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        activeSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("is-active", slideIndex === activeSlide);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("is-active", dotIndex === activeSlide);
        });
    }

    function startHero() {
        if (slides.length < 2) {
            return;
        }

        heroTimer = window.setInterval(function () {
            showSlide(activeSlide + 1);
        }, 5200);
    }

    dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
            const index = Number(dot.getAttribute("data-hero-dot") || 0);
            showSlide(index);
            if (heroTimer) {
                window.clearInterval(heroTimer);
            }
            startHero();
        });
    });

    startHero();

    const pageFilter = document.getElementById("pageFilter");
    const yearFilter = document.getElementById("yearFilter");
    const searchPage = document.querySelector("[data-search-page]");
    const searchInput = document.getElementById("searchInput");

    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    function filterCards() {
        const list = document.querySelector("[data-filter-list]");
        const empty = document.querySelector("[data-empty-state]");

        if (!list) {
            return;
        }

        const cards = Array.from(list.querySelectorAll(".movie-card"));
        const query = normalize(searchInput ? searchInput.value : pageFilter ? pageFilter.value : "");
        const selectedYear = yearFilter ? normalize(yearFilter.value) : "";
        let visible = 0;

        cards.forEach(function (card) {
            const text = normalize(card.getAttribute("data-search"));
            const queryMatch = !query || text.indexOf(query) !== -1;
            const yearMatch = !selectedYear || text.indexOf(selectedYear) !== -1;
            const show = queryMatch && yearMatch;
            card.hidden = !show;
            if (show) {
                visible += 1;
            }
        });

        if (empty) {
            empty.hidden = visible !== 0;
        }
    }

    if (searchPage && searchInput) {
        const params = new URLSearchParams(window.location.search);
        const query = params.get("q") || "";
        searchInput.value = query;
        filterCards();
        searchInput.addEventListener("input", filterCards);
    }

    if (pageFilter) {
        pageFilter.addEventListener("input", filterCards);
    }

    if (yearFilter) {
        yearFilter.addEventListener("change", filterCards);
    }
});
