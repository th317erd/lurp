import {
  DYNAMIC_PROPERTY_TYPE,
  DYNAMIC_PROPERTY_VALUE,
  DYNAMIC_PROPERTY_IS_SETTING,
  DYNAMIC_PROPERTY_SET,
  MYTHIX_TYPE,
} from './constants.js';

import * as BaseUtils from './base-utils.js';

/**
 * groupName: Utils
 * desc: |
 *   `DynamicProperty` is a simple value storage class wrapped in a Proxy.
 *
 *    It will allow the user to store any desired value. The catch however is that
 *    any value stored can only be set through its special `set` method.
 *
 *    This will allow any listeners to receive the `'update'` event when a value is set.
 *
 *    Since `DynamicProperty` instances are also always wrapped in a Proxy, the user may
 *    "directly" access attributes of the stored value. For example, if a `DynamicProperty`
 *    is storing an Array instance, then one would be able to access the `.length` property
 *    "directly", i.e. `dynamicProp.length`.
 *
 *    `DynamicProperty` has a special `set` method, whose name is a `symbol`, to avoid conflicting
 *    namespaces with the underlying datatype (and the wrapping Proxy).
 *    To set a value on a `DynamicProperty` instance, one must do so as follows: `dynamicProperty[DynamicProperty.set](myNewValue)`.
 *    This will update the internal value, and if the set value differs from the stored value, the `'update'` event will be dispatched to
 *    any listeners.
 *
 *    As `DynamicProperty` is an [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/EventTarget), one can attach
 *    event listeners to the `'update'` event to listen for updates to the underlying value. The `'update'` event is the only event that is
 *    ever triggered by this class. The received `event` instance in event callbacks will have the following attributes:
 *    1. `updateEvent.originator = this;` - `originator` is the instance of the `DynamicProperty` where the event originated from.
 *    2. `updateEvent.oldValue = currentValue;` - `oldValue` contains the previous value of the `DynamicProperty` before set.
 *    3. `updateEvent.value = newValue;` - `value` contains the current value being set on the `DynamicProperty`.
 *
 *    To retrieve the underlying raw value of a `DynamicProperty`, one may call `valueOf()`: `let rawValue = dynamicProperty.valueOf();`
 * notes:
 *   - |
 *     :warning: `DynamicProperty` instances will internally track when a `set` operation is underway, to prevent
 *     cyclic sets and maximum call stack errors. You are allowed to set the value recursively, however `update` events
 *     will only be dispatched for the first `set` call. Any `set` operation that happens while another `set` operation is
 *     underway will **not** dispatch any `'update'` events.
 *   - |
 *     `'update'` events will be dispatched immediately *after* the internal underlying stored value is updated. Though it is
 *     possible to `stopImmediatePropagation` in an event callback, attempting to "preventDefault" or "stopPropagation" will do nothing.
 * examples:
 *   - |
 *     ```javascript
 *     import { DynamicProperty } from 'mythix-ui-core@1.0';
 *
 *     let dynamicProperty = new DynamicProperty('initial value');
 *
 *     dynamicProperty.addEventListener('update', (event) => {
 *       console.log(`Dynamic Property Updated! New value = '${event.value}', Previous Value = '${event.oldValue}'`);
 *       console.log(`Current Value = '${dynamicProperty.valueOf()}'`);
 *     });
 *
 *     dynamicProperty[DynamicProperty.set]('new value');
 *
 *     // output -> Dynamic Property Updated! New value = 'new value', Old Value = 'initial value'
 *     // output -> Current Value = 'initial value'
 *     ```
 */
export class DynamicProperty extends EventTarget {
  static [Symbol.hasInstance](instance) { // @ref:_mythixTypeExample
    try {
      return (instance && instance[MYTHIX_TYPE] === DYNAMIC_PROPERTY_TYPE);
    } catch (e) {
      return false;
    }
  }

  /**
   * type: Property
   * name: set
   * groupName: DynamicProperty
   * parent: DynamicProperty
   * static: true
   * desc: |
   *   A special `symbol` used to access the `set` method of a `DynamicProperty`.
   * examples:
   *   - |
   *     ```javascript
   *     import { DynamicProperty } from 'mythix-ui-core@1.0';
   *
   *     let dynamicProperty = new DynamicProperty('initial value');
   *
   *     dynamicProperty.addEventListener('update', (event) => {
   *       console.log(`Dynamic Property Updated! New value = '${event.value}', Previous Value = '${event.oldValue}'`);
   *       console.log(`Current Value = '${dynamicProperty.valueOf()}'`);
   *     });
   *
   *     dynamicProperty[DynamicProperty.set]('new value');
   *
   *     // output -> Dynamic Property Updated! New value = 'new value', Old Value = 'initial value'
   *     // output -> Current Value = 'initial value'
   *     ```
   */
  static set = DYNAMIC_PROPERTY_SET; // @ref:DynamicProperty.set

