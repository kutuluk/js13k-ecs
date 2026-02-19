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
    Collider,
} from './components';

import {
    MovementSystem,
    Render,
    IntersectionProcessor,
    TargetingSystem,
    HuterControlSystem,
    Spawner,
    ExhaustProcessor,
    TransformSystem,
    AttractorProcessor,
    SpaceUpdater,
} from './systems';

import ecs from '../../src/ecs';

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
// const huntersCount = 1;

const particleLayer = scene.layer(0);
const hunterLayer = scene.layer(3);

class SpaceManager {
    constructor(cellSize, mapSize) {
        const size = Math.ceil(mapSize / cellSize);
        const space = Array.from({ length: size * size }).map(() => new Set());

        const getCellCoords = (x, y) => {
            const cx = clamp(0, size - 1, ~~(x / cellSize));
            const cy = clamp(0, size - 1, ~~(y / cellSize));
            return [cx, cy];
        };

        const getCell = (x, y) => {
            const [cx, cy] = getCellCoords(x, y);
            return space[cx + cy * size];
        };

        this.get = (point, radius, iterator) => {
            const { x, y } = point;
            const [left, top] = getCellCoords(x - radius, y - radius);
            const [right, bottom] = getCellCoords(x + radius, y + radius);

            for (let cx = left; cx <= right; cx++) {
                for (let cy = top; cy <= bottom; cy++) {
                    const cell = space[cx + cy * size];

                    cell.forEach((entity) => {
                        const position = entity.get(Position);
                        position &&
                            position.distanceSq(point) < radius * radius &&
                            iterator(entity);
                    });
                }
            }
        };

        this.update = (entity, [{ x, y }, collider]) => {
            const cell = getCell(x, y);

            cell.add(entity);

            const colliderCell = collider.cell;
            collider.cell = cell;

            colliderCell && colliderCell !== cell && colliderCell.delete(entity);
        };
    }
}

const spaceManager = new SpaceManager(100, 10000);

ecs.register(Position, Velocity, Sprite, Bounty, Hunter, Transform, Exhaust, Attractor, Collider);

const pipeline = [
    new TransformSystem(ecs),
    new IntersectionProcessor(ecs, explosionBitmap, particleLayer),
    new TargetingSystem(ecs, spaceManager),
    new HuterControlSystem(ecs),
    new ExhaustProcessor(ecs, particleBitmap, particleLayer),
    new AttractorProcessor(ecs),
    new MovementSystem(ecs),
    new Spawner(ecs, scene, ~~(huntersCount * 1.5), bountyBitmap),
    new SpaceUpdater(ecs, spaceManager),
    new Render(ecs, scene),
];

for (let i = huntersCount; i > 0; i--) {
    const sprite = new Sprite(hunterBitmap);
    hunterLayer.add(sprite);

    const angle = Math.random() * 2 * Math.PI;
    const hunter = new Hunter();

    ecs.create().add(
        new Position(Math.random() * view.width, Math.random() * view.height, angle),
        new Collider(),
        new Velocity().from(vecFromAngle(angle).mul(hunter.speed)),
        hunter,
        new Exhaust(1 / 60),
        new Attractor(30, 100),
        sprite,
    );
}

const spritesQuery = ecs.query(Sprite);
const sprites = document.getElementById('sprites');

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

        sprites.innerHTML = `<pre>${s}</pre>`;
    }

    requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
