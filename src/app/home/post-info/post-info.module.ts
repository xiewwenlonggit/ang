import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PostInfoComponent} from './post-info.component'
import {DirectiveModule} from '../../directive/directive.module';
@NgModule({
  declarations: [PostInfoComponent],
  imports: [
    CommonModule,
    DirectiveModule
  ],
  exports:[PostInfoComponent]
  // providers:[PostInfoComponent],
})
export class PostInfoModule { }
