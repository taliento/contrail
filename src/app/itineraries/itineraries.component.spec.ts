import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItinerariesComponent } from './itineraries.component';

describe('IntinerariesComponent', () => {
  let component: ItinerariesComponent;
  let fixture: ComponentFixture<ItinerariesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItinerariesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItinerariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
