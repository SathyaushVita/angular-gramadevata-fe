import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddspacerightComponent } from './addspaceright.component';

describe('AddspacerightComponent', () => {
  let component: AddspacerightComponent;
  let fixture: ComponentFixture<AddspacerightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddspacerightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddspacerightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
