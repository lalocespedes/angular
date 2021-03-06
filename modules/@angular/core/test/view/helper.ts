/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {RootRenderer} from '@angular/core';
import {checkNodeDynamic, checkNodeInline} from '@angular/core/src/view/index';
import {TestBed} from '@angular/core/testing';
import {getDOM} from '@angular/platform-browser/src/dom/dom_adapter';

export function isBrowser() {
  return getDOM().supportsDOMEvents();
}

export function setupAndCheckRenderer(config: {directDom: boolean}) {
  let rootRenderer: any;
  if (config.directDom) {
    beforeEach(() => {
      rootRenderer = <any>{
        renderComponent: jasmine.createSpy('renderComponent')
                             .and.throwError('Renderer should not have been called!')
      };
      TestBed.configureTestingModule(
          {providers: [{provide: RootRenderer, useValue: rootRenderer}]});
    });
    afterEach(() => { expect(rootRenderer.renderComponent).not.toHaveBeenCalled(); });
  } else {
    beforeEach(() => {
      rootRenderer = TestBed.get(RootRenderer);
      spyOn(rootRenderer, 'renderComponent').and.callThrough();
    });
    afterEach(() => { expect(rootRenderer.renderComponent).toHaveBeenCalled(); });
  }
}

export enum InlineDynamic {
  Inline,
  Dynamic
}

export const INLINE_DYNAMIC_VALUES = [InlineDynamic.Inline, InlineDynamic.Dynamic];

export function checkNodeInlineOrDynamic(inlineDynamic: InlineDynamic, values: any[]): any {
  switch (inlineDynamic) {
    case InlineDynamic.Inline:
      return (<any>checkNodeInline)(...values);
    case InlineDynamic.Dynamic:
      return checkNodeDynamic(values);
  }
}
