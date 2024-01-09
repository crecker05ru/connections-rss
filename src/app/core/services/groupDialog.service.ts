import { HttpClient, HttpResponseBase } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectGroupDialog } from '../../redux/selectors/groupDialog';
import { Observable, catchError, map, of, takeWhile, tap, timer } from 'rxjs';
import { GroupDialogActions } from '../../redux/actions/groupDialog.actions';
import { GroupDialogMessagesResponse } from '../../shared/models/groupDialog.model';

@Injectable({
  providedIn: 'root',
})
export class GroupDialogService {
  groupDialogStore$ = this.store.select(selectGroupDialog);
  canUpdate = false;
  groupDialogMessages: undefined | GroupDialogMessagesResponse;
  sinceDate: number | Date | undefined

  // countdown$ : Observable<number> | undefined = timer(0,1000).pipe(
  //   map(n => 60 - n),
  //   takeWhile(n => n >= 0),
  //   tap((data) => {
  //     if(data === 0){
  //       this.canUpdate = true
  //       console.log('this.canUpdate in GroupDialogService',this.canUpdate)

  //     }
  //   })
  // )
  countdown$: Observable<number> | undefined;
  constructor(private http: HttpClient, private store: Store) {
    this.groupDialogStore$.subscribe((data) => {
      this.groupDialogMessages = data.messages;
      // this.countdown$ = data.timer
    });
  }

  getMessages({ groupID = '', since = 0 }) {
    if(!this.sinceDate){
    this.sinceDate = Date.now()
    }
    this.store.dispatch(GroupDialogActions.setLoading({ isLoading: true }));
    this.store.dispatch(
      GroupDialogActions.setResponseMessage({ responseMessage: '' })
    );
    return this.http
      .get<HttpResponseBase | GroupDialogMessagesResponse>(
        `/groups/read?groupID=${groupID}`,
        {}
      )
      .pipe(
        tap((data) => {
          this.store.dispatch(
            GroupDialogActions.getMessages({
              messages: data as GroupDialogMessagesResponse,
            })
          );
          this.store.dispatch(
            GroupDialogActions.setLoading({ isLoading: false })
          );
          this.store.dispatch(
            GroupDialogActions.setResponseMessage({
              responseMessage: 'Success',
            })
          );
          setTimeout(() => {
            this.store.dispatch(
              GroupDialogActions.setResponseMessage({ responseMessage: '' })
            );
          }, 2000);
          return data;
        }),
        catchError(this.handleError<HttpResponseBase>())
      );
  }

  updateMessages({ groupID = '', since = 0 }) {
    this.store.dispatch(GroupDialogActions.setLoading({ isLoading: true }));
    this.store.dispatch(
      GroupDialogActions.setResponseMessage({ responseMessage: '' })
    );
    // this.createCountdown();
    // return this.getMessages({ groupID, since });
    return this.http
    .get<HttpResponseBase | GroupDialogMessagesResponse>(
      `/groups/read?groupID=${groupID}&since=${since}`,
      {}
    )
    .pipe(
      tap((data) => {
        this.store.dispatch(
          GroupDialogActions.updateMessages({
            newMessages: data as GroupDialogMessagesResponse,
          })
        );
        this.store.dispatch(
          GroupDialogActions.setLoading({ isLoading: false })
        );
        this.store.dispatch(
          GroupDialogActions.setResponseMessage({
            responseMessage: 'Success',
          })
        );
        setTimeout(() => {
          this.store.dispatch(
            GroupDialogActions.setResponseMessage({ responseMessage: '' })
          );
        }, 2000);
        return data;
      }),
      catchError(this.handleError<HttpResponseBase>())
    );
  }

  initialMessages({ groupID = '', since = 0 }) {
    console.log('GroupDialogService groupDialogStore$', this.groupDialogStore$);
    console.log('this.canUpdate', this.canUpdate);
    console.log(
      'GroupDialogService this.groupDialogMessages',
      this.groupDialogMessages
    );
    // if(this.groupDialogMessages) {
    //   return
    // }
    console.log('this.canUpdate before initialMessages', this.canUpdate);
    // this.createCountdown();
    return this.getMessages({ groupID, since });
  }

  sendMessage(groupID: string, message: string) {
    this.store.dispatch(GroupDialogActions.setLoading({ isLoading: true }));
    this.store.dispatch(
      GroupDialogActions.setResponseMessage({ responseMessage: '' })
    );
    return this.http
      .post<HttpResponseBase>(`/groups/append`, { groupID, message })
      .pipe(
        tap((data) => {
          this.store.dispatch(GroupDialogActions.sendMessage());
          this.store.dispatch(
            GroupDialogActions.setLoading({ isLoading: false })
          );
          this.store.dispatch(
            GroupDialogActions.setResponseMessage({
              responseMessage: 'Success',
            })
          );
          setTimeout(() => {
            this.store.dispatch(
              GroupDialogActions.setResponseMessage({ responseMessage: '' })
            );
          }, 2000);
          return data;
        }),
        catchError(this.handleError<HttpResponseBase>())
      );
  }

  handleError<T>(result?: T) {
    console.log('result', result);
    return (error: any): Observable<T> => {
      console.error(error); // log to console instea
      console.log(`failed: ${error.message}`);
      this.store.dispatch(
        GroupDialogActions.setResponseMessage({
          responseMessage: error.message,
        })
      );
      this.store.dispatch(GroupDialogActions.setLoading({ isLoading: false }));
      setTimeout(
        () =>
          this.store.dispatch(
            GroupDialogActions.setResponseMessage({ responseMessage: '' })
          ),
        5000
      );
      return of(error);
    };
  }

  createCountdown() {
    this.store.dispatch(GroupDialogActions.setCanUpdate({ canUpdate: false }));
    let countdown = timer(0, 1000).pipe(
      map((n) => 60 - n),
      takeWhile((n) => n >= 0),
      tap((data) => {
        if (data === 0) {
          this.store.dispatch(
            GroupDialogActions.setCanUpdate({ canUpdate: true })
          );
        }
      })
    );
    this.store.dispatch(GroupDialogActions.setTimer({ timer: countdown }));
  }
}
