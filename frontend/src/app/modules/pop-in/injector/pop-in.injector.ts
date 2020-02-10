import { InjectFlags, InjectionToken, Injector, Type } from '@angular/core';

export class PopInInjector implements Injector {
  constructor(private parentInjector: Injector, private additionalTokens: WeakMap<any, any>) {
  }

  get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T, flags?: InjectFlags): T;
  get(token: any, notFoundValue?: any);
  get(token: any, notFoundValue?: any, flags?: any) {
    const value = this.additionalTokens.get(token);

    if (value) {
      return value;
    }

    return this.parentInjector.get<any>(token, notFoundValue);
  }
}
