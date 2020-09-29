import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionSelectorModalPage } from './division-selector-modal.page';

describe('DivisionSelectorModalComponent', () => {
  let component: DivisionSelectorModalPage;
  let fixture: ComponentFixture<DivisionSelectorModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DivisionSelectorModalPage]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionSelectorModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
