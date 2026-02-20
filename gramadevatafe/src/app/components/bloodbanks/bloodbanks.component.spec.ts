import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodbanksComponent } from './bloodbanks.component';

describe('BloodbanksComponent', () => {
  let component: BloodbanksComponent;
  let fixture: ComponentFixture<BloodbanksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodbanksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BloodbanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
