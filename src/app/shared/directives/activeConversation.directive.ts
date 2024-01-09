import {
  Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges,
} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[activeConversation]',
})

export class ActiveConversationDirective implements OnChanges {
  @Input() backgroundColor = '#ff00ff';

  @Input() isTagged = false;


  constructor(private element: ElementRef) {
    // this.element.nativeElement.style.backgroundColor = this.backgroundColor;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.isTagged){
      this.element.nativeElement.style.backgroundColor = this.backgroundColor;
    }
  }
}
