import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationReportFormComponent } from './investigation-report-form.component';

describe('InvestigationReportFormComponent', () => {
  let component: InvestigationReportFormComponent;
  let fixture: ComponentFixture<InvestigationReportFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestigationReportFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigationReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
