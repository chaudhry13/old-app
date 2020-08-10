import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSearchbarComponent } from './location-searchbar.component';

describe('LocationSearchbarComponent', () => {
  let component: LocationSearchbarComponent;
  let fixture: ComponentFixture<LocationSearchbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationSearchbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
