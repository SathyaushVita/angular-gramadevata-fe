import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VillagechatComponent } from './villagechat.component';

describe('VillagechatComponent', () => {
  let component: VillagechatComponent;
  let fixture: ComponentFixture<VillagechatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VillagechatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VillagechatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
