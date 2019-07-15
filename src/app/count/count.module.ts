import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CountRoutingModule } from './count-routing.module';
import {CountComponent} from './count.component'
@NgModule({
  declarations: [CountComponent],
  imports: [
    CommonModule,
    CountRoutingModule,
    NgZorroAntdModule,
    ReactiveFormsModule, 
    FormsModule 
  ]
})
export class CountModule { }
