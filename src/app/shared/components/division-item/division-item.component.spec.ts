import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionItemComponent } from './division-item.component';

describe('DivisionItemComponent', () => {
  let component: DivisionItemComponent;
  let fixture: ComponentFixture<DivisionItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DivisionItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
