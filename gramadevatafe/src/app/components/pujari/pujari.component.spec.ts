import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PujariComponent } from './pujari.component';

describe('PujariComponent', () => {
  let component: PujariComponent;
  let fixture: ComponentFixture<PujariComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PujariComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PujariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
