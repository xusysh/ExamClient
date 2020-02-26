import { Directive, HostListener, ElementRef } from "@angular/core";

@Directive({
  selector: "[next-tab]"
})
export class NextTabDirective {
  self: any;
  nextControl: any;

  @HostListener("keydown.enter", ["$event"])
  onEnter(event: KeyboardEvent) {
    if (this.nextControl) {
      if (this.nextControl.focus) {
        this.nextControl.focus();
        this.nextControl.select();
        event.preventDefault();
        return false;
      }
    }
  }

  constructor(private control: ElementRef) {
    this.self = control.nativeElement;
  }
}
