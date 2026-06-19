document.addEventListener("DOMContentLoaded", function () {
    const shell = document.querySelector("[data-player]");

    if (!shell) {
        return;
    }

    const video = shell.querySelector("video");
    const cover = shell.querySelector("[data-player-start]");
    const message = shell.querySelector("[data-player-message]");
    const stream = shell.getAttribute("data-stream") || "";
    let attached = false;
    let hls = null;

    function showMessage(text) {
        if (!message) {
            return;
        }

        message.textContent = text;
        message.hidden = false;
    }

    function attach() {
        if (attached || !video || !stream) {
            return;
        }

        attached = true;

        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(stream);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal) {
                    showMessage("暂时无法播放，请稍后再试");
                }
            });
            return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = stream;
            return;
        }

        showMessage("暂时无法播放，请稍后再试");
    }

    function startPlayback() {
        attach();

        if (cover) {
            cover.hidden = true;
        }

        video.controls = true;
        const playTask = video.play();

        if (playTask && typeof playTask.catch === "function") {
            playTask.catch(function () {
                if (cover) {
                    cover.hidden = false;
                }
            });
        }
    }

    if (cover) {
        cover.addEventListener("click", startPlayback);
    }

    if (video) {
        video.addEventListener("click", function () {
            if (video.paused) {
                startPlayback();
            } else {
                video.pause();
            }
        });
    }

    window.addEventListener("beforeunload", function () {
        if (hls) {
            hls.destroy();
        }
    });
});
