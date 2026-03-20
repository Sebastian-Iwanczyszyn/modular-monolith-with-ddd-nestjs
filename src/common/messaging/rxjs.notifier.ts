import { Observable, Subject } from 'rxjs';

export class Notification {
  constructor(
    public readonly routingKey: string,
    public readonly userId: string,
  ) {
  }
}

export class RxjsNotifier<Notification> {
  private readonly subject = new Subject<Notification>();

  get notifications$(): Observable<Notification> {
    return this.subject.asObservable();
  }

  notify(payload: Notification): void {
    this.subject.next(payload);
  }

  complete(): void {
    this.subject.complete();
  }

  error(error: unknown): void {
    this.subject.error(error);
  }
}
