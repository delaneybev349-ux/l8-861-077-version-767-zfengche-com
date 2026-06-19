(function () {
    window.setupVideoPlayer = function (options) {
        var video = document.getElementById(options.videoId);
        var overlay = document.getElementById(options.overlayId);
        var url = options.url;
        var hls = null;
        var attached = false;

        if (!video || !url) {
            return;
        }

        function attachUrl() {
            if (attached) {
                return;
            }

            attached = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });

                hls.loadSource(url);
                hls.attachMedia(video);

                hls.on(window.Hls.Events.ERROR, function (eventName, data) {
                    if (!data || !data.fatal) {
                        return;
                    }

                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    } else {
                        hls.destroy();
                    }
                });
            } else {
                video.src = url;
            }
        }

        function playVideo(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            attachUrl();

            if (overlay) {
                overlay.classList.add("is-hidden");
            }

            video.controls = true;

            var playPromise = video.play();

            if (playPromise && playPromise.catch) {
                playPromise.catch(function () {});
            }
        }

        if (overlay) {
            overlay.addEventListener("click", playVideo);
        }

        video.addEventListener("click", function () {
            if (!attached || video.paused) {
                playVideo();
            }
        });

        window.addEventListener("pagehide", function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    };
})();
