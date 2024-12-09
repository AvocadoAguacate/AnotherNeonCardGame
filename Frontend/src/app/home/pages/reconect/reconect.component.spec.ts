import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconectComponent } from './reconect.component';

describe('ReconectComponent', () => {
  let component: ReconectComponent;
  let fixture: ComponentFixture<ReconectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReconectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReconectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
