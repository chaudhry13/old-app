import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { IntelligenceReportFormComponent } from "./intelligence-report-form.component";

describe("IntelligenceReportFormComponent", () => {
  let component: IntelligenceReportFormComponent;
  let fixture: ComponentFixture<IntelligenceReportFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IntelligenceReportFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntelligenceReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
