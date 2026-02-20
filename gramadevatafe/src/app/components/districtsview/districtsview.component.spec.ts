import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictsviewComponent } from './districtsview.component';

describe('DistrictsviewComponent', () => {
  let component: DistrictsviewComponent;
  let fixture: ComponentFixture<DistrictsviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistrictsviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DistrictsviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
