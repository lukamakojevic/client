import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcatererComponent } from './addcaterer.component';

describe('AddcatererComponent', () => {
  let component: AddcatererComponent;
  let fixture: ComponentFixture<AddcatererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddcatererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcatererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
