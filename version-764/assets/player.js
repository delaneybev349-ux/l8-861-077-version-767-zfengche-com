(function () {
  var shell = document.querySelector('[data-video-source]');
  if (!shell) {
    return;
  }

  var video = shell.querySelector('video');
  var button = shell.querySelector('[data-play-button]');
  var source = shell.getAttribute('data-video-source');
  var hlsInstance = null;
  var started = false;

  function loadAndPlay() {
    if (!video || !source) {
      return;
    }

    if (button) {
      button.classList.add('is-hidden');
    }

    if (started) {
      video.play().catch(function () {});
      return;
    }

    started = true;

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.addEventListener('loadedmetadata', function () {
        video.play().catch(function () {});
      }, { once: true });
      video.load();
    } else {
      video.src = source;
      video.play().catch(function () {});
    }
  }

  if (button) {
    button.addEventListener('click', loadAndPlay);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        loadAndPlay();
      }
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
