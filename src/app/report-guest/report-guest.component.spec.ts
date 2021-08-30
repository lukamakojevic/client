import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportGuestComponent } from './report-guest.component';

describe('ReportGuestComponent', () => {
  let component: ReportGuestComponent;
  let fixture: ComponentFixture<ReportGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportGuestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
