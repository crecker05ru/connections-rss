import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, delay, catchError } from 'rxjs/operators';
import { UserSigninData, UserSignupData, UserAuthErrorResponse } from '../../shared/models/userAuth.model';
import { Store } from '@ngrx/store';
import { selectorUserAuth } from '../../redux/selectors/userAuth';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponseBase } from '@angular/common/http';
import { baseUrl } from '../../shared/env/baseUrl';
import { UserAuthActions } from '../../redux/actions/userAuth.actions';
export interface CustomSignupResponse {
  data: HttpResponseBase | null,
  isOk: boolean | null
}

@Injectable({
  providedIn: 'root',
})


export class AuthService {
  isLoggedIn = !!localStorage.getItem('response');
  userAuth$ = this.store.select(selectorUserAuth)
  // isLoggedIn = false
  redirectUrl: string | null = null;

  // userInfo = JSON.parse(localStorage.getItem('userLogin') || '{}') || {};
  constructor(private store: Store,private http: HttpClient){}

  signup(userData:UserSignupData) {
    this.store.dispatch(UserAuthActions.setIsLoading({isLoading: true}))
    this.store.dispatch(UserAuthActions.setResponseMessage({responseMessage: ''}))
    return this.http.post(`/registration`,userData).pipe(tap((data) => {
      this.store.dispatch(UserAuthActions.setResponseMessage({responseMessage: 'Success'}))
      this.store.dispatch(UserAuthActions.setIsLoading({isLoading: false}))
      setTimeout(() => {
        this.store.dispatch(UserAuthActions.setResponseMessage({responseMessage: ''}))  
        }, 2000);
      return data
    }),catchError(this.handleError<HttpResponseBase>()))
  }

  signupAction(userData:UserSignupData) {
    this.store.dispatch(UserAuthActions.signup({userData}))
  }


  signin(userData: UserSigninData){
    this.store.dispatch(UserAuthActions.setIsLoading({isLoading: true}))
    this.store.dispatch(UserAuthActions.setResponseMessage({responseMessage: ''}))
    return this.http.post(`/login`,userData).pipe(tap((data) => {
      this.store.dispatch(UserAuthActions.setResponseMessage({responseMessage: 'Success'}))
      this.store.dispatch(UserAuthActions.setIsLoading({isLoading: false}))
      setTimeout(() => {
        this.store.dispatch(UserAuthActions.setResponseMessage({responseMessage: ''}))  
        }, 2000);
      return data
    }),catchError(this.handleError<HttpResponseBase>()))
  }

  signinAction(userData:UserSigninData) {
    this.store.dispatch(UserAuthActions.signin({userData}))
    this.isLoggedIn = true;
  }

  logout() {
    localStorage.removeItem('response');
    // localStorage.removeItem('userEmail');
    document.cookie = ""
    this.isLoggedIn = false;
    // return of(true).pipe(
    //   delay(100),
    //   tap(() => { this.isLoggedIn = false; }),
    // );
    this.store.dispatch(UserAuthActions.setIsLoading({isLoading: true}))
    this.store.dispatch(UserAuthActions.setResponseMessage({responseMessage: ''}))

    return this.http.delete<HttpResponseBase>(`/logout`).pipe(tap((data) => {
      this.store.dispatch(UserAuthActions.setResponseMessage({responseMessage: 'Success'}))
      this.store.dispatch(UserAuthActions.setIsLoading({isLoading: false}))
      this.store.dispatch(UserAuthActions.logOut())
      setTimeout(() => {
        this.store.dispatch(UserAuthActions.setResponseMessage({responseMessage: ''}))  
        }, 2000);
      return data
    }), catchError(this.handleError<HttpResponseBase>()))
  }
  
  logoutAction() {
    this.store.dispatch(UserAuthActions.logOut())
  }


  handleError<T>(result?: T) {
    console.log('result',result)
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      console.log(`failed: ${error.message}`);
    this.store.dispatch(UserAuthActions.setResponseMessage({responseMessage: error.message}))
    this.store.dispatch(UserAuthActions.setIsLoading({isLoading: false}))
    setTimeout(() => {
    this.store.dispatch(UserAuthActions.setResponseMessage({responseMessage: ''}))
      
    }, 5000);

  
      // Let the app keep running by returning an empty result.
      return of(error);
    };
}

}
