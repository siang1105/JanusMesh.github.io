// Media list for supplementary viewers (MP4 assets under static/result)
const MEDIA_CATEGORIES = {
  '2-object-clip': {
    basePath: '../static/result/2-object(CLIP_rotation)/',
    /* Only examples where SFS, concat, ours, TRELLIS, dreambeast all exist. */
    files: [
      '(1)a peacock+a pineapple_ours.mp4',
      '(2)cactus+purple succulent_ours.mp4',
      '(3)a pineapple+a fish_ours.mp4',
      '(4)an owl+a plane_ours.mp4',
      '(5)a rhinoceros+a pineapple_ours.mp4',
      '(6)a flying bird+a toucan_ours.mp4',
      '(7)a bear+a pelican_ours.mp4',
      '(9)a hippopotamus+blue rose_ours.mp4',
      '(10)a plane+a camera_ours.mp4'
    ]
  },
  '2-object-fix': {
    basePath: '../static/result/2-object(fix_angle)/',
    /* Subset of fix_angle with all five baselines (see static/result). */
    files: [
      '(3)a frog+a turtle_ours.mp4',
      '(5)grapes+an octopus_ours.mp4',
      '(14)an eagle+a running dog_ours.mp4',
      '(15)bamboo+dwarf cottage_ours.mp4',
      '(16)pumpkin carriage+a lion_ours.mp4',
      '(17)blue rose+grapes_ours.mp4',
      '(18)basket with goodies+ice castle_ours.mp4',
      '(19)grapes+bamboo_ours.mp4',
      '(21)a stork+a turtle_ours.mp4',
      '(22)a toucan+a boat_ours.mp4'
    ]
  },
  '3-object': {
    basePath: '../static/result/3-object/',
    files: [
      '(1)Bamboo+A Pineapple+Grapes.mp4',
      '(2)A Peacock+Green Vine+Ball Gown.mp4',
      '(3)Grapes+Cactus+Pumpkin Carriage.mp4',
      '(4)A Peacock+A Swan+A Pineapple.mp4',
      '(5)Bamboo+A Duck+A Pineapple.mp4'
    ]
  }
};

/**
 * Bumped when replacing any file under static/result/ so the browser fetches
 * new bytes (MP4s are often cached aggressively; on-disk = correct but tab still shows old).
 */
var RESULT_ASSET_CACHE_VER = '20260427-t0';

function resultVideoUrl(basePath, filename) {
  return basePath + encodeURIComponent(filename) + '?v=' + RESULT_ASSET_CACHE_VER;
}

function stripMediaSuffix(filename) {
  return filename
    .replace(/^\(\d+\)/, '')
    .replace(/_ours\.mp4$/i, '')
    .replace(/\.mp4$/i, '')
    .replace(/\.gif$/i, '');
}

function formatMediaTitle(filename, phases) {
  const name = stripMediaSuffix(filename);
  const parts = name.split('+');
  if (parts.length >= phases) {
    return parts.map(function (part) {
      const t = part.trim();
      return t.charAt(0).toUpperCase() + t.slice(1);
    }).join(' & ');
  }
  return name;
}

function formatThumbnailLabel(filename, phases) {
  const name = stripMediaSuffix(filename);
  const parts = name.split('+');
  if (parts.length >= phases) {
    return parts.map(function (part) {
      return part.trim();
    }).join(' & ');
  }
  return name;
}

function GifCarousel(category, phases) {
  this.config = MEDIA_CATEGORIES[category];
  this.phases = phases;
  this.files = this.config.files;
  this.basePath = this.config.basePath;
  this.currentIndex = 0;

  this.mediaEl = document.getElementById('mainGif');
  this.gifTitle = document.getElementById('gifTitle');
  this.currentNum = document.getElementById('currentNum');
  this.totalNum = document.getElementById('totalNum');
  this.progressFill = document.getElementById('progressFill');
  this.thumbnailStrip = document.getElementById('thumbnailStrip');
  this.prevBtn = document.getElementById('prevBtn');
  this.nextBtn = document.getElementById('nextBtn');

  this.init();
}

GifCarousel.prototype.init = function () {
  this.totalNum.textContent = this.files.length;
  this.createThumbnails();
  this.setupEventListeners();
  this.updateCarousel();
};

GifCarousel.prototype.createThumbnails = function () {
  var self = this;
  this.thumbnailStrip.innerHTML = '';
  this.files.forEach(function (file, index) {
    var item = document.createElement('div');
    item.className = 'thumbnail-item' + (index === 0 ? ' active' : '');
    item.textContent = formatThumbnailLabel(file, self.phases);
    item.addEventListener('click', function (e) {
      e.preventDefault();
      self.goTo(index);
    });
    self.thumbnailStrip.appendChild(item);
  });
};

