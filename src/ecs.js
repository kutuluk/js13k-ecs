const selectors = [];
const systems = [];
const entities = {};

let ecsComponentSign = '_sign';
let ecsComponentMask = '_mask';

if (typeof Symbol !== 'undefined') {
  ecsComponentSign = Symbol(ecsComponentSign);
  ecsComponentMask = Symbol(ecsComponentMask);
}

const getComponentProperty = (ecsComponentProperty, Component) => {
  const property = Component[ecsComponentProperty];
  if (!property) {
    throw new Error('The component is not registered');
  }
  return property;
};

const getComponentSign = getComponentProperty.bind(null, ecsComponentSign);
const getComponentMask = getComponentProperty.bind(null, ecsComponentMask);

const matchEntity = (entity) => {
  entity.id && selectors.forEach(selector => selector.match(entity));
};

const ejectEntity = (entity) => {
  Object.values(entity.components).forEach(
    component => component && component.destructor && component.destructor(),
  );

  selectors.forEach(selector => selector.remove(entity));
  delete entities[entity.id];
  entity.id = 0;
  // entity.mask = 0;
  // entity.components = {};
};

let sequence = 1;
const signs = {};

class Entity {
  constructor(id) {
    this.id = id || (sequence++).toString(36);
    this.components = Object.assign({}, signs);
    this.mask = 0;
  }

  add(...components) {
    components.forEach((component) => {
      this.components[getComponentSign(component.constructor)] = component;
      this.mask |= getComponentMask(component.constructor);
    });

    matchEntity(this);
  }

  remove(...Components) {
    Components.forEach((Component) => {
      const sign = getComponentSign(Component);
      const component = this.components[sign];

      if (component) {
        component.destructor && component.destructor();
        delete this.components[sign];
        this.mask &= ~getComponentMask(Component);
      }
    });

    matchEntity(this);
  }

  has(Component) {
    return getComponentSign(Component) in this.components;
  }

  get(Component) {
    // return this.components[getComponentSign(Component)];
    return this.components[Component[ecsComponentSign]];
  }

  /*
  set(Component, ...args) {
    const component = this.components[getComponentSign(Component)];

    if (component) {
      if (!component.setter) {
        throw new Error('Component does not have setter');
      }
      component.setter(...args);
    } else {
      this.add(new Component(...args));
    }
  }
  */

  eject() {
    ejectEntity(this);
  }
}

class Node {
  constructor(entity, next) {
    this.entity = entity;
    this.prev = null;
    this.next = next;
  }
}

class Selector {
  constructor(mask) {
    if (!mask) {
      throw new Error('Empty selector');
    }

    this.mask = mask;
    this.map = {};
    this.list = null;
    this.length = 0;

    Object.values(entities).forEach(entity => this.match(entity));
  }

  iterate(fn) {
    let node = this.list;
    while (node) {
      fn(node.entity);
      node = node.next;
    }
  }

  match(entity) {
    if ((this.mask & entity.mask) === this.mask) {
      this.add(entity);
    } else {
      this.remove(entity);
    }
  }

  add(entity) {
    if (this.map[entity.id]) {
      // this.map[entity.id].entity = entity;
      return;
    }

    const node = new Node(entity, this.list);

    this.list && (this.list.prev = node);
    this.list = node;

    this.map[entity.id] = node;
    this.length++;
  }

  remove(entity) {
    const node = this.map[entity.id];

    if (node) {
      if (node.prev) {
        node.prev.next = node.next;
      } else {
        this.list = node.next;
      }

      node.next && (node.next.prev = node.prev);

      delete this.map[entity.id];
      this.length--;
    }
  }
}

let bit = 0;

const perf = performance || Date;
const now = perf.now.bind(perf);

export default {
  register(...Components) {
    Components.forEach((Component) => {
      if (bit > 31) {
        throw new Error('Components limit reached');
      }

      if (Component[ecsComponentSign]) {
        // throw new Error('The component is already registered');
        return;
      }

      const sign = bit.toString(36);
      signs[sign] = null;

      Component[ecsComponentSign] = sign;
      Component[ecsComponentMask] = 1 << bit;
      bit++;
    });
  },

  process(...s) {
    s.forEach(system => systems.push(system));
  },

  create(id) {
    const entity = new Entity(id);

    if (entities[entity.id]) {
      throw new Error('The ID already exist');
    }

    entities[entity.id] = entity;
    return entity;
  },

  get(id) {
    return entities[id];
  },

  select(...Components) {
    let mask = 0;

    Components.forEach((Component) => {
      mask |= getComponentMask(Component);
    });

    const exist = selectors.find(selector => selector.mask === mask);
    if (exist) return exist;

    const selector = new Selector(mask);
    selectors.push(selector);
    return selector;
  },

  update(delta) {
    const statistics = {};

    systems.forEach((system) => {
      const begin = now();
      system.update(delta);
      statistics[system.constructor.name] = now() - begin;
    });

    return statistics;
  },
};
