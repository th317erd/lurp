import * as Utils from './utils.js';

import {
  EntityDefinition,
  EntityInstance,
  markNoChildren,
} from './entity.js';

import { TYPE_COMPONENT } from './constants.js';

export const INTERNAL_COMPONENT_PROPS = {
  key: undefined,
  ref: undefined,
};

export class CustomPropertyHandler {
  static filterOutCustomPropHandlers(props) {
    let newObj  = Object.create(null);
    let keys    = Object.keys(props);

    for (let i = 0, il = keys.length; i < il; i++) {
      let key   = keys[i];
      let value = props[key];

      if (value instanceof CustomPropertyHandler)
        continue;

      newObj[key] = value;
    }

    return newObj;
  }

  constructor(callback) {
    Object.defineProperties(this, {
      'callback': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        callback,
      },
    });
  }
}

export class ComponentDefinition extends EntityDefinition {
  constructor(_options) {
    let options = _options || {};

    super({
      ...options,
      type: TYPE_COMPONENT,
    });

    Object.defineProperties(this, {
      'renderMethod': {
        writable:     false,
        enumerable:   true,
        configurable: false,
        value:        options.renderMethod,
      },
    });
  }

  clone(options) {
    return super.clone({
      renderMethod: this.renderMethod,
      ...(options || {}),
    });
  }
}

export class ComponentInstance extends EntityInstance {
  constructor(definition) {
    super(definition);

    Object.defineProperties(this, {
      'state': {
        writable:     true,
        enumerable:   false,
        configurable: false,
        value:        [],
      },
    });
  }

  render(entityDefinition) {
    let stateCounter = 0;

    const useState = (defaultValue) => {
      const setter = (value) => {
        let currentValue = this.state[index];

        if (currentValue !== value) {
          // TODO: Trigger update
          this.state[index] = value;
        }
      };

      let index = stateCounter;
      let value;

      if (index >= this.state.length) {
        value = defaultValue;
        this.state.push(value);
      } else {
        value = this.state[index];
      }

      stateCounter++;

      return [ value, setter ];
    };

    return entityDefinition.render.call(
      entityDefinition,
      entityDefinition.props,
      {
        useState,
      },
      entityDefinition,
    );
  }
}

export function create(renderMethod, _componentProps, defaultProps, _DefinitionKlass) {
  let componentProps = Object.assign(
    Object.create(null),
    (_componentProps || {}),
    INTERNAL_COMPONENT_PROPS,
  );

  const DefinitionKlass = _DefinitionKlass || ComponentDefinition;

  const Component = (props, ...children) => {
    let componentDefinition = new DefinitionKlass({ props, children, renderMethod });
    return componentDefinition;
  };

  const assignPropHelpers = (_method, _props) => {
    const props   = _props;
    const method  = _method.bind(this, props);

    Object.keys(componentProps || {}).forEach((propName) => {
      let propValue = componentProps[propName];

      Object.defineProperty(method, propName, {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        (propValue instanceof CustomPropertyHandler) ? (...args) => {
          return propValue.callback.call(this, { assignPropHelpers, Component, props }, ...args);
        } : (value) => {
          let newProps = Object.assign(
            Object.create(null),
            props,
            {
              [propName]: value,
            },
          );

          return assignPropHelpers((...children) => {
            return Component(newProps, ...children);
          }, newProps);
        },
      });
    });

    Object.defineProperty(method, 'assign', {
      writable:     false,
      enumerable:   false,
      configurable: false,
      value:        (...args) => {
        let newProps = Object.assign(
          Object.create(null),
          props,
          ...args,
        );

        return assignPropHelpers((...children) => {
          return Component(newProps, ...children);
        }, newProps);
      },
    });

    markNoChildren(method);

    return method;
  };

  return assignPropHelpers(
    Component,
    CustomPropertyHandler.filterOutCustomPropHandlers(
      Object.assign(
        Object.create(null),
        defaultProps,
        componentProps || {},
      ),
    ),
  );
}
