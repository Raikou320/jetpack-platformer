/**
 * @typedef Rect
 * @property {number} x The x position of the rect
 * @property {number} y The y position of the rect
 * @property {number} w The width of the rect
 * @property {number} h The height of the rect
 */

// Canvas's variables

/** @type {HTMLCanvasElement} */
const canvas = document.querySelector("canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

// End of canvas's varaibles

// Player speed

/** @type {number} */
const playerSpeed = 5;

// End of player speed

// Classes

// Class Entity
class Entity {
  /**
   *
   * @param {number} x The x position
   * @param {number} y The y position
   * @param {number} w The width
   * @param {number} h The height
   * @param {number} groundY The y position of the entity ground
   * @param {number} gravity The gravity
   * @param {number} jumpH The height of a jump
   * @param {string} color The color
   */
  constructor(x, y, w, h, groundY, gravity, jumpH, color) {
    /** @type {number} */
    this.x = x;
    /** @type {number} */
    this.y = y;
    /** @type {number} */
    this.w = w;
    /** @type {number} */
    this.h = h;
    /** @type {number} */
    this.groundY = groundY;
    /** @type {number} */
    this.gravity = gravity;
    /** @type {number} */
    this.jumpH = jumpH;
    /** @type {string} */
    this.color = color;
    /** @type {number} */
    this.vy = 0;
    /** @type {boolean} */
    this.isGrounded = false;
    /** @type {boolean} */
    this.isOnPlatform = false;
  }
  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }
  moveX(dx) {
    this.x += dx;
  }
  moveY(dy) {
    this.y += dy;
  }
  jump() {
    if (this.isGrounded) this.isGrounded = false;
    else if (this.isOnPlatform) this.isOnPlatform = false;
    this.vy -= this.jumpH;
  }
  moveAbsolute(x, y) {
    this.x = x;
    this.y = y;
  }
  moveXAbsolute(x) {
    this.x = x;
  }
  moveYAbsolute(y) {
    this.y = y;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
  update(dt) {
    this.vy += (dt * this.gravity) / 1000;
    this.y += this.vy;
    if (this.y + this.h >= this.groundY) {
      this.y = this.groundY - this.h;
      this.vy = 0;
      this.isGrounded = true;
    }
  }
  /**
   *
   * @param {Rect} o
   */
  aabb(o) {
    return (
      this.x < o.x + o.w &&
      this.x + this.w > o.x &&
      this.y < o.y + o.h &&
      this.y + this.h > o.y
    );
  }
  resetGravity() {
    this.vy = 0;
  }
}

// End of Entity class

// Entity's class child

class Player extends Entity {
  /**
   *
   * @param {number} x The x position
   * @param {number} y The y position
   * @param {number} groundY the y position of the player ground
   */
  constructor(x, y, groundY) {
    super(x, y, 25, 25, groundY, 1, 2, "#f00");
  }
}

// End of Entity's class child

// Class Platform

class Platform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = "#664200";
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

// End of Platform's class

// Class InputManager

class InputManager {
  constructor() {
    /** @type {Object} The pressed keys */
    this.keysPressed = {};
    document.addEventListener("keydown", (e) => {
      this.keysPressed[e.key] = true;
    });
    document.addEventListener("keyup", (e) => {
      this.keysPressed[e.key] = false;
    });
  }
  /**
   *
   * @param {string} key The name of the key: example: ArrowUp
   */
  isKeyDown(key) {
    return this.keysPressed[key] === true ? true : false;
  }
  isKeyUp(key) {
    return this.keysPressed[key] === false ? false : true;
  }
}

// End of InputManager's class

// End of classes

// Setup the canvas
canvas.width = 512;
canvas.height = 288;
canvas.style.border = "1px solid black";

// Variables

/** @type {Player} */
const player = new Player(0, 0, canvas.height);
//player.y = canvas.height - player.h;
/** @type {InputManager} */
const im = new InputManager();
/** @type {Platform[]} */
const platforms = [new Platform(20, 200, 35, 10)];

let lt = 0;

function gameLoop(t) {
  const dt = t - lt;
  lt = t;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update(dt);
  platforms.forEach((p) => {
    p.draw()
    if (player.aabb(p)) {
      player.isOnPlatform = true;
      player.y = p.y - player.h;
      player.resetGravity();
    }
  })
  if (im.isKeyDown("ArrowLeft")) player.moveX(-playerSpeed);
  if (im.isKeyDown("ArrowRight")) player.moveX(playerSpeed);
  if (im.isKeyDown("ArrowUp") && (player.isGrounded || player.isOnPlatform)) {
    player.jump();
  }
  player.draw();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
