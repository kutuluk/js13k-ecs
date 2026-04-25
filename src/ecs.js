const empty = new Map();
const components = new Set();
const ecsComponentMask = Symbol('m');
let bit = 0;

class Entity {
    constructor(world) {
        this._world = world;
        this._components = new Map();
        this._mask = BigInt(0);
    }

    get exists() {
        return this._components === empty ? null : this;
    }

    add(...components) {
        if (this.exists) {
            components.forEach((component) => {
                const mask = component?.constructor?.[ecsComponentMask];
                if (mask) {
                    this._components.get(mask)?.destructor?.(this);
                    this._components.set(mask, component);
                    this._mask |= mask;
                }
            });

            this._world._matchEntity(this);
        }

        return this;
    }

    remove(...Components) {
        if (this.exists) {
            Components.forEach((Component) => {
                const mask = Component[ecsComponentMask];
                const component = this._components.get(mask);

                if (component) {
                    component.destructor?.(this);
                    this._components.delete(mask);
                    this._mask &= ~mask;
                }
            });

            this._world._matchEntity(this);
        }

        return this;
    }

    get(...Components) {
        const result = Components.map(
            (Component) => this._components.get(Component[ecsComponentMask]) || null,
        );
        return result.length > 1 ? result : result[0];
    }

    delete() {
        this._components.forEach((component) => component.destructor?.(this));
        this._world._queries.forEach((query) => query._remove(this));
        this._world._entities.delete(this);
        this._components = empty;
    }
}

class Query {
    constructor(world, mask, Components, parent) {
        const set = parent?._set || new Set();
        this._set = set;
        this._mask = mask;
        this._components = Components;

        this._match = (entity) => {
            (mask && (mask & entity._mask) === mask && set.add(entity)) || set.delete(entity);
        };

        !parent && world._entities.forEach(this._match);
    }

    _check(Components) {
        this._components.every((c, i) => c === Components[i]);
    }

    _remove(entity) {
        this._set.delete(entity);
    }

    iterate(fn) {
        this._set.forEach((entity) => fn(entity.get(...this._components), entity));
    }

    get length() {
        return this._set.size;
    }
}

class World {
    constructor() {
        this._queries = [];
        this._entities = new Set();
    }

    _matchEntity(entity) {
        this._queries.forEach((query) => query._match(entity));
    }

    create() {
        const entity = new Entity(this);
        this._entities.add(entity);
        return entity;
    }

    query(...Components) {
        const mask = Components.reduce(
            (mask, Component) => (mask |= Component[ecsComponentMask]),
            BigInt(0),
        );

        let query = this._queries.find((q) => q._mask === mask);

        if (!query) {
            query = new Query(this, mask, Components);
            this._queries.push(query);
        }

        if (!query._check(Components)) {
            return new Query(this, mask, Components, query);
        }

        return query;
    }

    update(pipeline, ...args) {
        pipeline.forEach((system) => system.update(...args));
    }

    reset() {
        this._entities.forEach((entity) => entity.delete());
    }
}

const registerComponents = (...Components) => {
    Components.forEach((Component) => {
        if (!components.has(Component)) {
            Component[ecsComponentMask] = BigInt('0b1'.padEnd(3 + bit++, '0'));
            components.add(Component);
        }
    });
};

const createWorld = () => new World();

export default [registerComponents, createWorld];
