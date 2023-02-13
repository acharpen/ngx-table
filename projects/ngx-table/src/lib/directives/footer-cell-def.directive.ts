import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[footerCellDef]' })
export class FooterCellDef {
  public constructor(public template: TemplateRef<unknown>) {}
}
