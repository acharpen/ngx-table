import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ColumnContextMenuComponent } from './components/column-context-menu/column-context-menu.component';
import { ColumnsSettingsComponent } from './components/columns-settings/columns-settings.component';
import { GlobalFilterComponent } from './components/global-filter/global-filter.component';
import { RowContextMenuComponent } from './components/row-context-menu/row-context-menu.component';
import { TableBlockingOverlayComponent } from './components/table-blocking-overlay/table-blocking-overlay.component';
import { CellDef } from './directives/cell-def.directive';
import { ColumnDef } from './directives/column-def.directive';
import { FooterCellDef } from './directives/footer-cell-def.directive';
import { HeaderCellDef } from './directives/header-cell-def.directive';
import { ColumnResize } from './directives/column-resize.directive';
import { TableTemplate } from './directives/table-template.directive';
import { NgxTableComponent } from './ngx-table.component';
import { TableService } from './table.service';

const EXPORTED_DECLARATIONS = [CellDef, ColumnDef, FooterCellDef, HeaderCellDef, NgxTableComponent, TableTemplate];

@NgModule({
  declarations: [
    ...EXPORTED_DECLARATIONS,
    ColumnContextMenuComponent,
    ColumnResize,
    ColumnsSettingsComponent,
    GlobalFilterComponent,
    RowContextMenuComponent,
    TableBlockingOverlayComponent
  ],
  exports: EXPORTED_DECLARATIONS,
  imports: [CommonModule, DragDropModule, OverlayModule, PortalModule, ReactiveFormsModule],
  providers: [TableService]
})
export class NgxTableModule {}
