import Vector from './vector';

export const vecFromAngle = (angle) => new Vector(Math.cos(angle), Math.sin(angle));

export const signRandom = (scale = 1) => (Math.random() - 0.5) * scale;

export const clamp = (a, b, c) => {
    if (c < a) {
        return a;
    }

    if (c > b) {
        return b;
    }

    return c;
};
