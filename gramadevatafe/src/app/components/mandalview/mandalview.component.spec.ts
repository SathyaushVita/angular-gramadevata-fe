import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MandalviewComponent } from './mandalview.component';

describe('MandalviewComponent', () => {
  let component: MandalviewComponent;
  let fixture: ComponentFixture<MandalviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MandalviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MandalviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
