import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlltemplesComponent } from './alltemples.component';

describe('AlltemplesComponent', () => {
  let component: AlltemplesComponent;
  let fixture: ComponentFixture<AlltemplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlltemplesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlltemplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
