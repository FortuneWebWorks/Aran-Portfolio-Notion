/** @type {HTMLCanvasElement} */

// import Drawer from './ImageDrawer.js';

class Selector {
  constructor(canvas, x, y, width, height, callBack) {
    this.canvas = canvas;
    this.c = canvas.getContext('2d');

    this.callBack = callBack;

    // Selector rectangle
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // Draw resizer
    this.drawing = false;

    // Selector resize points
    this.pointSize = 10;
    this.resizers = {};
    this.selectedResizer = null;
    this.sides = ['tl', 'ct', 'tr', 'cl', 'cr', 'bl', 'cb', 'br'];

    // Event Handleres
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseMove = this.mouseMove.bind(this);

    // For moving the selector
    this.offset = {
      x: 0,
      y: 0,
    };

    this.position = {
      x: this.x,
      y: this.y,
    };

    // Aspect Ratio
    this.ratio = null;
  }

  cursor(cursor) {
    document.body.style.cursor = cursor;
  }

  addResizer(cx, cy, size, side) {
    let x = cx;
    let y = cy;
    let width = size;
    let height = size;

    this.resizers[side] = {
      x,
      y,
      width,
      height,
    };

    return this.c.rect(x, y, width, height);
  }

  getHeight(length, ratio) {
    var height = length / Math.sqrt(Math.pow(ratio, 2));
    return Math.round(height);
  }

  getWidth(length, ratio) {
    var width = length / Math.sqrt(1 / Math.pow(ratio, 2));
    return Math.round(width);
  }

  selector() {
    // The selecor rectangle
    this.c.beginPath();
    this.c.rect(this.x, this.y, this.width, this.height);
    this.c.strokeStyle = 'coral';
    this.c.stroke();

    // The selector resize points:
    /** Corners */
    // Left-Top
    this.c.beginPath();
    this.addResizer(
      this.x - this.pointSize / 2,
      this.y - this.pointSize / 2,
      this.pointSize,
      'tl'
    );

    // Top-right
    this.addResizer(
      this.x + this.width - this.pointSize / 2,
      this.y - this.pointSize / 2,
      this.pointSize,
      'tr'
    );

    // Bottom-left
    this.addResizer(
      this.x - this.pointSize / 2,
      this.y + this.height - this.pointSize / 2,
      this.pointSize,
      'bl'
    );

    // Bottom-right
    this.addResizer(
      this.x + this.width - this.pointSize / 2,
      this.y + this.height - this.pointSize / 2,
      this.pointSize,
      'br'
    );

    /** Centers */
    // Center-left
    this.addResizer(
      this.x - this.pointSize / 2,
      this.y + this.height / 2 - this.pointSize / 2,
      this.pointSize,
      'cl'
    );

    // Center-top
    this.addResizer(
      this.x + this.width / 2 - this.pointSize / 2,
      this.y - this.pointSize / 2,
      this.pointSize,
      'ct'
    );

    // Center-right
    this.addResizer(
      this.x + this.width - this.pointSize / 2,
      this.y + this.height / 2 - this.pointSize / 2,
      this.pointSize,
      'cr'
    );

    // Center-bottom
    this.addResizer(
      this.x + this.width / 2 - this.pointSize / 2,
      this.y + this.height - this.pointSize / 2,
      this.pointSize,
      'cb'
    );

    this.c.strokeStyle = 'green';
    this.c.stroke();

    this.detectSelectedPointSide();
  }

  detectSelectedPointSide() {
    let resizersArr = [];
    for (let item in this.resizers) {
      resizersArr.push({ ...this.resizers[item], side: item });
    }

    const sortedX = resizersArr.sort((a, b) => a.x - b.x);
    const finalSort = sortedX.sort((a, b) => a.y - b.y);

    const renamed = finalSort.map((item, index) => {
      item.side = this.sides[index];
      return item;
    });

    this.resizers = {};
    renamed.forEach((item) => {
      this.resizers[item.side] = item;
    });
  }

