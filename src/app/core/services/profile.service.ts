import { HttpClient, HttpHeaders, HttpResponseBase } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { baseUrl } from "../../shared/env/baseUrl";
import { BehaviorSubject, Observable, catchError, of, tap } from "rxjs";
import { ProfileResponseSuccess } from "../../shared/models/profile.models";
import { selectorProfile } from "../../redux/selectors/profile";
import { ProfileActions } from "../../redux/actions/profile.actions";

@Injectable({
  providedIn: 'root',
})

export class ProfileService {
  profileStore$ = this.store.select(selectorProfile)
  public profile = {}
  httpMessage = ''
  constructor(private store: Store, private http: HttpClient){}

  loadProfile(){
    this.httpMessage = ''
    return this.http.get<HttpResponseBase | ProfileResponseSuccess>(`${baseUrl}/profile`).pipe(catchError(this.handleError<HttpResponseBase>()))
  }
  loadedProfilePage(){
    this.httpMessage = ''
    this.store.dispatch(ProfileActions.setResponseMessage({responseMessage: ''}))
    this.store.dispatch(ProfileActions.setLoading({isLoading: true}))
    return this.http.get<HttpResponseBase | ProfileResponseSuccess>(`/profile`).pipe(tap((data) => {
      // this.profile = data
      this.store.dispatch(ProfileActions.setProfileData({profile: data as ProfileResponseSuccess}))
      this.store.dispatch(ProfileActions.setLoading({isLoading: false}))
      this.store.dispatch(ProfileActions.setResponseMessage({responseMessage: 'Successfull'}))
      setTimeout(()=> this.store.dispatch(ProfileActions.setResponseMessage({responseMessage: ''})),2000)
      return data
    }),catchError(this.handleError<HttpResponseBase>()))
  }

  editProfile(newName: string){
    this.httpMessage = ''
    this.store.dispatch(ProfileActions.setResponseMessage({responseMessage: ''}))
    this.store.dispatch(ProfileActions.setLoading({isLoading: true}))

    return this.http.put<HttpResponseBase | ProfileResponseSuccess>(`/profile`,{name: newName}).pipe(tap((data) => {
      this.store.dispatch(ProfileActions.updateProfile({newName}))
      this.store.dispatch(ProfileActions.setLoading({isLoading: false}))
      this.store.dispatch(ProfileActions.setResponseMessage({responseMessage: 'Successfull'}))
      setTimeout(()=> this.store.dispatch(ProfileActions.setResponseMessage({responseMessage: ''})),2000)
      return data
    }),catchError(this.handleError<HttpResponseBase>()))
  }

  subscribedLoad(){
    this.httpMessage = ''
    return this.http.get<HttpResponseBase | ProfileResponseSuccess>(`/profile`).subscribe({next: (data) => {this.profile = data}})

  }

  handleError<T>(result?: T) {
    console.log('result',result)
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      console.log(`failed: ${error.message}`);

      this.httpMessage = error.message
      this.store.dispatch(ProfileActions.setResponseMessage({responseMessage: error.message}))
      this.store.dispatch(ProfileActions.setLoading({isLoading: false}))
      setTimeout(()=> this.store.dispatch(ProfileActions.setResponseMessage({responseMessage: ''})),5000)
      // Let the app keep running by returning an empty result.
      return of(error);
    };
}
}