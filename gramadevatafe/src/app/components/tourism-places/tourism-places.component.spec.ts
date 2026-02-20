import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourismPlacesComponent } from './tourism-places.component';

describe('TourismPlacesComponent', () => {
  let component: TourismPlacesComponent;
  let fixture: ComponentFixture<TourismPlacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourismPlacesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TourismPlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