  update(isUpdatingRatio) {
    this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Resize the selector
    if (this.selectedResizer) {
      // Width And Height change
      let dWidth = 0;
      let dHeight = 0;
      let dx = 0;
      let dy = 0;
      switch (this.selectedResizer) {
        // Corners
        case 'tl':
          if (this.ratio) {
            dx = this.position.x - this.x;
            dy = this.getHeight(dx, this.ratio);
            dWidth = -dx;
            dHeight = -dy;
          } else {
            dx = this.position.x - this.x;
            dy = this.position.y - this.y;
            dWidth = -dx;
            dHeight = -dy;
          }
          break;

        case 'tr':
          if (this.ratio) {
            dx = 0;
            dy = this.position.y - this.y;
            dWidth = this.getWidth(-dy, this.ratio);
            dHeight = -dy;
          } else {
            dx = 0;
            dy = this.position.y - this.y;
            dWidth = this.position.x - (this.x + this.width);
            dHeight = -dy;
          }
          break;

        case 'bl':
          if (this.ratio) {
            dx = this.position.x - this.x;
            dy = 0;
            dWidth = -dx;
            dHeight = this.getHeight(dWidth, this.ratio);
          } else {
            dx = this.position.x - this.x;
            dy = 0;
            dWidth = -dx;
            dHeight = this.position.y - (this.y + this.height);
          }
          break;

        case 'br':
          if (this.ratio) {
            dWidth = this.position.x - (this.x + this.width);
            dHeight = this.getHeight(dWidth, this.ratio);
          } else {
            dWidth = this.position.x - (this.x + this.width);
            dHeight = this.position.y - (this.y + this.height);
          }
          break;

        // Centers
        case 'cl':
          if (this.ratio) {
            dx = this.position.x - this.x;
            dWidth = -dx;
            dHeight = this.getHeight(dWidth, this.ratio);
            dy = -dHeight / 2;
          } else {
            dx = this.position.x - this.x;
            dWidth = -dx;
          }
          break;

        case 'ct':
          if (this.ratio) {
            dy = this.position.y - this.y;
            dHeight = -dy;
            dWidth = this.getWidth(dHeight, this.ratio);
            dx = -dWidth / 2;
          } else {
            dy = this.position.y - this.y;
            dHeight = -dy;
          }
          break;

        case 'cr':
          if (this.ratio) {
            dWidth = this.position.x - (this.x + this.width);
            dHeight = this.getHeight(dWidth, this.ratio);
            dy = -dHeight / 2;
          } else {
            dWidth = this.position.x - (this.x + this.width);
          }
          break;

        case 'cb':
          if (this.ratio) {
            dHeight = this.position.y - (this.y + this.height);
            dWidth = this.getWidth(dHeight, this.ratio);
            dx = -dWidth / 2;
          } else {
            dHeight = this.position.y - (this.y + this.height);
          }
          break;

        default:
          dWidth = 0;
          dHeight = 0;
          break;
      }

      this.x += dx;
      this.y += dy;
      this.width += dWidth;
      this.height += dHeight;
    } else if (this.drawing) {
      this.x = this.offset.pureX;
      this.y = this.offset.pureY;
      if (this.ratio) {
        this.height += this.position.y - (this.y + this.height);

        if (this.position.x > this.x && this.position.y > this.y) {
          this.width = this.getWidth(this.height, this.ratio);
        } else {
          this.width =
            this.position.x > this.x || this.position.y > this.y
              ? -this.getWidth(this.height, this.ratio)
              : this.getWidth(this.height, this.ratio);
        }
      } else {
        this.width += this.position.x - (this.x + this.width);
        this.height += this.position.y - (this.y + this.height);
      }
    } else if (!isUpdatingRatio) {
      // Move the selector
      this.x = this.position.x - this.offset.x;
      this.y = this.position.y - this.offset.y;
    }

    this.selector();
  }

