import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmPeopleComponent } from './pm-people.component';

describe('PmPeopleComponent', () => {
  let component: PmPeopleComponent;
  let fixture: ComponentFixture<PmPeopleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmPeopleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
