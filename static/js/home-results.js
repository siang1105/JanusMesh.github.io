/**
 * Results grids on index.html: 6 items per page, uses MEDIA_CATEGORIES from gifs.js.
 * Root-relative video URLs (index lives at site root).
 */
(function () {
  var PAGE_SIZE = 6;

  function mediaUrl(categoryKey, filename) {
    var c = MEDIA_CATEGORIES[categoryKey];
    var rel = c.basePath.replace(/^\.\.\/static\//, './static/');
    var q =
      typeof RESULT_ASSET_CACHE_VER !== 'undefined'
        ? '?v=' + RESULT_ASSET_CACHE_VER
        : '';
    return rel + encodeURIComponent(filename) + q;
  }

  function renderGrid(container, categoryKey, phases, pageIndex) {
    var cfg = MEDIA_CATEGORIES[categoryKey];
    var files = cfg.files;
    var start = pageIndex * PAGE_SIZE;
    var slice = files.slice(start, start + PAGE_SIZE);
    container.innerHTML = '';
    slice.forEach(function (file) {
      var cell = document.createElement('div');
      cell.className = 'jm-result-cell';
      var vid = document.createElement('video');
      vid.setAttribute('muted', '');
      vid.setAttribute('playsinline', '');
      vid.setAttribute('loop', '');
      vid.setAttribute('autoplay', '');
      vid.setAttribute('preload', 'metadata');
      var src = document.createElement('source');
      src.src = mediaUrl(categoryKey, file);
      src.type = 'video/mp4';
      vid.appendChild(src);
      var cap = document.createElement('div');
      cap.className = 'jm-result-caption';
      cap.textContent = formatMediaTitle(file, phases);
      cell.appendChild(vid);
      cell.appendChild(cap);
      container.appendChild(cell);
    });
  }

  function setupBlock(rootId, categoryKey, phases) {
    var root = document.getElementById(rootId);
    if (!root) return;
    var grid = root.querySelector('.jm-results-grid');
    var pagination = root.querySelector('.jm-pagination');
    var prev = root.querySelector('.jm-results-prev');
    var next = root.querySelector('.jm-results-next');
    var label = root.querySelector('.jm-results-page-label');
    // Home page only shows the first six examples (single page).
    var files = MEDIA_CATEGORIES[categoryKey].files.slice(0, PAGE_SIZE);
    var totalPages = Math.max(1, Math.ceil(files.length / PAGE_SIZE));
    var page = 0;

    function update() {
      renderGrid(grid, categoryKey, phases, page);
      label.textContent = page + 1 + ' / ' + totalPages;
      prev.disabled = page <= 0;
      next.disabled = page >= totalPages - 1;
      if (pagination) {
        pagination.style.display = totalPages <= 1 ? 'none' : '';
      }
    }

    prev.addEventListener('click', function () {
      if (page > 0) {
        page--;
        update();
      }
    });
    next.addEventListener('click', function () {
      if (page < totalPages - 1) {
        page++;
        update();
      }
    });
    update();
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (typeof MEDIA_CATEGORIES === 'undefined') return;
    setupBlock('jm-block-clip', '2-object-clip', 2);
    setupBlock('jm-block-fix', '2-object-fix', 2);
    setupBlock('jm-block-3obj', '3-object', 3);
  });
})();
