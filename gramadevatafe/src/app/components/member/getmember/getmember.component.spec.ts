import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetmemberComponent } from './getmember.component';

describe('GetmemberComponent', () => {
  let component: GetmemberComponent;
  let fixture: ComponentFixture<GetmemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetmemberComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetmemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
