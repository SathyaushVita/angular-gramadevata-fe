import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisionmissionComponent } from './visionmission.component';

describe('VisionmissionComponent', () => {
  let component: VisionmissionComponent;
  let fixture: ComponentFixture<VisionmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisionmissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisionmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
