import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector,
  Type,
} from '@angular/core';
import { PopInComponent } from '../components/pop-in/pop-in.component';
import { PopInModule } from '@modules';
import { PopInConfig } from '@modules/pop-in/config/pop-in.config';
import { PopInRef } from '@modules/pop-in/references/pop-in.reference';
import { PopInInjector } from '@modules/pop-in/injector/pop-in.injector';

@Injectable({
  providedIn: PopInModule
})
export class PopInService {
  private popInComponentRef: ComponentRef<PopInComponent>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private injector: Injector,
              private appRef: ApplicationRef) {
  }

  public open(componentType: Type<any>, config: PopInConfig) {
    const popInRef = this.appendDialogComponentToBody(config);
    this.popInComponentRef.instance.childComponentType = componentType;
    return popInRef;
  }

  private appendDialogComponentToBody(config: PopInConfig) {
    const map = new WeakMap();
    map.set(PopInConfig, config);

    const popInRef = new PopInRef();
    map.set(PopInRef, popInRef);

    const sub = popInRef.afterClosed.subscribe(() => {
      this.removeDialogComponentFromBody();
      sub.unsubscribe();
    });

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(PopInComponent);
    const componentRef = componentFactory.create(new PopInInjector(this.injector, map));

    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    this.popInComponentRef = componentRef;

    const closeSub = this.popInComponentRef.instance.onClose.subscribe(() => {
      this.removeDialogComponentFromBody();
      closeSub.unsubscribe();
    });

    return popInRef;
  }

  private removeDialogComponentFromBody() {
    this.appRef.detachView(this.popInComponentRef.hostView);
    this.popInComponentRef.destroy();
  }
}
