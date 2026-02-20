import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtempleComponent } from './addtemple.component';

describe('AddtempleComponent', () => {
  let component: AddtempleComponent;
  let fixture: ComponentFixture<AddtempleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddtempleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddtempleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
