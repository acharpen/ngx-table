import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ColumnDef } from './directives/column-def.directive';

@Injectable()
export class TableService {
  public columnResized$: Observable<void>;
  public columnResizing$: Observable<ColumnDef>;
  public globalFilterTextChanged$: Observable<string>;

  private readonly _columnResizedSource: Subject<void>;
  private readonly _columnResizingSource: Subject<ColumnDef>;
  private readonly _globalFilterTextChangedSource: Subject<string>;

  public constructor() {
    this._columnResizedSource = new Subject<void>();
    this._columnResizingSource = new Subject<ColumnDef>();
    this._globalFilterTextChangedSource = new Subject<string>();

    this.columnResized$ = this._columnResizedSource.asObservable();
    this.columnResizing$ = this._columnResizingSource.asObservable();
    this.globalFilterTextChanged$ = this._globalFilterTextChangedSource.asObservable();
  }

  // ////////////////////////////////////////////////////////////////////////////

  public getColumnNameFromClassList(classList: DOMTokenList): string | null {
    for (let i = 0, len = classList.length; i < len; i++) {
      const className = classList[i];

      if (className.startsWith(ColumnDef.NAME_PREFIX)) {
        return className.substr(ColumnDef.NAME_PREFIX.length);
      }
    }

    return null;
  }

  public onColumnResizeEnd(): void {
    this._columnResizedSource.next();
  }

  public resizeColumn(column: ColumnDef): void {
    this._columnResizingSource.next(column);
  }

  public search(searchText: string): void {
    this._globalFilterTextChangedSource.next(searchText);
  }
}
