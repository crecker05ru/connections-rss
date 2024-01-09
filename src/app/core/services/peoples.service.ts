import { HttpClient, HttpResponseBase } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectorPeoples } from "../../redux/selectors/peoples";
import { PeoplesActions } from "../../redux/actions/peoples.actions";
import { Observable, catchError, map, of, takeWhile, tap, timer } from "rxjs";
import { PeoplesConversationsCreate, PeoplesConversationsResponse, PeoplesSuccessResponse } from "../../shared/models/peoples.model";

@Injectable({
  providedIn: 'root',
})
export class PeoplesService {
peoplesStore$ = this.store.select(selectorPeoples)
  constructor(
    private store: Store,
    private http: HttpClient
  ){}

  getUsers(){
    this.store.dispatch(PeoplesActions.setLoading({isLoading: true}))
    this.store.dispatch(PeoplesActions.setResponseMessage({responseMessage: ''}))
    return this.http.get<HttpResponseBase | PeoplesSuccessResponse>('/users').pipe(tap((data) => {
      this.store.dispatch(PeoplesActions.loadUsers({peoples: data as PeoplesSuccessResponse}))
      this.store.dispatch(PeoplesActions.setLoading({isLoading: false}))
      this.store.dispatch(PeoplesActions.setResponseMessage({responseMessage: 'Success'}))
      setTimeout(() => {
        this.store.dispatch(PeoplesActions.setResponseMessage({responseMessage: ''}))
      }, 2000);
      return data
    }),catchError(this.handleError<HttpResponseBase>()))
  }

  updateUsers(){
    this.createCountdown()
    return this.getUsers()
  }

  getConversations(){
    this.store.dispatch(PeoplesActions.setLoading({isLoading: true}))
    this.store.dispatch(PeoplesActions.setResponseMessage({responseMessage: ''}))
    return this.http.get<HttpResponseBase | PeoplesConversationsResponse>('/conversations/list').pipe(tap((data) => {
      this.store.dispatch(PeoplesActions.loadConversations({conversations: data as PeoplesConversationsResponse}))
      this.store.dispatch(PeoplesActions.setLoading({isLoading: false}))
      this.store.dispatch(PeoplesActions.setResponseMessage({responseMessage: 'Success'}))
      setTimeout(() => {
        this.store.dispatch(PeoplesActions.setResponseMessage({responseMessage: ''}))
      }, 2000);
      return data
    }),catchError(this.handleError<HttpResponseBase>()))
  }

  getConversationById(id: string){
    this.store.dispatch(PeoplesActions.setLoading({isLoading: true}))
    this.store.dispatch(PeoplesActions.setResponseMessage({responseMessage: ''}))
    return this.http.get<HttpResponseBase | PeoplesConversationsResponse>(`/conversations/${id}`).pipe(tap((data) => {
      
      this.store.dispatch(PeoplesActions.loadConversations({conversations: data as PeoplesConversationsResponse}))
      this.store.dispatch(PeoplesActions.setLoading({isLoading: false}))
      this.store.dispatch(PeoplesActions.setResponseMessage({responseMessage: 'Success'}))
      setTimeout(() => {
        this.store.dispatch(PeoplesActions.setResponseMessage({responseMessage: ''}))
      }, 2000);
      return data
    }),catchError(this.handleError<HttpResponseBase>()))
  }

  createConversation(companion: string){
    this.store.dispatch(PeoplesActions.setLoading({isLoading: true}))
    this.store.dispatch(PeoplesActions.setResponseMessage({responseMessage: ''}))
    return this.http.post<HttpResponseBase | PeoplesConversationsCreate>(`/conversations/create`,{companion}).pipe(tap((data) => {
      const conversationIDs:PeoplesConversationsCreate[] = JSON.parse(localStorage.getItem('conversationIDs') || "[]")
      if(!conversationIDs) {
        const conversationIDs = [data]
        localStorage.setItem('conversationIDs',JSON.stringify(conversationIDs))
      } else {
        conversationIDs.push(data as PeoplesConversationsCreate)
        localStorage.setItem('conversationIDs',JSON.stringify(conversationIDs))
      }
      let idsString = conversationIDs.map((id) => id.conversationID)
      this.store.dispatch(PeoplesActions.createConversation({conversationId: (data as PeoplesConversationsCreate).conversationID}))
      this.store.dispatch(PeoplesActions.setLoading({isLoading: false}))
      this.store.dispatch(PeoplesActions.setResponseMessage({responseMessage: 'Success'}))
      setTimeout(() => {
        this.store.dispatch(PeoplesActions.setResponseMessage({responseMessage: ''}))
      }, 2000);
      return data
    }),catchError(this.handleError<HttpResponseBase>()))
  }



  handleError<T>(result?: T) {
    console.log('result',result)
    return (error: any): Observable<T> => {
      console.error(error); // log to console instea
      console.log(`failed: ${error.message}`);
      this.store.dispatch(PeoplesActions.setResponseMessage({responseMessage: error.message}))
      this.store.dispatch(PeoplesActions.setLoading({isLoading: false}))
      setTimeout(()=> this.store.dispatch(PeoplesActions.setResponseMessage({responseMessage: ''})),5000)
      return of(error);
    };
  }

  createCountdown(){
    this.store.dispatch(PeoplesActions.setCanUpdate({canUpdate: false}))
    let countdown = timer(0,1000).pipe(
      map(n => 60 - n),
      takeWhile(n => n >= 0),
      tap((data) => {
        if(data === 0){
          this.store.dispatch(PeoplesActions.setCanUpdate({canUpdate: true}))
        }
      })
    )
    this.store.dispatch(PeoplesActions.setTimer({timer: countdown}))
  }

}