import { Component, EventEmitter, Output } from '@angular/core';

import { NgxTableConfig } from '../../ngx-table-config.service';
import { TableService } from '../../table.service';

@Component({
  selector: 'oo-ngx-table-column-context-menu',
  templateUrl: './column-context-menu.component.html'
})
export class ColumnContextMenuComponent {
  @Output() public columnsSettingsOpen: EventEmitter<void>;
  @Output() public rowHeightChange: EventEmitter<number>;

  public currRowHeight!: number;
  public rowHeights!: { condensed: number; regular: number; relaxed: number };
  public showColumnsSettings!: boolean;
  public showRowHeight!: boolean;

  public customizeColumnsLabel: string;

  public constructor(tableConfig: NgxTableConfig, public tableService: TableService) {
    this.columnsSettingsOpen = new EventEmitter<void>();
    this.rowHeightChange = new EventEmitter<number>();

    this.customizeColumnsLabel = tableConfig.getTranslation('customizeColumns');
  }
}
