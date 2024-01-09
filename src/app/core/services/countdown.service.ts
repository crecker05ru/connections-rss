import { Observable, BehaviorSubject, map, switchMap, take, tap, timer } from "rxjs";

export abstract class CountdownService {
  protected seconds = 60
  protected canUpdate = true
  protected countdownSubject = new BehaviorSubject<number>(this.seconds);


  constructor(seconds: 60) {
    this.seconds = seconds
  }

  get(): Observable<number> {
    return this.countdownSubject.asObservable();
  }

  start(): Observable<number> {
    this.canUpdate = false
    return this.countdownSubject.pipe(
      take(1),
      switchMap((startValue) => timer(0, 1000).pipe(
        map((tick) => startValue - tick),
        take(startValue),
        tap((val) => {
          if(val === 0) this.canUpdate = true
        })
      )),
      tap((remainTime) => this.countdownSubject.next(remainTime))
    );
  }

  reset(): void {
    this.countdownSubject.next(this.seconds);
  }
}