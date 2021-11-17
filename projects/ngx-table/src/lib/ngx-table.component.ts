import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { _CoalescedStyleScheduler, _COALESCED_STYLE_SCHEDULER } from '@angular/cdk/table';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { ColumnService } from './column.service';
import { ColumnContextMenuComponent } from './components/column-context-menu/column-context-menu.component';
import { ColumnsSettingsComponent } from './components/columns-settings/columns-settings.component';
import { RowContextMenuComponent } from './components/row-context-menu/row-context-menu.component';
import { TableBlockingOverlayComponent } from './components/table-blocking-overlay/table-blocking-overlay.component';
import { ColumnDef } from './directives/column-def.directive';
import { TableTemplate } from './directives/table-template.directive';
import { NgxTableConfig } from './ngx-table-config.service';
import { TableService } from './table.service';
import { Node } from './types/node';
import { TableDataSource } from './types/table-data-source';
import { ObjectUtils } from './utils/object-utils';

@Component({
  providers: [{ provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler }, ColumnService],
  selector: 'oo-ngx-list-table[dataSource]',
  styleUrls: ['./table.component.scss'],
  templateUrl: './table.component.html'
})
export class NgxTableComponent<T> implements AfterContentInit, AfterViewInit, OnChanges, OnDestroy {
  @Input()
  public get dataSource(): TableDataSource<T> {
    return this._dataSource;
  }
  public set dataSource(value: TableDataSource<T>) {
    this._updateDataSource(value);
  }

  @Input() public selection: T[];
  @Output() public selectionChange: EventEmitter<T[]>;

  @Output() public rowSelected: EventEmitter<T[]>;
  @Output() public rowUnselected: EventEmitter<T[]>;

  @ContentChildren(ColumnDef)
  public set contentColumns(value: QueryList<ColumnDef>) {
    this._columnsSrc = value.toArray();

    this.columns = this._columnsSrc.filter((columnSrc) => columnSrc.visible);
  }

  @ContentChildren(TableTemplate) public templates!: QueryList<TableTemplate>;
  @ViewChildren('tableBodyRows') public tableBodyRowElts!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('caption', { static: false }) public captionElt!: ElementRef<HTMLElement> | null;
  @ViewChild('content', { static: true }) public contentElt!: ElementRef<HTMLElement>;
  @ViewChild('summary', { static: false }) public summaryElt!: ElementRef<HTMLElement> | null;
  @ViewChild('table', { static: true }) public tableElt!: ElementRef<HTMLElement>;
  @ViewChild('tableBody', { static: true }) public tableBodyElt!: ElementRef<HTMLElement>;
  @ViewChild('tableFooter', { static: false }) public tableFooterElt!: ElementRef<HTMLElement> | null;
  @ViewChild('tableFooterRow', { static: false }) public tableFooterRowElt!: ElementRef<HTMLElement> | null;
  @ViewChild('tableHeader', { static: true }) public tableHeaderElt!: ElementRef<HTMLElement>;
  @ViewChild('tableHeaderRow', { static: true }) public tableHeaderRowElt!: ElementRef<HTMLElement>;
  @ViewChild('toolbar', { static: false }) public toolbarElt!: ElementRef<HTMLElement> | null;
  @ViewChild('viewport', { static: true }) public viewportElt!: ElementRef<HTMLElement>;

  public captionTemplate: TemplateRef<unknown> | null;
  public controlsTemplate: TemplateRef<unknown> | null;
  public emptyFilterTemplate: TemplateRef<unknown> | null;
  public emptyTemplate: TemplateRef<unknown> | null;
  public rowContextMenuTemplate: TemplateRef<unknown> | null;
  public rowQuickActionTemplate: TemplateRef<unknown> | null;
  public summaryTemplate: TemplateRef<unknown> | null;

  public columnContextMenuOverlayData: { columnName: string; overlayRef: OverlayRef } | null;
  public columns: ColumnDef[];
  public hasFooterRow: boolean;
  public isMultiSelectionMode: boolean;
  public isSingleSelectionMode: boolean;
  public nodes: Node<T>[];
  public rowContextMenuOverlayData: { nodeId: number; overlayRef: OverlayRef } | null;
  public rowHeightPx!: string;
  public showColumnContextMenu: boolean;
  public visibleNodes: Node<T>[];

  public emptyFilterMessagelabel: string;
  public emptyMessagelabel: string;

  private readonly _unsubscribe: Subject<void>;

  private _activeNodeIndexes: number[];
  private _columnsSrc: ColumnDef[];
  private _counter: number;
  private _currFilter: { filterPredicate?: (item: T, index?: number) => boolean; filterText?: string } | null;
  private _currSort: { column: ColumnDef; sortOrder: 'asc' | 'desc' } | null;
  private _currStartNode: number | null;
  private _dataSource!: TableDataSource<T>;
  private _isInitialized: boolean;
  private _preventSelectionSetterPropagation: boolean;
  private _rowHeight!: number;
  private _scrollListener!: () => void;
  private _selectedNodes: Node<T>[];

