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
    Collider,
} from './components';

export class MovementSystem {
    constructor(ecs) {
        this.query = ecs.query(Position, Velocity);
    }

    update(delta) {
        this.query.iterate((entity, [position, velocity]) => {
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
    constructor(ecs, frame, layer) {
        this.ecs = ecs;
        this.frame = frame;
        this.layer = layer;
        this.query = ecs.query(Exhaust, Position);
    }

    update(delta) {
        this.query.iterate((entity, [exhaust, position]) => {
            exhaust.cooldown -= delta;

            if (exhaust.cooldown <= 0) {
                const direction = vecFromAngle(position.rotation + Math.PI * signRandom());
                const offset = vecFromAngle(position.rotation).mul(18);

                const sprite = new Sprite(this.frame, {
                    tint: 0xfbf98c,
                });
                this.layer.add(sprite);

                this.ecs
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
    constructor(ecs) {
        const query = ecs.query(Hunter, Position, Attractor);

        this.update = (delta) => {
            query.iterate((entity, [hunter, hunterPosition, attractor]) => {
                const [bounty, position] = hunter.target?.get(Bounty, Position) || [];

                if (
                    bounty &&
                    position &&
                    hunterPosition.distanceSq(position) < attractor.radius ** 2
                ) {
                    const vec = hunterPosition.clone().sub(position);
                    const speed = attractor.speed * (1 + 3 * (1 - vec.length() / attractor.radius));
                    position.add(vec.norm().mul(speed * delta));
                }
            });
        };
    }
}

export class SpaceUpdater {
    constructor(ecs, spaceManager) {
        const query = ecs.query(Position, Collider);

        this.update = () => query.iterate(spaceManager.update);
    }
}

export class TransformSystem {
    constructor(ecs) {
        this.query = ecs.query(Transform);
    }

    update(delta) {
        this.query.iterate((entity, transform) => {
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
    constructor(ecs, explosionFrame, particleLayer) {
        const query = ecs.query(Hunter, Position);
        const explosionColors = [0x33658a, 0x86bbd8];

        const fireTransforms = [
            { ...fireTransform, duration: 1 / 3 },
            { ...fireTransform, duration: 1 / 4 },
            { ...fireTransform, duration: 1 / 5 },
        ];

        this.update = () => {
            query.iterate((entity, [hunter]) => {
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

                                ecs.create().add(
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
    constructor(ecs, spaceManager) {
        this.spaceManager = spaceManager;
        this.hunters = ecs.query(Hunter, Position);
        this.bounties = ecs.query(Bounty, Position);
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
        this.hunters.iterate((hunterEntity, [hunter, hunterPosition]) => {
            if (hunter.target) {
                this.targetNearestBounty(hunter, hunterPosition, 200);
                return;
            }

            if (this.targetNearestBounty(hunter, hunterPosition, 500)) {
                return;
            }

            let bountyDistance = Infinity;
            let bountyCandidat = null;

            this.bounties.iterate((bountyEntity, [bounty, bountyPosition]) => {
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

        // this.bounties.iterate((bountyEntity, [bounty]) => {
        //     const sprite = bountyEntity.get(Sprite);
        //     if (bounty.targeted) {
        //         sprite.tint = 0xff6666;
        //     } else {
        //         sprite.tint = 0xffffff;
        //     }
        // });
    }
}

export class HuterControlSystem {
    constructor(ecs) {
        this.hunters = ecs.query(Hunter, Position, Velocity);
    }

    update(delta) {
        this.hunters.iterate((entity, [hunter, position, velocity]) => {
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
    constructor(ecs, scene, amount, frame) {
        this.ecs = ecs;
        this.amount = amount;
        this.frame = frame;
        this.canvas = scene.gl.canvas;
        this.layer = scene.layer(2);
        this.query = ecs.query(Bounty);
    }

    update() {
        const { width, height } = this.canvas;
        const padding = Math.sqrt(width * height) * 0.05;

        for (let i = this.query.length; i < this.amount; i++) {
            const sprite = new Sprite(this.frame);
            sprite.rotation = Math.random();
            sprite.scale.set();
            this.layer.add(sprite);

            this.ecs
                .create()
                .add(
                    new Position(
                        padding + Math.random() * (width - padding * 2),
                        padding + Math.random() * (height - padding * 2),
                        Math.random() * 2 * Math.PI,
                    ),
                    new Collider(),
                    new Velocity(signRandom(30), signRandom(30), signRandom(2) * Math.PI),
                    new Bounty(),
                    sprite,
                    new Transform(spawnTransform),
                );
        }
    }
}

export class Render {
    constructor(ecs, scene) {
        this.scene = scene;
        this.query = ecs.query(Position, Sprite);
    }

    update() {
        this.query.iterate((entity, [position, sprite]) => {
            sprite.position.x = position.x;
            sprite.position.y = position.y;
            sprite.rotation = position.rotation;
        });

        this.scene.render();
    }
}
