import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectyourtempleComponent } from './connectyourtemple.component';

describe('ConnectyourtempleComponent', () => {
  let component: ConnectyourtempleComponent;
  let fixture: ComponentFixture<ConnectyourtempleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectyourtempleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectyourtempleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
