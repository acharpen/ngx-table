import { Injectable } from '@angular/core';

import { Translation } from './types/translation';

@Injectable({ providedIn: 'root' })
export class NgxTableConfig {
  private _columnMinWidth = 100;

  private _searchDebounceTime = 250;

  private _translation: Translation = {
    cancel: 'Cancel',
    customizeColumns: 'Customize columns',
    emptyFilterMessage: 'No results found',
    emptyMessage: 'No results found',
    save: 'Save',
    search: 'Search'
  };

  // ////////////////////////////////////////////////////////////////////////////

  public getColumnMinWidth(): number {
    return this._columnMinWidth;
  }

  public getSearchDebounceTime(): number {
    return this._searchDebounceTime;
  }

  public getTranslation(key: keyof Translation): string {
    return this._translation[key];
  }

  public setColumnMinWidth(columnMinWidth: number): void {
    this._columnMinWidth = columnMinWidth;
  }

  public setSearchDebounceTime(searchDebounceTime: number): void {
    this._searchDebounceTime = searchDebounceTime;
  }

  public setTranslation(value: Partial<Translation>): void {
    this._translation = { ...this._translation, ...value };
  }
}
