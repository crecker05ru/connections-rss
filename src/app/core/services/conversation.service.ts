import { HttpClient, HttpResponseBase } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, catchError, map, of, takeWhile, tap, timer } from 'rxjs';
import { selectConversation } from '../../redux/selectors/conversation';
import { ConversationActions } from '../../redux/actions/conversation.actions';
import { ConversationMessagesResponse } from '../../shared/models/conversation.model';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  conversationStore$ = this.store.select(selectConversation);
  canUpdate = true;
  sinceDate: number | Date | undefined
  // countdown$ = timer(0,1000).pipe(
  //   map(n => 60 - n),
  //   takeWhile(n => n >= 0),
  //   tap((data) => {
  //     if(data === 0){
  //       this.canUpdate = true
  //     }
  //   })
  // )
  countdown$: Observable<number> | undefined;
  constructor(private http: HttpClient, private store: Store) {}

  getMessages({ conversationID = '', since = 0 }) {
    if(!this.sinceDate){
      this.sinceDate = Date.now()
      }
    console.log(
      'ConversationService conversationStore$',
      this.conversationStore$
    );
    this.store.dispatch(ConversationActions.setLoading({ isLoading: true }));
    this.store.dispatch(
      ConversationActions.setResponseMessage({ responseMessage: '' })
    );

    return this.http
      .get<HttpResponseBase | ConversationMessagesResponse>(
        `/conversations/read?conversationID=${conversationID}`,
        {}
      )
      .pipe(
        tap((data) => {
          this.store.dispatch(
            ConversationActions.getMessages({
              conversationMessages: data as ConversationMessagesResponse,
            })
          );
          this.store.dispatch(
            ConversationActions.setLoading({ isLoading: false })
          );
          this.store.dispatch(
            ConversationActions.setResponseMessage({
              responseMessage: 'Success',
            })
          );
          setTimeout(() => {
            this.store.dispatch(
              ConversationActions.setResponseMessage({ responseMessage: '' })
            );
          }, 2000);
          // this.countdown$ = timer(0, 1000).pipe(
          //   map((n) => 60 - n),
          //   takeWhile((n) => n >= 0),
          //   tap((data) => {
          //     if (data === 0) {
          //       this.canUpdate = true;
          //     }
          //   })
          // );
          // this.store.dispatch(
          //   ConversationActions.setTimer({ timer: this.countdown$ })
          // );
          return data;
        }),
        catchError(this.handleError<HttpResponseBase>())
      );
  }

  updateMessages({ conversationID = '', since = 0 }){
    // this.createCountdown()
    this.store.dispatch(ConversationActions.setLoading({ isLoading: true }));
    this.store.dispatch(
      ConversationActions.setResponseMessage({ responseMessage: '' })
    );

    return this.http
      .get<HttpResponseBase | ConversationMessagesResponse>(
        `/conversations/read?conversationID=${conversationID}&since=${since}`,
        {}
      )
      .pipe(
        tap((data) => {
          this.store.dispatch(
            ConversationActions.updateMessages({
              newMessages: data as ConversationMessagesResponse,
            })
          );
          this.store.dispatch(
            ConversationActions.setLoading({ isLoading: false })
          );
          this.store.dispatch(
            ConversationActions.setResponseMessage({
              responseMessage: 'Success',
            })
          );
          setTimeout(() => {
            this.store.dispatch(
              ConversationActions.setResponseMessage({ responseMessage: '' })
            );
          }, 2000);
          this.countdown$ = timer(0, 1000).pipe(
            map((n) => 60 - n),
            takeWhile((n) => n >= 0),
            tap((data) => {
              if (data === 0) {
                this.canUpdate = true;
              }
            })
          );
          this.store.dispatch(
            ConversationActions.setTimer({ timer: this.countdown$ })
          );
          return data;
        }),
        catchError(this.handleError<HttpResponseBase>())
      );
  }

  sendMessage(conversationID: string, message: string) {
    this.store.dispatch(ConversationActions.setLoading({ isLoading: true }));
    this.store.dispatch(
      ConversationActions.setResponseMessage({ responseMessage: '' })
    );
    return this.http
      .post<HttpResponseBase>(`/conversations/append`, {
        conversationID,
        message,
      })
      .pipe(
        tap((data) => {
          this.store.dispatch(ConversationActions.sendMessage());
          this.store.dispatch(
            ConversationActions.setLoading({ isLoading: false })
          );
          this.store.dispatch(
            ConversationActions.setResponseMessage({
              responseMessage: 'Success',
            })
          );
          setTimeout(() => {
            this.store.dispatch(
              ConversationActions.setResponseMessage({ responseMessage: '' })
            );
          }, 2000);
          return data;
        }),
        catchError(this.handleError<HttpResponseBase>())
      );
  }

  delete(conversationID: string) {
    this.store.dispatch(ConversationActions.setLoading({ isLoading: true }));
    this.store.dispatch(
      ConversationActions.setResponseMessage({ responseMessage: '' })
    );
    return this.http
      .delete<HttpResponseBase>(
        `/conversations/delete?conversationID=${conversationID}`
      )
      .pipe(
        tap((data) => {
          // this.store.dispatch(ConversationActions.sendMessage())
          this.store.dispatch(
            ConversationActions.setLoading({ isLoading: false })
          );
          this.store.dispatch(
            ConversationActions.setResponseMessage({
              responseMessage: 'Success',
            })
          );
          setTimeout(() => {
            this.store.dispatch(
              ConversationActions.setResponseMessage({ responseMessage: '' })
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
        ConversationActions.setResponseMessage({
          responseMessage: error.message,
        })
      );
      this.store.dispatch(ConversationActions.setLoading({ isLoading: false }));
      setTimeout(
        () =>
          this.store.dispatch(
            ConversationActions.setResponseMessage({ responseMessage: '' })
          ),
        5000
      );
      return of(error);
    };
  }

  createCountdown() {
    this.store.dispatch(ConversationActions.setCanUpdate({canUpdate: false}))
    let countdown = timer(0, 1000).pipe(
      map((n) => 60 - n),
      takeWhile((n) => n >= 0),
      tap((data) => {
        if (data === 0) {
          this.store.dispatch(ConversationActions.setTimer({timer: countdown}))
        }
      })
    );
    this.store.dispatch(ConversationActions.setTimer({ timer: countdown }));
  }
}
