import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgxTableConfig } from '../../ngx-table-config.service';
import { TableService } from '../../table.service';

@Component({
  selector: 'oo-ngx-table-global-filter',
  templateUrl: './global-filter.component.html'
})
export class GlobalFilterComponent {
  public form: FormGroup;

  public searchLabel: string;

  public constructor(
    tableConfig: NgxTableConfig,
    public tableService: TableService,
    private readonly _formBuilder: FormBuilder
  ) {
    this.form = this._formBuilder.group({ searchText: '' });

    this.searchLabel = tableConfig.getTranslation('search');
  }
}
