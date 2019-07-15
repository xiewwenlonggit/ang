import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PostInfoComponent } from './post-info/post-info.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DirectiveModule } from '../directive/directive.module';
import { LevelRuleComponent } from './level-rule/level-rule.component';
import { DeptComponent } from './dept/dept.component';
import { EmpInfoComponent } from './emp-info/emp-info.component';
import { PmInfoComponent } from './pm-info/pm-info.component';
import { PmPeopleComponent } from './pm-people/pm-people.component';

@NgModule({
  declarations: [HomeComponent, PostInfoComponent, LevelRuleComponent, DeptComponent, EmpInfoComponent, PmInfoComponent, PmPeopleComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DirectiveModule,
    NgZorroAntdModule.forRoot(),

  ],
})
export class HomeModule { }
