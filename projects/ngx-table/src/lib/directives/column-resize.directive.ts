import { Directive, OnInit, Renderer2, Input, ElementRef } from '@angular/core';

import { NgxTableConfig } from '../ngx-table-config.service';
import { TableService } from '../table.service';

import { ColumnDef } from './column-def.directive';

@Directive({ selector: '[columnResize]' })
export class ColumnResize implements OnInit {
  @Input() public column!: ColumnDef;

  public constructor(
    private readonly _elementRef: ElementRef<HTMLElement>,
    private readonly _tableConfig: NgxTableConfig,
    private readonly _tableService: TableService,
    private readonly _renderer: Renderer2
  ) {}

  // ////////////////////////////////////////////////////////////////////////////

  public ngOnInit(): void {
    const resizeHandleElt = this._elementRef.nativeElement;
    const cellElt = this._renderer.parentNode(resizeHandleElt) as HTMLElement;
    let isResizing = false;
    let startWidth: number;
    let startX: number;

    const onMouseDown = (event: MouseEvent): void => {
      isResizing = true;

      startWidth = cellElt.offsetWidth;
      startX = event.pageX;
    };

    const onMouseMove = (event: MouseEvent): void => {
      if (isResizing) {
        const newWidth = Math.max(startWidth + (event.pageX - startX), this._tableConfig.getColumnMinWidth());
        this.column.widthPx = `${newWidth}px`;

        this._tableService.resizeColumn(this.column);
      }
    };

    const onMouseUp = (): void => {
      isResizing = false;

      this._tableService.onColumnResizeEnd();
    };

    this._renderer.listen(resizeHandleElt, 'mousedown', onMouseDown);
    this._renderer.listen('document', 'mousemove', onMouseMove);
    this._renderer.listen('document', 'mouseup', onMouseUp);
  }
}
