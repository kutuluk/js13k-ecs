# js13k-ecs

[![NPM version](https://img.shields.io/npm/v/js13k-ecs.svg?style=flat-square)](https://www.npmjs.com/package/js13k-ecs)

> A microscopic object-oriented [Entity Component System](https://en.wikipedia.org/wiki/Entity_component_system) created specifically for the [Js13kGames](https://js13kgames.com/) competition.

Designed not for high performance (but still fast enough), primarily aims to accomplish the following goals:

- Lightweight (~650b minzipped)
- Simple, concise and flexible API in traditional javascript style
- Effective minification of the final user code

## Install

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

class Vector {
    constructor(x = 0, y = x) {
        this.x = x;
        this.y = y;
    }
}

class Position extends Vector {}
class Velocity extends Vector {}

ecs.register(Position, Velocity);

ecs.create().add(new Position(), new Velocity(1, 1));

class MovementSystem {
    constructor(ecs) {
        this.query = ecs.query(Position, Velocity);
    }

    update(delta) {
        this.query.iterate((entity, [position, velocity]) => {
            position.x += velocity.x * delta;
            position.y += velocity.y * delta;
        });
    }
}

const pipeline = [new MovementSystem(ecs)];

let last = performance.now();

const loop = () => {
    const now = performance.now();
    const delta = now - last;
    last = now;

    ecs.update(pipeline, delta);
    requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
```

See full demo in example folder. [Live demo](https://kutuluk.github.io/js13k-ecs/)

## API

### ecs

#### `ecs.register(Class1, ..., ClassN)`

The method registers javascript classes to be used as components. There are no requirements for classes, they can contain any data and have any methods. If the class contains a `destructor` method, it will be called when the component is removed from the entity.

#### `ecs.create()`

The method creates and returns an empty entity.

#### `ecs.query(Class1, ..., ClassN)`

The method returns a set of entities containing components of all specified classes. The set is updated automatically and is always up-to-date.

The set has a `length` property, which stores the number of entities in the set and a `iterate(iteratorFunction [, skipComponentsFlag])` method, which allows to enumerate all entities in the set.

```javascript
class MovementSystem {
    constructor(ecs) {
        this.query = ecs.query(Position, Velocity);
    }

    update(delta) {
        const movement = (entity, [position, velocity]) => {
            position.x += velocity.x * delta;
            position.y += velocity.y * delta;
            position.rotation += velocity.rotation * delta;
        };

        this.query.iterate(movement);
    }
}
```

In this example, the entities in the set are iterated using the `movement` function, which is applied to each entity that has both a `Position` and a `Velocity` component. The first parameter to this function is the entity itself, the second parameter is an array of components in the same order in which they were specified when the set was created. If the set consists of a single component, the second parameter is not the array, but the specified component.

Automatic component extraction is useful for more compact code, but there are cases when it is not required. If you pass `true` as the second parameter to the `iterate` method, the components will not be automatically retrieved from the entity, then the required components can be retrieved manually using the `entity.get()` method.

Queries are the primary way systems are implemented. Typically, a query is created when the system is created and used in the `update` method.

#### `ecs.update(pipeline, arg1, ..., argN)`

The method sequentially runs the `update` method of each system from the `pipeline` array of systems, passing the given parameters to it. This is the optimal way to update the world for the production build. At the same time, you can update the world without using this method by manually calling the necessary systems. Here is an example of code that starts the systems and collects information about the execution time of each of them:

```javascript
const pipeline = [new TargetingSystem(ecs), new MovementSystem(ecs)];

let last = performance.now();

const loop = () => {
    const now = performance.now();
    const delta = now - last;
    last = now;

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

The system can be any class or object with the `update` method, whose arguments are not strictly defined and are set by the developer when calling `ecs.update`. This allows you to flexibly customize the library's behavior depending on the needs of the application. As a rule, this method takes at least one `delta` argument, which determines how much time has passed since the last update of the world.

#### `ecs.reset()`

Removes all entities and their components from the world.

### `Entity`

Entities in this ecs implementation have no id, are passed by reference if necessary, and carry all the necessary methods for adding, extracting and removing components. As well as a method to remove the entity from the world (with all components removed).

#### `entity.add(component1, ..., componentN)`

The method adds components to an entity. The method waits for instances of previously registered classes. In case the passed component is already present in the entity, the old component will be removed (with a call to the destructor if present) and replaced with the new one. Returns the entity itself.

#### `entity.get(Class1, ..., ClassN)`

The method returns the specified entity components. The method expects previously registered classes. If more than one component is requested, the method returns an array of components in the same order, otherwise the requested component itself. If the entity does not have the requested component, `undefined` is returned instead.

#### `entity.remove(Class1, ..., ClassN)`

The method removes components from the entity. The method waits for previously registered classes. If the component has a constructor, calls it before deleting it. Returns the entity itself.

#### `entity.delete()`

The method removes the entity from the world by first clearing it of components with a call to their destructors.

#### `entity.exists`

This property is used to determine whether an entity is in the world or has already been removed from it. If the entity is deleted, it returns `null`, otherwise it returns the entity itself. When saving entity references, this property should always be checked before operations on the entity. Note that such a check is not necessary for entities obtained from queries - entities are guaranteed to be up to date there.

```javascript
class TargetingSystem {
    constructor(ecs) {
        this.query = ecs.query(Unit);
    }

    update(delta) {
        this.query.iterate((entity, unit) => {
            if (!unit.target?.exists) {
                // unit.target is not set, or the entity to which the target is pointing has become obsolete
                // retarget
                // ...
            }
        });
    }
}
```
