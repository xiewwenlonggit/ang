import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfCommentComponent } from './self-comment.component';

describe('SelfCommentComponent', () => {
  let component: SelfCommentComponent;
  let fixture: ComponentFixture<SelfCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
