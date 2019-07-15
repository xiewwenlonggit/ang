import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CountComponent} from './count.component'
const routes: Routes = [
  {
    path: 'check',
    component: CountComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountRoutingModule { }
