import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[cellDef]' })
export class CellDef {
  public constructor(public template: TemplateRef<unknown>) {}
}
