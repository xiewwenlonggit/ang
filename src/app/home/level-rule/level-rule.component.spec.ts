import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelRuleComponent } from './level-rule.component';

describe('LevelRuleComponent', () => {
  let component: LevelRuleComponent;
  let fixture: ComponentFixture<LevelRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
