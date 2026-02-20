import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatewiseTemplesPageComponent } from './statewise-temples-page.component';

describe('StatewiseTemplesPageComponent', () => {
  let component: StatewiseTemplesPageComponent;
  let fixture: ComponentFixture<StatewiseTemplesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatewiseTemplesPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatewiseTemplesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
