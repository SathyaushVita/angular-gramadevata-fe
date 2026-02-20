import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourconnectionsComponent } from './yourconnections.component';

describe('YourconnectionsComponent', () => {
  let component: YourconnectionsComponent;
  let fixture: ComponentFixture<YourconnectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourconnectionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YourconnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
