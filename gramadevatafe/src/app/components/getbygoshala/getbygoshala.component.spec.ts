import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetbygoshalaComponent } from './getbygoshala.component';

describe('GetbygoshalaComponent', () => {
  let component: GetbygoshalaComponent;
  let fixture: ComponentFixture<GetbygoshalaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetbygoshalaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetbygoshalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
