import { signRandom, vecFromAngle } from './common';

import {
  Position, Velocity, Sprite, Bounty, Hunter, Transform,
} from './components';

export class Movement {
  constructor(ecs) {
    this.selector = ecs.select(Position, Velocity);
  }

  update(delta) {
    this.selector.iterate((entity) => {
      const position = entity.get(Position);
      const velocity = entity.get(Velocity);

      position.add(velocity.clone().mul(delta));
      position.rotation += velocity.rotation * delta;
    });
  }
}

const exhaustTransform = {
  duration: 1 / 2,
  end(entity) {
    entity.eject();
  },
  update(entity, stage) {
    const sprite = entity.get(Sprite);
    sprite && (sprite.alpha = stage);
  },
};

export class Exhaust {
  constructor(ecs, texture) {
    this.ecs = ecs;
    this.texture = texture;
    this.selector = ecs.select(Hunter, Position);
  }

  update() {
    this.selector.iterate((entity) => {
      const position = entity.get(Position);

      const direction = vecFromAngle(position.rotation + Math.PI * signRandom());
      const offset = vecFromAngle(position.rotation).mul(8);

      this.ecs.create().add(
        new Position().from(position).sub(offset),
        new Velocity().from(direction).mul(Math.random() * 20),
        new Sprite(this.texture, 0xfbf98c),
        new Transform(exhaustTransform),
      );
    });
  }
}

export class Transformer {
  constructor(ecs) {
    this.selector = ecs.select(Transform);
  }

  update(delta) {
    this.selector.iterate((entity) => {
      const transform = entity.get(Transform);

      transform.remaining -= delta;

      if (transform.remaining <= 0) {
        transform.transformer.end && transform.transformer.end(entity);
        transform.transformer = transform.transformer.next;

        if (!transform.transformer) {
          entity.remove(Transform);
          return;
        }

        transform.remaining += transform.transformer.duration;
      }

      transform.transformer.update
      && transform.transformer.update(
        entity,
        transform.remaining / transform.transformer.duration,
      );
    });
  }
}

export class AI {
  constructor(ecs, particleTexture) {
    this.ecs = ecs;
    this.hunters = ecs.select(Hunter);
    this.bounties = ecs.select(Bounty);

    this.hunterTransform = {
      duration: 1 / 6,
      update(entity, stage) {
        const sprite = entity.get(Sprite);
        sprite && (sprite.scale = 1 + (1 - stage) * 0.2);
      },
      next: {
        duration: 1 / 4,
        update(entity, stage) {
          const sprite = entity.get(Sprite);
          sprite && (sprite.scale = 1.2 - (1 - stage) * 0.2);
        },
        end(entity) {
          const sprite = entity.get(Sprite);
          sprite && (sprite.scale = 1);
        },
      },
    };

    this.deathTransform = {
      duration: 1 / 4,
      end(entity) {
        const position = entity.get(Position);
        if (position) {
          for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 10) {
            const velocity = vecFromAngle(angle).mul(100 * (1 + Math.random()));
            ecs
              .create()
              .add(
                new Position().from(position),
                new Velocity().from(velocity),
                new Sprite(particleTexture, 0xF26419),
                new Transform(exhaustTransform),
              );
          }
        }
        entity.eject();
      },
      update(entity, stage) {
        const sprite = entity.get(Sprite);
        sprite && (sprite.scale = stage);
      },
    };
  }

  update(delta) {
    this.hunters.iterate((entity) => {
      const hunter = entity.get(Hunter);

      if (hunter.distance && hunter.distance < 12 * 12) {
        const bounty = hunter.target;
        if (bounty.has(Bounty)) {
          bounty.remove(Bounty);
          bounty.add(new Transform(this.deathTransform));
          entity.add(new Transform(this.hunterTransform));
        }
      }

      hunter.target = null;
      hunter.distance = null;
    });

    this.bounties.iterate((bounty) => {
      const bountyPosition = bounty.get(Position);

      this.hunters.iterate((entity) => {
        const hunter = entity.get(Hunter);
        const hunterPosition = entity.get(Position);

        const distance = hunterPosition.distanceSq(bountyPosition);

        if (hunter.distance === null || hunter.distance > distance) {
          hunter.distance = distance;
          hunter.target = bounty;
        }
      });
    });

    this.hunters.iterate((hunter) => {
      const hunterPosition = hunter.get(Position);

      const { target, speed, agi } = hunter.get(Hunter);
      const velocity = hunter.get(Velocity);

      if (target) {
        const bountyPosition = target.get(Position);

        const s = bountyPosition
          .clone()
          .sub(hunterPosition)
          .norm();

        const direction = vecFromAngle(hunterPosition.rotation);
        let angle = Math.atan2(direction.cross(s), direction.dot(s));

        if (Math.abs(angle) > agi) {
          const sign = angle < 0 ? -1 : 1;
          angle = agi * sign;
        }

        velocity.from(direction).mul(speed);
        velocity.rotation = angle / delta;
      } else {
        velocity.x = 0;
        velocity.y = 0;
        velocity.rotation = 0;
      }
    });
  }
}

export class Spawner {
  constructor(ecs, view, amount, texture) {
    this.ecs = ecs;
    this.amount = amount;
    this.texture = texture;
    this.view = view;
    this.selector = ecs.select(Bounty);

    this.spawnTransform = {
      duration: 1,
      update(entity, stage) {
        const sprite = entity.get(Sprite);
        sprite && (sprite.scale = 1 - stage);
      },
    };
  }

  update() {
    const { width, height } = this.view;
    const padding = (width + height) * 0.05;

    for (let i = this.selector.length; i < this.amount; i++) {
      this.ecs
        .create()
        .add(
          new Position(
            padding + Math.random() * (width - padding * 2),
            padding + Math.random() * (height - padding * 2),
            Math.random() * 2 * Math.PI,
          ),
          new Velocity(signRandom(3), signRandom(3), signRandom(2) * Math.PI),
          new Bounty(),
          new Sprite(this.texture, null, null, 0),
          new Transform(this.spawnTransform),
        );
    }
  }
}

export class Render {
  constructor(ecs, scene) {
    this.scene = scene;
    this.selector = ecs.select(Position, Sprite);
  }

  update() {
    this.scene.resize();
    this.scene.cls();
    this.selector.iterate((entity) => {
      const position = entity.get(Position);
      const {
        texture, alpha, tint, scale,
      } = entity.get(Sprite);

      // this.scene.col = (((alpha * 255) << 24) | tint) >>> 0;
      const r = (tint & 0xff0000) >> 16;
      const g = tint & 0xff00;
      const b = (tint & 0xff) << 16;
      this.scene.col = (((alpha * 255) << 24) | r | g | b) >>> 0;

      this.scene.img(
        texture,
        -texture.width / 2,
        -texture.height / 2,
        // Size
        texture.width,
        texture.height,
        // Rotation
        position.rotation,
        // Translation
        position.x,
        position.y,
        // Scale
        scale,
        scale,
        // UV
        0,
        0,
        1,
        1,
      );
    });

    this.scene.flush();
  }
}
