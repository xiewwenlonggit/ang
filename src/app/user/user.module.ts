import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component'
import { UserRoutingModule } from './user-routing.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SelfCommentComponent } from './self-comment/self-comment.component';
import {DirectiveModule} from '../directive/directive.module'
import { FormsModule } from "@angular/forms";
import { OtherCommentComponent } from './other-comment/other-comment.component';
import {ScrollingModule} from '@angular/cdk/scrolling'

@NgModule({
  declarations: [UserComponent, SelfCommentComponent, OtherCommentComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    DirectiveModule,
    ScrollingModule,
    NgZorroAntdModule.forRoot(),
  ]
})
export class UserModule { }
