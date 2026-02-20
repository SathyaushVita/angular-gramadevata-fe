import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlymemberComponent } from './onlymember.component';

describe('OnlymemberComponent', () => {
  let component: OnlymemberComponent;
  let fixture: ComponentFixture<OnlymemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlymemberComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OnlymemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
