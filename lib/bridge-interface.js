/* global DedicatedWorkerGlobalScope */

import * as Utils from './utils.js';

export class BridgeInterface {
  constructor(postMessageContext, _options) {
    let options = Object.assign(
      {},
      {
        name: (typeof DedicatedWorkerGlobalScope !== 'undefined' && postMessageContext instanceof DedicatedWorkerGlobalScope) ? 'Worker' : 'Browser',
      },
      _options || {},
    );

    Object.defineProperties(this, {
      'id': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        Utils.generateID(),
      },
      'postMessageContext': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        postMessageContext,
      },
      'userContext': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        options.expose || {},
      },
      'options': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        options,
      },
      'messageMap': {
        writable:     false,
        enumerable:   false,
        configurable: false,
        value:        new Map(),
      },
      'Utils': {
        enumerable:   false,
        configurable: false,
        get:          () => Utils,
      },
    });

    this.bindOnMessage();
  }

  bindOnMessage() {
    this.postMessageContext.onmessage = async (event) => {
      let action = event.data;
      if (!action.sender || !action.sender.id)
        return;

      if (!action.id || !action.command)
        return;

      if (this.options.debug === true)
        console.log(`${this.options.name}[${this.id}] received a message from ${event.data.sender.name}[${action.sender.id}]!`, event);

      await this[`action${action.command}`](action, action.value);
    };
  }

  _postMessage(command, value) {
    let promise = Utils.createResolvable();

    this.messageMap.set(promise.id, promise);

    this.postMessageContext.postMessage({
      id:       promise.id,
      sender:   {
        id:   this.id,
        name: this.options.name,
      },
      command,
      value,
    });

    return promise;
  }

  // Respond to a "CALL" action from remote
  async actionCALL(action, { name, args }) {
    if (!Object.prototype.hasOwnProperty.call(this.userContext, name))
      return this.respondToAction(action, new TypeError(`${this.options.name}: No such method defined on interface: ${name}`));

    let result = await this.userContext[name].apply(this, args);
    await this.respondToAction(action, result);

    return result;
  }

  // Respond to a "RESULT" action from remote
  async actionRESULT(action, { target, status, value }) {
    let promise = this.messageMap.get(target);
    if (!promise)
      return;

    const valueToError = (value) => {
      let type = globalThis[value.type];
      if (!type || !(type.prototype instanceof Error))
        type = Error;

      let error = new type(value.message);
      error.stack = value.stack;

      return error;
    };

    if (status === 'error')
      promise.reject(valueToError(value));
    else
      promise.resolve(value);

    return { status, value };
  }

  // Transmit a "Call" action to remote
  call(name, ...args) {
    return this._postMessage('CALL', {
      name,
      args,
    });
  }

  // Transmit a "Result" action to remote
  respondToAction(action, result) {
    let isError = (result instanceof Error);

    return this._postMessage('RESULT', {
      target: action.id,
      status: (isError) ? 'error' : 'ok',
      value:  (isError) ? { message: result.message, stack: result.stack, type: result.constructor.name } : result,
    });
  }
}
