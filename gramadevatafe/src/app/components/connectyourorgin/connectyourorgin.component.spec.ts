import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectyourorginComponent } from './connectyourorgin.component';

describe('ConnectyourorginComponent', () => {
  let component: ConnectyourorginComponent;
  let fixture: ComponentFixture<ConnectyourorginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectyourorginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectyourorginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
