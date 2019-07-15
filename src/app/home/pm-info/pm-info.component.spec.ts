import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmInfoComponent } from './pm-info.component';

describe('PmInfoComponent', () => {
  let component: PmInfoComponent;
  let fixture: ComponentFixture<PmInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