GifCarousel.prototype.setupEventListeners = function () {
  var self = this;
  this.prevBtn.addEventListener('click', function (e) {
    e.preventDefault();
    self.prev();
  });
  this.nextBtn.addEventListener('click', function (e) {
    e.preventDefault();
    self.next();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      self.prev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      self.next();
    }
  });
};

GifCarousel.prototype.setSource = function (file) {
  var url = resultVideoUrl(this.basePath, file);
  this.mediaEl.src = url;
  if (this.mediaEl.tagName === 'VIDEO') {
    this.mediaEl.load();
    var playPromise = this.mediaEl.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {});
    }
  }
};

GifCarousel.prototype.updateCarousel = function () {
  var file = this.files[this.currentIndex];
  this.setSource(file);
  this.gifTitle.textContent = formatMediaTitle(file, this.phases);
  this.currentNum.textContent = this.currentIndex + 1;
  this.progressFill.style.width =
    ((this.currentIndex + 1) / this.files.length) * 100 + '%';

  var thumbnails = this.thumbnailStrip.querySelectorAll('.thumbnail-item');
  for (var i = 0; i < thumbnails.length; i++) {
    thumbnails[i].classList.toggle('active', i === this.currentIndex);
  }

  this.prevBtn.disabled = this.currentIndex === 0;
  this.nextBtn.disabled = this.currentIndex === this.files.length - 1;
};

GifCarousel.prototype.goTo = function (index) {
  var next = Math.max(0, Math.min(index, this.files.length - 1));
  if (next !== this.currentIndex) {
    this.currentIndex = next;
    this.updateCarousel();
  }
};

GifCarousel.prototype.next = function () {
  if (this.currentIndex < this.files.length - 1) {
    this.currentIndex++;
    this.updateCarousel();
  }
};

GifCarousel.prototype.prev = function () {
  if (this.currentIndex > 0) {
    this.currentIndex--;
    this.updateCarousel();
  }
};

/** Stem of asset triple: "(1)foo+bar" from "(1)foo+bar_ours.mp4" */
function stemFromOursFilename(filename) {
  return filename.replace(/_ours\.mp4$/i, '');
}

/**
 * 3-up viewer: SFS, concat, ours (same example index for 2-object-clip / 2-object-fix).
 */
function CompareCarousel(category, phases) {
  this.config = MEDIA_CATEGORIES[category];
  this.categoryKey = category;
  this.phases = phases;
  this.files = this.config.files;
  this.basePath = this.config.basePath;
  this.currentIndex = 0;
  this._loadGen = 0;
  this._vcSyncing = false;

  this.vidSfs = document.getElementById('vidSfs');
  this.vidConcat = document.getElementById('vidConcat');
  this.vidTrellis = document.getElementById('vidTrellis');
  this.vidDreambeast = document.getElementById('vidDreambeast');
  this.vidOurs = document.getElementById('vidOurs');
  this.gifTitle = document.getElementById('gifTitle');
  this.currentNum = document.getElementById('currentNum');
  this.totalNum = document.getElementById('totalNum');
  this.progressFill = document.getElementById('progressFill');
  this.thumbnailStrip = document.getElementById('thumbnailStrip');
  this.prevBtn = document.getElementById('prevBtn');
  this.nextBtn = document.getElementById('nextBtn');

  this.init();
}

CompareCarousel.prototype.stem = function (file) {
  return stemFromOursFilename(file);
};

function compareClampTime(t, v) {
  if (!v || !isFinite(t)) return 0;
  var d = v.duration;
  if (!isFinite(d) || d <= 0) return Math.max(0, t);
  return Math.max(0, Math.min(t, d - 0.02));
}

CompareCarousel.prototype._videos = function () {
  return [this.vidSfs, this.vidConcat, this.vidTrellis, this.vidDreambeast, this.vidOurs];
};

CompareCarousel.prototype.setTripleSources = function (stem) {
  var self = this;
  var base = this.basePath;
  var g = ++this._loadGen;
  var vids = this._videos();
  this.vidSfs.src = resultVideoUrl(base, stem + '_SFS.mp4');
  this.vidConcat.src = resultVideoUrl(base, stem + '_concat.mp4');
  this.vidTrellis.src = resultVideoUrl(base, stem + '_trellis.mp4');
  this.vidDreambeast.src = resultVideoUrl(base, stem + '_dreambeast.mp4');
  this.vidOurs.src = resultVideoUrl(base, stem + '_ours.mp4');
  vids.forEach(function (v) {
    v.load();
  });
  var n = 0;
  vids.forEach(function (v) {
    var h = function () {
      v.removeEventListener('loadeddata', h);
      if (g !== self._loadGen) return;
      n += 1;
      if (n < 5) return;
      self._applyStartTimeAndPlayCompare(stem, g, vids);
    };
    v.addEventListener('loadeddata', h);
  });
};

