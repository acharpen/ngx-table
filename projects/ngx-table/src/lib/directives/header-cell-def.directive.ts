import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[headerCellDef]' })
export class HeaderCellDef {
  public constructor(public template: TemplateRef<unknown>) {}
}
