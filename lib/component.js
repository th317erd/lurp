export const COMPONENT_NO_CHILDREN = Symbol.for('/lurp/constants/noChildren');

export class CustomPropertyHandler {
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

function filterProps(props) {
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

export function create(renderMethod, componentProps) {
  const Component = (props) => {
    console.log('COMPONENT: ', props, renderMethod);
  };

  const assignPropHelpers = (_method, _props) => {
    const props   = filterProps(_props);
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

    console.log('CUSTOM: ', newProps, name, value);

    return assignPropHelpers((...children) => {
      return Component(newProps, ...children);
    }, newProps);
  }),
});
