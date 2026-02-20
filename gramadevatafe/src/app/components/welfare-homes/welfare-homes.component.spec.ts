import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelfareHomesComponent } from './welfare-homes.component';

describe('WelfareHomesComponent', () => {
  let component: WelfareHomesComponent;
  let fixture: ComponentFixture<WelfareHomesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelfareHomesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WelfareHomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
