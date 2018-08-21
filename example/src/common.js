import Vector from './vector';

/*
const x0 = 1;
const y0 = 0;
const cos = Math.cos(angle);
const sin = Math.sin(angle);
const x = x0 * cos - y0 * sin;
const y = x0 * sin + y0 * cos;
return new Vector(x, y);
*/
export const vecFromAngle = angle => new Vector(Math.cos(angle), Math.sin(angle));

export const signRandom = (scale = 1) => (Math.random() - 0.5) * scale;
