import Vector from './vector';
import Renderer from './renderer.m';

class VectorWithRotation extends Vector {
  constructor(x, y, rotation) {
    super(x, y);
    this.rotation = rotation || 0;
  }
}

export class Position extends VectorWithRotation {}

export class Velocity extends VectorWithRotation {}

export class Sprite extends Renderer.Sprite {
  constructor(bitmap, layer) {
    super(bitmap);
    layer && layer.add(this);
  }

  destructor() {
    this.remove();
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
    this.speed = 250 * (1 + Math.random() / 4);
    this.agi = (Math.PI / 48) * (1 + Math.random() / 4);
  }
}
