(function () {
    var menuToggle = document.querySelector('[data-menu-toggle]');
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            document.body.classList.toggle('is-menu-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var heroIndex = 0;

    function showHero(index) {
        if (!slides.length) {
            return;
        }
        heroIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === heroIndex);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === heroIndex);
        });
    }

    dots.forEach(function (dot, dotIndex) {
        dot.addEventListener('click', function () {
            showHero(dotIndex);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showHero(heroIndex + 1);
        }, 5200);
    }

    var filterInput = document.querySelector('[data-card-filter]');
    if (filterInput) {
        filterInput.addEventListener('input', function () {
            var keyword = filterInput.value.trim().toLowerCase();
            var cards = document.querySelectorAll('[data-movie-card]');
            cards.forEach(function (card) {
                var text = [
                    card.getAttribute('data-title') || '',
                    card.getAttribute('data-region') || '',
                    card.getAttribute('data-year') || '',
                    card.getAttribute('data-genre') || '',
                    card.textContent || ''
                ].join(' ').toLowerCase();
                card.classList.toggle('is-hidden', keyword && text.indexOf(keyword) === -1);
            });
        });
    }

    function createResultCard(item) {
        var article = document.createElement('article');
        article.className = 'movie-card';
        article.setAttribute('data-movie-card', '');
        article.setAttribute('data-title', item.title);
        article.setAttribute('data-region', item.region);
        article.setAttribute('data-year', item.year);
        article.setAttribute('data-genre', item.genre);

        var tags = item.tags.slice(0, 3).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');

        article.innerHTML = [
            '<a class="card-poster" href="' + escapeHtml(item.href) + '" aria-label="观看' + escapeHtml(item.title) + '">',
            '<span class="poster-frame" data-title="' + escapeHtml(item.title) + '海报">',
            '<img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '海报" loading="lazy" onerror="this.parentElement.classList.add(\'is-missing\'); this.remove();">',
            '</span>',
            '<span class="card-badge">' + escapeHtml(item.year) + '</span>',
            '</a>',
            '<div class="card-content">',
            '<div class="card-meta"><span>' + escapeHtml(item.category) + '</span><span>' + escapeHtml(item.region) + '</span></div>',
            '<h2><a href="' + escapeHtml(item.href) + '">' + escapeHtml(item.title) + '</a></h2>',
            '<p>' + escapeHtml(item.oneLine) + '</p>',
            '<div class="tag-row">' + tags + '</div>',
            '</div>'
        ].join('');
        return article;
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    var searchForm = document.querySelector('[data-search-form]');
    var searchResults = document.querySelector('[data-search-results]');
    var searchSummary = document.querySelector('[data-search-summary]');

    function performSearch(keyword) {
        if (!searchResults || !window.SITE_SEARCH_ITEMS) {
            return;
        }
        var query = (keyword || '').trim().toLowerCase();
        var items = window.SITE_SEARCH_ITEMS;
        var matches = query ? items.filter(function (item) {
            return [
                item.title,
                item.region,
                item.year,
                item.genre,
                item.category,
                item.tags.join(' '),
                item.oneLine
            ].join(' ').toLowerCase().indexOf(query) !== -1;
        }) : items.slice(0, 60);

        searchResults.innerHTML = '';
        matches.slice(0, 120).forEach(function (item) {
            searchResults.appendChild(createResultCard(item));
        });

        if (searchSummary) {
            searchSummary.textContent = query ? '已匹配到相关内容，点击卡片进入播放页。' : '展示近期推荐内容，可输入关键词继续筛选。';
        }
    }

    if (searchForm) {
        var input = searchForm.querySelector('input[name="q"]');
        var params = new URLSearchParams(window.location.search);
        var initial = params.get('q') || '';
        if (input) {
            input.value = initial;
            input.addEventListener('input', function () {
                performSearch(input.value);
            });
        }
        searchForm.addEventListener('submit', function (event) {
            event.preventDefault();
            performSearch(input ? input.value : '');
        });
        performSearch(initial);
    }

    var video = document.querySelector('video[data-stream]');
    var startButton = document.querySelector('[data-player-start]');
    var streamTabs = document.querySelectorAll('[data-stream-switch]');
    var hlsInstance = null;

    function attachStream(url) {
        if (!video || !url) {
            return;
        }
        if (hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
        }
        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(url);
            hlsInstance.attachMedia(video);
            hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                video.play().catch(function () {});
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.play().catch(function () {});
        } else {
            video.src = url;
            video.play().catch(function () {});
        }
    }

    if (video && startButton) {
        startButton.addEventListener('click', function () {
            var url = video.getAttribute('data-stream');
            attachStream(url);
            startButton.classList.add('is-hidden');
        });
        video.addEventListener('play', function () {
            startButton.classList.add('is-hidden');
        });
    }

    streamTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            streamTabs.forEach(function (item) {
                item.classList.remove('active');
            });
            tab.classList.add('active');
            var url = tab.getAttribute('data-stream');
            if (video) {
                video.setAttribute('data-stream', url);
            }
            attachStream(url);
            if (startButton) {
                startButton.classList.add('is-hidden');
            }
        });
    });
})();