  recHit(e, target) {
    if (target.width < 0) {
      if (target.height < 0) {
        if (
          e.offsetX >= target.x &&
          e.offsetX <= target.x + Math.abs(target.width) &&
          e.offsetY >= target.y - Math.abs(target.height) &&
          e.offsetY <= target.y + Math.abs(target.height)
        ) {
          return true;
        }
      } else {
        if (
          e.offsetX >= target.x - Math.abs(target.width) &&
          e.offsetX <= target.x &&
          e.offsetY >= target.y &&
          e.offsetY <= target.y + Math.abs(target.height)
        ) {
          return true;
        }
      }
    } else {
      if (target.height < 0) {
        if (
          e.offsetX >= target.x &&
          e.offsetX <= target.x + Math.abs(target.width) &&
          e.offsetY >= target.y - Math.abs(target.height) &&
          e.offsetY <= target.y + Math.abs(target.height)
        ) {
          return true;
        }
      } else {
        if (
          e.offsetX >= target.x &&
          e.offsetX <= target.x + Math.abs(target.width) &&
          e.offsetY >= target.y &&
          e.offsetY <= target.y + Math.abs(target.height)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  addRemoveEvents() {
    this.canvas.removeEventListener('mouseup', this.mouseUp);
    this.canvas.removeEventListener('mousemove', this.mouseMove);
    this.canvas.addEventListener('mouseup', this.mouseUp);
    this.canvas.addEventListener('mousemove', this.mouseMove);
  }

  mouseDown(e) {
    this.offset = {
      x: e.offsetX - this.x,
      y: e.offsetY - this.y,
      pureX: e.offsetX,
      pureY: e.offsetY,
    };

    this.addRemoveEvents();
  }

  mouseMove(e) {
    this.position = {
      x: e.offsetX,
      y: e.offsetY,
    };

    let cursor = 'default';

    for (const item in this.resizers) {
      if (this.recHit(e, this.resizers[item])) {
        // Change cursor
        switch (item) {
          // Corners
          case 'tl':
            cursor = 'se-resize';
            break;
          case 'tr':
            cursor = 'sw-resize';
            break;
          case 'bl':
            cursor = 'ne-resize';
            break;
          case 'br':
            cursor = 'nw-resize';
            break;

          // Centers
          case 'cl':
            cursor = 'e-resize';
            break;
          case 'ct':
            cursor = 's-resize';
            break;
          case 'cr':
            cursor = 'w-resize';
            break;
          case 'cb':
            cursor = 'n-resize';
            break;

          default:
            cursor;
            break;
        }

        // Set witch resizer is grabed
        this.selectedResizer = item;

        this.canvas.addEventListener('mouseup', this.mouseUp);
        this.canvas.addEventListener('mousemove', this.mouseMove);
      }

      // Change cursor
      this.cursor(cursor);
    }

    // Check if clicked point is the square
    if (this.recHit(e, this)) {
      cursor = 'move';
    } else {
      if (!this.selectedResizer) {
        this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.width = 0;
        this.height = 0;

        this.drawing = true;
      }
    }

    this.update();
  }

  mouseUp() {
    this.offset = {};
    this.position = {};
    this.selectedResizer = null;
    this.drawing = false;
    this.cursor('default');

    this.canvas.removeEventListener('mouseup', this.mouseUp);
    this.canvas.removeEventListener('mousemove', this.mouseMove);

    // Fix the position and size after drawing selector
    this.x = this.resizers['tl'].x + this.pointSize / 2;
    this.y = this.resizers['tl'].y + this.pointSize / 2;
    this.width = Math.abs(this.width);
    this.height = Math.abs(this.height);

    // Return data. it can be on mouse down too
    this.callBack(this.outPut());
  }

  setAspect(e) {
    switch (e.key) {
      case '1':
        this.ratio = 16 / 9;
        this.height = this.getHeight(this.width, this.ratio);
        break;

      case '2':
        this.ratio = 9 / 16;
        this.height = this.getHeight(this.width, this.ratio);
        break;

      case '3':
        this.ratio = 1 / 1;
        this.height = this.getHeight(this.width, this.ratio);
        break;

      case '4':
        this.ratio = null;
        break;

      default:
        this.ratio = null;
        break;
    }

    this.update(true);
  }

  outPut() {
    let x, y, width, height;
    if (this.width < 0) {
      x = this.x - Math.abs(this.width);
      y = this.y;
    } else {
      x = this.x;
      y = this.y;
    }
    if (this.height < 0) {
      y = this.y - Math.abs(this.height);
    }
    width = Math.abs(this.width);
    height = Math.abs(this.height);

    return {
      x,
      y,
      width,
      height,
    };
  }

  init() {
    this.update();

    this.canvas.addEventListener('mousedown', this.mouseDown);

    window.addEventListener('resize', () => {
      this.canvas.width = innerWidth;
      this.canvas.height = innerHeight;

      this.update();
    });

    window.addEventListener('keydown', (e) => {
      this.setAspect(e, this);
    });
  }
}

// const drawer = new Drawer();
// drawer.init(canvas);
// const callBack = (data) => {
//   drawer.draw(data);
// };

// const selector = new Selector(
//   canvas.width / 2 - 100,
//   canvas.height / 2 - 100,
//   200,
//   200,
//   callBack
// );
// const selectorData = selector.init();

export default Selector;
