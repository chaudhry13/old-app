import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonsFormComponent } from './persons-form.component';

describe('PersonsFormComponent', () => {
  let component: PersonsFormComponent;
  let fixture: ComponentFixture<PersonsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
