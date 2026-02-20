import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPoojaStoresComponent } from './add-pooja-stores.component';

describe('AddPoojaStoresComponent', () => {
  let component: AddPoojaStoresComponent;
  let fixture: ComponentFixture<AddPoojaStoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPoojaStoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPoojaStoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
