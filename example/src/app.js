import {
  Position, Velocity, Sprite, Bounty, Hunter, Transform,
} from './components';

import {
  Movement, Render, AI, Spawner, Exhaust, Transformer,
} from './systems';
import ecs from '../../dist/index.m';

import { TS, TCTex } from './tiny-sprite';

const view = document.getElementById('view');
const scene = TS(view);

scene.bkg(0.2, 0.2, 0.2);
const gl = scene.g;

const canvas = document.createElement('canvas');
canvas.width = 32;
canvas.height = 32;
const ctx = canvas.getContext('2d');

ctx.lineWidth = 2;

ctx.fillStyle = '#33658a';
ctx.strokeStyle = '#86bbd8';
ctx.beginPath();

ctx.moveTo(16, 16);
for (let angle = 0; angle < Math.PI * 2; angle += (Math.PI * 2) / 5) {
  ctx.lineTo(16 + Math.cos(angle) * 15, 16 + Math.sin(angle) * 15);
}

ctx.closePath();
ctx.fill();
ctx.stroke();

const bountyTexture = TCTex(gl, canvas, 16, 16);

ctx.clearRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = '#30644f';
ctx.strokeStyle = '#7eb77c';
ctx.beginPath();

ctx.moveTo(1, 1);
ctx.lineTo(30, 16);
ctx.lineTo(1, 30);
ctx.lineTo(8, 16);

ctx.closePath();
ctx.fill();
ctx.stroke();

const hunterTexture = TCTex(gl, canvas, 16, 16);

ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const particleTexture = TCTex(gl, canvas, 2, 2);

const huntersCount = (1 + (view.width * view.height) / 100000) | 0;

ecs.register(Position, Velocity, Sprite, Bounty, Hunter, Transform);

ecs.process(
  new Transformer(ecs),
  new Spawner(ecs, view, huntersCount * 2, bountyTexture),
  new AI(ecs, particleTexture),
  new Exhaust(ecs, particleTexture),
  new Movement(ecs),
  new Render(ecs, scene),
);

Array(...Array(huntersCount)).forEach(() => {
  ecs
    .create()
    .add(
      new Position(
        Math.random() * view.width,
        Math.random() * view.height,
        Math.random() * 2 * Math.PI,
      ),
      new Velocity(),
      new Hunter(),
      new Sprite(hunterTexture),
    );
});

let last = 0;
const loop = () => {
  const now = (performance || Date).now();

  /*
  const stats = ecs.update((now - last || now) / 1000);
  console.log(stats.systems);
  */
  ecs.update((now - last || now) / 1000);

  last = now;

  requestAnimationFrame(loop);
};

loop();
