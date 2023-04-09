import { Directive, ElementRef, HostListener } from "@angular/core";
import { MatRipple } from "@angular/material/core";

@Directive({
selector: '[rippleOnHover]',
providers: [MatRipple]
})
export class RippleOnHoverDirective {
  rippleRef: any;
  constructor(
      private _elementRef: ElementRef,
      private ripple: MatRipple
  ) {}
  @HostListener('mouseenter') onMouseEnter(): void {
      if (this._elementRef && this._elementRef.nativeElement) {
          this._elementRef.nativeElement.style.overflow = 'hidden';
      }

      if (this.ripple) {
          this.rippleRef = this.ripple.launch(
            {
              color: '#00000008',
              centered: true,
              animation: {
                exitDuration: 1000
              }
            }
          );
      }
  }
  @HostListener('mouseleave') onMouseLeave(): void {
      if (this.rippleRef) {
          this.rippleRef.fadeOut();
      }
  }
}
