import { Component, EventEmitter, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'oo-ngx-table-row-context-menu',
  templateUrl: './row-context-menu.component.html'
})
export class RowContextMenuComponent<T> {
  @Output() public contextMenuClose: EventEmitter<void>;

  public item!: T;
  public template!: TemplateRef<unknown>;

  public handler: { hide: () => void };

  public constructor() {
    this.contextMenuClose = new EventEmitter<void>();

    this.handler = {
      hide: () => {
        this.contextMenuClose.emit();
      }
    };
  }
}
