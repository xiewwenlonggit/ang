import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberinputDirective } from './numberinput.directive';

@NgModule({
  declarations: [NumberinputDirective],
  imports: [
    CommonModule
  ],
  exports:[NumberinputDirective]
})
export class DirectiveModule { }
