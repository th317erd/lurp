import * as Utils         from './utils.js';
import { ensureEntities } from './entity.js';

import {
  RenderCommand,
  Renderer,
} from './render.js';

export class HTMLRenderCommand extends RenderCommand {
  constructor(type, _options) {
    let options = {
      ...(_options || {}),
      type,
    };

    super(options);
  }
}

export class HTMLRenderer extends Renderer {
  constructor() {
    super();
  }
}
