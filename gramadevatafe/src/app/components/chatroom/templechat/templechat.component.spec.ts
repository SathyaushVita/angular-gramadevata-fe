import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplechatComponent } from './templechat.component';

describe('TemplechatComponent', () => {
  let component: TemplechatComponent;
  let fixture: ComponentFixture<TemplechatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplechatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplechatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
