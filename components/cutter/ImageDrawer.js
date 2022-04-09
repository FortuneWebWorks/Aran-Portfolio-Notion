class Drawer {
  constructor(canvas, fitResizer, container, image) {
    this.canvas = canvas;
    this.c = this.canvas.getContext('2d');

    this.container = container;

    this.image = image;
    this.imageInfo = this.image.getBoundingClientRect();

    this.xRatio = this.image.naturalWidth / this.imageInfo.width;
    this.yRatio = this.image.naturalHeight / this.imageInfo.height;

    this.zoom = this.zoom.bind(this);
    this.zoomDir = null;
    this.zoomDx = 5;

    this.selector = null;

    // Flip
    this.flipX = false;
    this.flipY = false;

    // Fit resizer function to fit the canvas size to cut it live
    this.fitResizer = fitResizer;
  }

  zoom() {
    if (this.zoomDir) {
      let width = this.image.getBoundingClientRect().width;

      const ratio = this.image.naturalWidth / this.image.naturalHeight;

      // Get the height with ratio
      function getHeight(length, ratio) {
        var height = length / Math.sqrt(Math.pow(ratio, 2));
        return height;
      }

      if (this.zoomDir > 0) {
        this.image.style.width = width + this.zoomDx + 'px';
        this.image.style.height = getHeight(width, ratio) + 'px';
      } else {
        this.image.style.width = width - this.zoomDx + 'px';
        this.image.style.height = getHeight(width, ratio) + 'px';
      }

      this.xRatio =
        this.image.naturalWidth / this.image.getBoundingClientRect().width;
      this.yRatio =
        this.image.naturalHeight / this.image.getBoundingClientRect().height;
      this.fitResizer(this.selector);
    }
  }

  flip(e) {}

  draw(data) {
    if (this.xRatio === 0 || this.yRatio === 0) {
      this.imageInfo = this.image.getBoundingClientRect();
      this.xRatio = this.image.naturalWidth / this.imageInfo.width;
      this.yRatio = this.image.naturalHeight / this.imageInfo.height;
    }

    this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.width = data.width * this.xRatio;
    this.canvas.height = data.height * this.yRatio;

    // X and Y flip
    let fy, fx;

    // Check and do the x flip
    let rightDis;
    let left;
    let selectorWidth;
    if (this.flipX) {
      rightDis = data.x + data.width - this.imageInfo.width;
      left = rightDis * -1;
      selectorWidth = data.width * -1;
      fx = -1;
    } else {
      left = data.x - this.image.offsetLeft;
      selectorWidth = data.width;
      fx = 1;
    }

    // Check and do the y flip
    let bottomDis;
    let top;
    let selectorHeight;
    if (this.flipY) {
      bottomDis = data.y + data.height - this.imageInfo.height;
      top = bottomDis * -1;
      selectorHeight = data.height * -1;
      fy = -1;
    } else {
      top = data.y - this.image.offsetTop;
      selectorHeight = data.height;
      fy = 1;
    }

    this.c.beginPath();
    this.c.scale(fx, fy);
    // Draw the cropped image
    this.c.drawImage(
      this.image,
      left * this.xRatio,
      top * this.yRatio,
      data.width * this.xRatio,
      data.height * this.yRatio,
      0,
      0,
      selectorWidth * this.xRatio,
      selectorHeight * this.yRatio
    );
    this.c.closePath();
  }

  init(selector) {
    this.selector = selector;
    window.addEventListener(
      'wheel',
      (e) => {
        this.zoomDir = e.wheelDelta;
        this.zoom();
      },
      { once: true }
    );
    this.canvas.addEventListener('mousedown', this.flip);
  }
}

// const download = document.getElementById('download');
// download.addEventListener('click', () => {
//   const output = canvas
//     .toDataURL('image/png')
//     .replace('image/png', 'image/octet-stream');

//   window.location.href = output;

//   console.log(output);
// });

export default Drawer;
