import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailvieweventComponent } from './detailviewevent.component';

describe('DetailvieweventComponent', () => {
  let component: DetailvieweventComponent;
  let fixture: ComponentFixture<DetailvieweventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailvieweventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailvieweventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
