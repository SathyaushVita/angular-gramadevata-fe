import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWelfareHomeComponent } from './add-welfare-home.component';

describe('AddWelfareHomeComponent', () => {
  let component: AddWelfareHomeComponent;
  let fixture: ComponentFixture<AddWelfareHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWelfareHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddWelfareHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
