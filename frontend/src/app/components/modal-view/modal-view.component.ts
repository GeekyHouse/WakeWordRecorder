import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { slideInAnimation } from '../../animations';

@Component({
  selector: 'app-modal-view',
  templateUrl: './modal-view.component.html',
  styleUrls: ['./modal-view.component.scss'],
  exportAs: 'modal',
  animations: [
    slideInAnimation
    // animation triggers go here
  ]
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

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
