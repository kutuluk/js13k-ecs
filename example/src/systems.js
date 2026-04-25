import { signRandom, vecFromAngle } from './common';

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

export class MovementSystem {
    constructor(world) {
        this.query = world.query(Position, Velocity);
    }

    update(delta) {
        this.query.iterate(([position, velocity]) => {
            position.x += velocity.x * delta;
            position.y += velocity.y * delta;
            position.rotation += velocity.rotation * delta;
        });
    }
}

const spawnTransform = {
    duration: 1 / 4,
    end(entity) {
        entity.get(Bounty).targeted = false;
    },
    update(entity, stage) {
        const sprite = entity.get(Sprite);
        sprite && sprite.scale.set(stage);
    },
};

const exhaustTransform = {
    duration: 0.8,
    end(entity) {
        entity.delete();
    },
    update(entity, stage) {
        const sprite = entity.get(Sprite);
        if (sprite) {
            sprite.alpha = 1 - stage;
            sprite.scale.set(0.7 + stage);
        }
    },
};

const fireTransform = {
    duration: 1 / 3,
    end(entity) {
        entity.delete();
    },
    update(entity, stage) {
        const sprite = entity.get(Sprite);
        sprite && (sprite.alpha = 1 - stage);
    },
};

const deathTransform = {
    duration: 1 / 4,
    end(entity) {
        entity.delete();
    },
    update(entity, stage) {
        const sprite = entity.get(Sprite);
        sprite && sprite.scale.set(1 - stage);
    },
};

export class ExhaustProcessor {
    constructor(world, frame, layer) {
        this.world = world;
        this.frame = frame;
        this.layer = layer;
        this.query = world.query(Exhaust, Position);
    }

    update(delta) {
        this.query.iterate(([exhaust, position]) => {
            exhaust.cooldown -= delta;

            if (exhaust.cooldown <= 0) {
                const direction = vecFromAngle(position.rotation + Math.PI * signRandom());
                const offset = vecFromAngle(position.rotation).mul(18);

                const sprite = new Sprite(this.frame, {
                    tint: 0xfbf98c,
                });
                this.layer.add(sprite);

                this.world
                    .create()
                    .add(
                        new Position().from(position).sub(offset),
                        new Velocity().from(direction).mul(Math.random() * 20),
                        sprite,
                        new Transform(exhaustTransform),
                    );

                exhaust.cooldown = exhaust.rate;
            }
        });
    }
}

export class AttractorProcessor {
    constructor(world) {
        const query = world.query(Hunter, Position, Attractor);

        this.update = (delta) => {
            query.iterate(([hunter, hunterPosition, attractor]) => {
                if (!hunter.target?.exists) {
                    return;
                }

                const [bounty, bountyPosition] = hunter.target.get(Bounty, Position);

                if (
                    bounty &&
                    bountyPosition &&
                    hunterPosition.distanceSq(bountyPosition) < attractor.radius ** 2
                ) {
                    const vec = hunterPosition.clone().sub(bountyPosition);
                    const speed = attractor.speed * (1 + 3 * (1 - vec.length() / attractor.radius));
                    bountyPosition.add(vec.norm().mul(speed * delta));
                }
            });
        };
    }
}

export class SpaceUpdater {
    constructor(world, spaceManager) {
        this.query = world.query(Position, Greed);
        this.spaceManager = spaceManager;
    }

    update() {
        this.query.iterate(([{ x, y }, greed], entity) => {
            const cell = this.spaceManager.getCell(x, y);

            cell.add(entity);

            const greedCell = greed.cell;
            greed.cell = cell;

            greedCell && greedCell !== cell && greedCell.delete(entity);
        });
    }
}

export class TransformSystem {
    constructor(world) {
        this.query = world.query(Transform);
    }

    update(delta) {
        this.query.iterate((transform, entity) => {
            transform.remaining -= delta;

            if (transform.remaining <= 0) {
                transform.transformer.update?.(entity, 1);
                transform.transformer.end?.(entity);
                transform.transformer = transform.transformer.next;

                if (!transform.transformer) {
                    entity.remove(Transform);
                    return;
                }

                transform.remaining += transform.transformer.duration;
            }

            transform.transformer.update?.(
                entity,
                1 - transform.remaining / transform.transformer.duration,
            );
        });
    }
}

export class IntersectionProcessor {
    constructor(world, explosionFrame, particleLayer) {
        const query = world.query(Hunter, Position);
        const explosionColors = [0x33658a, 0x86bbd8];

        const fireTransforms = [
            { ...fireTransform, duration: 1 / 3 },
            { ...fireTransform, duration: 1 / 4 },
            { ...fireTransform, duration: 1 / 5 },
        ];

        this.update = () => {
            query.iterate(([hunter]) => {
                if (hunter.target && hunter.distance < 10 ** 2) {
                    const bounty = hunter.target;

                    if (bounty.get(Bounty)) {
                        bounty.remove(Bounty);
                        bounty.add(new Transform(deathTransform));

                        const position = bounty.get(Position);
                        if (position) {
                            for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 10) {
                                const velocity = vecFromAngle(angle).mul(
                                    80 * (1 + 0.5 * Math.random()),
                                );

                                const sprite = new Sprite(explosionFrame);
                                sprite.tint = explosionColors[Math.round(Math.random())];
                                particleLayer.add(sprite);

                                world
                                    .create()
                                    .add(
                                        new Position().from(position),
                                        new Velocity().from(velocity),
                                        sprite,
                                        new Transform(fireTransforms[~~(Math.random() * 3)]),
                                    );
                            }
                        }
                    }

                    hunter.target = null;
                    hunter.distance = null;
                }
            });
        };
    }
}

