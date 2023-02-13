import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { NgxTableConfig } from '../../ngx-table-config.service';
import { TableService } from '../../table.service';

@Component({
  selector: 'oo-ngx-table-columns-settings',
  styles: [':host { margin: auto; }'],
  templateUrl: './columns-settings.component.html'
})
export class ColumnsSettingsComponent implements OnInit {
  @Output() public columnsChange: EventEmitter<{ name: string; visible: boolean }[]>;
  @Output() public dialogClose: EventEmitter<void>;

  public columns!: { name: string; visible: boolean }[];

  public visibleColumnsCount!: number;

  public cancelLabel: string;
  public customizeColumnsLabel: string;
  public saveLabel: string;

  public constructor(tableConfig: NgxTableConfig, public tableService: TableService) {
    this.columnsChange = new EventEmitter<{ name: string; visible: boolean }[]>();
    this.dialogClose = new EventEmitter<void>();

    this.cancelLabel = tableConfig.getTranslation('cancel');
    this.customizeColumnsLabel = tableConfig.getTranslation('customizeColumns');
    this.saveLabel = tableConfig.getTranslation('save');
  }

  // ////////////////////////////////////////////////////////////////////////////

  public ngOnInit(): void {
    this.visibleColumnsCount = this._computeVisibleColumnsCount();
  }

  // ////////////////////////////////////////////////////////////////////////////

  public drop(event: CdkDragDrop<unknown>): void {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  public toggleColumn(column: { visible: boolean }): void {
    column.visible = !column.visible;

    this.visibleColumnsCount = this._computeVisibleColumnsCount();
  }

  // ////////////////////////////////////////////////////////////////////////////

  private _computeVisibleColumnsCount(): number {
    return this.columns.filter((column) => column.visible).length;
  }
}
