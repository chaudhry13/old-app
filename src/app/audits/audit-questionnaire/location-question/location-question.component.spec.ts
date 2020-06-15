import { LocationQuestionComponent } from "./location-question.component";
import {
  async,
  ComponentFixture,
  TestBed,
  inject,
  tick,
  fakeAsync,
} from "@angular/core/testing";
import { DebugElement } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ValidationService } from "src/app/_services/validation.service";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "src/app/app.component";

describe("LocationQuestionComponent", () => {
  let component: LocationQuestionComponent;
  let fixture: ComponentFixture<LocationQuestionComponent>;
  let de: DebugElement;
  let validationService;

  beforeEach(async(() => {
    validationService = jasmine.createSpyObj("ValidationService", [
      "isQuestionAnswerValid",
    ]);

    TestBed.configureTestingModule({
      declarations: [AppComponent, LocationQuestionComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        RouterTestingModule,
      ],
      providers: [{ provide: ValidationService, useValue: validationService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationQuestionComponent);
    component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
