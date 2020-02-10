import { Observable, Subject } from 'rxjs';

export class PopInRef {
  private readonly afterClosedSubject = new Subject<any>();
  public afterClosed: Observable<any> = this.afterClosedSubject.asObservable();

  constructor() {
  }

  close(result?: any) {
    this.afterClosedSubject.next(result);
  }
}
