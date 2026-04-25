import Renderer from 'js13k-2d';

import { clamp, vecFromAngle } from './common';

import {
    Position,
    Velocity,
    Sprite,
    Bounty,
    Hunter,
    Transform,
    Exhaust,
    Attractor,
    Greed,
} from './components';

import {
    MovementSystem,
    Render,
    IntersectionProcessor,
    TargetingSystem,
    HunterControlSystem,
    Spawner,
    ExhaustProcessor,
    TransformSystem,
    AttractorProcessor,
    SpaceUpdater,
} from './systems';

import ecs from '../../src/ecs';

const [registerComponents, createWorld] = ecs;

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
        ctx.lineTo(offset + 16 + Math.cos(angle) * 10, 16 + Math.sin(angle) * 10);
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
const explosionBitmap = Frame(atlas, Point(64, 0), Point(32));
explosionBitmap.width = 12;
explosionBitmap.height = 12;

const huntersCount = 1 + Math.round((view.width * view.height) / 150 ** 2);

const particleLayer = scene.layer(0);
const hunterLayer = scene.layer(3);

class SpaceManager {
    constructor(cellSize, mapSize) {
        this.cellSize = cellSize;
        this.size = Math.ceil(mapSize / cellSize);
        this.space = Array.from({ length: this.size ** 2 }).map(() => new Set());
    }

    getCellCoords(x, y) {
        const cx = clamp(0, this.size - 1, ~~(x / this.cellSize));
        const cy = clamp(0, this.size - 1, ~~(y / this.cellSize));
        return [cx, cy];
    }

    getCell(x, y) {
        const [cx, cy] = this.getCellCoords(x, y);
        return this.space[cx + cy * this.size];
    }

    get(point, radius, iterator) {
        const { x, y } = point;
        const [left, top] = this.getCellCoords(x - radius, y - radius);
        const [right, bottom] = this.getCellCoords(x + radius, y + radius);

        for (let cx = left; cx <= right; cx++) {
            for (let cy = top; cy <= bottom; cy++) {
                const cell = this.space[cx + cy * this.size];

                cell.forEach((entity) => {
                    const position = entity.exists?.get(Position);
                    position && position.distanceSq(point) < radius * radius && iterator(entity);
                });
            }
        }
    }
}

const spaceManager = new SpaceManager(100, 10000);

registerComponents(
    Position,
    Velocity,
    Sprite,
    Bounty,
    Hunter,
    Transform,
    Exhaust,
    Attractor,
    Greed,
);

const world = createWorld();

const pipeline = [
    new TransformSystem(world),
    new IntersectionProcessor(world, explosionBitmap, particleLayer),
    new TargetingSystem(world, spaceManager),
    new HunterControlSystem(world),
    new ExhaustProcessor(world, particleBitmap, particleLayer),
    new AttractorProcessor(world),
    new MovementSystem(world),
    new Spawner(world, scene, ~~(huntersCount * 1.5), bountyBitmap),
    new SpaceUpdater(world, spaceManager),
    new Render(world),
];

for (let i = huntersCount; i > 0; i--) {
    const sprite = new Sprite(hunterBitmap);
    hunterLayer.add(sprite);

    const angle = Math.random() * 2 * Math.PI;
    const hunter = new Hunter();

    world
        .create()
        .add(
            new Position(Math.random() * view.width, Math.random() * view.height, angle),
            new Greed(),
            new Velocity().from(vecFromAngle(angle).mul(hunter.speed)),
            hunter,
            new Exhaust(1 / 60),
            new Attractor(30, 100),
            sprite,
        );
}

const spritesQuery = world.query(Sprite);
const info = document.getElementById('info');

let i = 0;
let last = 0;

const nowFunc = typeof performance === 'undefined' ? Date : performance;
const getNow = () => nowFunc.now();

const loop = () => {
    stats.begin();

    const now = getNow();
    let delta = now - last;
    last = now;

    if (delta > 1000) {
        delta = 1000 / 60;
    }

    const statistics = {};

    pipeline.forEach((system) => {
        const begin = getNow();
        system.update(delta / 1000);
        statistics[system.constructor.name] = getNow() - begin;
    });

    scene.render();

    stats.end();

    if (!(i++ % 20)) {
        let s = '';
        let total = 0;

        Object.entries(statistics).forEach(([k, v]) => {
            total += v;
            s += `${k}: ${v.toFixed(1)} ms\n`;
        });

        s += `\nTotal: ${total.toFixed(1)} ms\n`;
        s += `\nEntities: ${spritesQuery.length}`;

        info.textContent = s;
    }

    requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
