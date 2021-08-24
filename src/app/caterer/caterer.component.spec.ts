import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatererComponent } from './caterer.component';

describe('CatererComponent', () => {
  let component: CatererComponent;
  let fixture: ComponentFixture<CatererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
