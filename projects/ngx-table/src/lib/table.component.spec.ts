import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxTableComponent } from './ngx-table.component';

describe('NgxTableComponent', () => {
  let component: NgxTableComponent<unknown>;
  let fixture: ComponentFixture<NgxTableComponent<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgxTableComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
