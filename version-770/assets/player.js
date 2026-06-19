(function () {
  var video = document.getElementById('movie-player');
  var button = document.getElementById('player-start');
  var source = typeof siteVideoSource === 'string' ? siteVideoSource : '';
  var ready = false;
  var hlsInstance = null;

  function attach() {
    if (!video || !source || ready) {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls();
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else {
      video.src = source;
    }
    ready = true;
  }

  function start() {
    attach();
    if (button) {
      button.classList.add('is-hidden');
    }
    if (video) {
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }
  }

  if (button) {
    button.addEventListener('click', start);
  }
  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });
  }
  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
})();
