import { ContentChild, Directive, Input } from '@angular/core';

import { ColumnService } from '../column.service';

import { CellDef } from './cell-def.directive';
import { FooterCellDef } from './footer-cell-def.directive';
import { HeaderCellDef } from './header-cell-def.directive';

@Directive({ selector: '[columnDef]' })
export class ColumnDef {
  public static readonly NAME_PREFIX: string = 'oo-table-column--';

  @ContentChild(CellDef) public cell!: CellDef;
  @ContentChild(FooterCellDef) public footerCell: FooterCellDef | null;
  @ContentChild(HeaderCellDef) public headerCell: HeaderCellDef | null;

  @Input()
  public get align(): 'center' | 'left' | 'right' {
    return this._align;
  }
  public set align(value: 'center' | 'left' | 'right') {
    if (value !== this._align) {
      this._align = value;

      this.updateCssClassName();
    }
  }

  @Input()
  public get pinned(): 'left' | 'right' | null {
    return this._pinned;
  }
  public set pinned(value: 'left' | 'right' | null) {
    if (value !== this._pinned) {
      this._pinned = value;

      this.updateCssClassName();

      this._columnService.markForCheck(this.name, 'pinned');
    }
  }

  @Input()
  public get sortable(): boolean {
    return this._sortable;
  }
  public set sortable(value: boolean) {
    if (value !== this._sortable) {
      this._sortable = value;

      this.updateCssClassName();
    }
  }

  @Input()
  public get visible(): boolean {
    return this._visible;
  }
  public set visible(value: boolean) {
    if (value !== this._visible) {
      this._visible = value;

      this._columnService.markForCheck(this.name, 'visible');
    }
  }

  @Input()
  public get width(): string | null {
    return this._width;
  }
  public set width(value: string | null) {
    if (value !== this._width) {
      this._width = value;

      this._columnService.markForCheck(this.name, 'width');
    }
  }

  @Input('columnDef') public name!: string;
  @Input() public resizable: boolean;

  public cssClassName: string[];
  public leftPx: string | null;
  public position!: number;
  public rightPx: string | null;
  public sortOrder: 'asc' | 'desc' | null;
  public widthPx!: string;

  private _align!: 'center' | 'left' | 'right';
  private _pinned: 'left' | 'right' | null;
  private _sortable: boolean;
  private _visible: boolean;
  private _width: string | null;

  public constructor(private readonly _columnService: ColumnService) {
    this.footerCell = null;
    this.headerCell = null;

    this.resizable = false;

    this.cssClassName = [];
    this.leftPx = null;
    this.rightPx = null;
    this.sortOrder = null;

    this._pinned = null;
    this._sortable = false;
    this._visible = true;
    this._width = null;
  }

  // ////////////////////////////////////////////////////////////////////////////

  public setVisible(visible: boolean): void {
    this._visible = visible;
  }

  public updateCssClassName(): void {
    this.cssClassName = [];

    this.cssClassName.push(`${ColumnDef.NAME_PREFIX}${this.name}`);

    if (this.align === 'center') {
      this.cssClassName.push('oo-table-text-center');
    } else if (this.align === 'left') {
      this.cssClassName.push('oo-table-text-left');
    } else {
      this.cssClassName.push('oo-table-text-right');
    }

    if (this.pinned != null) {
      this.cssClassName.push('oo-table-sticky');
    }

    if (this.sortable) {
      this.cssClassName.push('oo-table-sortable');
    }
  }
}
