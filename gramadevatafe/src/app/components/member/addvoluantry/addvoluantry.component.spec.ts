import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddvoluantryComponent } from './addvoluantry.component';

describe('AddvoluantryComponent', () => {
  let component: AddvoluantryComponent;
  let fixture: ComponentFixture<AddvoluantryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddvoluantryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddvoluantryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
