import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponseBase, HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from '../env/baseUrl';
import { UserAuthLoginResponse } from '../models/userAuth.model';
@Injectable()
export class WithTokenInterceptor implements HttpInterceptor {
  private userData: UserAuthLoginResponse = JSON.parse(localStorage.getItem('response') || "{}")
  private userEmail = localStorage.getItem('userEmail') || ""




  intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<HttpResponseBase>> {
    if(!this.userData || !this.userEmail) {
      this.userData = JSON.parse(localStorage.getItem('response') || "{}")
      this.userEmail = localStorage.getItem('userEmail') || ""
    }
    const authReq = req.clone({
      url: `${baseUrl}${req.url}`,
      // headers: req.headers?.set('Authorization', `Bearer ${this.userData?.token || ''}`)?.set('rs-uid', this.userData?.uid || '')?.set('rs-email', this.userEmail || '')
      headers: new HttpHeaders({
        ...(this.userData?.token && {'Authorization': `Bearer ${this.userData?.token || ''}`}),
        ...(this.userData?.uid && {'rs-uid': this.userData?.uid} || ''),
        ...(this.userEmail && {'rs-email': JSON.parse(this.userEmail || '')}),
      })
    });

    // const newReq = req.clone({ setParams: { key: this.apiKey }, url: `${baseUrl}${req.url}` });
    // req.url = this.searchUrl;
    // req.params.set('key', this.apiKey);
    return next.handle(authReq);
  }
}
