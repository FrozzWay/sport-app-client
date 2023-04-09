import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleOnHoverDirective } from "./rippleOnHover.directive";



@NgModule({
  declarations: [RippleOnHoverDirective],
  imports: [
    CommonModule
  ],
  exports: [RippleOnHoverDirective]
})
export class DirectivesModule { }
