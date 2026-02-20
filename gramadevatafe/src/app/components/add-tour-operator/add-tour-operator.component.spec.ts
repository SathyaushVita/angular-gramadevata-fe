import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTourOperatorComponent } from './add-tour-operator.component';

describe('AddTourOperatorComponent', () => {
  let component: AddTourOperatorComponent;
  let fixture: ComponentFixture<AddTourOperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTourOperatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTourOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
