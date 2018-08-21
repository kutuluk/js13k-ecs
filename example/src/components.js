import Vector from './vector';

class VectorWithRotation extends Vector {
  constructor(x, y, rotation) {
    super(x, y);
    this.rotation = rotation || 0;
  }
}

export class Position extends VectorWithRotation {}

export class Velocity extends VectorWithRotation {}

export class Sprite {
  constructor(texture, tint, alpha, scale) {
    this.texture = texture;
    // this.alpha = alpha || 1;
    // this.scale = scale || 1;
    // this.tint = tint || 0xffffff;
    this.tint = tint === 0 ? 0 : tint || 0xffffff;
    this.alpha = alpha === 0 ? 0 : alpha || 1;
    this.scale = scale === 0 ? 0 : scale || 1;
  }
}

export class Transform {
  constructor(transformer) {
    this.transformer = transformer;
    this.remaining = transformer.duration;
  }
}

export class Bounty {}

export class Hunter {
  constructor() {
    this.target = null;
    this.distance = null;
    this.speed = 150 * (1 + Math.random() / 4);
    this.agi = (Math.PI / 48) * (1 + Math.random() / 4);
  }
}
