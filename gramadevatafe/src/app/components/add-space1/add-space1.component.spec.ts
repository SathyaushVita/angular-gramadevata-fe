import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSpace1Component } from './add-space1.component';

describe('AddSpace1Component', () => {
  let component: AddSpace1Component;
  let fixture: ComponentFixture<AddSpace1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSpace1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSpace1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
