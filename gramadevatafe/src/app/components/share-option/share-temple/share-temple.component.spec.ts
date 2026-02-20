import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareTempleComponent } from './share-temple.component';

describe('ShareTempleComponent', () => {
  let component: ShareTempleComponent;
  let fixture: ComponentFixture<ShareTempleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareTempleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShareTempleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
