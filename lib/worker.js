import { BridgeInterface } from './bridge-interface.js';

export class WorkerBridgeInterface extends BridgeInterface {
  render(component) {
    return this.call('render', component);
  }
}

export function setupBridge(context, options) {
  return new WorkerBridgeInterface(
    globalThis,
    Object.assign(
      Object.create(null),
      context,
    ),
    options,
  );
}
