import {
  Position, Velocity, Sprite, Bounty, Hunter, Transform,
} from './components';

import {
  Movement, Render, AI, Spawner, Exhaust, Transformer,
} from './systems';
import ecs from '../../dist/ecs.m';

import Renderer from './renderer.m';

const stats = new Stats();
document.body.appendChild(stats.dom);

const view = document.getElementById('view');
const renderer = Renderer(view);
console.log(renderer);

renderer.bkg(0.2, 0.2, 0.2, 1);

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

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(offset + 3, 3, offset + 28, 28);

  return canvas;
};

const atlas = renderer.texture(atlasImg());

const bountyBitmap = renderer.bitmap(atlas, 0, 0, 31, 31);
const hunterBitmap = renderer.bitmap(atlas, 32, 0, 63, 31);
const particleBitmap = renderer.bitmap(atlas, 70, 10, 72, 12);

const huntersCount = (1 + ((view.width * view.height) / 100000) * 2) | 0;

const particleLayer = renderer.layer(0);

ecs.register(Position, Velocity, Sprite, Bounty, Hunter, Transform);
ecs.process(
  new Transformer(ecs),
  new Spawner(ecs, renderer, huntersCount * 2, bountyBitmap),
  new AI(ecs, particleBitmap, particleLayer),
  new Exhaust(ecs, particleBitmap, particleLayer),
  new Movement(ecs),
  new Render(ecs, renderer),
);

const hunterLayer = renderer.layer(3);

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
      new Sprite(hunterBitmap, hunterLayer),
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
