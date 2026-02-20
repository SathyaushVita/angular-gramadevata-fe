import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VertinaryHospitalsComponent } from './vertinary-hospitals.component';

describe('VertinaryHospitalsComponent', () => {
  let component: VertinaryHospitalsComponent;
  let fixture: ComponentFixture<VertinaryHospitalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VertinaryHospitalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VertinaryHospitalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
