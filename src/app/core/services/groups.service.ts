import { Injectable } from "@angular/core";
import { selectorGroups } from "../../redux/selectors/groups";
import { Store } from "@ngrx/store";
import { HttpClient, HttpResponseBase } from "@angular/common/http";
import { Observable, catchError, map, of, takeWhile, tap, timer } from "rxjs";
import { GroupsActions } from "../../redux/actions/groups.actions";
import { GroupsCreateResponse, GroupsSuccessResponse } from "../../shared/models/groups.model";

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
groupsStore$ = this.store.select(selectorGroups)
constructor(
  private store: Store,
  private http: HttpClient
){}

getGroups(){
  this.store.dispatch(GroupsActions.setLoading({isLoading: true}))
  this.store.dispatch(GroupsActions.setResponseMessage({responseMessage: ''}))
return this.http.get<HttpResponseBase | GroupsSuccessResponse>('/groups/list').pipe(tap((data) => {
  this.store.dispatch(GroupsActions.setLoading({isLoading: false}))
  this.store.dispatch(GroupsActions.setResponseMessage({responseMessage: 'Success'}))
  this.store.dispatch(GroupsActions.loadGroups({groups: data as GroupsSuccessResponse}))
  setTimeout(() => {
    this.store.dispatch(GroupsActions.setResponseMessage({responseMessage: ''}))
  }, 2000);
  return data
}),
catchError(this.handleError<HttpResponseBase>()))
}

updateGroups(){
  this.createCountdown()
  return this.getGroups()
}

create(name: string){
  this.store.dispatch(GroupsActions.setLoading({isLoading: true}))
  this.store.dispatch(GroupsActions.setResponseMessage({responseMessage: ''}))
return this.http.post<HttpResponseBase | GroupsCreateResponse>('/groups/create',{name}).pipe(tap((data) => {

  const groupIDs = JSON.parse(localStorage.getItem('groupIDs') || "[]")
  if(!groupIDs){
    const groupIDs = [data]
    localStorage.setItem('groupIDs',JSON.stringify(groupIDs))
  }else {
    groupIDs.push(data)
    localStorage.setItem('groupIDs',JSON.stringify(groupIDs))
  }
  this.store.dispatch(GroupsActions.createGroup({groupId: (data as GroupsCreateResponse)}))
  this.store.dispatch(GroupsActions.setLoading({isLoading: false}))
  this.store.dispatch(GroupsActions.setResponseMessage({responseMessage: 'Success'}))
  setTimeout(() => {
    this.store.dispatch(GroupsActions.setResponseMessage({responseMessage: ''}))
  }, 2000);
  return data
}),
catchError(this.handleError<HttpResponseBase>()))
}

deleteGroup(groupID: string){
  this.store.dispatch(GroupsActions.setLoading({isLoading: true}))
  this.store.dispatch(GroupsActions.setResponseMessage({responseMessage: ''}))
return this.http.delete<HttpResponseBase>(`/groups/delete?groupID=${groupID}`).pipe(tap((data) => {

  const groupIDs = JSON.parse(localStorage.getItem('groupIDs') || "[]")
  if(!groupIDs){
    const groupIDs: [] = []
    localStorage.setItem('groupIDs',JSON.stringify(groupIDs))
  }else {
    (groupIDs as GroupsCreateResponse[]).filter((item) => item.groupID !== groupID)
    localStorage.setItem('groupIDs',JSON.stringify(groupIDs))
  }
  this.store.dispatch(GroupsActions.deleteGroup({groupId: groupID}))
  this.store.dispatch(GroupsActions.setLoading({isLoading: false}))
  this.store.dispatch(GroupsActions.setResponseMessage({responseMessage: 'Success'}))
  setTimeout(() => {
    this.store.dispatch(GroupsActions.setResponseMessage({responseMessage: ''}))
  }, 2000);
  return data
}),
catchError(this.handleError<HttpResponseBase>()))
}


handleError<T>(result?: T) {
  console.log('result',result)
  return (error: any): Observable<T> => {
    console.error(error); // log to console instea
    console.log(`failed: ${error.message}`);
    this.store.dispatch(GroupsActions.setResponseMessage({responseMessage: error.message}))
    this.store.dispatch(GroupsActions.setLoading({isLoading: false}))
    setTimeout(()=> this.store.dispatch(GroupsActions.setResponseMessage({responseMessage: ''})),5000)
    return of(error);
  };
}

createCountdown(){
  this.store.dispatch(GroupsActions.setCanUpdate({canUpdate: false}))
  let countdown = timer(0,1000).pipe(
    map(n => 60 - n),
    takeWhile(n => n >= 0),
    tap((data) => {
      if(data === 0){
        this.store.dispatch(GroupsActions.setCanUpdate({canUpdate: true}))
      }
    })
  )
  this.store.dispatch(GroupsActions.setTimer({timer: countdown}))
}
}