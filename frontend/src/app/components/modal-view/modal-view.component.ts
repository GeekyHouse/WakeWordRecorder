import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-view',
  templateUrl: './modal-view.component.html',
  styleUrls: ['./modal-view.component.scss'],
  exportAs: 'modal'
})
export class ModalViewComponent {

  @Output() modalClose: EventEmitter<any> = new EventEmitter<any>();

  constructor(private router: Router) {
  }

  closeModal($event: MouseEvent) {
    this.router.navigate([{outlets: {modal: null}}]);
    this.modalClose.next($event);
  }

  onOverlayClicked($event: MouseEvent) {
    // this.popInRef.close();
    this.router.navigate([{outlets: {modal: null}}]);
    this.modalClose.next($event);
  }

  onDialogClicked($event: MouseEvent) {
    $event.stopPropagation();
  }
}
