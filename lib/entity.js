import * as Utils from './utils.js';

import {
  COMPONENT_NO_CHILDREN,
  EMPTY_KEY,
  TYPE_COMPONENT,
} from './constants.js';

export function isValidEntity(component) {
  if (component == null || component === false || Object.is(component, NaN))
    return false;

  if (component instanceof EntityDefinition)
    return true;

  if (typeof component === 'function')
    return true;

  if (!Utils.isPrimitive(component))
    return false;

  return true;
}

export function ensureEntities(...components) {
  return components.map((_component) => {
    let component = _component;
    if (!isValidEntity(component))
      return null;

    if (typeof component === 'function' && component[COMPONENT_NO_CHILDREN])
      component = component();

    if (Utils.isPrimitive(component))
      component = component.toString();

    return component;
  }).filter(Boolean);
}

export function markNoChildren(method) {
  Object.defineProperty(method, COMPONENT_NO_CHILDREN, {
    writable:     false,
    enumerable:   false,
    configurable: false,
    value:        true,
  });

  return method;
}

export class EntityInstance {
  constructor(definition) {
    let id = Utils.SHA256(Utils.deadbeef.call({ custom: false }, this));

    Object.defineProperties(this, {
      'id': {
        writable:     false,
        enumerable:   true,
        configurable: false,
        value:        id,
      },
      'definition': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        definition,
      },
      'previousRenderResult': {
        writable:     true,
        enumerable:   false,
        configurable: false,
        value:        null,
      },
    });
  }

  render(entityDefinition) {
    return entityDefinition;
  }
}

export class EntityDefinition {
  [Utils.deadbeef.idSym]() {
    return this.instanceID();
  }

  constructor(_options) {
    let options = _options || {};
    let key     = options.key;

    if (key == null)
      key = (options.props || {}).key;

    if (key == null)
      key = EMPTY_KEY;

    Object.defineProperties(this, {
      'options': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        options,
      },
      'type': {
        writable:     false,
        enumerable:   true,
        configurable: false,
        value:        options.type || TYPE_COMPONENT,
      },
      'props': {
        writable:     false,
        enumerable:   true,
        configurable: false,
        value:        options.props || {},
      },
      'children': {
        writable:     false,
        enumerable:   true,
        configurable: false,
        value:        this.processChildren(options.children),
      },
      'parent': {
        writable:     false,
        enumerable:   true,
        configurable: false,
        value:        options.parent || null,
      },
      'key': {
        writable:     false,
        enumerable:   true,
        configurable: false,
        value:        key,
      },
    });
  }

  instanceID() {
    return Utils.deadbeef(
      this.type,
      this.key,
      this.value,
      ...this.getAllParents().map((parent) => parent.instanceID()),
    );
  }

  fullID() {
    let propKeys = Object.keys(this.props).sort();
    let uniqueID = Utils.deadbeef(
      this.instanceID(),
      ...propKeys,
      ...propKeys.map((key) => this.props[key]),
      ...this.children,
    );

    return uniqueID;
  }

  differs(componentDefinition) {
    return (this.fullID() !== componentDefinition.fullID());
  }

  getAllParents() {
    let parents = [];
    let parent  = this.parent;

    while (parent) {
      parents.push(parent);
      parent = parent.parent;
    }

    return parents;
  }

  processChildren(children) {
    return ensureEntities(...(children || [])).map((child, index) => {
      if (child instanceof EntityDefinition) {
        let key = child.props.key;
        if (key == null)
          key = child.key;

        if (key === EMPTY_KEY)
          key = index;

        return (child.key === index && child.parent === this) ? child : child.clone({ parent: this, key });
      }

      return child;
    });
  }

  clone(options) {
    return new this.constructor({
      type:     this.type,
      props:    this.props,
      children: this.children,
      parent:   this.parent,
      key:      this.key,
      ...(options || {}),
    });
  }

  createInstance() {
    return new EntityInstance(this);
  }
}
