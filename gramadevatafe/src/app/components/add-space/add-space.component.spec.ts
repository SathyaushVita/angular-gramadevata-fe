import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSpaceComponent } from './add-space.component';

describe('AddSpaceComponent', () => {
  let component: AddSpaceComponent;
  let fixture: ComponentFixture<AddSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSpaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
