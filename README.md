# js13k-ecs

> A 1kb [entity component system](http://entity-systems.wikidot.com/), designed for js13k.

[![NPM version](https://img.shields.io/npm/v/js13k-ecs.svg?style=flat-square)](https://www.npmjs.com/package/js13k-ecs)[![Build Status](https://img.shields.io/travis/kutuluk/js13k-ecs/master.svg?style=flat-square)](https://travis-ci.org/kutuluk/js13k-ecs)

-   **Tiny:** weighs about one kilobyte gzipped

## Install

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com). Go check them out if you don't have them locally installed.

```sh
$ npm install js13k-ecs
```

Then with a module bundler like [rollup](http://rollupjs.org/) or [webpack](https://webpack.js.org/), use as you would anything else:

```javascript
// using ES6 modules
import ecs from 'js13k-ecs';

// using CommonJS modules
var ecs = require('js13k-ecs');
```

The [UMD](https://github.com/umdjs/umd) build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/js13k-ecs/dist/ecs.umd.js"></script>
```

You can find the library on `window.ecs`.

## Usage

See example folder. [Live example](https://kutuluk.github.io/js13k-ecs/)

## API

### ecs

#### `register(...Components)`

Registers components for use by the library. Components must be classes or constructor functions. No other requirements are imposed on the components.

#### `process(...systems)`

Adds systems for use by the library. Systems must be instances of classes or objects. Systems must implement the `update` method.

#### `create(id)`

Creates the entity with the specified `id`. If `id` is not specified, serial numbers starting with 1 are generated and encoded in base36. Returns the created entity.

#### `get(id)`

Returns the entity with the specified id or `undefined` if it is not present.

#### `select(...Components)`

Returns a selection of entities that have the specified set of components. The sample is updated real-time and always relevant.

The selector has the `length` property, which stores the number of entities in the sample and the `iterate(fn)` method, with which you can loop through all entities.

#### `update(delta)`

Successively calls `update` methods on all systems, passing them the `delta` parameter. Returns the object that contains the duration of the execution of the systems.

### `Entity`

#### `add(...components)`

Adds the components to the entity.

#### `remove(...Components)`

Removes components of the `Components` class from the entity. Calls the `destructor` method of each component if it is present.

#### `has(Component)`

Returns true if the entity has a component of the `Component` class and false otherwise.

#### `get(Component)`

Returns a component of the `Component` class or `undefined` if it is not present.

#### `eject()`

Removes the entity from all selectors and sets its `id` to zero. Calls the `destructor` method of each component if it is present.
