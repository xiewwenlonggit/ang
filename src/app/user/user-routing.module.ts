import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import {SelfCommentComponent} from './self-comment/self-comment.component';
import {OtherCommentComponent} from './other-comment/other-comment.component'
const routes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    children:[
     { path:'self/:empno',component:SelfCommentComponent},
     { path:'other',component:OtherCommentComponent},
     { path:'user',component:UserComponent},

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
