import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatgroupsComponent } from './chatgroups.component';

describe('ChatgroupsComponent', () => {
  let component: ChatgroupsComponent;
  let fixture: ComponentFixture<ChatgroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatgroupsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatgroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
