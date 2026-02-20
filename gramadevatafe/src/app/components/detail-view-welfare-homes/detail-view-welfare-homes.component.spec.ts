import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailViewWelfareHomesComponent } from './detail-view-welfare-homes.component';

describe('DetailViewWelfareHomesComponent', () => {
  let component: DetailViewWelfareHomesComponent;
  let fixture: ComponentFixture<DetailViewWelfareHomesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailViewWelfareHomesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailViewWelfareHomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
