import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VillagetemplesComponent } from './villagetemples.component';

describe('VillagetemplesComponent', () => {
  let component: VillagetemplesComponent;
  let fixture: ComponentFixture<VillagetemplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VillagetemplesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VillagetemplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
