import { Component, OnInit } from '@angular/core';
import {
  FormControl, FormGroup, ReactiveFormsModule, Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { checkStrongPassword } from '../../../shared/directives/checkStrongPassword.directive';
import { UserSigninData, UserSignupData, UserAuthErrorResponse } from '../../../shared/models/userAuth.model';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{
  emailVal = ''
  isLogged = false;
  isButtonDisabled = false;
  responseMessage = '';
  lastSubmitedEmail = ''
  isDisabled$ = new BehaviorSubject(false)

  registrationForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required,Validators.maxLength(40),Validators.pattern(/^[\w\s-]+$/)]),
    email: new FormControl<string>('', [Validators.required, Validators.pattern(
      /^[a-zA-Z0-9.!#$%&’*+/=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    )]),
    password: new FormControl<string>('', [Validators.required, checkStrongPassword(8)]),
  });

  constructor(
    public authService: AuthService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public location: Location,
  ) {
    this.isLogged = authService.isLoggedIn;
  }

  ngOnInit(): void {
    this.logEmailChange();
  }

  logEmailChange() {
    const emailControl = this.registrationForm.get('email');
    emailControl?.valueChanges.forEach(
      (value) => {
        this.emailVal = String(value)
      console.log('this.emailVal',this.emailVal)
      if(this.lastSubmitedEmail !== this.emailVal){
        this.isButtonDisabled = false
      }
    }
    );
  }

  formSubmit() {
    if (this.registrationForm.value.email !== null && this.registrationForm.value.password !== null && this.registrationForm.value.name !== null) {
      console.log('this.isButtonDisabled',this.isButtonDisabled)
      console.log('this.isTrue$',this.isTrue$)
      console.log('this.isDisabled$',this.isDisabled$)
      if(this.registrationForm.value.email === this.lastSubmitedEmail){
        this.isButtonDisabled = true
        this.responseMessage = 'Email still the same'
        return;
      }
      this.isButtonDisabled = true
      this.authService.signup(this.registrationForm.value as UserSignupData).subscribe((resp) => {
        console.log('resp',resp)
        if(resp && !(resp as HttpErrorResponse).ok){
          const error: UserAuthErrorResponse = (resp as HttpErrorResponse).error
          this.responseMessage = error.message
          this.isButtonDisabled = false
          if(error.type === 'PrimaryDuplicationException'){
            this.isButtonDisabled = true
          }
        } 
        if (resp === null) {
          this.responseMessage = 'Successfull'
          setTimeout(() => {
            this.router.navigateByUrl('/signin');
          }, 1200);
          this.registrationForm.reset();
        }
      });
    }
    
  }

  logout() {
    this.authService.logout();
    this.isLogged = false;
  }
  toSignInPage() {
    this.router.navigateByUrl('/signin');
  }
  // isTrue$ = this.isDisabled$.pipe(tap(() => {
  //   return this.isButtonDisabled === true && this.registrationForm.value.email === this.lastSubmitedEmail
  // }))
  isTrue$ = this.isDisabled$.subscribe({next: (val) => {
    // this.isButtonDisabled = val
    return this.isButtonDisabled === true && this.registrationForm.value.email === this.lastSubmitedEmail
  }})
  // get isButtonDisabled(): Boolean {
  //   return this.isButtonDisabled
  // }
}
