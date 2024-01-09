import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'my-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit, OnDestroy{
  @Input() id?: string
isOpen = false;
private element: undefined | Node | HTMLElement
constructor(
  private modalService: ModalService,
  private elementRef: ElementRef
  ){
    this.element = this.elementRef.nativeElement
  }

  ngOnInit() {
    // add self (this modal instance) to the modal service so it can be opened from any component
    this.modalService.add(this);

    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element as Node);

    // close modal on background click
    (this.element as HTMLElement).addEventListener('click', (el: any) => {
        if (el.target.className === 'my-modal') {
            this.close();
        }
    });
}

ngOnDestroy() {
    // remove self from modal service
    this.modalService.remove(this);

    // remove modal element from html
    (this.element as HTMLElement).remove();
}

open() {
    (this.element as HTMLElement).style.display = 'block';
    document.body.classList.add('my-modal__open');
    this.isOpen = true;
    console.log('open',this)
}

close() {
  (this.element as HTMLElement).style.display = 'none';
    document.body.classList.remove('my-modal__open');
    this.isOpen = false;
}

}
