import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetbytemplesComponent } from './getbytemples.component';

describe('GetbytemplesComponent', () => {
  let component: GetbytemplesComponent;
  let fixture: ComponentFixture<GetbytemplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetbytemplesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetbytemplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
