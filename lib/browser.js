import { BridgeInterface } from './bridge-interface.js';

export class BrowserBridgeInterface extends BridgeInterface {

}

function render(component) {
  console.log('Got a render request!');
}

export const INTERNAL_INTERFACE_METHODS = {
  render,
};

export function createWorker(workerScriptURI, _context, options) {
  if (!window.Worker)
    throw new Error('Script environment doesn\'t support Workers');

  const worker = new Worker(workerScriptURI, { type: 'module' });

  worker.onmessage = function(event) {
    console.log('Message received from worker', event);
  };

  let context = Object.assign(
    Object.create(null),
    INTERNAL_INTERFACE_METHODS,
    _context || {},
    {
      expose: Object.assign(
        Object.create(null),
        INTERNAL_INTERFACE_METHODS,
        (_context || {}).expose,
      ),
    },
  );

  return new BrowserBridgeInterface(worker, context, options);
}
