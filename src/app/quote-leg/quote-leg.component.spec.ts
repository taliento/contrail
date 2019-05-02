import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteLegComponent } from './quote-leg.component';

describe('QuoteLegComponent', () => {
  let component: QuoteLegComponent;
  let fixture: ComponentFixture<QuoteLegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteLegComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteLegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