/**
 * 五路從頭（t=0）起播，播放中仍由 SFS 帶動其他四路對齊。
 */
CompareCarousel.prototype._applyStartTimeAndPlayCompare = function (stem, g, vids) {
  var self = this;
  if (g !== self._loadGen) return;
  self._vcSyncing = true;
  vids.forEach(function (x) {
    x.currentTime = compareClampTime(0, x);
  });
  self._vcSyncing = false;
  vids.forEach(function (x) {
    var p = x.play();
    if (p && p.catch) p.catch(function () {});
  });
};

CompareCarousel.prototype.setupVideoSync = function () {
  var self = this;
  var vids = this._videos();
  var driftS = 0.12;
  vids.forEach(function (v) {
    v.addEventListener('play', function () {
      if (self._vcSyncing) return;
      vids.forEach(function (x) {
        if (x !== v && x.paused) {
          x.play().catch(function () {});
        }
      });
    });
    v.addEventListener('pause', function () {
      if (self._vcSyncing) return;
      vids.forEach(function (x) {
        if (x !== v && !x.paused) x.pause();
      });
    });
    v.addEventListener('seeked', function () {
      if (self._vcSyncing) return;
      var t = v.currentTime;
      var allClose = vids.every(function (x) {
        return Math.abs(x.currentTime - t) < 0.05;
      });
      if (allClose) return;
      self._vcSyncing = true;
      vids.forEach(function (x) {
        x.currentTime = compareClampTime(t, x);
      });
      self._vcSyncing = false;
    });
  });
  this.vidSfs.addEventListener('timeupdate', function () {
    if (self._vcSyncing || self.vidSfs.paused) return;
    var t = self.vidSfs.currentTime;
    if (
      Math.abs(self.vidConcat.currentTime - t) <= driftS &&
      Math.abs(self.vidTrellis.currentTime - t) <= driftS &&
      Math.abs(self.vidDreambeast.currentTime - t) <= driftS &&
      Math.abs(self.vidOurs.currentTime - t) <= driftS
    ) {
      return;
    }
    self._vcSyncing = true;
    [self.vidConcat, self.vidTrellis, self.vidDreambeast, self.vidOurs].forEach(function (x) {
      if (Math.abs(x.currentTime - t) > driftS) {
        x.currentTime = compareClampTime(t, x);
      }
    });
    self._vcSyncing = false;
  });
};

CompareCarousel.prototype.init = function () {
  this.totalNum.textContent = this.files.length;
  this.createThumbnails();
  this.setupEventListeners();
  this.setupVideoSync();
  this.updateCarousel();
};

CompareCarousel.prototype.createThumbnails = function () {
  var self = this;
  this.thumbnailStrip.innerHTML = '';
  this.files.forEach(function (file, index) {
    var item = document.createElement('div');
    item.className = 'thumbnail-item' + (index === 0 ? ' active' : '');
    item.textContent = formatThumbnailLabel(file, self.phases);
    item.addEventListener('click', function (e) {
      e.preventDefault();
      self.goTo(index);
    });
    self.thumbnailStrip.appendChild(item);
  });
};

CompareCarousel.prototype.setupEventListeners = function () {
  var self = this;
  this.prevBtn.addEventListener('click', function (e) {
    e.preventDefault();
    self.prev();
  });
  this.nextBtn.addEventListener('click', function (e) {
    e.preventDefault();
    self.next();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      self.prev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      self.next();
    }
  });
};

CompareCarousel.prototype.updateCarousel = function () {
  var file = this.files[this.currentIndex];
  var stem = this.stem(file);
  this.setTripleSources(stem);
  this.gifTitle.textContent = formatMediaTitle(file, this.phases);
  this.currentNum.textContent = this.currentIndex + 1;
  this.progressFill.style.width =
    ((this.currentIndex + 1) / this.files.length) * 100 + '%';

  var thumbs = this.thumbnailStrip.querySelectorAll('.thumbnail-item');
  for (var i = 0; i < thumbs.length; i++) {
    thumbs[i].classList.toggle('active', i === this.currentIndex);
  }
  this.prevBtn.disabled = this.currentIndex === 0;
  this.nextBtn.disabled = this.currentIndex === this.files.length - 1;
};

CompareCarousel.prototype.goTo = function (index) {
  var n = Math.max(0, Math.min(index, this.files.length - 1));
  if (n !== this.currentIndex) {
    this.currentIndex = n;
    this.updateCarousel();
  }
};

CompareCarousel.prototype.next = function () {
  if (this.currentIndex < this.files.length - 1) {
    this.currentIndex++;
    this.updateCarousel();
  }
};

CompareCarousel.prototype.prev = function () {
  if (this.currentIndex > 0) {
    this.currentIndex--;
    this.updateCarousel();
  }
};
