import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddvillageComponent } from './addvillage.component';

describe('AddvillageComponent', () => {
  let component: AddvillageComponent;
  let fixture: ComponentFixture<AddvillageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddvillageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddvillageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
