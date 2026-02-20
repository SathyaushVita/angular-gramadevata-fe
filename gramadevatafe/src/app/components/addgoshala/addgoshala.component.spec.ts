import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddgoshalaComponent } from './addgoshala.component';

describe('AddgoshalaComponent', () => {
  let component: AddgoshalaComponent;
  let fixture: ComponentFixture<AddgoshalaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddgoshalaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddgoshalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
