import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowobjectComponent } from './showobject.component';

describe('ShowobjectComponent', () => {
  let component: ShowobjectComponent;
  let fixture: ComponentFixture<ShowobjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowobjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowobjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
