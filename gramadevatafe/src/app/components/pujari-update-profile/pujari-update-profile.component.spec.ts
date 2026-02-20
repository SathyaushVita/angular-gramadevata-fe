import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PujariUpdateProfileComponent } from './pujari-update-profile.component';

describe('PujariUpdateProfileComponent', () => {
  let component: PujariUpdateProfileComponent;
  let fixture: ComponentFixture<PujariUpdateProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PujariUpdateProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PujariUpdateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
