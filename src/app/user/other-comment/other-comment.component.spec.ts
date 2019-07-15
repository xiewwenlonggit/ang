import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherCommentComponent } from './other-comment.component';

describe('OtherCommentComponent', () => {
  let component: OtherCommentComponent;
  let fixture: ComponentFixture<OtherCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
