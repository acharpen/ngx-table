# ngx-table

ngx-table is an opinionated table for Angular ecosystem.

Simple example using ngx-table: [ngx-table-demo](https://github.com/acharpen/ngx-table-demo)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
  - [Caption](#caption)
  - [Summary](#summary)
  - [Controls](#controls)
  - [Row context menu](#row-context-menu)
  - [Row quick action](#row-quick-action)
  - [Empty](#empty)
  - [Empty filter](#empty-filter)
- [API](#api)
  - [Directives](#directives)
  - [Classes](#classes)
- [Theming](#theming)

## Installation

```sh
npm install @oorg/ngx-table --save
```

Note that `@angular/cdk` is required.

```sh
npm install @angular/cdk --save
```

## Usage

1. [Import](https://material.angular.io/cdk/overlay/overview#initial-setup) the CDK overlays prebuilt styles in your global stylesheet.
2. Import a theme for ngx-table in your global stylesheet. You can use an existing theme or create your own.

```scss
@import "~@oorg/ngx-table/resources/_theme.scss";
```

3. Import the `NgxTableModule`.
4. Create a data source object:

```typescript
dataSource { data: [], rowHeight: 48, visibleRowsCount: 10 };
```

5. Create the markup with the columns definition:

```html
<oo-ngx-list-table [dataSource]="dataSource">
  <ng-container columnDef="col1" align="left">
    <ng-container *cellDef="let element"></ng-container>
  </ng-container>

  <ng-container columnDef="col2" align="left">
    <ng-container *cellDef="let element"></ng-container>
  </ng-container>
</oo-ngx-list-table>
```

6. Provide the translations for the current locale:

```typescript
tableConfig.setTranslation({
  [...]
});
```

## Features

### Caption

Caption is not affected by horizontal scrolling.

```html
<ng-template tableTemplate="caption"></ng-template>
```

#### Bindings

- `selection`: the list of selected rows

### Summary

Summary is not affected by horizontal scrolling.

```html
<ng-template tableTemplate="summary"></ng-template>
```

#### Bindings

- `selection`: the list of selected rows

### Controls

Controls are inserted in the toolbar (which is below the caption).

```html
<ng-template tableTemplate="controls"></ng-template>
```

#### Bindings

- `selection`: the list of selected rows

### Row context menu

When defined, a column is inserted at the end of each row. It contains a button to open a menu with the given list of actions.

```html
<ng-template tableTemplate="rowContextMenu" let-overlay>
  <li class="oo-table-menu-item" (click)="overlay.hide()">First action</li>
</ng-template>
```

#### Bindings

- `$implicit`: the row data
- `overlay`: handler to close the context menu

### Row quick action

When defined, a column is inserted at the end of each row (or just before the row context menu if it's defined).

```html
<ng-template tableTemplate="rowQuickAction"></ng-template>
```

#### Bindings

- `$implicit`: the row data

### Empty

When there is no data, `empty` template can be used to display a message.

```html
<ng-template tableTemplate="empty"></ng-template>
```

### Empty filter

When filter produces no results, `emptyFilter` template can be used to display a message.

```html
<ng-template tableTemplate="emptyFilter"></ng-template>
```

## API

### Directives

#### ColumnDef

Column definition for the ngx-table. Defines a set of cells available for a table column.

Selector: `[columnDef]`

##### Properties

- `@Input('columnDef') name: string`: unique name for this column.
- `@Input() align: 'center' | 'left' | 'right'`: alignment of the cell content.
- `@Input() pinned: 'left' | 'right' | null`: whether sticky positioning should be applied. Default value is `null`.
- `@Input() resizable: boolean`: whether the column can be resized. Default value is `false`.
- `@Input() sortable: boolean`: whether the column can be sorted. Default value is `false`.
- `@Input() visible: boolean`: whether the column is visible. Default value is `true`.
- `@Input() width : string | null`: initial width of the column; supported units are: `px`, `rem` and `%`. Default value is `null`.

#### CellDef

Cell definition for the ngx-table. Captures the template of a column's data row cell.

Selector: `[cellDef]`

#### HeaderCellDef

Header cell definition for the ngx-table. Captures the template of a column's header cell.

Selector: `[headerCellDef]`

#### FooterCellDef

Footer cell definition for the ngx-table. Captures the template of a column's footer cell.

Selector: `[footerCellDef]`

### Classes

#### NgxTableComponent

##### Properties

- `@Input() dataSource: TableDataSource<T>`: the table's source of data.
- `@Input() selection: T[]`: selected rows.
- `@Output() selectionChange: EventEmitter<T[]>`: emits when selection is changed.
- `@Output() rowSelected: EventEmitter<T[]>`: emits when rows are selected.
- `@Output() rowUnselected: EventEmitter<T[]>`: emits when rows are unselected.

##### Methods

- `filter`
  - Parameters:
    - `filterData: ((item: T) => boolean) | string`
- `sort`
  - Parameters:
    - `columnName: string`
    - `sortOrder: 'asc' | 'desc' | null`

#### TableDataSource

##### Properties

- `data: T[]`: data array; each object represents one table row.
- `rowHeight: number | { condensed: number; regular: number; relaxed: number }`: if an object is provided, row height customization will be accessible through column settings.
- `visibleRowsCount: number`: the number of visible rows.
- `globalFilterPaths?: string[]`: an array of paths to use in global filtering.
- `selectable?: boolean | number`:
  - `false`: selectable rows are disabled.
  - `true`: selectable rows are enabled, all rows can be selected.
  - `number`: this sets the maximum number of rows that can be selected.
- `selectableCheck?: (item: T) => boolean`: whether the given row can be selected.
- `selectableRollingSelection?: boolean`: whether to allow the selection of new rows once the limit is reached. When true: if you set the selectable option to a numeric value then when you select past this number of rows, the first selected row will be deselected.
- `showColumnsSettings?: boolean`: whether to enable columns customization.
- `showGlobalFilter?: boolean`: whether to enable global filter.
- `sortingData?: (sortHeaderId: string) => (a: T, b: T) => number`: sorting function.

## Theming

ngx-table can be customized through the following css variables:

- `--oo-table-color-bg-primary`
- `--oo-table-color-bg-secondary`
- `--oo-table-color-border-primary`
- `--oo-table-color-border-secondary`
- `--oo-table-color-btn`
- `--oo-table-color-btn--hover`
- `--oo-table-color-row--hover`
- `--oo-table-color-scrollbar`
- `--oo-table-color-scrollbar-thumb`
- `--oo-table-color-text-link`
- `--oo-table-color-text-primary`
