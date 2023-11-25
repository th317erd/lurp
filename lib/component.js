import * as Utils from './utils.js';

export const COMPONENT_NO_CHILDREN = Symbol.for('/lurp/constants/noChildren');

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

export class ComponentDefinition {
  constructor(_options) {
    let options = _options || {};

    Object.defineProperties(this, {
      'props': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        options.props || {},
      },
      'children': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        ensureComponents(...(options.children || [])),
      },
      'render': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        options.render || (() => null),
      },
    });
  }
}

export function isValidComponent(component) {
  if (component == null || component === false || Object.is(component, NaN))
    return false;

  if (component instanceof ComponentDefinition)
    return true;

  if (typeof component === 'function')
    return true;

  if (!Utils.isPrimitive(component))
    return false;

  return true;
}

export function ensureComponents(...components) {
  return components.map((_component) => {
    let component = _component;
    if (!isValidComponent(component))
      return null;

    if (typeof component === 'function' && component[COMPONENT_NO_CHILDREN])
      component = component();

    if (Utils.isPrimitive(component))
      component = component.toString();

    return component;
  }).filter(Boolean);
}

export function create(render, componentProps) {
  const Component = (props, ...children) => {
    return new ComponentDefinition({ props, children, render });
  };

  const assignPropHelpers = (_method, _props) => {
    const props   = CustomPropertyHandler.filterOutCustomPropHandlers(_props);
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

    Object.defineProperty(method, COMPONENT_NO_CHILDREN, {
      writable:     false,
      enumerable:   false,
      configurable: false,
      value:        true,
    });

    return method;
  };

  return assignPropHelpers(
    Component,
    Object.assign(Object.create(null), componentProps || {}),
  );
}

export const Element = create(() => {

}, {
  tagName: 'SPAN',
  on:       new CustomPropertyHandler(({ assignPropHelpers, Component, props }, name, value) => {
    let newProps = Object.assign(
      Object.create(null),
      props,
      {
        [`on${name}`]: value,
      },
    );

    return assignPropHelpers((...children) => {
      return Component(newProps, ...children);
    }, newProps);
  }),
});
