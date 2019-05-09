// eslint-disable-next-line import/no-extraneous-dependencies
import Renderer from 'js13k-2d';
import Vector from './vector';

class VectorWithRotation extends Vector {
  constructor(x, y, rotation) {
    super(x, y);
    this.rotation = rotation || 0;
  }
}

export class Position extends VectorWithRotation {}

export class Velocity extends VectorWithRotation {}

export class Sprite extends Renderer.Sprite {
  /*
  constructor(frame, props) {
    super(frame, props);
  }
  */

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
    this.color = 0xffffff * Math.random();
  }
}
