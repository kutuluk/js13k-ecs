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
    destructor() {
        this.remove();
    }
}

export class Exhaust {
    constructor(rate) {
        this.rate = rate;
        this.cooldown = 0;
    }
}

export class Attractor {
    constructor(radius, speed) {
        this.radius = radius;
        this.speed = speed;
    }
}

export class Transform {
    constructor(transformer) {
        this.transformer = transformer;
        this.remaining = transformer.duration;
    }
}

export class Bounty {
    constructor() {
        this.targeted = true;
    }
}

export class Hunter {
    constructor() {
        this.target = null;
        this.distance = null;
        this.speed = 150 + 20 * Math.random();
        this.agi = 1.3 * Math.PI;
    }
}

export class Greed {
    constructor() {
        this.cell = null;
    }

    destructor(entity) {
        this.cell?.delete(entity);
    }
}
