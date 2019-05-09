// eslint-disable-next-line import/no-extraneous-dependencies
import Renderer from 'js13k-2d';

import {
  Position, Velocity, Sprite, Bounty, Hunter, Transform,
} from './components';

import {
  Movement, Render, AI, Spawner, Exhaust, Transformer,
} from './systems';

import ecs from '../../dist/ecs.mjs';

const { Point, Texture, Frame } = Renderer;

const stats = new Stats();
document.body.appendChild(stats.dom);

const view = document.getElementById('view');
const scene = Renderer(view);
const { gl } = scene;

scene.background(0.2, 0.2, 0.2);

const atlasImg = () => {
  const canvas = document.createElement('canvas');
  const size = 32;

  canvas.width = 96;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');

  let offset = 0;

  ctx.lineWidth = size / 16;

  ctx.fillStyle = '#33658a';
  ctx.strokeStyle = '#86bbd8';

  ctx.beginPath();

  ctx.moveTo(offset + 16, 16);
  for (let angle = 0; angle < Math.PI * 2; angle += (Math.PI * 2) / 5) {
    ctx.lineTo(offset + 16 + Math.cos(angle) * 14, 16 + Math.sin(angle) * 14);
  }

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  offset += size;

  ctx.fillStyle = '#30644f';
  ctx.strokeStyle = '#7eb77c';

  ctx.beginPath();

  ctx.moveTo(offset + 3, 3);
  ctx.lineTo(offset + 28, 16);
  ctx.lineTo(offset + 3, 28);
  ctx.lineTo(offset + 8, 16);

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  offset += size;

  for (let i = 0.2; i <= 1; i += 0.2) {
    ctx.fillStyle = `rgba(255,255,255,${i})`;
    ctx.beginPath();
    ctx.arc(offset + 16, 16, 16 - i * 10, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  return canvas;
};

const atlas = Texture(scene, atlasImg(), 0, {
  [gl.TEXTURE_MAG_FILTER]: gl.LINEAR,
  [gl.TEXTURE_MIN_FILTER]: gl.LINEAR,
});
atlas.anchor.set(0.5);

const bountyBitmap = Frame(atlas, Point(), Point(32));
const hunterBitmap = Frame(atlas, Point(32, 0), Point(32));
const particleBitmap = Frame(atlas, Point(64, 0), Point(32));
particleBitmap.width = 4;
particleBitmap.height = 4;

const huntersCount = (1 + ((view.width * view.height) / 100000) * 4) | 0;

const particleLayer = scene.layer(0);

ecs.register(Position, Velocity, Sprite, Bounty, Hunter, Transform);
ecs.process(
  new Transformer(ecs),
  new Spawner(ecs, scene, huntersCount * 2, bountyBitmap),
  new AI(ecs, particleBitmap, particleLayer),
  new Exhaust(ecs, particleBitmap, particleLayer),
  new Movement(ecs),
  new Render(ecs, scene),
);

const hunterLayer = scene.layer(3);

Array(...Array(huntersCount)).forEach(() => {
  const sprite = new Sprite(hunterBitmap);
  hunterLayer.add(sprite);
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
      sprite,
    );
});

const spritesSel = ecs.select(Sprite);
const sprites = document.getElementById('sprites');

let i = 0;

let last = 0;
const loop = () => {
  stats.begin();
  const now = (performance || Date).now();

  const statistics = ecs.update((now - last || now) / 1000);
  // ecs.update((now - last || now) / 1000);

  last = now;
  stats.end();

  /*
  console.log(statistics);
 sprites.innerText = `Sprites: ${spritesSel.length}`;
  */

  i++;
  if (!(i % 20)) {
    let s = '';
    Object.entries(statistics).forEach(([k, v]) => {
      s += `${k}: ${v.toFixed(1)} ms\n`;
    });
    s += `\nSprites: ${spritesSel.length}`;
    sprites.innerHTML = `<pre>${s}</pre>`;
    i = 0;
  }

  requestAnimationFrame(loop);
};

loop();