  public constructor(
    @Inject(_COALESCED_STYLE_SCHEDULER) private readonly _coalescedStyleScheduler: _CoalescedStyleScheduler,
    private readonly _columnService: ColumnService,
    private readonly _elementRef: ElementRef<HTMLElement>,
    private readonly _overlay: Overlay,
    private readonly _renderer2: Renderer2,
    private readonly _tableConfig: NgxTableConfig,
    private readonly _tableService: TableService
  ) {
    this.selection = [];
    this.selectionChange = new EventEmitter<T[]>();

    this.rowSelected = new EventEmitter<T[]>();
    this.rowUnselected = new EventEmitter<T[]>();

    this.captionTemplate = null;
    this.controlsTemplate = null;
    this.emptyFilterTemplate = null;
    this.emptyTemplate = null;
    this.rowContextMenuTemplate = null;
    this.rowQuickActionTemplate = null;
    this.summaryTemplate = null;

    this.columnContextMenuOverlayData = null;
    this.columns = [];
    this.hasFooterRow = false;
    this.isMultiSelectionMode = false;
    this.isSingleSelectionMode = false;
    this.nodes = [];
    this.rowContextMenuOverlayData = null;
    this.showColumnContextMenu = false;
    this.visibleNodes = [];

    this.emptyFilterMessagelabel = this._tableConfig.getTranslation('emptyFilterMessage');
    this.emptyMessagelabel = this._tableConfig.getTranslation('emptyMessage');

    this._unsubscribe = new Subject<void>();

    this._activeNodeIndexes = [];
    this._columnsSrc = [];
    this._counter = 0;
    this._currFilter = null;
    this._currSort = null;
    this._currStartNode = null;
    this._isInitialized = false;
    this._preventSelectionSetterPropagation = false;
    this._selectedNodes = [];

    this._registerColumnServiceEvents();
    this._registerTableServiceEvents();
  }

  // ////////////////////////////////////////////////////////////////////////////

