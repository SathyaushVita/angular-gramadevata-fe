import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoojastoresComponent } from './poojastores.component';

describe('PoojastoresComponent', () => {
  let component: PoojastoresComponent;
  let fixture: ComponentFixture<PoojastoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoojastoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoojastoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
