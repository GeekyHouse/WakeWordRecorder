import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  Type,
  ViewChild, ViewRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { InsertionDirective } from '../../directives/insertion.directive';
import { PopInRef } from '@modules/pop-in/references/pop-in.reference';

@Component({
  selector: 'app-pop-in',
  templateUrl: './pop-in.component.html',
  styleUrls: ['./pop-in.component.scss']
})
export class PopInComponent implements AfterViewInit, OnDestroy {
  public componentRef: ComponentRef<any>;
  public childComponentType: Type<any>;
  @ViewChild(InsertionDirective, {static: false})
  insertionPoint: InsertionDirective;
  private readonly onCloseSubject = new Subject<any>();
  public onClose = this.onCloseSubject.asObservable();

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private cd: ChangeDetectorRef,
              private popInRef: PopInRef) {
  }

  ngAfterViewInit() {
    this.loadChildComponent(this.childComponentType);
    if (!(this.cd as ViewRef).destroyed) {
      this.cd.detectChanges();
    }
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  close() {
    this.onCloseSubject.next();
  }

  onOverlayClicked(evt: MouseEvent) {
    this.popInRef.close();
  }

  onDialogClicked(evt: MouseEvent) {
    evt.stopPropagation();
  }

  private loadChildComponent(componentType: Type<any>) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);

    const viewContainerRef = this.insertionPoint.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
  }
}