  public ngOnChanges(changes: SimpleChanges): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (changes.selection != null) {
      if (!this._preventSelectionSetterPropagation) {
        if (this._isInitialized) {
          this._runBlockingAction(() => {
            this._unselectAllNodes();

            this._selectNodes(this._getNodesFromSelection(changes.selection.currentValue as T[]));

            this._updateVisibleNodes();
            this._updateTableHeaderSelectionIndicator();
          });
        } else {
          this._unselectAllNodes();

          this._selectNodes(this._getNodesFromSelection(changes.selection.currentValue as T[]));
        }
      }

      this._preventSelectionSetterPropagation = false;
    }
  }

  public ngAfterContentInit(): void {
    this.hasFooterRow = this.columns.some((column) => column.footerCell != null);

    this.templates.forEach((item) => {
      switch (item.name) {
        case 'caption': {
          this.captionTemplate = item.template;
          break;
        }

        case 'controls': {
          this.controlsTemplate = item.template;
          break;
        }

        case 'empty': {
          this.emptyTemplate = item.template;
          break;
        }

        case 'emptyFilter': {
          this.emptyFilterTemplate = item.template;
          break;
        }

        case 'rowContextMenu': {
          this.rowContextMenuTemplate = item.template;
          this.tableBodyElt.nativeElement.classList.add('oo-table-with-row-context-menu');
          break;
        }

        case 'rowQuickAction': {
          this.rowQuickActionTemplate = item.template;
          this.tableBodyElt.nativeElement.classList.add('oo-table-with-row-quick-action');
          break;
        }

        case 'summary': {
          this.summaryTemplate = item.template;
          break;
        }
      }
    });
  }

  public ngAfterViewInit(): void {
    this._scrollListener = this._renderer2.listen(this.tableElt.nativeElement, 'scroll', () => {
      this._updateVisibleNodes();
    });

    this._updateColumnsPosition();

    this._updateVisibleColumnsWidth();

    this._updateHiddenColumnsWidth();

    this._updateColumnsStickyPosition();

    this._coalescedStyleScheduler.schedule(() => {
      this._updateRowElts();
      this._updateTableElts();
      this._updateTableHeaderSelectionIndicator();
    });

    this._isInitialized = true;
  }

  public ngOnDestroy(): void {
    this._scrollListener();

    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  // ////////////////////////////////////////////////////////////////////////////

  public filter(filterData: ((item: T, index?: number) => boolean) | string): void {
    this._runBlockingAction(() => {
      this._currFilter =
        typeof filterData === 'string'
          ? { ...(this._currFilter ?? {}), filterText: filterData }
          : { ...(this._currFilter ?? {}), filterPredicate: filterData };

      this._updateNodes({ filter: true });
    });
  }

  public sort(columnName: string, sortOrder: 'asc' | 'desc' | null): void {
    const targetColumn = this.columns.find((column) => column.name === columnName);

    if (targetColumn?.sortable === true) {
      this._sort(targetColumn, sortOrder);
    }
  }

  // ////////////////////////////////////////////////////////////////////////////

  public onClickColumnContextMenu(event: MouseEvent, column: ColumnDef): void {
    event.stopPropagation();

    const eventTarget = event.target as HTMLElement;

    this.columnContextMenuOverlayData = {
      columnName: column.name,
      overlayRef: this._overlay.create({
        backdropClass: 'cdk-overlay-transparent-backdrop',
        hasBackdrop: true,
        positionStrategy: this._overlay
          .position()
          .flexibleConnectedTo(
            eventTarget.classList.contains('oo-table-menu-btn') ? eventTarget : eventTarget.parentElement!
          )
          .withPositions([{ originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }])
      })
    };

    this.columnContextMenuOverlayData.overlayRef.backdropClick().subscribe({
      next: () => {
        this._hideColumnContextMenu();
      }
    });

    const columnContextMenuRef = this.columnContextMenuOverlayData.overlayRef.attach(
      new ComponentPortal(ColumnContextMenuComponent)
    );

    columnContextMenuRef.instance.currRowHeight = this._rowHeight;
    columnContextMenuRef.instance.rowHeights = this.dataSource.rowHeight as {
      condensed: number;
      regular: number;
      relaxed: number;
    };
    columnContextMenuRef.instance.showColumnsSettings = this.dataSource.showColumnsSettings ?? false;
    columnContextMenuRef.instance.showRowHeight = typeof this.dataSource.rowHeight !== 'number';

    columnContextMenuRef.instance.columnsSettingsOpen.subscribe({
      next: () => {
        this._hideColumnContextMenu();

        this._openColumnsSettingsDialog();
      }
    });

    columnContextMenuRef.instance.rowHeightChange.subscribe({
      next: (rowHeight: number) => {
        this._hideColumnContextMenu();

        if (rowHeight !== this._rowHeight) {
          this._setRowHeight(rowHeight);

          this._updateNodes({ updateIndex: true });
        }
      }
    });
  }

  public onClickRowContextMenu(event: MouseEvent, node: Node<T>): void {
    event.stopPropagation();

    const eventTarget = event.target as HTMLElement;

    this.rowContextMenuOverlayData = {
      nodeId: node.id,
      overlayRef: this._overlay.create({
        backdropClass: 'cdk-overlay-transparent-backdrop',
        hasBackdrop: true,
        positionStrategy: this._overlay
          .position()
          .flexibleConnectedTo(
            eventTarget.classList.contains('oo-table-menu-btn') ? eventTarget : eventTarget.parentElement!
          )
          .withPositions([{ originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'top' }])
      })
    };
    this.rowContextMenuOverlayData.overlayRef.backdropClick().subscribe({
      next: () => {
        this._hideRowContextMenu();
      }
    });

    const rowContextMenuRef = this.rowContextMenuOverlayData.overlayRef.attach(
      new ComponentPortal(RowContextMenuComponent)
    );

    rowContextMenuRef.instance.item = node.value;
    rowContextMenuRef.instance.template = this.rowContextMenuTemplate!;

    rowContextMenuRef.instance.contextMenuClose.subscribe({
      next: () => {
        this._hideRowContextMenu();
      }
    });
  }

  public onClickTableBodyRow(node: Node<T>): void {
    this._preventSelectionSetterPropagation = true;

    const isUnselectMode = node.isSelected;

    if (isUnselectMode) {
      this._unselectNodes([node]);
    } else {
      this._selectNodes([node]);
    }

    this._updateTableHeaderSelectionIndicator();
    this._updateTableBodyRowsSelectionIndicator();

    this.selectionChange.emit(this._selectedNodes.map((selectedNode) => selectedNode.value));

    if (isUnselectMode) {
      this.rowUnselected.emit([node.value]);
    } else {
      this.rowSelected.emit([node.value]);
    }
  }

  public onClickTableHeaderCellContent(column: ColumnDef): void {
    if (column.sortable) {
      const sortOrder =
        this._currSort == null || this._currSort.column.name !== column.name
          ? ('asc' as const)
          : this._currSort.sortOrder === 'asc'
          ? ('desc' as const)
          : null;
      this._sort(column, sortOrder);
    }
  }

  public onClickTableHeaderCheckbox(): void {
    this._preventSelectionSetterPropagation = true;

    this._runBlockingAction(() => {
      const shouldUnselect = this._selectedNodes.length === this.nodes.length;

      if (shouldUnselect) {
        this._unselectAllNodes();
      } else {
        this._selectNodes(this.nodes);
      }

      this._updateTableHeaderSelectionIndicator();
      this._updateTableBodyRowsSelectionIndicator();

      this.selectionChange.emit(this._selectedNodes.map((selectedNode) => selectedNode.value));

      if (shouldUnselect) {
        this.rowUnselected.emit(this.nodes.map((node) => node.value));
      } else {
        this.rowSelected.emit(this.nodes.map((node) => node.value));
      }
    });
  }

  public onClickTableHeaderSortBtn(column: ColumnDef, sortOrder: 'asc' | 'desc'): void {
    this._sort(column, sortOrder);
  }

  // ////////////////////////////////////////////////////////////////////////////

  private _computeScrollbarAndTableBorderOffset(): number {
    const viewportHeight = this.dataSource.visibleRowsCount * this._rowHeight;
    const tableBodyHeight = viewportHeight + 4 * this._rowHeight;

    this.viewportElt.nativeElement.style.height = `${viewportHeight}px`;
    this.tableBodyElt.nativeElement.style.height = `${tableBodyHeight}px`;

    const offset = this.tableElt.nativeElement.offsetWidth - this.tableElt.nativeElement.clientWidth;

    this.viewportElt.nativeElement.style.height = '';
    this.tableBodyElt.nativeElement.style.height = '';

    return offset;
  }

  private _computeViewportHeight(): number {
    return Math.min(this._activeNodeIndexes.length, this.dataSource.visibleRowsCount) * this._rowHeight;
  }

  private _convertWidthToPxValue(width: string | null): number | null {
    const matches = width != null ? /^(\d+(?:.\d+)?)(px|rem|%)$/.exec(width) : null;

    if (matches == null) {
      return null;
    }
    if (matches[2] === '%') {
      return this._elementRef.nativeElement.offsetWidth * (Number(matches[1]) / 100);
    }
    if (matches[2] === 'rem') {
      return Number(matches[1]) * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    return Number(matches[1]);
  }

  private _getNodesFromSelection(selection: T[]): Node<T>[] {
    const nodeIds = new Set<number>();
    const nodes: Node<T>[] = [];
    selection.forEach((item) => {
      const matchingNode = this.nodes.find((node) => node.value === item);
      if (matchingNode != null && !nodeIds.has(matchingNode.id)) {
        nodeIds.add(matchingNode.id);
        nodes.push(matchingNode);
      }
    });

    return nodes;
  }

  private _handleFilter(): void {
    const hasFilterPredicate = this._currFilter?.filterPredicate != null;
    const hasFilterText = this._currFilter?.filterText != null && this._currFilter.filterText !== '';

    if (!hasFilterPredicate && !hasFilterText) {
      this.nodes.forEach((node) => (node.isMatching = true));
    } else {
      if (hasFilterPredicate) {
        this.nodes.forEach((node, i) => (node.isMatching = this._currFilter!.filterPredicate!(node.value, i)));
      }

      if (hasFilterText) {
        const globalFilterPaths = this.dataSource.globalFilterPaths ?? [];

        this.nodes.forEach((node) => {
          node.isMatching = globalFilterPaths.some((path) => {
            const value = ObjectUtils.get(node.value, path);

            return (
              (typeof value === 'number' || typeof value === 'string') &&
              value.toString().includes(this._currFilter!.filterText!)
            );
          });
        });
      }
    }
  }

  private _handleSort(): Node<T>[] {
    if (this._currSort == null) {
      return this.nodes.sort((a, b) => a.initialPos - b.initialPos);
    }

    const order = this._currSort.sortOrder === 'asc' ? 1 : -1;
    const sortingData = this.dataSource.sortingData?.(this._currSort.column.name);

    return this.nodes.sort((a, b) => (sortingData == null ? 0 : sortingData(a.value, b.value) * order));
  }

  private _hideColumnContextMenu(): void {
    this.columnContextMenuOverlayData?.overlayRef.dispose();
    this.columnContextMenuOverlayData = null;
  }

  private _hideRowContextMenu(): void {
    this.rowContextMenuOverlayData?.overlayRef.dispose();
    this.rowContextMenuOverlayData = null;
  }

  private _openColumnsSettingsDialog(): void {
    const overlayRef = this._overlay.create({
      backdropClass: 'cdk-overlay-transparent-backdrop',
      hasBackdrop: true,
      positionStrategy: this._overlay
        .position()
        .flexibleConnectedTo(this.tableElt)
        .withPositions([{ originX: 'center', originY: 'center', overlayX: 'center', overlayY: 'center' }])
    });

    overlayRef.backdropClick().subscribe({
      next: () => {
        overlayRef.dispose();
      }
    });

    const columnsSettingsRef = overlayRef.attach(new ComponentPortal(ColumnsSettingsComponent));

    columnsSettingsRef.instance.columns = this._columnsSrc.map((column) => ({
      name: column.name,
      visible: column.visible
    }));

    columnsSettingsRef.instance.columnsChange.subscribe({
      next: (updatedColumns: { name: string; visible: boolean }[]) => {
        overlayRef.dispose();

        this._toggleColumns(updatedColumns);
      }
    });

    columnsSettingsRef.instance.dialogClose.subscribe({
      next: () => {
        overlayRef.dispose();
      }
    });
  }

  private _registerColumnServiceEvents(): void {
    this._columnService.columnDefChanged$.pipe(takeUntil(this._unsubscribe)).subscribe({
      next: ({ columnName, property }) => {
        if (this._isInitialized) {
          const targetColumn = this._columnsSrc.find((column) => column.name === columnName)!;
          switch (property) {
            case 'pinned': {
              // Reset column values
              targetColumn.leftPx = null;
              targetColumn.rightPx = null;

              // Reset cell values
              const empty = (elt: HTMLElement): void => {
                elt.style.left = '';
                elt.style.right = '';
              };

              empty(this.tableHeaderRowElt.nativeElement.children.item(targetColumn.position) as HTMLElement);

              this.tableBodyRowElts.forEach((row) => {
                empty(row.nativeElement.children.item(targetColumn.position) as HTMLElement);
              });

              if (this.tableFooterRowElt != null) {
                empty(this.tableFooterRowElt.nativeElement.children.item(targetColumn.position) as HTMLElement);
              }

              // Compute new values
              this._updateColumnsStickyPosition();

              this._updateTableCellStickyPosition(targetColumn);
              break;
            }

            case 'visible': {
              this._toggleColumns(
                this._columnsSrc
                  .filter(
                    (columnSrc) =>
                      columnSrc.name === columnName || this.columns.some((column) => column.name === columnSrc.name)
                  )
                  .map((columnSrc) => (columnSrc.name === columnName ? targetColumn : columnSrc))
              );
              break;
            }

            case 'width': {
              this._setColumnWidthPx(targetColumn);

              this._updateColumnsStickyPosition();

              this._updateTableCellWidth(targetColumn);
              break;
            }
          }
        }
      }
    });
  }

  private _registerTableServiceEvents(): void {
    this._tableService.columnResized$.pipe(takeUntil(this._unsubscribe)).subscribe({
      next: () => {
        this._updateColumnsStickyPosition();

        this._coalescedStyleScheduler.schedule(() => {
          this.columns.forEach((column) => {
            this._updateTableCellStickyPosition(column);
          });
        });
      }
    });

    this._tableService.columnResizing$.pipe(takeUntil(this._unsubscribe)).subscribe({
      next: (column) => {
        this._coalescedStyleScheduler.schedule(() => {
          this._updateTableCellWidth(column);
        });
      }
    });

    this._tableService.globalFilterTextChanged$
      .pipe(
        debounceTime(this._tableConfig.getSearchDebounceTime()),
        distinctUntilChanged(),
        takeUntil(this._unsubscribe)
      )
      .subscribe({
        next: (searchText) => {
          this._runBlockingAction(() => {
            this._currFilter = { filterText: searchText };

            this._updateNodes({ filter: true });
          });
        }
      });
  }

  private _runBlockingAction(callback: () => void): void {
    // 1. Show overlay
    const overlayRef = this._overlay.create({
      backdropClass: 'oo-table-blocking',
      height: `${this.tableElt.nativeElement.offsetHeight}px`,
      positionStrategy: this._overlay
        .position()
        .flexibleConnectedTo(this.tableElt)
        .withPositions([{ originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'top' }]),
      width: `${this.tableElt.nativeElement.offsetWidth}px`
    });
    overlayRef.attach(new ComponentPortal(TableBlockingOverlayComponent));

    // 2. Run
    callback();

    // 3. Hide overlay
    overlayRef.dispose();
  }

  private _selectNodes(nodes: Node<T>[]): void {
    const get = (nodesToCheck: Node<T>[]): Node<T>[] => {
      const unselectedNodesToCheck = nodesToCheck.filter((node) => !node.isSelected);

      return this.dataSource.selectableCheck
        ? unselectedNodesToCheck.filter((node) => this.dataSource.selectableCheck!(node.value))
        : unselectedNodesToCheck;
    };
    const select = (node: Node<T>): void => {
      node.isSelected = true;
      this._selectedNodes.push(node);
    };

    if (this.dataSource.selectable === true) {
      get(nodes).forEach(select);
    } else {
      // I: the number of input nodes that can be selected according to 'selectableCheck' predicate
      // N: the number of selectable nodes as defined in table data source
      // S: the number of selected nodes
      // M: the number of nodes that can be selected; M = N - S

      const selectable = this.dataSource.selectable as number;

      if (nodes.length > 0) {
        const nodesToSelect = get(nodes);

        if (this.dataSource.selectableRollingSelection ?? false) {
          // A: the number of nodes to select; A <= N
          // Unselect the first (A - M) nodes and select A input nodes
          const selectingNodes = nodesToSelect.slice(Math.max(0, nodesToSelect.length - selectable));
          const unselectingNodesCount = Math.max(0, selectingNodes.length - (selectable - this._selectedNodes.length));

          this._unselectNodes(this._selectedNodes.slice(0, unselectingNodesCount));

          selectingNodes.forEach(select);
        } else {
          // B: the number of nodes to select; B = min(I, M)
          // Select the first B input nodes
          nodesToSelect
            .slice(0, Math.min(nodesToSelect.length, selectable - this._selectedNodes.length))
            .forEach(select);
        }
      }
    }
  }

  private _setColumnWidthPx(column: ColumnDef): void {
    const width = this._convertWidthToPxValue(column.width);
    column.widthPx = `${width ?? this._tableConfig.getColumnMinWidth()}px`;
  }

  private _setRowHeight(rowHeight: number): void {
    this._rowHeight = rowHeight;
    this.rowHeightPx = `${this._rowHeight}px`;
  }

  private _sort(column: ColumnDef, sortOrder: 'asc' | 'desc' | null): void {
    this._runBlockingAction(() => {
      if (this._currSort != null) {
        this._currSort.column.sortOrder = null;
      }

      this._currSort =
        sortOrder == null || (this._currSort?.column.name === column.name && this._currSort.sortOrder === sortOrder)
          ? null
          : { column, sortOrder };

      if (this._currSort != null) {
        this._currSort.column.sortOrder = sortOrder;
      }

      this._updateNodes({ sort: true });
    });
  }

  private _toggleColumns(updatedColumns: { name: string; visible: boolean }[]): void {
    // Save each column data
    this._columnsSrc = this._columnsSrc.map(
      (columnSrc) => this.columns.find((column) => column.name === columnSrc.name) ?? columnSrc
    );

    // Save new values of 'visible' property
    updatedColumns.forEach((updatedColumn) => {
      const targetColumnSrc = this._columnsSrc.find((columnSrc) => columnSrc.name === updatedColumn.name)!;
      targetColumnSrc.setVisible(updatedColumn.visible);
    });

    // Update visible columns based on incoming data
    this.columns = updatedColumns
      .filter((updatedColumn) => updatedColumn.visible)
      .map((updatedColumn) => this._columnsSrc.find((columnSrc) => columnSrc.name === updatedColumn.name)!);

    this._coalescedStyleScheduler.schedule(() => {
      this._updateColumnsPosition();

      this._updateColumnsStickyPosition();

      this.columns.forEach((column) => {
        this._updateTableCellStickyPosition(column);
        this._updateTableCellWidth(column);
      });
    });
  }

  private _unselectAllNodes(): void {
    this.nodes.forEach((node) => (node.isSelected = false));
    this._selectedNodes = [];
  }

  private _unselectNodes(nodes: Node<T>[]): void {
    const nodeIdSet = new Set<number>(nodes.map((node) => node.id));

    nodes.forEach((node) => (node.isSelected = false));
    this._selectedNodes = this._selectedNodes.filter((node) => !nodeIdSet.has(node.id));
  }

  private _updateActiveNodeIndexes(): void {
    this._activeNodeIndexes = [];

    this.nodes.forEach((node, i) => {
      if (node.isMatching) {
        this._activeNodeIndexes.push(i);
      }
    });
  }

  private _updateColumnsPosition(): void {
    for (let i = 0, len = this.tableHeaderRowElt.nativeElement.children.length; i < len; i++) {
      const node = this.tableHeaderRowElt.nativeElement.children.item(i);

      if (node != null) {
        const columnName = this._tableService.getColumnNameFromClassList(node.classList);
        const targetColumn = this.columns.find((column) => column.name === columnName);

        if (targetColumn != null) {
          targetColumn.position = i;
        }
      }
    }
  }

  private _updateColumnsStickyPosition(): void {
    const computeOffset = (start: number, len: number): number => {
      let offset = 0;
      for (let i = start; i < len; i++) {
        const prevNode = this.tableHeaderRowElt.nativeElement.children.item(i) as HTMLElement;

        if (prevNode.classList.contains('oo-table-sticky')) {
          const targetColumn = this.columns.find((column) => column.position === i);

          offset += targetColumn == null ? prevNode.offsetWidth : Number(targetColumn.widthPx.slice(0, -2));
        }
      }

      return offset;
    };

    for (let i = 0, len = this.tableHeaderRowElt.nativeElement.children.length; i < len; i++) {
      const targetColumn = this.columns.find((column) => column.position === i);

      if (targetColumn?.pinned != null) {
        if (targetColumn.pinned === 'left') {
          targetColumn.leftPx = `${computeOffset(0, i)}px`;
        } else {
          targetColumn.rightPx = `${computeOffset(i + 1, len)}px`;
        }
      }
    }
  }

  private _updateDataSource(dataSource: TableDataSource<T>): void {
    this._dataSource = dataSource;

    this.nodes = this.dataSource.data.map((item, i) => ({
      id: this._counter++,
      initialPos: i,
      isMatching: true,
      isSelected: false,
      value: item
    }));

    this.isMultiSelectionMode =
      this.dataSource.selectable === true || (this.dataSource.selectable != null && this.dataSource.selectable > 1);
    this.isSingleSelectionMode = this.dataSource.selectable === 1;
    this.showColumnContextMenu =
      typeof this.dataSource.rowHeight !== 'number' || (this.dataSource.showColumnsSettings ?? false);

    this._setRowHeight(
      typeof this.dataSource.rowHeight === 'number' ? this.dataSource.rowHeight : this.dataSource.rowHeight.regular
    );

    if (this._isInitialized) {
      this._unselectAllNodes();

      this._selectNodes(this._getNodesFromSelection(this.selection));

      this._updateTableHeaderSelectionIndicator();

      // Ensure `selection` is still valid after the changes; recalculating from `_selectedNodes`
      this._preventSelectionSetterPropagation = true;

      this.selectionChange.emit(this._selectedNodes.map((node) => node.value));
    }

    this._updateNodes({ filter: true, sort: true, updateIndex: true });
  }

  private _updateHiddenColumnsWidth(): void {
    this._columnsSrc
      .filter((column) => !column.visible)
      .forEach((column) => {
        this._setColumnWidthPx(column);
      });
  }

  private _updateNodes(options?: { filter?: boolean; sort?: boolean; updateIndex?: boolean }): void {
    if (options?.filter ?? false) {
      this._handleFilter();
    }
    if (options?.sort ?? false) {
      this.nodes = this._handleSort();
    }

    if (options?.filter ?? options?.updateIndex ?? false) {
      this._updateActiveNodeIndexes();

      if (this._isInitialized) {
        this._updateTableElts();
      }
    }

    this._updateVisibleNodes({ force: true });
  }

  private _updateRowElts(): void {
    // Cells
    this.columns.forEach((column) => {
      this._updateTableCellStickyPosition(column);
      this._updateTableCellWidth(column);
    });

    // Body rows
    this.tableBodyRowElts.forEach((row) => {
      row.nativeElement.style.height = this.rowHeightPx;
    });

    // Footer row
    if (this.tableFooterRowElt != null) {
      this.tableFooterRowElt.nativeElement.style.height = this.rowHeightPx;
    }

    this._updateTableBodyRowsSelectionIndicator();
  }

  private _updateTableBodyRowsSelectionIndicator(): void {
    if (this.isMultiSelectionMode || this.isSingleSelectionMode) {
      this.tableBodyRowElts.forEach((row, i) => {
        const node = this.visibleNodes[i];

        row.nativeElement.classList.remove('oo-table-unselectable');

        if (!this.visibleNodes[i].isSelected) {
          if (
            !(this.dataSource.selectableRollingSelection ?? false) &&
            typeof this.dataSource.selectable === 'number' &&
            this.dataSource.selectable === this._selectedNodes.length
          ) {
            row.nativeElement.classList.add('oo-table-unselectable');
          } else {
            const canSelect = this.dataSource.selectableCheck?.(node.value) ?? true;

            if (!canSelect) {
              row.nativeElement.classList.add('oo-table-unselectable');
            }
          }
        }
      });
    }
  }

  private _updateTableCellStickyPosition(column: ColumnDef): void {
    if (column.pinned != null) {
      const position = column.pinned;
      const value = column.pinned === 'left' ? column.leftPx! : column.rightPx!;

      // Header
      (this.tableHeaderRowElt.nativeElement.children.item(column.position) as HTMLElement).style[position] = value;

      // Body
      this.tableBodyRowElts.forEach((row) => {
        (row.nativeElement.children.item(column.position) as HTMLElement).style[position] = value;
      });

      // Footer
      if (this.tableFooterRowElt != null) {
        (this.tableFooterRowElt.nativeElement.children.item(column.position) as HTMLElement).style[position] = value;
      }
    }
  }

  private _updateTableCellWidth(column: ColumnDef): void {
    // Header
    (this.tableHeaderRowElt.nativeElement.children.item(column.position) as HTMLElement).style.width = column.widthPx;

    // Body
    this.tableBodyRowElts.forEach((row) => {
      (row.nativeElement.children.item(column.position) as HTMLElement).style.width = column.widthPx;
    });

    // Footer
    if (this.tableFooterRowElt != null) {
      (this.tableFooterRowElt.nativeElement.children.item(column.position) as HTMLElement).style.width = column.widthPx;
    }
  }

  private _updateTableElts(): void {
    const captionHeight = this.captionElt?.nativeElement.offsetHeight ?? 0;
    const globalFilterHeight = this.toolbarElt?.nativeElement.offsetHeight ?? 0;
    const summaryHeight = this.summaryElt?.nativeElement.offsetHeight ?? 0;
    const tableFooterHeight = this.hasFooterRow ? this._rowHeight : 0;
    const tableHeaderHeight = this.tableHeaderRowElt.nativeElement.offsetHeight;
    const viewportHeight = this._computeViewportHeight();

    const contentHeight = this._activeNodeIndexes.length * this._rowHeight + tableFooterHeight + summaryHeight;
    const tableHeaderTop = captionHeight + globalFilterHeight;
    const tableMinHeight = tableHeaderTop + tableHeaderHeight + tableFooterHeight + summaryHeight + this._rowHeight;
    const tableFooterTop = tableHeaderTop + tableHeaderHeight + viewportHeight;

    this.contentElt.nativeElement.style.height = `${contentHeight}px`;
    this.tableHeaderElt.nativeElement.style.top = `${tableHeaderTop}px`;
    this.tableElt.nativeElement.style.minHeight = `${tableMinHeight}px`;
    this.viewportElt.nativeElement.style.height = `${viewportHeight}px`;

    if (this.summaryElt != null) {
      this.summaryElt.nativeElement.style.top = `${tableFooterTop + tableFooterHeight}px`;
    }
    if (this.tableFooterElt != null) {
      this.tableFooterElt.nativeElement.style.top = `${tableFooterTop}px`;
    }
    if (this.toolbarElt != null) {
      this.toolbarElt.nativeElement.style.top = `${captionHeight}px`;
    }
  }

  private _updateTableHeaderSelectionIndicator(): void {
    const checkboxElt = this.tableHeaderRowElt.nativeElement.firstElementChild!.firstElementChild!;

    checkboxElt.classList.remove('oo-table-checkbox-checked', 'oo-table-checkbox-partially-checked');

    if (this.isMultiSelectionMode && this.nodes.length > 0) {
      const areAllRowsSelected = this._selectedNodes.length === this.nodes.length;
      const areSomeRowsSelected = !areAllRowsSelected && this._selectedNodes.length > 0;

      if (areAllRowsSelected) {
        checkboxElt.classList.add('oo-table-checkbox-checked');
      }
      if (areSomeRowsSelected) {
        checkboxElt.classList.add('oo-table-checkbox-partially-checked');
      }
    }
  }

  private _updateVisibleColumnsWidth(): void {
    let totalWidth = this._computeScrollbarAndTableBorderOffset();

    // Handle columns with explicit width
    for (let i = 0, len = this.tableHeaderRowElt.nativeElement.children.length; i < len; i++) {
      const node = this.tableHeaderRowElt.nativeElement.children.item(i);

      if (node != null) {
        const targetColumn = this.columns.find((column) => column.position === i);

        if (targetColumn == null) {
          totalWidth += node.clientWidth;
        } else {
          const width = this._convertWidthToPxValue(targetColumn.width);

          if (width == null) {
            targetColumn.width = null;
          } else {
            totalWidth += width;

            targetColumn.widthPx = `${width}px`;
          }
        }
      }
    }

    // Handle columns without explicit width
    const columns = this.columns.filter((column) => column.width == null);
    const columnsCount = columns.length;

    if (columnsCount > 0) {
      const remainingWidth = Math.max(this._elementRef.nativeElement.clientWidth - totalWidth, 0);
      const width = Math.max(remainingWidth / columnsCount, this._tableConfig.getColumnMinWidth());

      columns.forEach((column) => {
        column.widthPx = `${width}px`;
      });
    }
  }

  private _updateVisibleNodes({ force }: { force: boolean } = { force: false }): void {
    const nodePadding = 2;

    let startNode = Math.floor(this.tableElt.nativeElement.scrollTop / this._rowHeight) - nodePadding;
    startNode = Math.max(0, startNode);

    if (force || startNode !== this._currStartNode) {
      this._currStartNode = startNode;

      let visibleNodesCount = Math.ceil(this._computeViewportHeight() / this._rowHeight) + 2 * nodePadding;
      visibleNodesCount = Math.min(this._activeNodeIndexes.length - startNode, visibleNodesCount);

      const visibleNodes: Node<T>[] = [];
      for (let i = 0, len = visibleNodesCount; i < len; i++) {
        visibleNodes.push(this.nodes[this._activeNodeIndexes[i + startNode]]);
      }
      this.visibleNodes = visibleNodes;

      this._coalescedStyleScheduler.schedule(() => {
        this.tableBodyElt.nativeElement.style.transform = `translateY(${startNode * this._rowHeight}px)`;

        this._updateRowElts();
      });
    }
  }
}
