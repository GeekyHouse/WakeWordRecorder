import { Component, EventEmitter, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
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
export class ModalViewComponent implements OnInit, OnDestroy {

  @Output() modalClose: EventEmitter<any> = new EventEmitter<any>();

  constructor(private router: Router,
              private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'hide-scroll');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'hide-scroll');
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
