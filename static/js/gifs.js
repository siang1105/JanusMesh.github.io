// Media list for supplementary viewers (MP4 assets under static/result)
const MEDIA_CATEGORIES = {
  '2-object-clip': {
    basePath: '../static/result/2-object(CLIP_rotation)/',
    files: [
      '(1)a peacock+a pineapple_ours.mp4',
      '(2)cactus+purple succulent_ours.mp4',
      '(3)a pineapple+a fish_ours.mp4',
      '(4)an owl+a plane_ours.mp4',
      '(5)a rhinoceros+a pineapple_ours.mp4',
      '(6)a flying bird+a toucan_ours.mp4',
      '(7)a bear+a pelican_ours.mp4',
      '(8)an owl+a pigeon_ours.mp4',
      '(9)a hippopotamus+blue rose_ours.mp4',
      '(10)a plane+a camera_ours.mp4'
    ]
  },
  '2-object-fix': {
    basePath: '../static/result/2-object(fix_angle)/',
    files: [
      '(1)a sofa+open book_ours.mp4',
      '(2)an owl+a hat_ours.mp4',
      '(3)a frog+a turtle_ours.mp4',
      '(4)cactus+dwarf cottage_ours.mp4',
      '(5)grapes+an octopus_ours.mp4',
      '(6)pumpkin carriage+strawberry ice cream sundae in the cup_ours.mp4',
      '(7)a stork+grapes_ours.mp4',
      '(8)a parrot+a boat_ours.mp4',
      '(9)a horse+a telescope_ours.mp4',
      '(10)a turtle+a plane_ours.mp4',
      '(11)a flying bird+a shark_ours.mp4',
      '(12)a rooster+grapes_ours.mp4',
      '(13)a rhinoceros+dwarf cottage_ours.mp4',
      '(14)an eagle+a running dog_ours.mp4',
      '(15)bamboo+dwarf cottage_ours.mp4',
      '(16)pumpkin carriage+a lion_ours.mp4',
      '(17)blue rose+grapes_ours.mp4',
      '(18)basket with goodies+ice castle_ours.mp4',
      '(19)grapes+bamboo_ours.mp4',
      '(20)a running dog+a bear_ours.mp4',
      '(21)a stork+a turtle_ours.mp4',
      '(22)a toucan+a boat_ours.mp4',
      '(23)a rooster+purple succulent_ours.mp4',
      '(24)dwarf cottage+a crocodile_ours.mp4',
      '(25)a pineapple+an antelope_ours.mp4'
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
    }).join(' → ');
  }
  return name;
}

function formatThumbnailLabel(filename, phases) {
  const name = stripMediaSuffix(filename);
  const parts = name.split('+');
  if (parts.length >= phases) {
    return parts.map(function (part) {
      return part.trim();
    }).join(' → ');
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
  var url = this.basePath + encodeURIComponent(file);
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
