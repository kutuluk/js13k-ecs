# js13k-ecs

[![NPM version](https://img.shields.io/npm/v/js13k-ecs.svg?style=flat-square)](https://www.npmjs.com/package/js13k-ecs)

> Microscopic Object-oriented [Entity Component System](https://en.wikipedia.org/wiki/Entity_component_system) created specifically for the [Js13kGames](https://js13kgames.com) competition.

It is primarily aimed at achieving the following goals:

- Lightweight (<700b minzipped)
- Effective minification of the final user code
- A simple, concise and flexible API in a modern JavaScript style

Performance is not the goal of this library and it is lower than that of other available ECS implementations, but it is quite sufficient for small games within the framework of the competition. The small size with full-featured ECS architecture support covers the speed lag.

## Installation

```sh
$ npm i js13k-ecs
```

The [UMD](https://github.com/umdjs/umd) build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/js13k-ecs/dist/ecs.umd.js"></script>
```

You can find the library on `window.ecs`.

## Usage

```javascript
import ecs from 'js13k-ecs';

const [registerComponents, createWorld] = ecs;

class Vector {
    constructor(x = 0, y = x) {
        this.x = x;
        this.y = y;
    }
}

class Position extends Vector {}
class Velocity extends Vector {}

registerComponents(Position, Velocity);

const world = createWorld();

world.create().add(new Position(), new Velocity(1, 1));

class MovementSystem {
    constructor(world) {
        const query = world.query(Position, Velocity);

        this.update = (delta) => {
            query.iterate(([position, velocity]) => {
                position.x += velocity.x * delta;
                position.y += velocity.y * delta;
            });
        };
    }
}

const pipeline = [new MovementSystem(world)];

let last = performance.now();

const loop = () => {
    const now = performance.now();
    const delta = now - last;
    last = now;

    world.update(pipeline, delta);
    requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
```

The demo can be found in the example folder. The example demonstrates a very dynamic simulation of a world with several thousand entities. To illustrate the performance improvement, the example also implements space partitioning using one component, one system, and the `SpaceManager' utility class. [Live demo](https://kutuluk.github.io/js13k-ecs/)

## API

#### `registerComponents(Class1, ..., ClassN)`

The function registers JavaScript classes for use as components. Classes can be registered either by a single call with multiple arguments, or by separate calls. Re-registration of an already registered class will not result in an error - in this case, nothing will be done. There are no restrictions on the number of registered classes. There are no requirements for classes, they can contain any data and have any methods. If the class contains the `destructor` method, it will be called when deleting a component from an entity (including when deleting the entity itself) and will receive a reference to the entity as an argument.

#### `createWorld()`

The function creates a world - a separate container for simulation. There can be any number of worlds independent of each other at the same time. The world is the root element of ECS, with its help entities are created and an update is launched.

### `World`

#### `world.create()`

The method creates and returns an empty entity.

#### `world.query(Class1, ..., ClassN)`

The method returns a set of entities that are guaranteed to contain components of all specified classes. The set is updated automatically and is always up to date.

The set has the `length` property, which stores the number of entities in the set, and the `iterate(iterator)` method, which allows you to iterate through all the entities in the set.

```javascript
class MovementSystem {
    constructor(world) {
        const query = world.query(Position, Velocity);

        this.update = (delta) => {
            const movement = ([position, velocity], entity) => {
                position.x += velocity.x * delta;
                position.y += velocity.y * delta;
                position.rotation += velocity.rotation * delta;
            };

            query.iterate(movement);
        };
    }
}
```

In this example, the set entities are iterated using the `movement` function, which is applied to each entity that simultaneously has both a `Position` component and a `Velocity` component. The first argument to this function is an array of components in the same order in which they were set when creating the set. If the set is specified by a single component, then the argument will come not from the array, but from the specified component. The second argument for this function is the entity itself (it is not used in this example).

Queries are the main way systems are implemented. Usually, a request is created when the system is created and used in the `update` method.

#### `world.update(pipeline, arg1, ..., argN)`

The method sequentially runs the `update` method of each system from the `pipeline` array of systems, passing the specified parameters to it. At the same time, the update of the world can be performed without using this method by manually calling the necessary systems. Here is an example that starts the systems on its own and collects information about the execution time of each of them.:

```javascript
const pipeline = [new TargetingSystem(ecs), new MovementSystem(ecs)];

let last = performance.now();

const loop = () => {
    const now = performance.now();
    const delta = now - last;
    last = now;

    // Launching systems "out of the box"
    // world.update(pipeline, delta);

    // Starting the systems manually
    const statistics = {};

    pipeline.forEach((system) => {
        const begin = performance.now();
        system.update(delta);
        statistics[system.constructor.name] = performance.now() - begin;
    });

    console.log(statistics);

    requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
```

Any class or object with the `update` method can act as a system, the parameters of which are not regulated by the library and are determined by the developer himself when calling `world.update`. This allows you to flexibly customize the behavior of the library depending on the needs of the application. As a rule, this method accepts only one `delta` argument, which determines how much time has passed since the last update.

#### `world.reset()`

Removes all entities and their components from the world.

### `Entity`

Entities in this ECS implementation do not have an id, are passed by reference if necessary, and carry all the necessary methods for adding, receiving, and deleting components. As well as a method for removing an entity from the world (with the removal of all its components).

#### `entity.add(component1, ..., componentN)`

The method adds components to the entity. The method waits for instances of previously registered classes. If the transferred component is already present in the entity, the old component will be deleted (with a call to the destructor, if any) and replaced with a new one. Returns the entity itself.

#### `entity.get(Class1, ..., ClassN)`

The method returns the specified components of the entity. The method expects previously registered classes. If only one component is requested, the method will return the requested component, if more than one component is requested, the method will return an array of components in the same order. If the entity does not have the requested component, `null` is returned.

#### `entity.remove(Class1, ..., ClassN)`

The method removes components from the entity. The method expects previously registered classes. If a component has a destructor, it calls it before deleting it. Returns the entity itself.

#### `entity.delete()`

The method removes an entity from the world by first clearing it of its components and calling their destructors.

#### `entity.exists`

The property is used to determine whether an entity is in the world or has already been removed from it. If the entity is deleted, it returns `null`, otherwise it returns the entity itself. When saving references to entities, this property should always be checked before operations on them. It should be borne in mind that such a check does not need to be done for entities received from requests - the entities are guaranteed to be relevant there.

```javascript
class TargetingSystem {
    constructor(world) {
        this.query = world.query(Unit);
    }

    update(delta) {
        this.query.iterate((unit) => {
            if (!unit.target?.exists) {
                // unit.target is not set, or the entity that the target points to has lost its relevance
                // find a new target
                // ...
            }
        });
    }
}
```