export class TargetingSystem {
    constructor(world, spaceManager) {
        this.spaceManager = spaceManager;
        this.hunters = world.query(Hunter, Position);
        this.bounties = world.query(Bounty, Position);
    }

    targetNearestBounty(hunter, hunterPosition, radius) {
        let bountyDistance = hunter.target
            ? (hunter.distance = hunter.target.get(Position).distanceSq(hunterPosition))
            : Infinity;
        let bountyCandidat = null;

        this.spaceManager.get(hunterPosition, radius, (entity) => {
            const [bounty, bountyPosition] = entity.get(Bounty, Position);

            if (bounty && bountyPosition) {
                if (bounty.targeted) {
                    return;
                }

                const distance = hunterPosition.distanceSq(bountyPosition);

                if (distance < bountyDistance) {
                    bountyDistance = distance;
                    bountyCandidat = entity;
                }
            }
        });

        if (bountyCandidat) {
            hunter.target && (hunter.target.get(Bounty).targeted = false);

            hunter.target = bountyCandidat;
            hunter.distance = bountyDistance;
            bountyCandidat.get(Bounty).targeted = true;

            return true;
        }
    }

    update() {
        this.hunters.iterate(([hunter, hunterPosition]) => {
            if (hunter.target) {
                this.targetNearestBounty(hunter, hunterPosition, 200);
                return;
            }

            if (this.targetNearestBounty(hunter, hunterPosition, 500)) {
                return;
            }

            let bountyDistance = Infinity;
            let bountyCandidat = null;

            this.bounties.iterate(([bounty, bountyPosition], bountyEntity) => {
                if (bounty.targeted) {
                    return;
                }

                const distance = hunterPosition.distanceSq(bountyPosition);

                if (distance < bountyDistance) {
                    bountyDistance = distance;
                    bountyCandidat = bountyEntity;
                }
            });

            if (bountyCandidat) {
                hunter.distance = bountyDistance;
                hunter.target = bountyCandidat;
                bountyCandidat.get(Bounty).targeted = true;
            }
        });

        // this.bounties.iterate(([bounty], bountyEntity) => {
        //     const sprite = bountyEntity.get(Sprite);
        //     if (bounty.targeted) {
        //         sprite.tint = 0xff6666;
        //     } else {
        //         sprite.tint = 0xffffff;
        //     }
        // });
    }
}

export class HunterControlSystem {
    constructor(world) {
        this.hunters = world.query(Hunter, Position, Velocity);
    }

    update(delta) {
        this.hunters.iterate(([hunter, position, velocity]) => {
            const { target, speed, agi } = hunter;

            if (target?.exists) {
                const bountyPosition = target.get(Position);

                const s = bountyPosition.clone().sub(position);

                const direction = vecFromAngle(position.rotation);
                let angle = Math.atan2(direction.cross(s), direction.dot(s));

                const maxAngle = agi * delta;
                if (Math.abs(angle) > maxAngle) {
                    angle = maxAngle * Math.sign(angle);
                }

                velocity.from(direction).mul(speed);
                velocity.rotation = angle / delta;
            }
        });
    }
}

export class Spawner {
    constructor(world, scene, amount, frame) {
        this.world = world;
        this.amount = amount;
        this.frame = frame;
        this.canvas = scene.gl.canvas;
        this.layer = scene.layer(2);
        this.query = world.query(Bounty);
    }

    update() {
        const { width, height } = this.canvas;
        const padding = Math.sqrt(width * height) * 0.05;

        for (let i = this.query.length; i < this.amount; i++) {
            const sprite = new Sprite(this.frame);
            sprite.rotation = Math.random();
            sprite.scale.set();
            this.layer.add(sprite);

            this.world
                .create()
                .add(
                    new Position(
                        padding + Math.random() * (width - padding * 2),
                        padding + Math.random() * (height - padding * 2),
                        Math.random() * 2 * Math.PI,
                    ),
                    new Greed(),
                    new Velocity(signRandom(30), signRandom(30), signRandom(2) * Math.PI),
                    new Bounty(),
                    sprite,
                    new Transform(spawnTransform),
                );
        }
    }
}

export class Render {
    constructor(world) {
        this.query = world.query(Position, Sprite);
    }

    update() {
        this.query.iterate(([position, sprite]) => {
            sprite.position.x = position.x;
            sprite.position.y = position.y;
            sprite.rotation = position.rotation;
        });
    }
}
