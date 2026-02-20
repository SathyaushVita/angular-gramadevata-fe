import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBloddBankComponent } from './add-blodd-bank.component';

describe('AddBloddBankComponent', () => {
  let component: AddBloddBankComponent;
  let fixture: ComponentFixture<AddBloddBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBloddBankComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddBloddBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
