import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LevelRuleComponent} from './level-rule.component';
@NgModule({
  declarations: [LevelRuleComponent],
  imports: [
    CommonModule
  ],
  exports:[LevelRuleComponent]
})
export class LevelRuleModule { }
