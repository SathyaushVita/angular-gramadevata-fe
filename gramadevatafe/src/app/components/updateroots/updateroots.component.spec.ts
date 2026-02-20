import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdaterootsComponent } from './updateroots.component';

describe('UpdaterootsComponent', () => {
  let component: UpdaterootsComponent;
  let fixture: ComponentFixture<UpdaterootsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdaterootsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdaterootsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
