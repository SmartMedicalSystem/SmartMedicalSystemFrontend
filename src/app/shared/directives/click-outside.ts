import {
  Directive,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
  inject
} from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true
})
export class ClickOutsideDirective {

  private readonly elementRef = inject(ElementRef);

  @Output()
  clickOutside = new EventEmitter<void>();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {

    const clickedInside =
      this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.clickOutside.emit();
    }

  }

}