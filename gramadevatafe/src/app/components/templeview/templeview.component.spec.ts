import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempleviewComponent } from './templeview.component';

describe('TempleviewComponent', () => {
  let component: TempleviewComponent;
  let fixture: ComponentFixture<TempleviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TempleviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TempleviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});