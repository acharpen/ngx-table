import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({ selector: '[tableTemplate]' })
export class TableTemplate {
  @Input('tableTemplate') public name!:
    | 'caption'
    | 'controls'
    | 'empty'
    | 'emptyFilter'
    | 'rowContextMenu'
    | 'rowQuickAction'
    | 'summary';

  public constructor(public template: TemplateRef<unknown>) {}
}