  /**
   * type: Function
   * name: constructor
   * groupName: DynamicProperty
   * parent: Utils
   * desc: |
   *   Construct a `DynamicProperty`.
   * arguments:
   *   - name: initialValue
   *     dataType: any
   *     desc:
   *       The initial value to store.
   * notes:
   *   - |
   *     :info: This will return a Proxy instance wrapping the `DynamicProperty` instance.
   *   - |
   *     :info: You can not set a `DynamicProperty` to another `DynamicProperty` instance.
   *     If `initialValue` is a `DynamicProperty` instance, it will use the stored value
   *     of that instance instead (by calling @see DynamicProperty.valueOf;).
   */
  constructor(initialValue) {
    super();

    Object.defineProperties(this, {
      [MYTHIX_TYPE]: {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        DYNAMIC_PROPERTY_TYPE,
      },
      [DYNAMIC_PROPERTY_VALUE]: {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        (BaseUtils.isType(initialValue, DynamicProperty)) ? initialValue.valueOf() : initialValue,
      },
      [DYNAMIC_PROPERTY_IS_SETTING]: {
        writable:     true,
        enumerable:   false,
        configurable: true,
        value:        false,
      },
    });

    let proxy = new Proxy(this, {
      get:  (target, propName) => {
        if (propName in target) {
          let value = target[propName];
          return (typeof value === 'function') ? value.bind(target) : value;
        }

        let value = target[DYNAMIC_PROPERTY_VALUE][propName];
        return (value === 'function') ? value.bind(target[DYNAMIC_PROPERTY_VALUE]) : value;
      },
      set:  (target, propName, value) => {
        if (propName in target)
          target[propName] = value;
        else
          target[DYNAMIC_PROPERTY_VALUE][propName] = value;

        return true;
      },
    });

    return proxy;
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'number')
      return +this[DYNAMIC_PROPERTY_VALUE];
    else if (hint === 'string')
      return this.toString();

    return this.valueOf();
  }

  toString() {
    let value = this[DYNAMIC_PROPERTY_VALUE];
    return (value && typeof value.toString === 'function') ? value.toString() : ('' + value);
  }

  /**
   * type: Function
   * groupName: DynamicProperty
   * parent: DynamicProperty
   * desc: |
   *   Fetch the underlying raw value stored by this `DynamicProperty`.
   * return: |
   *   @types: any; The underling raw value.
   */
  valueOf() {
    return this[DYNAMIC_PROPERTY_VALUE];
  }

  /**
   * type: Function
   * name: "[DynamicProperty.set]"
   * groupName: DynamicProperty
   * parent: DynamicProperty
   * desc: |
   *   Set the underlying raw value stored by this `DynamicProperty`.
   *
   *   If the current stored value is exactly the same as the provided `value`,
   *   then this method will simply return.
   *
   *   Otherwise, when the underlying value is updated, `this.dispatchEvent` will
   *   be called to dispatch an `'update'` event to notify all listeners that the
   *   underlying value has been changed.
   * arguments:
   *   - name: newValue
   *     dataType: any
   *     desc: |
   *       The new value to set. If this is itself a `DynamicProperty` instance, then
   *       it will be unwrapped to its underlying value, and that will be used as the value instead.
   *   - name: options
   *     optional: true
   *     dataType: object
   *     desc: |
   *       An object to provided options for the operation. The shape of this object is `{ dispatchUpdateEvent: boolean }`.
   *       If `options.dispatchUpdateEvent` equals `false`, then no `'update'` event will be dispatched to listeners.
   * notes:
   *   - |
   *     :info: If the underlying stored value is exactly the same as the value provided,
   *     then nothing will happen, and the method will simply return.
   *   - |
   *     :info: The underlying value is updated *before* dispatching events.
   *   - |
   *     :info: `DynamicProperty` protects against cyclic event callbacks. If an
   *     event callback again sets the underlying `DynamicProperty` value, then
   *     the value will be set, but no event will be dispatched (to prevent event loops).
   *   - |
   *     :info: You can not set a `DynamicProperty` to another `DynamicProperty` instance.
   *     If this method receives a `DynamicProperty` instance, it will use the stored value
   *     of that instance instead (by calling @see DynamicProperty.valueOf;).
   */
  [DYNAMIC_PROPERTY_SET](_newValue, _options) {
    let newValue = _newValue;
    if (BaseUtils.isType(newValue, DynamicProperty))
      newValue = newValue.valueOf();

    if (this[DYNAMIC_PROPERTY_VALUE] === newValue)
      return;

    if (this[DYNAMIC_PROPERTY_IS_SETTING]) {
      this[DYNAMIC_PROPERTY_VALUE] = newValue;
      return;
    }

    let options = _options || {};

    try {
      this[DYNAMIC_PROPERTY_IS_SETTING] = true;

      let oldValue = this[DYNAMIC_PROPERTY_VALUE];
      this[DYNAMIC_PROPERTY_VALUE] = newValue;

      if (options.dispatchUpdateEvent === false)
        return;

      let updateEvent = new Event('update');

      updateEvent.originator = this;
      updateEvent.oldValue = oldValue;
      updateEvent.value = newValue;

      this.dispatchEvent(updateEvent);
    } catch (error) {
      console.error(error);
    } finally {
      this[DYNAMIC_PROPERTY_IS_SETTING] = false;
    }
  }
}
