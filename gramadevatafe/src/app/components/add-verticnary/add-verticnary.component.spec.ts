import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVerticnaryComponent } from './add-verticnary.component';

describe('AddVerticnaryComponent', () => {
  let component: AddVerticnaryComponent;
  let fixture: ComponentFixture<AddVerticnaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVerticnaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddVerticnaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
