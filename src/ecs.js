const queries = [];
const entities = new Set();
const empty = new Map();
const ecsComponentMask = Symbol('m');
let bit = 0;

const matchEntity = (entity) => queries.forEach((query) => query._match(entity));

class Entity {
    constructor() {
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

            matchEntity(this);
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

            matchEntity(this);
        }

        return this;
    }

    get(...Components) {
        const result = Components.map((Component) =>
            this._components.get(Component[ecsComponentMask]),
        );
        return result.length > 1 ? result : result[0];
    }

    delete() {
        this._components.forEach((component) => component?.destructor?.(this));
        queries.forEach((query) => query._remove(this));
        entities.delete(this);
        this._components = empty;
    }
}

class Query {
    constructor(mask, Components, parent) {
        const set = parent?._set || new Set();
        this._set = set;
        this._mask = mask;

        this._check = (Comps) => Components.every((c, i) => c === Comps[i]);

        this._match = (entity) =>
            (mask && (mask & entity._mask) === mask && set.add(entity)) || set.delete(entity);

        this._remove = (entity) => set.delete(entity);

        this.iterate = (fn, skipComponents) =>
            set.forEach((entity) => fn(entity, !skipComponents && entity.get(...Components)));

        !parent && entities.forEach(this._match);
    }

    get length() {
        return this._set.size;
    }
}

export default {
    register(...Components) {
        Components.forEach((Component) => {
            if (!Component[ecsComponentMask]) {
                Component[ecsComponentMask] = BigInt('0b1'.padEnd(3 + bit++, '0'));
            }
        });
    },

    create() {
        const entity = new Entity();
        entities.add(entity);
        return entity;
    },

    query(...Components) {
        let mask = BigInt(0);

        Components.forEach((Component) => (mask |= Component[ecsComponentMask]));

        let query = queries.find((s) => s._mask === mask);

        if (!query) {
            query = new Query(mask, Components);
            queries.push(query);
        }

        if (!query._check(Components)) {
            return new Query(mask, Components, query);
        }

        return query;
    },

    update(pipeline, ...args) {
        pipeline.forEach((system) => system.update(delta, ...args));
    },

    reset() {
        queries.forEach((query) => query.forEach((entity) => entity.delete()));
    },
};

class World {
    constructor() {
        this._queries = [];
        this._entities = new Set();
    }

    create() {
        const entity = new Entity();
        this._entities.add(entity);
        return entity;
    }

    matchEntity(entity) {
        this._queries.forEach((query) => query._match(entity));
    }

    query(...Components) {
        let mask = BigInt(0);

        Components.forEach((Component) => (mask |= Component[ecsComponentMask]));

        let query = this._queries.find((s) => s._mask === mask);

        if (!query) {
            query = new Query(mask, Components);
            this._queries.push(query);
        }

        if (!query._check(Components)) {
            return new Query(mask, Components, query);
        }

        return query;
    }

    update(pipeline, ...args) {
        pipeline.forEach((system) => system.update(delta, ...args));
    }

    reset() {
        this._queries.forEach((query) => query.forEach((entity) => entity.delete()));
    }
}
