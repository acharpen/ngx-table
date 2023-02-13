import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ColumnService {
  public columnDefChanged$: Observable<{ columnName: string; property: 'pinned' | 'visible' | 'width' }>;

  private readonly _columnDefChangedSource: Subject<{ columnName: string; property: 'pinned' | 'visible' | 'width' }>;

  public constructor() {
    this._columnDefChangedSource = new Subject<{ columnName: string; property: 'pinned' | 'visible' | 'width' }>();

    this.columnDefChanged$ = this._columnDefChangedSource.asObservable();
  }

  // ////////////////////////////////////////////////////////////////////////////

  public markForCheck(columnName: string, property: 'pinned' | 'visible' | 'width'): void {
    this._columnDefChangedSource.next({ columnName, property });
  }
}
