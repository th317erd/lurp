import * as Utils         from './utils.js';
import { ensureEntities } from './entity.js';
import { TYPE_COMPONENT, TYPE_ELEMENT, TYPE_TERM } from './constants.js';

export class RenderCommand {
  constructor(_options) {
    let options = _options || {};

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
        value:        options.type,
      },
    });
  }
}

export class Renderer {
  constructor() {
    Object.defineProperties(this, {
      'componentInstances': {
        writable:     false,
        enumerable:   false,
        configurable: true,
        value:        new Map(),
      },
    });
  }

  async render(_componentDefinition) {
    let [
      componentDefinition,
    ] = ensureEntities(_componentDefinition);

    let definitionID      = Utils.deadbeef(componentDefinition);
    let componentInstance = this.componentInstances.get(definitionID);

    if (!componentInstance) {
      componentInstance = componentDefinition.createInstance();
      this.componentInstances.set(definitionID, componentInstance);
    }

    let previousRenderResult  = componentInstance.previousRenderResult || {};
    let renderResult          = await componentInstance.render(componentDefinition);

    componentInstance.previousRenderResult = renderResult;

    return this.handleRenderResult({
      definitionID,
      componentDefinition,
      componentInstance,
      previousRenderResult,
      renderResult,
    });
  }

  handlePropDifference(scope, propName, propValues) {
  }

  handleElementRenderResult(scope) {
    let {
      previousRenderResult,
      renderResult,
    } = scope;

    let propDiff = Utils.propsDiffer(previousRenderResult.props, renderResult.props);
    if (propDiff) {
      let keys = Object.keys(propDiff);
      for (let i = 0, il = keys.length; i < il; i++) {
        let key   = keys[i];
        let value = propDiff[key];

        this.handlePropDifference(scope, key, value);
      }
    }

    console.log(propDiff);
  }

  handleTermRenderResult({ previousRenderResult, renderResult }) {
    let propDiff = Utils.propsDiffer(previousRenderResult.props, renderResult.props);
    console.log(propDiff);
  }

  handleComponentRenderResult({ previousRenderResult, renderResult }) {
    let propDiff = Utils.propsDiffer(previousRenderResult.props, renderResult.props);
    console.log(propDiff);
  }

  handleRenderResult(scope) {
    let { renderResult } = scope;

    if (renderResult.type === TYPE_ELEMENT)
      return this.handleElementRenderResult(scope);
    else if (renderResult.type === TYPE_TERM)
      return this.handleElementRenderResult(scope);
    else if (renderResult.type === TYPE_COMPONENT)
      return this.handleComponentRenderResult(scope);
  }
}
