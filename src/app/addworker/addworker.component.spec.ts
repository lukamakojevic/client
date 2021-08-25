import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddworkerComponent } from './addworker.component';

describe('AddworkerComponent', () => {
  let component: AddworkerComponent;
  let fixture: ComponentFixture<AddworkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddworkerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddworkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
