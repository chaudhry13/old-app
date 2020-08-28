import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultReportFormComponent } from './default-report-form.component';

describe('DefaultReportFormComponent', () => {
  let component: DefaultReportFormComponent;
  let fixture: ComponentFixture<DefaultReportFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultReportFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
