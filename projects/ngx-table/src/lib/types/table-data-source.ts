export type TableDataSource<T> = {
  data: T[];
  rowHeight: number | { condensed: number; regular: number; relaxed: number };
  visibleRowsCount: number;

  globalFilterPaths?: string[];
  selectable?: boolean | number;
  selectableCheck?: (item: T) => boolean;
  selectableRollingSelection?: boolean;
  showColumnsSettings?: boolean;
  showGlobalFilter?: boolean;
  sortingData?: (sortHeaderId: string) => (a: T, b: T) => number;
};
