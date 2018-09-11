import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegComponent } from './leg.component';

describe('LegComponent', () => {
  let component: LegComponent;
  let fixture: ComponentFixture<LegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
