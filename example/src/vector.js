class Vector {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  from(obj) {
    this.x = obj.x;
    this.y = obj.y;
    return this;
  }

  add(vec) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }

  sub(vec) {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  }

  invert() {
    this.x *= -1;
    this.y *= -1;
    return this;
  }

  mul(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  /*
  mulVec(vec) {
    this.x *= vec.x;
    this.y *= vec.y;
    return this;
  }
  */

  div(scalar) {
    if (scalar === 0) {
      this.x = 0;
      this.y = 0;
    } else {
      this.x /= scalar;
      this.y /= scalar;
    }
    return this;
  }

  /*
  divVec(vec) {
    this.x /= vec.x;
    this.y /= vec.y;
    return this;
  }
  */

  norm() {
    const length = this.length();

    if (length === 0) {
      this.x = 1;
      this.y = 0;
    } else {
      this.div(length);
    }

    return this;
  }

  rotate(angle) {
    const nx = this.x * Math.cos(angle) - this.y * Math.sin(angle);
    const ny = this.x * Math.sin(angle) + this.y * Math.cos(angle);

    this.x = nx;
    this.y = ny;

    return this;
  }

  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }

  length() {
    return Math.sqrt(this.lengthSq());
  }

  distanceSq(vec) {
    const dx = this.x - vec.x;
    const dy = this.y - vec.y;
    return dx * dx + dy * dy;
  }

  distance(vec) {
    return Math.sqrt(this.distanceSq(vec));
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }

  cross(vec) {
    return this.x * vec.y - this.y * vec.x;
  }

  dot(vec) {
    return this.x * vec.x + this.y * vec.y;
  }

  clone() {
    return new Vector(this.x, this.y);
  }
}

export default Vector;
